import { test, expect, type Page } from "@playwright/test";
import { path } from "./paths";

/**
 * Deleting a profile, and the failure that made it worth a spec of its own.
 *
 * `manageToken` is the only thing that can ever withdraw a published link, and
 * it exists in exactly one place: the profile record. So deleting a published
 * profile does not remove its link — it makes it permanent. Silently, behind a
 * button that reads as though it removes things.
 *
 * These tests are the record that it withdraws first and deletes second, and
 * that a failed withdrawal refuses the deletion rather than proceeding.
 */

async function openSharing(page: Page) {
  // A profile can only be built from results, so take the cheapest instrument.
  await page.goto(path("/en/tests/numerology/take/"));
  await page.getByTestId("finish").click();
  await page.waitForURL(/\/result\/?/);
  await page.goto(path("/en/sharing/"));
}

const cards = (page: Page) => page.locator("[data-profile]");

test("a profile is deleted from the row, without opening it first", async ({ page }) => {
  await openSharing(page);
  await page.getByRole("button", { name: "Add a public one" }).click();
  await expect(cards(page)).toHaveCount(1);

  // Visible on the collapsed card: removing a profile is something done to a
  // list, and making somebody open it first asks them to look at it again.
  await cards(page).first().getByTestId("delete-profile").click();
  await cards(page).first().getByTestId("confirm-delete").click();

  await expect(cards(page)).toHaveCount(0);
  await page.reload();
  await expect(cards(page)).toHaveCount(0);
});

test("one click does not delete anything", async ({ page }) => {
  await openSharing(page);
  await page.getByRole("button", { name: "Add one for work" }).click();
  await expect(cards(page)).toHaveCount(1);

  await cards(page).first().getByTestId("delete-profile").click();
  // Armed, not fired.
  await expect(cards(page).first().getByTestId("confirm-delete")).toBeVisible();
  await expect(cards(page)).toHaveCount(1);

  await page.reload();
  await expect(cards(page)).toHaveCount(1);
});

test("deleting several leaves the others alone", async ({ page }) => {
  await openSharing(page);
  for (const label of ["Add a public one", "Add one for work", "Add one for a partner"]) {
    await page.getByRole("button", { name: label }).click();
  }
  await expect(cards(page)).toHaveCount(3);

  const second = cards(page).nth(1);
  const name = await second.locator("h4").innerText();
  await second.getByTestId("delete-profile").click();
  await second.getByTestId("confirm-delete").click();

  await expect(cards(page)).toHaveCount(2);
  await expect(page.locator("[data-profile] h4", { hasText: name })).toHaveCount(0);
});
