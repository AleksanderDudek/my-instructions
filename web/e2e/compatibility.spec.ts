import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";

/**
 * The kept list: adding, correcting, finding and paging through it.
 *
 * The arithmetic is unit-tested and so is the search-order-page logic. What can
 * only be checked here is that the wiring holds — that a date typed in is still
 * there after a reload, that editing one changes the reading rather than
 * producing a second row, and that the page does not fall over with three
 * hundred of them.
 *
 * This spec used to assert the opposite of its first test: that nothing typed
 * here survived a reload. That was the right promise while the screen kept
 * nothing, and it is the wrong one now that it keeps a list on purpose.
 */

async function takeNumerology(page: Page) {
  await page.goto(path("/en/tests/numerology/take/"));
  await page.getByTestId("finish").click();
  await page.waitForURL(/\/result\/?/);
  await expect(page.locator("[data-compatibility]")).toBeVisible();
}

async function add(page: Page, name: string, day: string, month: string, year: string) {
  await page.locator("#fit-name").fill(name);
  await page.locator("#fit-day").fill(day);
  await page.locator("#fit-month").fill(month);
  await page.locator("#fit-year").fill(year);
  await page.getByTestId("fit-save").click();
}

const rows = (page: Page) => page.locator("[data-fit]");

/** Write records straight into storage — the only way to reach a list this long. */
async function seed(page: Page, count: number) {
  await page.evaluate((n) => {
    for (let i = 0; i < n; i++) {
      localStorage.setItem(
        `mi:1:fit:seed${i}`,
        JSON.stringify({
          id: `seed${i}`,
          name: `Person ${i}`,
          day: (i % 27) + 1,
          month: (i % 12) + 1,
          year: 1950 + (i % 60),
          createdAt: new Date(Date.UTC(2020, 0, 1) + i * 86400000).toISOString(),
          updatedAt: new Date(Date.UTC(2020, 0, 1) + i * 86400000).toISOString(),
        }),
      );
    }
  }, count);
}

test("a date is added, kept, and still there after a reload", async ({ page }) => {
  await takeNumerology(page);
  await add(page, "Ada", "3", "7", "1966");

  await expect(rows(page)).toHaveCount(1);
  const row = rows(page).first();
  await expect(row).toContainText("Ada");
  await expect(row).toContainText("3.7.1966");
  // Collapsed by default: the point of the accordion is that a long list reads
  // as a list rather than as a wall.
  await expect(row.locator("table")).toBeHidden();

  await page.reload();
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).toContainText("Ada");
});

test("expanding one shows both charts side by side and the four parts", async ({ page }) => {
  await takeNumerology(page);
  await add(page, "Ada", "3", "7", "1966");

  await rows(page).first().getByRole("button", { name: /Ada/ }).click();
  const table = rows(page).first().locator("table");
  await expect(table).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "You" })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Ada" })).toBeVisible();
  await expect(table.getByRole("row")).toHaveCount(5);
});

test("editing one changes it rather than adding a second", async ({ page }) => {
  await takeNumerology(page);
  await add(page, "Ada", "3", "7", "1966");

  const before = await rows(page).first().innerText();

  await rows(page).first().getByRole("button", { name: /Ada/ }).click();
  await rows(page).first().getByRole("button", { name: "Edit" }).click();
  await page.locator("#fit-name").fill("Ada L");
  await page.locator("#fit-year").fill("1970");
  await page.getByTestId("fit-save").click();

  await expect(rows(page)).toHaveCount(1);
  const after = rows(page).first();
  await expect(after).toContainText("Ada L");
  await expect(after).toContainText("3.7.1970");
  // A different date is a different reading. If the score were stored rather
  // than recomputed, this is where it would go stale.
  expect(await after.innerText()).not.toBe(before);

  await page.reload();
  await expect(rows(page).first()).toContainText("Ada L");
});

test("an impossible date is refused by the instrument's own validator", async ({ page }) => {
  await takeNumerology(page);
  // 31 September. The form rejects it, so this screen has to as well.
  await add(page, "Nobody", "31", "9", "1990");
  await expect(page.locator("#fit-day-error")).toBeVisible();
  await expect(rows(page)).toHaveCount(0);
});

test("one can be forgotten on its own", async ({ page }) => {
  await takeNumerology(page);
  await add(page, "Ada", "3", "7", "1966");
  await add(page, "Bo", "11", "11", "2011");
  await expect(rows(page)).toHaveCount(2);

  await rows(page).first().getByRole("button", { name: /Bo/ }).click();
  await rows(page).first().getByRole("button", { name: "Forget" }).click();

  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).toContainText("Ada");
  await page.reload();
  await expect(rows(page)).toHaveCount(1);
});

test("search finds by name and by date, including one on a later page", async ({ page }) => {
  await takeNumerology(page);
  await seed(page, 24);
  await add(page, "Grandmother", "3", "7", "1966");

  await expect(rows(page)).toHaveCount(10);

  // A name that sorts far down the list: cutting to ten before searching would
  // make this unfindable, which reads as a search that does not work.
  await page.locator("#fit-search").fill("grandmother");
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).toContainText("Grandmother");

  await page.locator("#fit-search").fill("3.7.1966");
  await expect(rows(page)).toHaveCount(1);

  await page.locator("#fit-search").fill("nothing like this");
  await expect(page.getByTestId("fit-none")).toBeVisible();
  await expect(rows(page)).toHaveCount(0);

  await page.locator("#fit-search").fill("");
  await expect(rows(page)).toHaveCount(10);
});

test("pages ten at a time, and the last page is the remainder", async ({ page }) => {
  await takeNumerology(page);
  await seed(page, 25);
  await page.reload();

  await expect(rows(page)).toHaveCount(10);
  await expect(page.getByTestId("fit-prev")).toBeDisabled();

  await page.getByTestId("fit-next").click();
  await expect(rows(page)).toHaveCount(10);
  await page.getByTestId("fit-next").click();
  await expect(rows(page)).toHaveCount(5);
  await expect(page.getByTestId("fit-next")).toBeDisabled();

  await page.getByTestId("fit-prev").click();
  await expect(rows(page)).toHaveCount(10);
});

test("holds three hundred without the page giving up", async ({ page }) => {
  await takeNumerology(page);
  await seed(page, 300);

  const started = Date.now();
  await page.reload();
  await expect(rows(page)).toHaveCount(10);
  const drawn = Date.now() - started;

  // Not a benchmark — a floor. Ten comparisons are computed and three hundred
  // are not, so this must not scale with the list. If it ever creeps past a few
  // seconds, something started computing the whole list again.
  expect(drawn, `three hundred rows took ${drawn}ms to draw ten`).toBeLessThan(10_000);

  await expect(page.getByTestId("fit-count")).toContainText("300");

  // And the search stays responsive over the full list.
  await page.locator("#fit-search").fill("Person 42");
  await expect(rows(page)).toHaveCount(1);
});
