// Одноразовое сжатие промо-картинок PHNIX: png 4-6MB → webp ~1600px
import sharp from "sharp";

const files = [
  "phnix-install-methods",
  "phnix-hot-water",
  "phnix-smart-control",
  "phnix-cooling",
];

for (const f of files) {
  await sharp(`public/phnix/${f}.png`)
    .resize({ width: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/phnix/${f}.webp`);
  console.log("ok:", f);
}
