import Image from "next/image";

/**
 * Схема-иллюстрация с подписью.
 *
 * Схемы у нас растровые и подписаны внутри картинки мелким шрифтом. На телефоне
 * такая схема, вписанная по ширине экрана, превращается в кашу, поэтому она не
 * сжимается, а прокручивается вбок: минимальная ширина держит подписи
 * читаемыми, а лишний воздух по краям съедает отрицательный отступ, чтобы
 * прокручиваемая область начиналась от края экрана.
 *
 * Подпись обязательна и живёт в коде, а не внутри картинки: это текст, который
 * читает поиск и озвучивает скринридер, и его можно поправить, не перерисовывая
 * схему. Номер рисунка — часть языка «инженерного журнала»: страница читается
 * как документ, где на рисунок можно сослаться.
 */
export default function SchemeFigure({
  src,
  alt,
  caption,
  figure,
  width,
  height,
  minWidth = 820,
  priority = false,
}: {
  src: string;
  /** Что изображено — для поиска и скринридера, а не повтор подписи. */
  alt: string;
  /** Подпись под схемой: что она говорит. */
  caption: string;
  /** Номер рисунка, например «01». */
  figure?: string;
  width: number;
  height: number;
  /** Ниже какой ширины схему нельзя сжимать — она уходит в прокрутку. */
  minWidth?: number;
  priority?: boolean;
}) {
  return (
    <figure className="m-0">
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
        <div style={{ minWidth }} className="md:!min-w-0">
          <div className="overflow-hidden rounded-[10px] border border-line bg-white">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 768px) 820px, (max-width: 1200px) 100vw, 1152px"
              priority={priority}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        {figure && <span className="mono-label text-eco-dark">Рис. {figure}</span>}
        <span className="max-w-[46em] text-[14.5px] leading-[1.6] text-muted md:text-[15px]">{caption}</span>
        <span className="mono-label !text-[10px] md:hidden">схема прокручивается вбок</span>
      </figcaption>
    </figure>
  );
}
