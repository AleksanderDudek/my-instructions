import { test, expect } from "@playwright/test";
import { path } from "./paths";
import { LOCALES } from "./instruments";

/**
 * The routes page, and the two things about it that can only be checked here.
 *
 * That it is real HTML rather than a spinner — the whole reason it exists is to
 * be the page somebody lands on, so a crawler and a reader with JavaScript off
 * must both get the five routes and every link. And that the marks appear after
 * the store has been read, without the rows moving.
 */

for (const locale of LOCALES) {
  test(`renders five routes with their links in ${locale}`, async ({ page }) => {
    await page.goto(path(`/${locale}/paths/`));

    await expect(page.locator("[data-track]")).toHaveCount(5);

    // Every step is a link to an instrument page, not a dead row.
    const steps = page.locator("[data-step]");
    await expect(steps).not.toHaveCount(0);
    for (const row of await steps.all()) {
      await expect(row.getByRole("link")).toHaveCount(1);
    }
  });
}

test("the routes are in the served markup, not drawn by script", async ({ request }) => {
  // Fetched rather than rendered: this is what a crawler sees.
  const response = await request.get(path("/en/paths/"));
  expect(response.status()).toBe(200);
  const html = await response.text();
  for (const id of ["self", "dating", "couple", "work", "statement"]) {
    expect(html, `no ${id} route in the served HTML`).toContain(`data-track="${id}"`);
  }
  expect(html).toContain("Where to start");
});

test("an instrument already taken is marked, and the next one is pointed at", async ({ page }) => {
  // Take the first step of the work route.
  await page.goto(path("/en/tests/communication-style/take/"));
  const finish = page.getByTestId("finish");
  for (let guard = 0; guard < 20; guard++) {
    const next = page.getByTestId("next");
    if (await next.isVisible().catch(() => false)) {
      await next.click();
      continue;
    }
    break;
  }
  await finish.click();
  await page.waitForURL(/\/result\/?/);

  await page.goto(path("/en/paths/"));
  const work = page.locator('[data-track="work"]');
  await expect(work.locator('[data-step="communication-style"]')).toContainText("taken");
  // The first untaken one in the route's own order.
  await expect(work.locator('[data-step="working-style"]')).toContainText("start here");
  await expect(work).toContainText("1 of 5");
});

test("the three routes that hand something over say where they land", async ({ page }) => {
  await page.goto(path("/en/paths/"));
  for (const id of ["dating", "work", "statement"]) {
    await expect(page.locator(`[data-track="${id}"]`), id).toContainText("profile");
  }
  // And the two that do not, do not offer a link at the end.
  for (const id of ["self", "couple"]) {
    await expect(page.locator(`[data-track="${id}"]`).getByRole("link", { name: "Build it" })).toHaveCount(0);
  }
});
