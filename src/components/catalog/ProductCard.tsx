import Link from "next/link";
import LeadButton from "@/components/LeadButton";
import ProductImage from "./ProductImage";
import { facts, productHref, productTitle, shortTitle, type CatalogItem } from "@/lib/catalog-view";

/**
 * Карточка каталога: фото на белом, длинное техническое название с мощностью и
 * артикулом, наличие, действие.
 *
 * Цены нет намеренно — розничного прайса пока не существует, а закупочные цены
 * клиенту не показываются (решение 29.08.2026). Вместо цифры — запрос цены.
 */
export default function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <article className="card card-hover flex flex-col overflow-hidden bg-white">
      <Link
        href={productHref(item)}
        className="relative flex h-[230px] items-center justify-center bg-white p-5"
      >
        {item.refrigerant && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-tint px-2.5 py-1 font-head text-[11px] font-bold tracking-wide text-eco-dark">
            {item.refrigerant}
          </span>
        )}
        <span className="absolute right-3.5 top-3.5 font-head text-[13px] font-bold text-muted">{item.brand}</span>
        <ProductImage item={item} size={300} />
      </Link>

      <div className="flex flex-1 flex-col gap-3 border-t border-line p-5">
        <h3 className="text-[15.5px] font-bold leading-snug">
          <Link href={productHref(item)} className="text-graphite transition-colors hover:text-eco-dark">
            {productTitle(item)}
          </Link>
        </h3>

        {facts(item).length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {facts(item).map((f) => (
              <li key={f} className="rounded-md bg-off px-2 py-1 text-[12.5px] text-ink">
                {f}
              </li>
            ))}
          </ul>
        )}

        <p className="flex items-center gap-1.5 text-[13px] font-medium text-eco-dark">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-eco" />
          В наличии
        </p>

        <div className="mt-auto pt-1">
          <LeadButton
            product={shortTitle(item)}
            source={`catalog-card-${item.slug}`}
            className="btn-primary w-full !py-3 text-[14.5px]"
          >
            Узнать цену
          </LeadButton>
        </div>
      </div>
    </article>
  );
}
