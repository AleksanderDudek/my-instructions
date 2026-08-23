import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end, against a real production build.
 *
 * `next dev` is not what anybody uses, and the class of bug these tests exist
 * to catch — a control that stops working when the tree around it re-renders —
 * behaves differently under a dev-mode double render. So the suite builds and
 * serves the real thing.
 */
/**
 * `E2E_BASE_URL` points the suite at an already-running server — used to prove
 * the static export behaves the same as the server build, served from a
 * subpath the way GitHub Pages serves a project page.
 */
const external = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  use: {
    baseURL: external ?? "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: external
    ? undefined
    : {
        command: "npm run build && npx next start -p 3100",
        url: "http://127.0.0.1:3100/en",
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      },
});
