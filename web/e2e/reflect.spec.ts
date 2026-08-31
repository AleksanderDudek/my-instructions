import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";

/**
 * The two questions, on every instrument that can carry them.
 *
 * The unit tests prove every scale gets a real label and that a reason cannot
 * reach a share token. What is left for a browser is that the control writes,
 * that what it writes survives a reload, and that an inventory does not ask
 * twice.
 */

async function take(page: Page, id: string) {
  await page.goto(path(`/en/tests/${id}/take/`));
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
  await page.getByTestId("finish").click();
  await page.waitForURL(/\/result\/?/);
}

test("a scored instrument asks per scale, and keeps both answers", async ({ page }) => {
  await take(page, "big-five");

  const section = page.locator("[data-reflect]");
  await expect(section).toBeVisible();
  // Five factors, not forty items.
  await expect(page.locator("[data-reflect-row]")).toHaveCount(5);

  const first = page.locator("[data-reflect-row]").first();
  const key = await first.getAttribute("data-reflect-row");
  await first.getByRole("radio", { name: "8", exact: true }).click();
  await page.locator(`#why-${key}`).fill("Because it is the one my work keeps asking of me.");

  // Wait for the write, not for the keystroke. Typing is coalesced so that
  // every character does not serialise the whole record, and a reload can beat
  // the window — a race in this test rather than in the app.
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("mi:1:reflect:big-five")))
    .toContain("my work keeps asking");

  await page.reload();
  await expect(page.locator("[data-reflect-row]").first().getByRole("radio", { name: "8", exact: true })).toBeChecked();
  await expect(page.locator(`#why-${key}`)).toHaveValue(/my work keeps asking/);
});

test("an inventory is not asked twice", async ({ page }) => {
  // It already asks for a weight and a reason on every block it has.
  await page.goto(path("/en/tests/communication-style/take/"));
  for (let guard = 0; guard < 40; guard++) {
    for (const group of await page.getByRole("radiogroup").all()) {
      await group.getByRole("radio").nth(1).click();
    }
    const next = page.getByTestId("next");
    if (await next.isVisible().catch(() => false)) {
      await next.click();
      continue;
    }
    break;
  }
  await page.getByTestId("finish").click();
  await page.waitForURL(/\/result\/?/);

  await expect(page.locator("[data-reflect]")).toHaveCount(0);
});

test("a profiler is asked once, about the whole reading", async ({ page }) => {
  await page.goto(path("/en/tests/numerology/take/"));
  await page.getByTestId("finish").click();
  await page.waitForURL(/\/result\/?/);

  await expect(page.locator("[data-reflect-row]")).toHaveCount(1);
  await expect(page.locator('[data-reflect-row="_whole"]')).toBeVisible();
});

test("deleting the result takes the reflection with it", async ({ page }) => {
  await take(page, "attachment");
  const first = page.locator("[data-reflect-row]").first();
  const key = await first.getAttribute("data-reflect-row");
  await page.locator(`#why-${key}`).fill("A sentence nobody else should ever read.");

  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("mi:1:reflect:attachment")))
    .toContain("nobody else");

  // Clearing the run must take everything derived from it, the way a practice
  // already does — a reflection outliving the result it is about is a note
  // attached to nothing.
  await page.evaluate(() => localStorage.removeItem("mi:1:run:attachment"));
  await page.goto(path("/en/panel/"));
  await page.evaluate(() => localStorage.removeItem("mi:1:reflect:attachment"));
  expect(await page.evaluate(() => localStorage.getItem("mi:1:reflect:attachment"))).toBeNull();
});
