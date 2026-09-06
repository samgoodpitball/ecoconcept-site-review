/**
 * Съёмка кадров анимации схемы.
 *
 * Страница открывается с якорем #t=0 — в этом режиме её собственный цикл не
 * стартует, и каждый кадр рисуется вызовом seek(t). Один браузер на всю съёмку:
 * перезапуск Chrome на кадр превращал бы пять минут в час.
 */
import puppeteer from "puppeteer";
import { writeFile } from "node:fs/promises";

const OUT = process.argv[2];
const DURATION = Number(process.argv[3] ?? 59.8);
const FPS = Number(process.argv[4] ?? 30);
const WIDTH = 1920;
const HEIGHT = 1304;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000/anim/heat-pump.html#t=0", { waitUntil: "networkidle0" });
await page.waitForFunction("typeof window.seek === 'function'");

const total = Math.round(DURATION * FPS);
for (let i = 0; i < total; i++) {
  const t = i / FPS;
  await page.evaluate((time) => window.seek(time), t);
  const buf = await page.screenshot({ type: "png", optimizeForSpeed: true });
  await writeFile(`${OUT}/f${String(i).padStart(5, "0")}.png`, buf);
  if (i % 150 === 0) console.log(`кадр ${i}/${total}`);
}
console.log(`готово: ${total} кадров`);
await browser.close();
