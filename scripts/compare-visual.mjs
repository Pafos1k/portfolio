import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { mkdir, writeFile } from "node:fs/promises";

// Run the original main export on BASELINE_URL and the built migration on SITE_URL.
// Rotation is normalized only inside the test browser; production motion is untouched.
const baseline = process.env.BASELINE_URL || "http://127.0.0.1:8001";
const site = process.env.SITE_URL || "http://127.0.0.1:4173";
await mkdir("test-results/visual", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const width of [1524, 810, 390]) {
    const captures = [];
    for (const [name, url] of [
      ["baseline", baseline],
      ["migration", site],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height: 960 },
        reducedMotion: "reduce",
      });
      await page.goto(url);
      await page.waitForTimeout(4500);
      await page.evaluate(() => {
        window.requestAnimationFrame = () => 0;
      });
      await page.waitForTimeout(100);
      await page.evaluate(() => {
        const image = [...document.images].find((image) =>
          image.src.includes("a56e1bff76f3b6e73fbd"),
        );
        const ring = image.parentElement.parentElement;
        const scale = Math.min(
          (ring.parentElement.clientHeight - 40) / 580,
          (ring.parentElement.clientWidth - 40) / 640,
          1,
        );
        ring.style.transform = `translateZ(-470px) rotateY(90deg) scale(${scale})`;
        [...ring.children].forEach((card, index) => {
          card.style.transform = `translate(-50%, -50%) rotateY(${(360 / 14) * index}deg) translateZ(${-645 / (2 * Math.sin(Math.PI / 14))}px)`;
        });
      });
      captures.push(
        PNG.sync.read(
          await page.screenshot({
            path: `test-results/visual/${name}-${width}.png`,
          }),
        ),
      );
      await page.close();
    }
    const diff = new PNG({ width, height: 960 });
    const pixels = pixelmatch(
      captures[0].data,
      captures[1].data,
      diff.data,
      width,
      960,
      { threshold: 0.1 },
    );
    await writeFile(
      `test-results/visual/diff-${width}.png`,
      PNG.sync.write(diff),
    );
    console.log(
      `${width}px: ${pixels} changed pixels after normalizing gallery phase`,
    );
    if (pixels > width * 960 * 0.001) process.exitCode = 1;
  }
} finally {
  await browser.close();
}
