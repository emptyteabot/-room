import { chromium } from "playwright";
import { mkdirSync, existsSync, readdirSync, copyFileSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const format = process.env.PROMO_FORMAT === "landscape" ? "landscape" : "vertical";
const siteUrl = process.env.PROMO_SITE_URL ?? "http://127.0.0.1:3000/focus-room";
const cinematicSceneIds = ["snow-study", "window-reading", "cafe-notes", "library-aisle", "rain-window", "mountain-clouds", "snow-study"];
const profile = format === "landscape"
  ? {
      width: 1920,
      height: 1080,
      outputName: "innook-product-demo-landscape.mp4",
      outputDir: "marketing/promo-video-landscape",
      screenshotsDir: "marketing/promo-frames-landscape",
    }
  : {
      width: 1080,
      height: 1920,
      outputName: "innook-product-demo-vertical.mp4",
      outputDir: "marketing/promo-video",
      screenshotsDir: "marketing/promo-frames",
    };
const outputDir = path.resolve(process.cwd(), process.env.PROMO_OUTPUT_DIR ?? profile.outputDir);
const publicDir = path.resolve(process.cwd(), "public/promo");
const publicMp4 = path.join(publicDir, profile.outputName);
const marketingMp4 = path.resolve(process.cwd(), "marketing", profile.outputName);
const screenshotsDir = path.resolve(process.cwd(), profile.screenshotsDir);
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
  viewport: { width: profile.width, height: profile.height },
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  locale: "zh-CN",
  colorScheme: "dark",
  recordVideo: {
    dir: outputDir,
    size: { width: profile.width, height: profile.height },
  },
});

const page = await context.newPage();

if (format === "landscape") {
  await recordLandscape(page);
} else {
  await page.goto(siteUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  await recordVertical(page);
}

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
  `scale=${profile.width}:${profile.height}:force_original_aspect_ratio=increase,crop=${profile.width}:${profile.height},setsar=1`,
  "-r",
  "30",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-preset",
  "medium",
  "-crf",
  format === "landscape" ? "16" : "21",
  "-movflags",
  "+faststart",
  publicMp4,
], { stdio: "inherit" });

if (ffmpeg.status !== 0) {
  throw new Error(`ffmpeg failed with status ${ffmpeg.status}`);
}

copyFileSync(publicMp4, marketingMp4);
console.log(publicMp4);

async function recordVertical(page) {
  await page.waitForTimeout(2400);
  await screenshot(page, "01-snow-home");
  await openDrawer(page);
  await page.waitForTimeout(1700);
  await screenshot(page, "02-control-drawer");
  await chooseScene(page, "雪山书房");
  await page.waitForTimeout(1000);
  await closeDrawer(page);
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: "开始学习" }).click({ force: true });
  await page.waitForTimeout(7000);
  await screenshot(page, "03-immersive-timer");
  await showPanel(page);
  await page.getByText("沉浸设置").waitFor({ timeout: 10000 });
  await page.waitForTimeout(3800);
  await closeDrawer(page);
  await page.waitForTimeout(4500);
}

async function recordLandscape(page) {
  await recordCinematicScene(page, cinematicSceneIds[0], 20000, "01-snow-main");

  for (let index = 1; index < cinematicSceneIds.length - 1; index += 1) {
    await recordCinematicScene(page, cinematicSceneIds[index], 3000, `scene-${cinematicSceneIds[index]}`);
  }

  await recordCinematicScene(page, cinematicSceneIds.at(-1), 12000, "02-snow-ending");
}

async function recordCinematicScene(page, sceneId, durationMs, frameName) {
  const url = new URL(siteUrl);
  url.searchParams.set("promo", "cinematic");
  url.searchParams.set("scene", sceneId);

  await page.goto(url.toString(), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => {
    const video = document.querySelector("video");
    return video && video.readyState >= 2 && video.videoWidth > 0;
  }, { timeout: 20000 });
  await page.waitForTimeout(600);
  await page.waitForTimeout(durationMs);
  await screenshot(page, frameName);
}

async function openDrawer(page) {
  await page.getByRole("button", { name: "调整场景" }).click({ force: true });
  await page.getByText("沉浸设置").waitFor({ timeout: 10000 });
}

async function showPanel(page) {
  const showPanelButton = page.getByRole("button", { name: "显示面板" });

  if (await showPanelButton.count()) {
    await showPanelButton.first().click({ force: true });
    return;
  }

  const settingsButton = page.getByRole("button", { name: "打开设置" });

  if (await settingsButton.count()) {
    await settingsButton.first().click({ force: true });
    return;
  }

  await page.locator("button[title='显示面板'], button[aria-label='显示面板']").first().click({ force: true });
}

async function closeDrawer(page) {
  await page.getByRole("button", { name: "关闭设置", exact: true }).click({ force: true });
}

async function chooseScene(page, sceneName) {
  const scene = page.getByRole("button", { name: new RegExp(sceneName) }).first();
  await scene.scrollIntoViewIfNeeded();
  await scene.click({ force: true });
}

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(screenshotsDir, `${name}.jpg`),
    type: "jpeg",
    quality: 92,
    fullPage: false,
  });
}
