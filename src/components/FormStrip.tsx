import LeadButton from "./LeadButton";
import { ru, contacts } from "@/content/site";

/**
 * Компактный финал страницы: одна хвойная полоса вместо полноэкранной формы.
 *
 * Находка №8 брифа — «одинаковые концовки»: каждая страница заканчивалась
 * витриной, зелёной формой и футером, три тяжёлых блока подряд. Полная форма
 * осталась только на главной; внутренние страницы завершает эта полоса —
 * заголовок, кнопка модалки заявки, WhatsApp и телефон. Аудитория чаще
 * уходит в мессенджер и звонит, чем заполняет поля, — полоса отдаёт оба
 * канала без прокрутки формы.
 *
 * Тексты — те же строки src/content/site.ts, что использует полная форма.
 */
export default function FormStrip({
  source,
  interest,
}: {
  source: string;
  interest?: string;
}) {
  return (
    <section className="bg-graphite">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6 md:py-14">
        <div>
          <span className="mono-label !text-white/60">{ru.lead.kicker}</span>
          <p className="mt-2.5 max-w-[22em] font-head text-[22px] font-bold leading-[1.2] text-white md:text-[26px]">
            {ru.lead.title}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <LeadButton interest={interest} source={source}>
            {ru.lead.submit}
          </LeadButton>
          <a
            href={contacts.whatsapp(source)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-light"
          >
            {ru.lead.whatsappCta}
          </a>
          <a
            href={contacts.phoneHref}
            className="num px-1 text-[16px] font-semibold text-white underline-offset-4 hover:underline"
          >
            {contacts.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
