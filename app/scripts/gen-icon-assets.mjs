import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "assets");
mkdirSync(assetsDir, { recursive: true });

// Brand accent (index.css --accent, oklch(0.76 0.15 72)) ≈ amber/orange
const ORANGE = { r: 236, g: 159, b: 44, alpha: 1 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const DARK = { r: 11, g: 11, b: 15, alpha: 1 };

// lucide ScanLine, stroke recolored + scalable
const scanSvg = (px, stroke) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"
     fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
  <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
  <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
  <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
  <path d="M7 12h10"/>
</svg>`;

const scanAt = async (size, stroke) =>
  sharp(Buffer.from(scanSvg(size, stroke)), { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

const composite = async (size, bg, iconSize, stroke, out) => {
  const icon = await scanAt(iconSize, stroke);
  const off = Math.round((size - iconSize) / 2);
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: icon, top: off, left: off }])
    .png()
    .toFile(path.join(assetsDir, out));
  console.log("wrote", out);
};

// Adaptive foreground: white scan icon on transparent (inner safe zone ~52%)
await composite(1024, { r: 0, g: 0, b: 0, alpha: 0 }, 540, "#ffffff", "icon-foreground.png");
// Adaptive background: solid orange
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: ORANGE } })
  .png()
  .toFile(path.join(assetsDir, "icon-background.png"));
console.log("wrote icon-background.png");
// Legacy icon: orange bg + white scan icon
await composite(1024, ORANGE, 620, "#ffffff", "icon-only.png");
// Splashes: orange scan mark centered
await composite(2732, WHITE, 560, "#ec9f2c", "splash.png");
await composite(2732, DARK, 560, "#ec9f2c", "splash-dark.png");
