import Image from "next/image";
import type { CatalogItem } from "@/lib/catalog-view";

/**
 * Фотография прибора на белом поле. Фон у всех снимков приведён к белому
 * скриптом scripts/prepare-images.py, поэтому карточки в ряду выглядят одинаково.
 *
 * Там, где фотографии ещё нет (инверторы и батареи Deye, баки YKR, серия PASRW),
 * рисуется контурная заглушка — тоже на белом, чтобы ряд не рассыпался.
 */
export default function ProductImage({
  item,
  size,
  priority = false,
}: {
  item: CatalogItem;
  size: number;
  priority?: boolean;
}) {
  if (item.image) {
    return (
      <Image
        src={item.image}
        alt={`${item.brand} ${item.model}`}
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain"
      />
    );
  }
  return <Placeholder category={item.category} />;
}

function Placeholder({ category }: { category: CatalogItem["category"] }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="opacity-40">
        {category === "batteries" || category === "inverters" ? (
          <>
            <rect x="16" y="10" width="32" height="44" rx="4" />
            <path d="M24 22h16M24 30h16M28 40l8-6-4 10 8-6" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : category === "tanks" ? (
          <>
            <rect x="20" y="8" width="24" height="48" rx="12" />
            <path d="M26 20h12M26 46h12" strokeLinecap="round" />
          </>
        ) : (
          <>
            <rect x="8" y="16" width="48" height="32" rx="4" />
            <circle cx="24" cy="32" r="8" />
            <circle cx="44" cy="32" r="4" />
          </>
        )}
      </svg>
      <span className="px-4 text-center text-[12px] leading-snug">Фотография запрошена<br />у поставщика</span>
    </div>
  );
}
