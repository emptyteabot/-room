import { chromium } from "playwright";
import { mkdirSync, existsSync, readdirSync, copyFileSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const siteUrl = process.env.PROMO_SITE_URL ?? "http://127.0.0.1:3000/focus-room";
const outputDir = path.resolve(process.cwd(), process.env.PROMO_OUTPUT_DIR ?? "marketing/promo-video");
const publicDir = path.resolve(process.cwd(), "public/promo");
const publicMp4 = path.join(publicDir, "innook-product-demo-vertical.mp4");
const marketingMp4 = path.resolve(process.cwd(), "marketing/innook-product-demo-vertical.mp4");
const screenshotsDir = path.resolve(process.cwd(), "marketing/promo-frames");
const chromePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });
mkdirSync(screenshotsDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath && existsSync(chromePath) ? chromePath : undefined,
  headless: true,
  args: [
    "--autoplay-policy=no-user-gesture-required",
    "--disable-web-security",
    "--disable-features=IsolateOrigins,site-per-process",
  ],
});

const context = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  locale: "zh-CN",
  colorScheme: "dark",
  recordVideo: {
    dir: outputDir,
    size: { width: 1080, height: 1920 },
  },
});

const page = await context.newPage();
await page.goto(siteUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2400);
await page.screenshot({ path: path.join(screenshotsDir, "01-snow-home.jpg"), type: "jpeg", quality: 92, fullPage: false });

await page.getByRole("button", { name: "调整场景" }).click({ force: true });
await page.getByText("沉浸设置").waitFor({ timeout: 10000 });
await page.waitForTimeout(1700);
await page.screenshot({ path: path.join(screenshotsDir, "02-control-drawer.jpg"), type: "jpeg", quality: 92, fullPage: false });

const snowScene = page.getByRole("button", { name: /雪山书房/ }).first();
await snowScene.scrollIntoViewIfNeeded();
await snowScene.click({ force: true });
await page.waitForTimeout(1000);

await page.getByRole("button", { name: "关闭设置", exact: true }).click({ force: true });
await page.waitForTimeout(900);
await page.getByRole("button", { name: "开始学习" }).click({ force: true });
await page.waitForTimeout(7000);
await page.screenshot({ path: path.join(screenshotsDir, "03-immersive-timer.jpg"), type: "jpeg", quality: 92, fullPage: false });

await page.getByRole("button", { name: "显示面板" }).click({ force: true });
await page.getByText("沉浸设置").waitFor({ timeout: 10000 });
await page.waitForTimeout(3800);
await page.getByRole("button", { name: "关闭设置", exact: true }).click({ force: true });
await page.waitForTimeout(4500);

await context.close();
await browser.close();

const webmFile = readdirSync(outputDir).find((file) => file.endsWith(".webm"));

if (!webmFile) {
  throw new Error("Promo recording webm not found");
}

const webmPath = path.join(outputDir, webmFile);
const ffmpeg = spawnSync(ffmpegPath, [
  "-y",
  "-i",
  webmPath,
  "-an",
  "-vf",
  "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1",
  "-r",
  "30",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-preset",
  "medium",
  "-crf",
  "21",
  "-movflags",
  "+faststart",
  publicMp4,
], { stdio: "inherit" });

if (ffmpeg.status !== 0) {
  throw new Error(`ffmpeg failed with status ${ffmpeg.status}`);
}

copyFileSync(publicMp4, marketingMp4);
console.log(publicMp4);
