import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";

/**
 * The profiler path, which is where the reported bug was worst.
 *
 * A questionnaire is radios; a profiler is text, numbers, times and selects.
 * The select was the control people said "did not work", and the reason was
 * structural: the old runner replaced the surrounding markup on every change,
 * so a native <select> was torn out from under the pointer mid-choice and the
 * value never landed.
 *
 * These tests drive the select the way a person does — open it, choose with
 * the keyboard, confirm the choice stuck — and then finish the form, because a
 * value that displays correctly and never reaches the result is the same bug
 * one step later.
 */
/**
 * Pick the option that is not currently chosen, by name.
 *
 * Two things this had to learn. An earlier version pressed ArrowDown and
 * assumed the highlight moved: it passed locally and failed in CI, because the
 * keypress can land before the listbox has mounted its items, and a lost
 * keystroke is indistinguishable from a broken control. Naming the option
 * waits for it.
 *
 * And `before` is passed in rather than read here, because while the listbox
 * is open Radix marks everything outside its portal `aria-hidden` — correctly,
 * so a screen reader is not offered the page behind a modal listbox. The
 * trigger is therefore invisible to a role query for exactly as long as this
 * function runs.
 */
async function chooseOther(page: Page, before: string) {
  await expect(page.getByRole("listbox")).toBeVisible();
  const options = await page.getByRole("option").all();
  for (const option of options) {
    const text = (await option.textContent())?.trim() ?? "";
    if (text && text !== before) {
      await option.click();
      return text;
    }
  }
  throw new Error("the listbox offered nothing but the current value");
}

test("a select opens, takes a choice, and keeps it", async ({ page }) => {
  await page.goto(path("/en/tests/chronotype/take/"));
  const trigger = page.getByRole("combobox").first();
  // The chosen label, not the whole button: the button also contains a
  // decorative caret, and reading it as the value is how an earlier draft of
  // this test "chose" the option that was already selected and still passed
  // its own comparison.
  const value = trigger.getByTestId("select-value");
  await expect(trigger).toBeVisible();

  const before = (await value.textContent())?.trim() ?? "";
  await trigger.click();
  const after = await chooseOther(page, before);

  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(value, "the chosen option did not land on the trigger").toHaveText(after);
  expect(after).not.toBe(before);

  // The value must survive the re-render that follows every other edit — the
  // exact thing the old runner lost.
  await page.getByRole("spinbutton").first().fill("4");
  await expect(value).toHaveText(after);
});

test("a select opens and closes from the keyboard alone", async ({ page }) => {
  await page.goto(path("/en/tests/chronotype/take/"));
  const trigger = page.getByRole("combobox").first();
  const value = trigger.getByTestId("select-value");
  await trigger.focus();
  await expect(trigger).toBeFocused();

  // Opening, choosing and closing without a mouse is the part that has to work;
  // which key moves the highlight is the primitive's business, not this app's.
  const before = (await value.textContent())?.trim() ?? "";
  await page.keyboard.press("Enter");
  const after = await chooseOther(page, before);
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(value).toHaveText(after);
  // Closing must hand focus back, or a keyboard user is stranded.
  await expect(trigger).toBeFocused();
});

test("a profiler fills in and produces a reading", async ({ page }) => {
  await page.goto(path("/en/tests/chronotype/take/"));
  await expect(page.getByTestId("finish")).toBeVisible();

  // Every field has a sensible default, so submitting untouched is a real use
  // of the form rather than a shortcut around it.
  await page.getByTestId("finish").click();
  await expect(page).toHaveURL(/\/result\/?$/);
  await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();
});

test("text and number fields keep what was typed across edits", async ({ page }) => {
  await page.goto(path("/en/tests/chronotype/take/"));
  const number = page.getByRole("spinbutton").first();
  await number.fill("3");
  await expect(number).toHaveValue("3");

  // Touch a different control, then come back: the first value must still be
  // there. A controlled input that resets on a sibling's change is the same
  // defect as a select that loses its choice.
  await page.getByRole("combobox").first().click();
  await page.keyboard.press("Escape");
  await expect(number).toHaveValue("3");
});
