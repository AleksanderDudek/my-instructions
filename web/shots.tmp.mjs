import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://127.0.0.1:3123";
const OUT = process.env.OUT ?? "/tmp/shots";
const ROUTES = [
  ["home", "/en"],
  ["paths", "/en/paths"],
  ["tests", "/en/tests"],
  ["test-detail", "/en/tests/work-shape"],
  ["take", "/en/tests/work-shape/take"],
  ["instructions", "/en/instructions"],
  ["sharing", "/en/sharing"],
  ["panel", "/en/panel"],
];
const SIZES = [["mobile", 390, 844], ["desktop", 1440, 900]];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];
for (const [sizeName, width, height] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const [name, path] of ROUTES) {
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(350);
      // Horizontal overflow is the single most common mobile defect and the
      // one screenshots hide, because the viewport simply crops it.
      const m = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        offenders: [...document.querySelectorAll("*")]
          .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
          .slice(0, 4)
          .map((el) => el.tagName.toLowerCase() + "." + [...el.classList].slice(0, 3).join(".")),
      }));
      const overflow = m.scrollW > m.clientW + 1;
      report.push({ size: sizeName, name, overflow, by: m.scrollW - m.clientW, offenders: m.offenders });
      await page.screenshot({ path: `${OUT}/${sizeName}-${name}.png`, fullPage: true });
    } catch (e) {
      report.push({ size: sizeName, name, error: String(e).split("\n")[0].slice(0, 110) });
    }
  }
  await ctx.close();
}
await browser.close();
for (const r of report) {
  if (r.error) console.log(`✖ ${r.size}/${r.name}: ${r.error}`);
  else if (r.overflow) console.log(`⚠ ${r.size}/${r.name}: overflows by ${r.by}px — ${r.offenders.join(" ")}`);
  else console.log(`· ${r.size}/${r.name}: ok`);
}
