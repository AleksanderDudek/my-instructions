import { test, expect } from "@playwright/test";
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
test("a select opens, takes a keyboard choice, and keeps it", async ({ page }) => {
  await page.goto(path("/en/tests/chronotype/take/"));
  const trigger = page.getByRole("combobox").first();
  await expect(trigger).toBeVisible();

  const before = (await trigger.textContent())?.trim();

  await trigger.click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("listbox")).toBeHidden();
  const after = (await trigger.textContent())?.trim();
  expect(after, "the chosen option did not land on the trigger").not.toBe(before);

  // The value must survive the re-render that follows every other edit — the
  // exact thing the old runner lost.
  await page.getByRole("spinbutton").first().fill("4");
  await expect(trigger).toHaveText(after!);
});

test("a select is operable without opening it by mouse", async ({ page }) => {
  await page.goto(path("/en/tests/chronotype/take/"));
  const trigger = page.getByRole("combobox").first();
  await trigger.focus();
  await expect(trigger).toBeFocused();

  const before = (await trigger.textContent())?.trim();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  expect((await trigger.textContent())?.trim()).not.toBe(before);
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
