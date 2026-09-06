/**
 * Наполнение каталога и контента. Скрипт идемпотентный: повторный запуск
 * обновляет существующие записи по слагу, а не плодит дубли.
 *
 * Запуск: DATABASE_URI=... PAYLOAD_SECRET=... npx tsx scripts/seed-catalog.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { seedCategories, seedProducts } from "../src/seed/catalog";
import { seedPosts } from "../src/seed/content";

const payload = await getPayload({ config });

type SeedCollection = "categories" | "products" | "posts" | "projects";

async function findBySlug(collection: SeedCollection, slug: string) {
  const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  return res.docs[0];
}

// Payload типизирует data под каждую коллекцию отдельно; в сид-скрипте мы
// сознательно работаем с общей формой, поэтому здесь одно локальное приведение.
type AnyData = Record<string, unknown>;

async function upsert(collection: SeedCollection, slug: string, data: AnyData) {
  const existing = await findBySlug(collection, slug);
  if (existing) {
    await payload.update({ collection, id: existing.id, data } as never);
    return { id: existing.id as number, created: false };
  }
  const doc = await payload.create({ collection, data: { ...data, slug } } as never);
  return { id: (doc as { id: number }).id, created: true };
}

/* --------------------------------- Категории --------------------------------- */

const categoryIds = new Map<string, number>();

// Сначала родительские, затем дочерние — чтобы связь parent разрешалась
for (const cat of [...seedCategories].sort((a, b) => (a.parent ? 1 : 0) - (b.parent ? 1 : 0))) {
  const { id, created } = await upsert("categories", cat.slug, {
    title: cat.title,
    order: cat.order,
    ...(cat.description ? { description: cat.description } : {}),
    ...(cat.parent ? { parent: categoryIds.get(cat.parent) } : {}),
  });
  categoryIds.set(cat.slug, id);
  console.log(`${created ? "создана" : "обновлена"} категория: ${cat.title}`);
}

/* ---------------------------------- Товары ----------------------------------- */

const productIds = new Map<string, number>();

// Первый проход — без связей usedWith (их id ещё не все известны)
for (const p of seedProducts) {
  const categoryId = categoryIds.get(p.category);
  if (!categoryId) {
    console.warn(`пропущен ${p.slug}: неизвестная категория ${p.category}`);
    continue;
  }
  const { id, created } = await upsert("products", p.slug, {
    title: p.title,
    brand: p.brand,
    category: categoryId,
    short: p.short,
    imageSlot: `product-${p.slug}`,
    badges: p.badges.map((value) => ({ value })),
    specs: p.specs.map(([label, value]) => ({ label, value })),
    ...(p.benefits ? { benefits: p.benefits.map((value) => ({ value })) } : {}),
    ...(p.power != null ? { power: p.power } : {}),
    ...(p.minTemp != null ? { minTemp: p.minTemp } : {}),
    ...(p.refrigerant ? { refrigerant: p.refrigerant } : {}),
    // Наличие по позициям заказчик уточнит на складе — по умолчанию «под заказ»
    availability: "on_order",
    order: p.order,
  });
  productIds.set(p.slug, id);
  console.log(`${created ? "создан" : "обновлён"} товар: ${p.title}`);
}

// Второй проход — связи между товарами
for (const p of seedProducts) {
  if (!p.usedWith?.length) continue;
  const id = productIds.get(p.slug);
  if (!id) continue;
  const related = p.usedWith.map((s) => productIds.get(s)).filter(Boolean);
  if (related.length) {
    await payload.update({ collection: "products", id, data: { usedWith: related } } as never);
    console.log(`связи для ${p.title}: ${related.length}`);
  }
}

/* ---------------------------------- Статьи ----------------------------------- */

for (const post of seedPosts) {
  const existing = await findBySlug("posts", post.slug);
  // Не перетираем тело статьи, если её уже начали писать в админке
  const data: Record<string, unknown> = {
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    outline: post.outline.map((heading) => ({ heading })),
    seo: { title: post.seoTitle, description: post.seoDescription },
  };
  if (!existing) {
    data.published = true;
    data.publishedAt = new Date().toISOString();
  }
  const { created } = await upsert("posts", post.slug, data);
  console.log(`${created ? "создана" : "обновлена"} статья: ${post.title}`);
}

console.log("\nсид завершён");
process.exit(0);
