import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "assets");
const publicDir = path.join(root, "public");
const srcAssetsDir = path.join(root, "src", "assets");
const sourcePath = path.join(assetsDir, "logo-source.png");

mkdirSync(assetsDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });
mkdirSync(srcAssetsDir, { recursive: true });

const ORANGE = { r: 236, g: 159, b: 44, alpha: 1 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const DARK = { r: 11, g: 11, b: 15, alpha: 1 };

const logo = sharp(sourcePath);

const writeLogo = async (size, outPath, background = null) => {
    let pipeline = logo.clone().resize(size, size, {
        fit: "contain",
        ...(background ? { background } : {}),
    });

    if (!background) {
        pipeline = pipeline.png();
    } else {
        pipeline = pipeline.flatten({ background }).png();
    }

    await pipeline.toFile(outPath);
    console.log("wrote", path.relative(root, outPath));
};

const writeSplash = async (size, bg, outName) => {
    const markSize = Math.round(size * 0.22);
    const mark = await logo
        .clone()
        .resize(markSize, markSize, { fit: "contain", background: bg })
        .png()
        .toBuffer();
    const offset = Math.round((size - markSize) / 2);

    await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
        .composite([{ input: mark, top: offset, left: offset }])
        .png()
        .toFile(path.join(assetsDir, outName));

    console.log("wrote", outName);
};

await writeLogo(1024, path.join(assetsDir, "icon-only.png"));
await writeLogo(1024, path.join(assetsDir, "icon-foreground.png"));
await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: ORANGE },
})
    .png()
    .toFile(path.join(assetsDir, "icon-background.png"));
console.log("wrote assets/icon-background.png");

await writeSplash(2732, WHITE, "splash.png");
await writeSplash(2732, DARK, "splash-dark.png");

await writeLogo(128, path.join(srcAssetsDir, "logo.png"));
await writeLogo(192, path.join(publicDir, "apple-touch-icon.png"));
await writeLogo(192, path.join(publicDir, "favicon-192.png"));
await writeLogo(512, path.join(publicDir, "pwa-512.png"));
await writeLogo(32, path.join(publicDir, "favicon-32.png"));
await writeLogo(32, path.join(publicDir, "favicon.png"));
