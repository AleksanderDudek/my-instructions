import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";

/**
 * The reported bug, written down so it cannot come back.
 *
 * The symptom was "some select or radio fields did not work". The cause was
 * that answering replaced the surrounding markup, destroying the control
 * mid-interaction: focus fell back to the document, and an open native select
 * was torn out from under the pointer before its value landed.
 *
 * Every test below fails on that behaviour and passes on the current one. They
 * assert what a person experiences — the choice stuck, the keyboard still
 * works, the answer survived a page turn — rather than what the DOM contains,
 * because the DOM was never the thing that was broken.
 */

const TEST = "love-languages";
const take = (locale = "en") => path(`/${locale}/tests/${TEST}/take/`);

/**
 * Press an arrow the way a person does: down, a beat, up.
 *
 * `keyboard.press()` sends keydown and keyup in the same tick. Selection
 * follows focus in a radio group because Radix records "an arrow is down" on
 * keydown and clears it on keyup, then checks that flag when the focus handler
 * runs — and React processes focus after both synthetic events have landed, so
 * the flag is already false. No human types that fast; the shortest real
 * keypress is tens of milliseconds. Using `press()` here reported a product
 * bug that did not exist.
 */
async function pressArrow(page: Page, key: string) {
  await page.keyboard.down(key);
  await page.waitForTimeout(60);
  await page.keyboard.up(key);
}

/** The runner reads local storage before it draws, so wait for the questions. */
async function openRunner(page: Page, locale = "en") {
  await page.goto(take(locale));
  await expect(page.getByRole("radiogroup").first()).toBeVisible();
}

test("choosing an answer keeps it chosen", async ({ page }) => {
  await openRunner(page);
  const group = page.getByRole("radiogroup").first();
  const option = group.getByRole("radio").nth(3);

  await option.click();
  await expect(option).toBeChecked();

  // The original defect: a second answer elsewhere re-rendered the page and
  // silently dropped the first.
  await page.getByRole("radiogroup").nth(1).getByRole("radio").first().click();
  await expect(option).toBeChecked();
});

test("focus stays on the control after answering", async ({ page }) => {
  await openRunner(page);
  const option = page.getByRole("radiogroup").first().getByRole("radio").nth(2);
  await option.click();

  // This is the assertion that fails against the old runner. Replacing the
  // markup sent focus back to <body>, so every subsequent Tab restarted from
  // the top of the document and the form became unusable by keyboard.
  await expect(option).toBeFocused();
});

test("a radio group is navigable with the arrow keys", async ({ page }) => {
  await openRunner(page);
  const group = page.getByRole("radiogroup").first();
  const options = group.getByRole("radio");

  await options.first().focus();
  await pressArrow(page, "ArrowRight");
  await expect(options.nth(1)).toBeFocused();
  await expect(options.nth(1)).toBeChecked();

  await pressArrow(page, "ArrowRight");
  await expect(options.nth(2)).toBeChecked();
  await expect(options.nth(1)).not.toBeChecked();

  // Wrapping is part of the pattern: from the last point, forward returns to
  // the first rather than trapping the reader at the end of the scale.
  await options.last().focus();
  await pressArrow(page, "ArrowRight");
  await expect(options.first()).toBeFocused();
});

test("answers survive turning the page and coming back", async ({ page }) => {
  await openRunner(page);
  // Fill the page first, *then* set the one answer under test — an earlier
  // draft of this test set it first and the loop below overwrote it, so it was
  // asserting the loop's value and would have passed against a broken app.
  for (const group of await page.getByRole("radiogroup").all()) {
    await group.getByRole("radio").nth(2).click();
  }
  const first = page.getByRole("radiogroup").first().getByRole("radio").nth(4);
  await first.click();
  await expect(first).toBeChecked();

  await page.getByTestId("next").click();
  await expect(page.getByTestId("prev")).toBeEnabled();

  await page.getByTestId("prev").click();
  await expect(page.getByRole("radiogroup").first().getByRole("radio").nth(4)).toBeChecked();
});

test("a half-finished run is still there after a reload", async ({ page }) => {
  await openRunner(page);
  await page.getByRole("radiogroup").first().getByRole("radio").nth(1).click();
  await expect(page.getByTestId("progress")).toContainText("1");

  await page.reload();
  await expect(page.getByRole("radiogroup").first()).toBeVisible();
  await expect(page.getByRole("radiogroup").first().getByRole("radio").nth(1)).toBeChecked();
});

test("progress counts what has actually been answered", async ({ page }) => {
  await openRunner(page);
  await expect(page.getByTestId("progress")).toContainText("0");
  await page.getByRole("radiogroup").first().getByRole("radio").nth(0).click();
  await expect(page.getByTestId("progress")).toContainText("1");
  // Changing an answer is not a second answer.
  await page.getByRole("radiogroup").first().getByRole("radio").nth(4).click();
  await expect(page.getByTestId("progress")).toContainText("1");
});
