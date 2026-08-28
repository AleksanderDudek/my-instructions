import { test, expect } from "@playwright/test";
import { IDS, LOCALES } from "./instruments";
import { path } from "./paths";

/**
 * Every instrument, every language, actually rendering.
 *
 * A view that throws only for one instrument in one locale is invisible to a
 * suite that walks one happy path — and after porting sixteen of them by
 * machine, that is exactly the failure to expect. So this walks all of them:
 * cheap, and the only test that would notice a single broken translation table
 * or a view that reads a field its scoring no longer produces.
 *
 * "All of them" is the registry's answer, not a copy of it kept here. See
 * `./instruments` for why a written-out list is worse than no list at all.
 */

for (const locale of LOCALES) {
  test(`every instrument has a readable page in ${locale}`, async ({ page }) => {
    const broken: string[] = [];
    for (const id of IDS) {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      const response = await page.goto(path(`/${locale}/tests/${id}/`));
      if (response?.status() !== 200) {
        broken.push(`${id}: HTTP ${response?.status()}`);
        return;
      }
      const heading = await page.getByRole("heading", { level: 1 }).first().textContent();
      // A page that renders its own message key instead of a sentence means
      // the table is missing or the namespace is wrong — it looks like content
      // until you read it.
      if (!heading?.trim() || heading.includes("title")) broken.push(`${id}: heading is "${heading}"`);
      if (errors.length) broken.push(`${id}: ${errors[0].slice(0, 120)}`);
    }
    expect(broken).toEqual([]);
  });
}

/**
 * One test per instrument, not one test for all of them.
 *
 * This walked the whole registry inside a single `test()` until the catalogue
 * reached twenty-four. Filling in eight inventories — each a dozen blocks of
 * position, weight and reason, over four or five pages — does not fit in one
 * test's timeout, and what the runner reported was a stale "element is not
 * stable" on whichever radio the clock happened to stop on. That reads as a
 * flaky control and is really a budget that ran out.
 *
 * A test each gives every instrument its own budget and, more usefully, its own
 * name in the output: the failure now says which instrument, before anybody
 * opens a trace. The `broken` array stays because an instrument can fail in
 * several ways at once and all of them are worth printing together.
 */
for (const id of IDS) {
  test(`${id} produces a result without throwing`, async ({ page }) => {
    const broken: string[] = [];
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(path(`/en/tests/${id}/take/`));

    // Questionnaire or profiler — answer whatever is on screen, page by page.
    for (let guard = 0; guard < 40; guard++) {
      for (const group of await page.getByRole("radiogroup").all()) {
        await group.getByRole("radio").nth(2).click();
      }
      const next = page.getByTestId("next");
      if (await next.isVisible().catch(() => false)) {
        if (!(await next.isEnabled())) break;
        await next.click();
        continue;
      }
      break;
    }

    // A profiler may require at least one pick from a multi-select. Ticking
    // the first box of each is what a person filling the form in would do, and
    // leaving them blank tests the validation rather than the instrument.
    for (const box of await page.getByRole("checkbox").all()) {
      const group = box.locator("xpath=ancestor::*[@data-field][1]");
      if ((await group.getByRole("checkbox", { includeHidden: false }).all()).length) {
        const already = await group.locator('[aria-checked="true"]').count();
        if (!already) await box.click();
      }
    }

    const finish = page.getByTestId("finish");
    if (!(await finish.isVisible().catch(() => false))) {
      broken.push(`${id}: never reached a finish button`);
      return;
    }
    await finish.click();

    const arrived = await page
      .waitForURL(/\/result\/?/, { timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!arrived) {
      broken.push(`${id}: never reached a result`);
      return;
    }

    // The result page reads local storage before it can draw, so it shows a
    // loading line first. Reading `main` immediately measures that line — an
    // earlier draft of this test did exactly that and reported twelve broken
    // instruments that were all fine.
    // Poll the page's own text rather than a heading level. Instruments draw
    // their readings differently — some open on an h3, numerology on an h4 —
    // and a test that encodes one instrument's markup is a test that fails
    // when another is added rather than when something breaks.
    const settled = await expect
      .poll(async () => (await page.locator("main").innerText().catch(() => "")).length, { timeout: 10_000 })
      .toBeGreaterThan(200)
      .then(() => true)
      .catch(() => false);
    if (!settled) {
      const shown = (await page.locator("main").innerText().catch(() => "")).slice(0, 80).replace(/\n+/g, " / ");
      broken.push(`${id}: result stalled showing "${shown}"`);
    }
    if (errors.length) broken.push(`${id}: ${errors[0].slice(0, 140)}`);

    expect(broken).toEqual([]);
  });
}
