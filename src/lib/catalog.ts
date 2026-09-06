import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Category, Product } from "@/payload-types";

/**
 * Доступ к каталогу. Все запросы обёрнуты в try/catch: если база недоступна,
 * страницы собираются с пустым каталогом, а не падают.
 *
 * Закупочная цена (priceInternal) закрыта на уровне поля в Payload и наружу
 * не отдаётся — здесь дополнительно ничего не выбираем.
 */

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "categories",
      limit: 200,
      depth: 1,
      pagination: false,
      sort: "order",
    });
    return res.docs;
  } catch {
    return [];
  }
});

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "products",
      limit: 500,
      depth: 1,
      pagination: false,
      sort: "order",
    });
    return res.docs;
  } catch {
    return [];
  }
});

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

/** id категории у товара (depth:1 отдаёт объект, но подстрахуемся). */
export function categoryIdOf(product: Product): string | number | null {
  const c = product.category as Category | string | number | null | undefined;
  if (c == null) return null;
  return typeof c === "object" ? c.id : c;
}

export function categoryOf(product: Product): Category | null {
  const c = product.category as Category | string | number | null | undefined;
  return c && typeof c === "object" ? c : null;
}

/**
 * Товары, привязанные напрямую к этой категории (без подкатегорий).
 * Если у категории есть подкатегории, их товары показываются на их
 * собственных страницах — иначе список на родительской странице дублирует
 * карточки подкатегорий и выглядит как один длинный хаотичный список.
 */
export async function getProductsInCategory(category: Category): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => categoryIdOf(p) === category.id);
}

export const availabilityLabels: Record<string, string> = {
  in_stock_bishkek: "В наличии в Бишкеке",
  on_order: "Под заказ",
};

export const brandLabels = ["PHNIX", "Hisense", "Trina Solar"] as const;

/**
 * Статические фото категорий для витрины каталога — пока в CMS не загружены
 * свои (поле image у категории имеет приоритет).
 */
export const categoryImageFallback: Record<string, string> = {
  "heat-pumps": "/images/hitherma-monoblock.png",
  "heat-pumps-phnix": "/images/phnix-g20.png",
  "heat-pumps-hisense": "/images/hitherma-outdoor.png",
  "dhw-tanks": "/images/hitherma-tank.png",
  solar: "/images/solar-trina.png",
  "solar-panels": "/images/solar-trina.png",
  inverters: "/photo/SOL-03.webp",
  batteries: "/photo/SOL-06.webp",
  climate: "/images/himulti-outdoor.png",
  multisplit: "/images/himulti-cassette.png",
  accessories: "/images/integra-tower.png",
};
