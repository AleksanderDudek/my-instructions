/**
 * The installed app's icons, rendered from Uriel's medallion.
 *
 * Run by hand when the medallion changes: `node scripts/make-app-icons.mjs`.
 * The PNGs are committed — a home screen, a splash screen and iOS all need
 * raster files, and rendering them at build time would put sharp's native
 * binary on the deploy's critical path for four files that never change.
 *
 *   icon-192 / icon-512      "any": the medallion on the night ground, a
 *                            little inset so launchers that round the corners
 *                            do not clip the gold ring.
 *   icon-maskable-512        "maskable": the medallion inside the 80% safe
 *                            zone, so Android's circle, squircle or teardrop
 *                            mask never cuts into it.
 *   apple-icon (180)         iOS fills transparency with black and rounds the
 *                            corners itself; opaque ground, generous inset.
 *   shortcut-*-96            the glass roundels, for the app's shortcut menu.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const GROUND = "#130c0b";
const out = join(root, "public/brand/app");
mkdirSync(out, { recursive: true });

async function medallion(size, inset, file) {
  const inner = Math.round(size * (1 - 2 * inset));
  const art = await sharp(join(root, "public/brand/uriel/uriel-avatar.svg"), { density: 600 })
    .resize(inner, inner)
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: GROUND } })
    .composite([{ input: art, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(file);
}

async function roundel(name, size, file) {
  await sharp(join(root, `public/brand/icons/icon-${name}.svg`), { density: 600 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(file);
}

await medallion(192, 0.06, join(out, "icon-192.png"));
await medallion(512, 0.06, join(out, "icon-512.png"));
await medallion(512, 0.14, join(out, "icon-maskable-512.png"));
await medallion(180, 0.1, join(root, "src/app/apple-icon.png"));
for (const name of ["tests", "sheet", "share"]) await roundel(name, 96, join(out, `shortcut-${name}-96.png`));
console.log("icons written");
