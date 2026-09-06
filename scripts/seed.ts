import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });

const users = await payload.find({ collection: "users", limit: 1 });
if (users.totalDocs === 0) {
  await payload.create({
    collection: "users",
    data: { email: "samakirov@gmail.com", password: "EcoAdmin-2026", name: "Самат" },
  });
  console.log("admin user created: samakirov@gmail.com");
} else {
  console.log("admin user already exists");
}

const brands: [string, string][] = [
  ["Trina Solar", "солнечные модули · топ-производитель"],
  ["PHNIX", "тепловые насосы · R290"],
  ["Hisense", "Hi-Therma · Hi-Multi"],
];
for (const [name, note] of brands) {
  const found = await payload.find({ collection: "brands", where: { name: { equals: name } } });
  if (found.totalDocs === 0) {
    await payload.create({ collection: "brands", data: { name, note } });
    console.log("brand created:", name);
  }
}

console.log("seed done");
process.exit(0);
