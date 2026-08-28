import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";
import { INVENTORIES, shapeOf, type Shape } from "./inventories";

/**
 * The inventory path, end to end, on every instrument that walks it.
 *
 * The other specs walk a *scored* instrument: answer radios, reach a reading.
 * An inventory has three things none of them has, and each is a way the whole
 * family could be broken without a single existing test noticing — the block
 * triad on one page, the reader's own sentence surviving to the result, and the
 * playbook, which is the only place in the app where what the reader types is
 * stored and printed back.
 *
 * This began as one spec against `communication-style`, the front door of the
 * eight, written against the shapes rather than against its particular words so
 * that the other seven could inherit it. They now do. Nothing below names an
 * instrument except the two tests that are *about* one instrument's own
 * feature, and even those find their subject by asking the bank rather than by
 * knowing it: the private block is the block whose lead item is private, and
 * the open questions are the `text` items with no block around them.
 *
 * The id list is `registry.byFamily("inventory")`, for the reason
 * `e2e/instruments.ts` gives at length and `coverage.spec.ts` was just fixed
 * for: eight ids written out here would look like coverage and would be wrong
 * exactly once, on the day a ninth was added and nothing went red.
 */

/* ── the runner, walked ─────────────────────────────────────────────── */

/** What one page of the runner turned out to be. */
type Seen = { items: string[]; header: string | null };

/** The `data-item` of everything drawn on the page, in document order. */
const drawn = (page: Page) =>
  page.locator("[data-item]").evaluateAll((els) => els.map((el) => el.getAttribute("data-item") ?? ""));

/**
 * The section title the page is showing, or null where it draws no header.
 *
 * Folded to one case on the way out. `SectionHeader` sets the title in
 * `label-caps`, which is `text-transform: uppercase`, so what `innerText`
 * returns is not the string in the message table — the same trap the catalogue
 * test above records, where an earlier draft searched for a note that could
 * never appear. Comparing the letters rather than their casing is what keeps
 * this a test of the copy instead of a test of the stylesheet.
 */
async function header(page: Page): Promise<string | null> {
  const box = page.getByTestId("section");
  if (!(await box.count())) return null;
  return (await box.locator("h2").innerText()).trim().toLowerCase();
}

/**
 * Answer one item the way a person would, by the kind the bank declared.
 *
 * Deliberately not "click the first radio in every radiogroup". A weight is a
 * radio group too, and answering every one of them with a 1 files every block
 * under `open`, so the result page's other weight list is never drawn and a
 * View that throws building it would go unseen. Nine is chosen instead: it puts
 * every block over the `settled` threshold, and the number is visible on the
 * result, so the assertion that the weight survived is an assertion about a
 * number the reader actually picked.
 *
 * A `multi` is checkboxes and no radiogroup at all, so a radio-only walker
 * leaves every one of them blank — which is how a bank with two multis reaches
 * its result having answered eleven of thirteen questions and a playbook line
 * derived from one of them silently never fires.
 */
async function answerItem(page: Page, shape: Shape, id: string) {
  const item = shape.byId.get(id);
  if (!item) throw new Error(`${shape.id}: the page drew "${id}", which its form does not declare`);
  const box = page.locator(`[data-item="${id}"]`);

  if (item.kind === "choice" || item.kind === "likert") {
    await box.getByRole("radio").first().click();
    return;
  }
  if (item.kind === "rating") {
    // Value 9 wherever the scale starts. `nth` is an index and the rating is a
    // range, so the arithmetic is the bank's rather than a guess at it.
    const wanted = Math.min(9, item.max);
    await box.getByRole("radio").nth(wanted - item.min).click();
    return;
  }
  if (item.kind === "multi") {
    const first = box.getByRole("checkbox").first();
    if ((await first.getAttribute("aria-checked")) !== "true") await first.click();
    return;
  }
  // `text` is left alone. It never blocks, and a walker that filled every box
  // would be testing its own typing rather than the form.
}

/**
 * Walk the runner from the current page to the end, checking each page as it
 * goes, and stop on the result.
 *
 * `onPage` runs before the page is answered, which is what lets the caller type
 * into a reason box on the page it is asking about.
 */
async function walk(
  page: Page,
  shape: Shape,
  onPage?: (seen: Seen, index: number) => Promise<void>,
): Promise<Seen[]> {
  const seen: Seen[] = [];

  for (let guard = 0; guard < 60; guard++) {
    const items = await drawn(page);
    expect(items, `${shape.id}: a runner page with nothing on it`).not.toHaveLength(0);
    const page_ = { items, header: await header(page) };
    seen.push(page_);
    await onPage?.(page_, seen.length - 1);

    for (const id of items) await answerItem(page, shape, id);

    const next = page.getByTestId("next");
    if (await next.isVisible().catch(() => false)) {
      // Enabled before the click, not merely present: a Next that has gone grey
      // is a reader stuck on a page, and on an optional form — which every one
      // of these declares — it is a defect rather than validation.
      await expect(next, `${shape.id}: Next is disabled on an optional form`).toBeEnabled();
      await next.click();
      // The turn, waited on by the thing that proves it happened. A fixed pause
      // would be a guess and the page counter changes for other reasons.
      await expect(page.locator(`[data-item="${items[0]}"]`)).toHaveCount(0);
      continue;
    }

    const finish = page.getByTestId("finish");
    await expect(finish, `${shape.id}: the last page cannot be finished`).toBeEnabled();
    await finish.click();
    await page.waitForURL(/\/result\/?(\?|$)/, { timeout: 15_000 });
    return seen;
  }
  throw new Error(`${shape.id}: the runner never reached its last page`);
}

/** Straight through, answering everything, touching nothing else. */
async function complete(page: Page, shape: Shape) {
  await page.goto(path(`/en/tests/${shape.id}/take/`));
  return walk(page, shape);
}

/* ── the catalogue ──────────────────────────────────────────────────── */

test("every inventory is filed under the inventories", async ({ page }) => {
  await page.goto(path("/en/tests/"));

  // Inside the inventories plate, which is a claim about position rather than
  // presence: `registry.groups()` files a card by family, and one that drifted
  // into "Tests" would still be visible and still be wrong.
  const inventories = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { level: 2, name: "Inventories" }) });

  for (const id of INVENTORIES) {
    const shape = await shapeOf(id);
    // By href, because that is the identity the registry filed; the name is
    // then checked on the card that href found, so a card carrying the wrong
    // words is a different failure from a card in the wrong group.
    const card = inventories.locator(`a[href$="/tests/${id}"]`);
    await expect(card, `${id} is not in the inventories plate`).toHaveCount(1);
    await expect(card).toContainText(shape.title);
  }

  // And the group itself sits between the profilers and the questionnaires.
  // Read from the h2s rather than from `main`'s text: the note beside each
  // heading is uppercased in CSS, so its rendered text is not the string in the
  // message table and an earlier draft of this test searched for one that could
  // never appear.
  const groups = await page.getByRole("heading", { level: 2 }).allInnerTexts();
  expect(groups.indexOf("Inventories")).toBeGreaterThan(groups.indexOf("Profilers"));
  expect(groups.indexOf("Inventories")).toBeLessThan(groups.indexOf("Tests"));
});

/* ── every inventory, the whole way through ─────────────────────────── */

for (const id of INVENTORIES) {
  test(`${id}: a block stays whole, its page is named, and what was typed comes back`, async ({ page }) => {
    const shape = await shapeOf(id);
    const REASON = `Because of the ${id} question specifically, and nothing else.`;

    await page.goto(path(`/en/tests/${id}/take/`));
    await expect(page.locator("[data-item]").first()).toBeVisible();

    // The first block on the first page is the one the reason is typed into,
    // and the one the triad is measured on. Which block that is comes from the
    // bank rather than from a constant here.
    const first = shape.blocks.find((b) => b.why !== null);
    if (!first) throw new Error(`${id}: no block in this bank has a reason box`);

    /* the triad, together, on one page */
    await expect(page.locator(`[data-item="${first.id}"]`)).toBeVisible();
    await expect(page.locator(`[data-item="${first.why}"]`)).toBeVisible();
    await expect(page.locator(`[data-item="${first.why}"]`).locator("textarea")).toBeVisible();
    if (first.weight) {
      const weight = page.locator(`[data-item="${first.weight}"]`);
      await expect(weight).toBeVisible();
      // 1..10, as `core/stance.ts` declares it — read off the item rather than
      // written down, so a bank that changed the range fails here on the range.
      const rating = shape.byId.get(first.weight);
      const points = rating?.kind === "rating" ? rating.max - rating.min + 1 : 0;
      await expect(weight.getByRole("radio")).toHaveCount(points);
      expect(points).toBe(10);
    }

    const seen = await walk(page, shape, async (_, index) => {
      if (index !== 0 || !first.why) return;
      await page.locator(`[data-item="${first.why}"]`).locator("textarea").fill(REASON);
    });

    /* every page, checked as it was walked */
    for (const [index, { items, header: title }] of seen.entries()) {
      const where = `${id} page ${index + 1}/${seen.length}`;

      // No block is ever split across a page break. This is the one failure
      // `pageBy: "group"` exists to prevent and the one that looks fine: the
      // reader is asked how important a question is with the question on the
      // previous screen.
      for (const item of items) {
        const group = shape.byId.get(item)?.group;
        if (!group) continue;
        const block = shape.blocks.find((b) => b.id === group);
        expect(block, `${where}: "${item}" is in a group with no question`).toBeTruthy();
        expect(block!.items, `${where}: block "${group}" is split across a page break`).toEqual(
          expect.arrayContaining(items.filter((i) => shape.byId.get(i)?.group === group)),
        );
        for (const sibling of block!.items) {
          expect(items, `${where}: "${sibling}" is missing from its own block's page`).toContain(sibling);
        }
      }

      // A page about one subject says what it is. A page about two says
      // nothing, because a caption over questions it does not describe is
      // worse than no caption at all.
      const sections = new Set(items.map((i) => shape.byId.get(i)?.section));
      const only = sections.size === 1 ? [...sections][0] : undefined;
      const expected = sections.size === 1 ? shape.sectionTitle(only)?.toLowerCase() ?? null : null;
      expect(title, `${where}: header was ${JSON.stringify(title)}, expected ${JSON.stringify(expected)}`).toBe(
        expected,
      );
    }

    // At least one page earned a header, or the section copy every bank wrote
    // is being paid for and never shown.
    expect(
      seen.filter((s) => s.header).length,
      `${id}: not one page of the runner named its section`,
    ).toBeGreaterThan(0);

    /* the result */
    await expect(page).toHaveURL(/\/result\/?$/);
    const main = page.locator("main");
    // The sentence is prose, is deliberately absent from the result object, and
    // is read out of the stored answers by the View. If the wiring breaks this
    // is the only place it shows.
    await expect(main, `${id}: the reader's own sentence did not come back`).toContainText(REASON);
    // And the record around it: the question, and the section it was asked in.
    await expect(main).toContainText(shape.t(`stance.${first.id}.prompt`));
    const sectionTitle = shape.sectionTitle(first.section);
    if (sectionTitle) await expect(main).toContainText(sectionTitle);
  });

  test(`${id}: the playbook offers two columns and keeps a line the reader writes`, async ({ page }) => {
    const shape = await shapeOf(id);
    const OWN_LINE = `Ask me about ${id} before you decide anything.`;
    await complete(page, shape);
    await expect(page).toHaveURL(/\/result\/?$/);

    const ok = page.getByRole("region", { name: "This is fine" });
    const notOk = page.getByRole("region", { name: "This is not" });
    await expect(ok).toBeVisible();
    await expect(notOk).toBeVisible();

    // Suggestions are derived from the answers, so both sides have some.
    expect(await ok.getByRole("checkbox").count(), `${id}: nothing on the "fine" side`).toBeGreaterThan(0);
    expect(await notOk.getByRole("checkbox").count(), `${id}: nothing on the "not" side`).toBeGreaterThan(0);

    // Ticking one writes through with no Save button.
    const box = ok.getByRole("checkbox").first();
    await box.click();
    await expect(box).toHaveAttribute("aria-checked", "true");

    // A line the app could not have written for them.
    await ok.getByRole("textbox").fill(OWN_LINE);
    await ok.getByRole("button", { name: "Add" }).click();
    await expect(ok).toContainText(OWN_LINE);

    // It survives a reload, which is the whole claim the panel makes.
    await page.reload();
    await expect(page.locator("main")).toContainText(OWN_LINE);
    await expect(page.getByRole("region", { name: "This is fine" }).getByRole("checkbox").first()).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  test(`${id}: the instruction sheet carries its cards and the reader's own line`, async ({ page }) => {
    const shape = await shapeOf(id);
    const OWN_LINE = `Written by hand for ${id}, not offered by the page.`;
    await complete(page, shape);
    const ok = page.getByRole("region", { name: "This is fine" });
    await ok.getByRole("textbox").fill(OWN_LINE);
    await ok.getByRole("button", { name: "Add" }).click();
    await expect(ok).toContainText(OWN_LINE);

    await page.goto(path("/en/instructions/"));
    const main = page.locator("main");
    await expect(main).toContainText(OWN_LINE);
    // Some card of this instrument's is on the sheet. Which one is the bank's
    // business; that the sheet is not empty of it is this test's.
    await expect(main.locator("h4").first()).toBeVisible();
  });
}

/* ── what a share link is allowed to contain ────────────────────────── */

/**
 * Every token the sharing page would hand out, decoded.
 *
 * Read off the preview links rather than reconstructed here, because the point
 * of the test is what the *page* offers. `reportLink` builds both the copy
 * button and the preview href from one call, so the href is the link the reader
 * would send, character for character.
 *
 * The rule the whole feature rests on is that withheld content is **absent from
 * the link** rather than hidden by the page that renders it — so this returns
 * the decoded payload, and the assertions are about what is not in it.
 */
async function tokens(page: Page): Promise<{ raw: string; answersFor(id: string): Record<string, unknown> | null }[]> {
  const hrefs = await page
    .getByRole("link")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  /**
   * The token lives in the fragment, and this asserts it rather than coping.
   *
   * It shipped in a query string once, which handed the whole payload to every
   * link-preview crawler a messenger runs. A test that merely accepted either
   * form would let it drift back.
   */
  const inQuery = hrefs.filter((href) => href.includes("?d="));
  expect(inQuery, "a share link carried its token in the query string").toEqual([]);

  return hrefs
    .filter((href) => href.includes("#d="))
    .map((href) => {
      const token = decodeURIComponent(href.split("#d=")[1] ?? "");
      const raw = Buffer.from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
      const payload = JSON.parse(raw) as { r?: { i: string; a: string }[] };
      return {
        raw,
        answersFor: (id: string) => {
          const row = (payload.r ?? []).find((r) => r.i === id);
          return row ? (JSON.parse(row.a) as Record<string, unknown>) : null;
        },
      };
    });
}

/** Put one instrument's run in front of the widest audience it permits. */
async function shareAt(page: Page, title: string, audience: string) {
  await page.goto(path("/en/sharing/"));
  const row = page.getByRole("group", { name: `Audience for ${title}` });
  await expect(row, `no sharing row for "${title}"`).toBeVisible();
  await row.getByRole("button", { name: audience, exact: true }).click();
  await expect(row.getByRole("button", { name: audience, exact: true })).toHaveAttribute("aria-pressed", "true");
}

for (const id of INVENTORIES) {
  /* ── the private block ──────────────────────────────────────────── */

  test(`${id}: a private block produces no card and nothing of it travels`, async ({ page }) => {
    const shape = await shapeOf(id);
    const secret = shape.blocks.find((b) => b.private);
    // Found by the flag, not by name. `money-management.undisclosed-debt` is
    // the only one across the eight banks today; a second one marked tomorrow
    // is covered on the day it is marked rather than on the day somebody
    // remembers this file.
    test.skip(!secret, `${id} declares no private block`);
    if (!secret) return;

    const REASON = `A sentence about ${secret.id} that must never reach a link.`;
    const open = shape.blocks.find((b) => !b.private && b.section === secret.section && b.why);

    await page.goto(path(`/en/tests/${id}/take/`));
    await walk(page, shape, async ({ items }) => {
      if (secret.why && items.includes(secret.why)) {
        await page.locator(`[data-item="${secret.why}"]`).locator("textarea").fill(REASON);
      }
    });
    await expect(page).toHaveURL(/\/result\/?$/);

    /* ── no card, on the reader's result or on the sheet ─────────── */

    const forbidden = [
      shape.t(`stance.${secret.id}.prompt`),
      ...(() => {
        const item = shape.byId.get(secret.id);
        return item && "options" in item ? item.options.map((o) => o.label) : [];
      })(),
    ];

    // The cards plate, by its own heading — not `main`, which also holds the
    // reader's own answers, where the private block *should* appear. This is
    // the artefact that gets printed and handed over; the result page is not.
    const cards = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { level: 2, name: "What this added" }) });
    await expect(cards).toBeVisible();
    const cardText = await cards.innerText();
    for (const words of forbidden) {
      expect(cardText, `${id}: an instruction card on the result carries "${words}"`).not.toContain(words);
    }
    // Not vacuous: the *other* block of the same section does reach a card, so
    // "no card" is a decision about this block rather than an empty plate.
    if (open) {
      const said = await page.locator(`[data-item="${open.id}"]`).count();
      expect(said).toBe(0); // we are on the result page, not the runner
      const label = optionLabel(shape, open.id, 0);
      expect(cardText, `${id}: no card carries "${label}", so the check above proves nothing`).toContain(label);
    }

    await page.goto(path("/en/instructions/"));
    const sheet = await page.locator("main").innerText();
    for (const words of forbidden) {
      expect(sheet, `${id}: the instruction sheet carries "${words}"`).not.toContain(words);
    }
    if (open) expect(sheet).toContain(optionLabel(shape, open.id, 0));

    /* ── and nothing of it in a share token ─────────────────────── */

    await shareAt(page, shape.title, "partner");
    const found = await tokens(page);
    expect(found.length, `${id}: the sharing page offered no links`).toBeGreaterThan(0);

    let carried = 0;
    for (const token of found) {
      const answers = token.answersFor(id);
      if (!answers) continue;
      carried++;
      // Private *entire*. Not the answer with the weight left behind — a
      // token that omitted the answer and carried `<id>.weight = 9` would
      // announce exactly what the omission was withholding.
      for (const derived of secret.items) {
        expect(answers, `${id}: "${derived}" is in a share token`).not.toHaveProperty(derived);
      }
      expect(token.raw, `${id}: "${secret.id}" appears in a share token`).not.toContain(secret.id);
      expect(token.raw, `${id}: the reader's typed reason is in a share token`).not.toContain(REASON);
      // Non-vacuity again: the shared blocks and their weights *are* in it, so
      // the absences above are a filter rather than an empty token.
      if (open) {
        expect(answers, `${id}: the token carries no answers at all`).toHaveProperty(open.id);
        if (open.weight) expect(answers[open.weight]).toBe(9);
      }
    }
    expect(carried, `${id}: no share token carried this run, so nothing was tested`).toBeGreaterThan(0);
  });

  /* ── the questions with no options ──────────────────────────────── */

  test(`${id}: open questions render, never block, and come back`, async ({ page }) => {
    const shape = await shapeOf(id);
    // Found by shape: a `text` item with no block around it. `good-life` is the
    // only bank in the eight with any, and naming it here would be the same
    // trap the id list avoids.
    test.skip(shape.openItems.length === 0, `${id} has no open questions`);
    if (!shape.openItems.length) return;

    const written = new Map(shape.openItems.map((open) => [open, `In my own words, about ${open}.`]));

    await page.goto(path(`/en/tests/${id}/take/`));
    let met = 0;
    await walk(page, shape, async ({ items }) => {
      const here = items.filter((item) => shape.openItems.includes(item));
      if (!here.length) return;

      for (const open of here) {
        met++;
        const box = page.locator(`[data-item="${open}"]`);
        // A question and a space under it. Nothing else: no options, no
        // weight, nothing to pick.
        await expect(box, `${id}: "${open}" is not on the page`).toBeVisible();
        await expect(box.locator("textarea")).toBeVisible();
        await expect(box).toContainText(shape.t(`item.${open}`));
        await expect(box.getByRole("radio")).toHaveCount(0);
        await expect(box.getByRole("checkbox")).toHaveCount(0);
      }

      // Empty, and the way on is open. "I would rather not" is a real answer,
      // and a form that will not advance until something is typed collects
      // sentences that were typed to advance the form.
      const next = page.getByTestId("next");
      if (await next.count()) await expect(next, `${id}: an empty open question blocks Next`).toBeEnabled();
      else await expect(page.getByTestId("finish"), `${id}: an empty open question blocks Finish`).toBeEnabled();

      for (const open of here) await page.locator(`[data-item="${open}"]`).locator("textarea").fill(written.get(open)!);
    });
    expect(met, `${id}: the runner never drew its open questions`).toBe(shape.openItems.length);

    await expect(page).toHaveURL(/\/result\/?$/);
    const main = page.locator("main");
    for (const [open, sentence] of written) {
      await expect(main, `${id}: "${open}" did not come back on the result`).toContainText(sentence);
      // Under its own question, because a paragraph months later is a
      // paragraph whose question has been forgotten.
      await expect(main).toContainText(shape.t(`item.${open}`));
    }

    // Never scored, never shared. The first is the result object's business and
    // is unit-tested; the second is a link, and this is where a link is made.
    await shareAt(page, shape.title, "partner");
    for (const token of await tokens(page)) {
      const answers = token.answersFor(id);
      if (!answers) continue;
      for (const [open, sentence] of written) {
        expect(answers, `${id}: open question "${open}" is in a share token`).not.toHaveProperty(open);
        expect(token.raw, `${id}: an open answer's prose is in a share token`).not.toContain(sentence);
      }
    }
  });
}

/** The nth option's label, as the reader read it. */
function optionLabel(shape: Shape, id: string, index: number): string {
  const item = shape.byId.get(id);
  if (!item || !("options" in item)) throw new Error(`${shape.id}: "${id}" has no options`);
  return item.options[index].label;
}
