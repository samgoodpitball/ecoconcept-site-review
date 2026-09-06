import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryView from "@/components/catalog/CategoryView";
import {
  CATEGORY_INTRO,
  categories,
  categoryTitle,
  pageCount,
  pageHref,
  type CatalogCategory,
} from "@/lib/catalog-view";

/**
 * Вторая и следующие страницы раздела: /catalog/inverters/page/2.
 * Первая живёт по адресу раздела без номера.
 */

function isCategory(value: string): value is CatalogCategory {
  return categories.some((c) => c.id === value);
}

export function generateStaticParams() {
  return categories.flatMap((c) =>
    Array.from({ length: pageCount(c.id) - 1 }, (_, i) => ({
      category: c.id,
      num: String(i + 2),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; num: string }>;
}): Promise<Metadata> {
  const { category, num } = await params;
  if (!isCategory(category)) return {};
  return {
    title: `${categoryTitle(category)}, страница ${num} | EcoConcept`,
    description: CATEGORY_INTRO[category],
    alternates: { canonical: pageHref(category, Number(num)) },
  };
}

export default async function CategoryPageNumber({
  params,
}: {
  params: Promise<{ category: string; num: string }>;
}) {
  const { category, num } = await params;
  const page = Number(num);
  // первая страница живёт по адресу без номера, чтобы не было двух адресов у одного списка
  if (!isCategory(category) || !Number.isInteger(page) || page < 2 || page > pageCount(category)) {
    notFound();
  }
  return <CategoryView category={category} page={page} />;
}
