import { test, expect, type Page } from "@playwright/test";

/** Finish a questionnaire by answering every page at the same point. */
async function complete(page: Page, id: string, locale = "en") {
  await page.goto(`/${locale}/tests/${id}/take`);
  await expect(page.getByRole("radiogroup").first()).toBeVisible();

  for (let guard = 0; guard < 40; guard++) {
    for (const group of await page.getByRole("radiogroup").all()) {
      await group.getByRole("radio").nth(3).click();
    }
    const next = page.getByTestId("next");
    if (await next.isVisible()) {
      await next.click();
      continue;
    }
    await page.getByTestId("finish").click();
    return;
  }
  throw new Error("the runner never reached its last page");
}

test("a test can be taken from the catalogue through to a result", async ({ page }) => {
  await page.goto("/en/tests");
  await page.getByRole("link", { name: /love/i }).first().click();

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /take this test/i }).click();

  await expect(page.getByRole("radiogroup").first()).toBeVisible();
  await complete(page, "love-languages");

  await expect(page).toHaveURL(/\/result$/);
  // A result is a reading, not a number: the assertion is that prose arrived.
  await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();
});

test("a result read before the test is taken says so instead of breaking", async ({ page }) => {
  await page.goto("/en/tests/love-languages/result");
  await expect(page.getByRole("link", { name: /take/i })).toBeVisible();
});

test("the language switch keeps you on the same page", async ({ page }) => {
  await page.goto("/en/tests/love-languages");
  await page.getByRole("button", { name: /language/i }).click();
  await page.getByRole("menuitem", { name: "Polski" }).click();
  await expect(page).toHaveURL("/pl/tests/love-languages");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("an unprefixed URL lands on a language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|pl|es|de)$/);
});
