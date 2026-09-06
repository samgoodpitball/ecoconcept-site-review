import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryView from "@/components/catalog/CategoryView";
import { CATEGORY_INTRO, categories, categoryTitle, type CatalogCategory } from "@/lib/catalog-view";

function isCategory(value: string): value is CatalogCategory {
  return categories.some((c) => c.id === value);
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  return {
    title: `${categoryTitle(category)} — купить в Бишкеке | EcoConcept`,
    description: CATEGORY_INTRO[category],
    alternates: { canonical: `/catalog/${category}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  return <CategoryView category={category} page={1} />;
}
