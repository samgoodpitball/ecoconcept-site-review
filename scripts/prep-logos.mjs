// Одноразовая подготовка логотипов брендов: обрезка полей, ресайз, webp/png
import sharp from "sharp";

const jobs = [
  // jpg с белым фоном → trim + png с прозрачностью не выйдет из jpg, оставляем белый фон
  { in: "public/brand/logos/hisense.jpg", out: "public/brand/logos/hisense.png", trim: true },
  { in: "public/brand/logos/phnix.jpg", out: "public/brand/logos/phnix.png", trim: true },
  { in: "public/brand/logos/trina-solar.png", out: "public/brand/logos/trina-solar-web.png", trim: false },
];

for (const j of jobs) {
  let img = sharp(j.in);
  if (j.trim) img = img.trim({ threshold: 10 });
  const meta = await img.toBuffer();
  await sharp(meta).resize({ height: 120, fit: "inside" }).png().toFile(j.out);
  console.log("ok:", j.out);
}
