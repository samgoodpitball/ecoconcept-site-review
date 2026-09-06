// Конвертация перекрашенных (зелёных) промо-картинок PHNIX в webp
import sharp from "sharp";

const src = "../phnix-green";
const files = ["phnix-install-methods", "phnix-hot-water", "phnix-smart-control", "phnix-cooling"];

for (const f of files) {
  await sharp(`${src}/${f}.png`)
    .resize({ width: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/phnix/${f}.webp`);
  console.log("ok:", f);
}
