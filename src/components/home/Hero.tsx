import Image from "next/image";
import { PhotoBadge } from "@/components/product/SectionKit";
import Link from "next/link";
import { home } from "@/content/home";

/**
 * Первый экран главной.
 *
 * Раскладка простая намеренно: снимок оборудования во всю ширину, поверх —
 * заголовок, абзац, две кнопки и три факта с числами. Ничего не двигается и не
 * появляется при прокрутке.
 *
 * ⚠️ Этот файл — не прежний `home/Hero.tsx` того поколения главной, что снесли
 * 03.09; тот лежал рядом и питался от `content/home-v2`.
 */
export default function Hero() {
  const h = home.hero;
  return (
    <section className="relative isolate flex min-h-[560px] items-end overflow-hidden md:min-h-[640px]">
      <Image
        src={h.photo}
        alt={h.alt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Сплошная плашка вместо градиента: белый текст должен читаться на
          светлом складе, а градиенты дизайн-система запрещает. */}
      <span aria-hidden className="absolute inset-0 -z-10 bg-graphite/55" />

      {h.badge ? (
        <PhotoBadge>{h.badge}</PhotoBadge>
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:px-6 md:pb-16 md:pt-32">
        <h1 className="max-w-[14em] text-[34px] font-bold leading-[1.06] tracking-[-0.02em] text-white md:text-[56px]">
          {h.title}
        </h1>
        <p className="mt-5 max-w-[38em] text-[16.5px] leading-[1.55] text-white/85 md:text-[19px]">
          {h.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={h.primary.href} className="btn-primary">
            {h.primary.label}
          </Link>
          <Link href={h.secondary.href} className="btn-outline-light">
            {h.secondary.label}
          </Link>
        </div>

        <ul className="mt-10 flex flex-col gap-3 border-t border-white/20 pt-7 md:flex-row md:gap-10">
          {h.facts.map((fact) => (
            <li key={fact} className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden className="mt-0.5 shrink-0">
                <path d="M3 10.5 8 15.5 17 4.5" stroke="#7CC24B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[14.5px] leading-[1.4] text-white/90 md:text-[15.5px]">{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
