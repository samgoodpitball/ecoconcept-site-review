"use client";

import { useState } from "react";
import Image from "next/image";
import ProductImage from "./ProductImage";
import { formatTemp, type CatalogItem } from "@/lib/catalog-view";

/**
 * Фотографии модели: крупный снимок и миниатюры под ним.
 *
 * Миниатюры показываются, только когда снимков больше одного — у комплекта
 * Integra это наружный блок и внутренний с баком. Клик по миниатюре
 * подставляет её в крупное поле.
 */
export default function ProductGallery({ item }: { item: CatalogItem }) {
  const photos = [item.image, item.image2].filter(Boolean) as string[];
  const [active, setActive] = useState(0);
  const current = photos[active];

  return (
    <div>
      <div className="relative flex h-[320px] items-center justify-center rounded-[12px] border border-line bg-white p-8 md:h-[400px]">
        <span className="absolute right-5 top-4 font-head text-[18px] font-extrabold tracking-wide text-muted">
          {item.brand}
        </span>
        {item.minTemp && (
          <span className="absolute left-5 top-4 rounded-full bg-tint px-3 py-1.5 font-head text-[12px] font-bold text-eco-dark">
            до {formatTemp(item.minTemp)}
          </span>
        )}

        {current ? (
          <Image
            src={current}
            alt={`${item.brand} ${item.model}`}
            width={520}
            height={520}
            priority
            className="h-full w-full object-contain"
          />
        ) : (
          <ProductImage item={item} size={520} priority />
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex gap-3">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Фотография ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`flex h-[92px] w-[92px] items-center justify-center rounded-[12px] bg-white p-2 transition-colors ${
                i === active ? "border-2 border-eco" : "border border-line hover:border-eco"
              }`}
            >
              <Image
                src={src}
                alt=""
                width={92}
                height={92}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
