import Link from "next/link";
import type { CatalogCategory } from "@/lib/catalog-view";
import { pageHref } from "@/lib/catalog-view";

/** Номера страниц раздела. Показывается, только когда страниц больше одной. */
export default function Pagination({
  category,
  current,
  total,
}: {
  category: CatalogCategory;
  current: number;
  total: number;
}) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Страницы раздела" className="mt-10 flex items-center justify-center gap-2">
      <Arrow category={category} to={current - 1} disabled={current === 1} direction="prev" />

      <ul className="flex items-center gap-1.5">
        {pages.map((n) => {
          const active = n === current;
          return (
            <li key={n}>
              <Link
                href={pageHref(category, n)}
                aria-current={active ? "page" : undefined}
                aria-label={`Страница ${n}`}
                className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-head text-[15px] transition-colors ${
                  active
                    ? "bg-graphite font-bold text-white"
                    : "border border-line text-ink hover:border-eco hover:text-eco-dark"
                }`}
              >
                {n}
              </Link>
            </li>
          );
        })}
      </ul>

      <Arrow category={category} to={current + 1} disabled={current === total} direction="next" />
    </nav>
  );
}

function Arrow({
  category,
  to,
  disabled,
  direction,
}: {
  category: CatalogCategory;
  to: number;
  disabled: boolean;
  direction: "prev" | "next";
}) {
  const label = direction === "prev" ? "Предыдущая страница" : "Следующая страница";
  const icon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={direction === "prev" ? "rotate-180" : ""}
    >
      <path d="M4 8h8M8.5 4.5L12 8l-3.5 3.5" />
    </svg>
  );

  if (disabled) {
    return (
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-line"
      >
        {icon}
      </span>
    );
  }

  return (
    <Link
      href={pageHref(category, to)}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-eco hover:text-eco-dark"
    >
      {icon}
    </Link>
  );
}
