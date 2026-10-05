import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";

/**
 * Two people, one page.
 *
 * Twenty instruments carried a `Compare` view that no route ever rendered,
 * so the app's stated purpose — understanding someone by comparing results —
 * was a feature nobody could reach. It now lives on the opened-report page:
 * the sender's result, and under it the reader's own run of the same
 * instrument, scored side by side. The report link the sender already made
 * is the comparison link.
 *
 * Here sender and reader are one browser, which is enough: the token carries
 * the sender's answers, the store holds the reader's run, and the page has to
 * put the two together.
 */
async function take(page: Page, id: string) {
  await page.goto(path(`/en/tests/${id}/take/`));
  for (let guard = 0; guard < 40; guard++) {
    for (const group of await page.getByRole("radiogroup").all()) {
      await group.getByRole("radio").nth(3).click();
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

test("an opened report compares the sender's result with the reader's own", async ({ page }) => {
  // Attachment: short, not sensitive, so a public profile includes it.
  await take(page, "attachment");

  await page.goto(path("/en/sharing/"));
  await page.getByRole("button", { name: "Add a public one" }).click();
  // A profile just added opens itself, with its link already on the card.
  const card = page.locator("[data-profile]").first();
  const link = await card.locator("[data-link]").inputValue();
  expect(link).toContain("/report/");

  await page.goto(link);
  const block = page.locator('[data-compare="attachment"]');
  await expect(block).toBeVisible();
  // Nobody has set a display name, so the two sides are "You" and "Them".
  await expect(block.getByRole("heading", { name: "You & Them" })).toBeVisible();
});

test("without a run of their own, the reader is told to take it first", async ({ page }) => {
  await take(page, "attachment");
  await page.goto(path("/en/sharing/"));
  await page.getByRole("button", { name: "Add a public one" }).click();
  const card = page.locator("[data-profile]").first();
  const link = await card.locator("[data-link]").inputValue();

  // A fresh browser context: the link, but none of the reader's own data.
  const other = await page.context().browser()!.newContext();
  const reader = await other.newPage();
  await reader.goto(link);
  const block = reader.locator('[data-compare="attachment"]');
  await expect(block).toBeVisible();
  await expect(block.getByRole("heading", { name: "Take it first" })).toBeVisible();
  await expect(block.getByRole("link", { name: /Take/ })).toBeVisible();
  await other.close();
});
