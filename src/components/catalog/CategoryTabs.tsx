import Link from "next/link";
import { categories, categoryHref, itemsOf, type CatalogCategory } from "@/lib/catalog-view";

/** Разделы полосой — замена левой колонке на узком экране. */
export default function CategoryTabs({ active }: { active: CatalogCategory }) {
  return (
    <nav aria-label="Разделы каталога" className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const current = c.id === active;
        return (
          <Link
            key={c.id}
            href={categoryHref(c.id)}
            aria-current={current ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-[14px] transition-colors ${
              current
                ? "bg-graphite font-medium text-white"
                : "border border-line text-ink hover:border-eco hover:text-eco-dark"
            }`}
          >
            {c.title} · {itemsOf(c.id).length}
          </Link>
        );
      })}
    </nav>
  );
}
