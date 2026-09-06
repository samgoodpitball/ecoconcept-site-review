import Image from "next/image";
import Link from "next/link";
import { productHref, facts, type CatalogItem } from "@/lib/catalog-view";

/**
 * Общие примитивы продуктовых страниц (/heat-pumps, /solar).
 *
 * Визуальный язык один на все продукты — «инженерный документ»: типографика и
 * линии вместо карточек с тенями, один акцентный цвет, число с условием рядом.
 * Здесь лежит то, что иначе пришлось бы копировать между страницами: надзаголовок,
 * раскрывающийся пункт и карточка модели.
 */

/** Надзаголовок секции: короткая линия и капитель. */
export function Eyebrow({
  children,
  light = false,
  centered = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  centered?: boolean;
}) {
  return (
    <span className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
      <span aria-hidden className={`block h-px w-8 ${light ? "bg-white/40" : "bg-eco"}`} />
      <span
        className={`font-head text-[11px] font-bold uppercase tracking-[0.24em] ${
          light ? "text-white/70" : "text-muted"
        }`}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Раскрывающийся пункт. Нативный <details>: работает без JavaScript, читается
 * скринридером и не требует клиентского компонента. Приём взят у 1KOMMA5° —
 * одним инструментом держится вся длина страницы.
 */
export function Disclosure({
  q,
  a,
  open = false,
  large = false,
}: {
  q: string;
  a: string;
  open?: boolean;
  large?: boolean;
}) {
  return (
    <details open={open} className="group border-t border-line last:border-b">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden md:py-7">
        <h3
          className={`font-head font-bold leading-[1.25] text-graphite transition-colors group-hover:text-eco-dark ${
            large ? "text-[19px] md:text-[23px]" : "text-[16.5px] md:text-[18px]"
          }`}
        >
          {q}
        </h3>
        <span
          aria-hidden
          className="relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-eco-dark"
        >
          <span className="absolute h-[1.5px] w-[15px] bg-current" />
          <span className="absolute h-[15px] w-[1.5px] bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
        </span>
      </summary>
      <p className="max-w-[52em] pb-7 pr-10 text-[15.5px] leading-[1.7] text-muted md:text-[16px]">{a}</p>
    </details>
  );
}

/** Отметка списка: квадрат тонкой обводкой и галочка, выходящая за его угол. */
export function CheckMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="mt-px shrink-0">
      <path
        d="M22 12.5V21a1.5 1.5 0 0 1-1.5 1.5h-16A1.5 1.5 0 0 1 3 21V5a1.5 1.5 0 0 1 1.5-1.5H17"
        stroke="#2e6210"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="m8 12 5 5L24 3.5" stroke="#448a16" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Карточка модели в ленте оборудования.
 *
 * Фотографии есть не у всех разделов каталога: у Deye их нет вовсе. Вместо
 * серой заглушки «фото ожидается» в такой карточке можно показать главное
 * число модели — это честнее и читается как строка каталога, а не как поломка.
 */
export function ModelCard({
  item,
  placeholder,
  note,
}: {
  item: CatalogItem;
  /** Чем занять место снимка, если фотографии нет. */
  placeholder?: (item: CatalogItem) => React.ReactNode;
  /** Нижняя строка карточки под тонкой линией. */
  note?: (item: CatalogItem) => string | null;
}) {
  const bottom = note ? note(item) : item.area ? `дом ${item.area} м²${item.phase ? ` · ${item.phase}` : ""}` : null;

  return (
    <Link
      href={productHref(item)}
      className="group flex h-full flex-col border border-line bg-white transition-colors hover:border-eco"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-off">
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.brand} ${item.model}`}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : placeholder ? (
          placeholder(item)
        ) : (
          <span className="flex h-full items-center justify-center font-head text-[12px] uppercase tracking-[0.12em] text-muted">
            фото ожидается
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 border-t border-line p-5">
        <div>
          <p className="font-head text-[12px] font-bold uppercase tracking-[0.14em] text-muted">{item.brand}</p>
          <h4 className="mt-1.5 font-head text-[17px] font-bold leading-tight text-graphite">{item.model}</h4>
        </div>
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
          {facts(item).map((f) => (
            <li key={f} className="font-head text-[12.5px] font-semibold text-eco-dark">
              {f}
            </li>
          ))}
        </ul>
        {bottom && <p className="mt-auto border-t border-line pt-3 text-[13.5px] text-muted">{bottom}</p>}
      </div>
    </Link>
  );
}

/**
 * Плашка происхождения снимка: «Сток · заменить» или «ИИ-генерация».
 *
 * До 06.09.2026 этот span был скопирован в шести компонентах с расходящимися
 * размерами и отступами. Пока своей съёмки нет, плашка стоит на каждом чужом
 * кадре, и выглядеть она должна везде одинаково.
 */
export function PhotoBadge({
  children,
  position = "top-right",
}: {
  children: React.ReactNode;
  position?: "top-right" | "bottom-center" | "bottom-left";
}) {
  const place =
    position === "bottom-center"
      ? "bottom-6 left-1/2 -translate-x-1/2"
      : position === "bottom-left"
        ? "bottom-4 left-4 z-10"
        : "right-3 top-3";
  return (
    <span
      className={`absolute ${place} rounded-[4px] bg-graphite/70 px-2 py-1 font-head text-[9.5px] font-bold uppercase tracking-[0.12em] text-white/90`}
    >
      {children}
    </span>
  );
}
