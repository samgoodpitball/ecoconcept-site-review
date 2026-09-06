import Image from "next/image";
import { getSlotSpec } from "@/lib/imageSlots";
import { getSlotMediaMap } from "@/lib/media";

/**
 * Слот изображения: показывает загруженный в CMS файл (по slotId) либо
 * бренд-плейсхолдер точных пропорций. Место резервируется через aspect-ratio,
 * поэтому подстановка реального фото не двигает вёрстку.
 *
 * `src` — запасной путь к файлу в /public: используется, если в CMS слот пуст.
 */
export default async function ImageSlot({
  slotId,
  alt,
  src,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 600px",
  className = "",
  imageClassName = "object-cover",
  fallbackClassName,
  label,
  rounded = "rounded-[12px]",
}: {
  slotId: string;
  alt?: string;
  src?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Как отрисовать реальное фото из CMS (обычно object-cover). */
  imageClassName?: string;
  /** Как отрисовать запасное фото из /public — у товарных рендеров это object-contain. */
  fallbackClassName?: string;
  label?: string;
  rounded?: string;
}) {
  const spec = getSlotSpec(slotId);
  const media = (await getSlotMediaMap()).get(slotId);
  // Приоритет: загруженное в CMS → готовый файл из манифеста → запасной src страницы
  const fromCms = Boolean(media?.url);
  const fromManifest = !fromCms && Boolean(spec.src);
  const resolvedSrc = media?.url ?? spec.src ?? src;
  const resolvedAlt = alt ?? media?.alt ?? spec.alt;
  // Запасное фото товара вписываем (object-contain), реальное фото — заполняет слот
  const fit = fromCms || fromManifest ? imageClassName : (fallbackClassName ?? imageClassName);

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ aspectRatio: `${spec.w} / ${spec.h}` }}
    >
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={resolvedAlt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
          quality={75}
          className={fit}
        />
      ) : (
        <Placeholder label={label ?? resolvedAlt} />
      )}
    </div>
  );
}

/** Бренд-плейсхолдер: Leaf Tint, лист-паттерн, ненавязчивая подпись. */
function Placeholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-line bg-tint px-5 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url(/brand/leaf.png)", backgroundSize: "96px" }}
      />
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true" className="relative text-eco/45">
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <circle cx="8.6" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M4.5 17l4.8-4.4 3.4 3 3-2.4 3.8 3.4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="relative max-w-[24ch] text-[12.5px] font-medium leading-snug text-eco-dark/70">{label}</span>
    </div>
  );
}
