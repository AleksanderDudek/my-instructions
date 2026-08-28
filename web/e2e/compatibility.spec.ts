import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";

/**
 * The premium calculator, and the promise printed under it.
 *
 * Two things are worth an end-to-end test rather than a unit one. That a
 * reading appears at all — the arithmetic is unit-tested, the wiring is not —
 * and that a date typed here does not survive a reload, which is a claim about
 * storage that can only be checked by actually reloading.
 *
 * The second is the one that matters. The copy tells the reader that somebody
 * else's date of birth is not theirs to keep and that nothing here is written
 * down. A test is what stops that becoming a sentence the code disagrees with.
 */

/** Take the instrument, so there is a chart to compare against. */
async function takeNumerology(page: Page) {
  await page.goto(path("/en/tests/numerology/take/"));
  await page.getByTestId("finish").click();
  await page.waitForURL(/\/result\/?/);
  await expect(page.locator("[data-compatibility]")).toBeVisible();
}

async function check(page: Page, day: string, month: string, year: string, name?: string) {
  if (name) await page.locator("#fit-name").fill(name);
  await page.locator("#fit-day").fill(day);
  await page.locator("#fit-month").fill(month);
  await page.locator("#fit-year").fill(year);
  await page.getByTestId("fit-check").click();
}

test("a date is checked against the reader's own chart, as often as they like", async ({ page }) => {
  await takeNumerology(page);

  await check(page, "3", "7", "1966", "Ada");
  const first = page.locator("[data-compatibility] article").first();
  await expect(first).toContainText("Ada");
  await expect(first).toContainText("/ 100");
  // Four parts, each with its own bar and note.
  await expect(first.locator("p").filter({ hasText: "/" }).first()).toBeVisible();

  // A second date does not replace the first: the point of the feature is
  // holding several beside each other.
  await check(page, "11", "11", "2011", "Bo");
  const all = page.locator("[data-compatibility] article");
  await expect(all).toHaveCount(2);
  await expect(all.first()).toContainText("Bo");
  await expect(all.nth(1)).toContainText("Ada");

  await all.first().getByRole("button", { name: /forget/i }).click();
  await expect(page.locator("[data-compatibility] article")).toHaveCount(1);
});

test("an impossible date is refused by the instrument's own validator", async ({ page }) => {
  await takeNumerology(page);
  // 31 September. The form rejects it, so this screen has to as well — a date
  // one accepted and the other refused would be two instruments in one name.
  await check(page, "31", "9", "1990");
  await expect(page.locator("#fit-day-error")).toBeVisible();
  await expect(page.locator("[data-compatibility] article")).toHaveCount(0);
});

test("nothing typed into it survives a reload", async ({ page }) => {
  await takeNumerology(page);
  await check(page, "3", "7", "1966", "Ada");
  await expect(page.locator("[data-compatibility] article")).toHaveCount(1);

  await page.reload();
  await expect(page.locator("[data-compatibility]")).toBeVisible();
  await expect(page.locator("[data-compatibility] article")).toHaveCount(0);

  /**
   * And it is absent from storage, not merely unrendered.
   *
   * Checking the screen alone would pass for a page that stored the date and
   * simply did not draw it again — which is the failure the copy actually
   * promises against. So the assertion is against everything this origin has
   * written, under any key.
   */
  const stored = await page.evaluate(() => {
    const out: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) out.push(`${key}=${localStorage.getItem(key) ?? ""}`);
    }
    return out.join("\n");
  });
  expect(stored, "a date checked in the calculator reached storage").not.toContain("Ada");
  expect(stored).not.toContain("1966");
});
