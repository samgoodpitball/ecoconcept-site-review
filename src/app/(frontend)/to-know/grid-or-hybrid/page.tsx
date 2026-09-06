import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormStrip from "@/components/FormStrip";
import {
  ArticleHero,
  Statement,
  Chapter,
  SplitMedia,
  CardsRow,
  NextSteps,
  SourcesNote,
} from "@/components/to-know/ArticleKit";
import SchemeFigure from "@/components/SchemeFigure";
import StationSchemes from "@/components/solar/StationScheme";
import { gridOrHybrid as c } from "@/content/to-know/grid-or-hybrid";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: "/to-know/grid-or-hybrid" },
};

/**
 * «Сетевая или гибридная» — вторая страница раздела объяснений.
 *
 * Построена вокруг выбора схемы, а не оборудования: у клиента здесь вопрос
 * «что будет, когда выключат свет», а не «как устроен инвертор». Главное место
 * — таблица трёх схем и честная строка о том, когда батарея не окупается.
 */
export default function GridOrHybridPage() {
  return (
    <>
      <Header />
      <main>
        <ArticleHero {...c.hero} />
        <Statement>{c.statement}</Statement>

        <Chapter title={c.what.title} paragraphs={c.what.paragraphs}>
          {/* Схема идёт после абзацев, а не вместо них: текст объясняет роль
              инвертора, картинка показывает, куда при этом течёт ток. */}
          <div className="mt-10">
            <SchemeFigure
              src={c.figure.src}
              alt={c.figure.alt}
              caption={c.figure.caption}
              figure="01"
              width={c.figure.width}
              height={c.figure.height}
              minWidth={900}
            />
          </div>
        </Chapter>

        <Chapter title={c.compare.title} tone="off">
          {/* Сравнение — таблица: на телефоне колонки становятся подписанными
              строками, чтобы не уезжать вбок. */}
          <div className="mt-9">
            <div className="hidden grid-cols-[1.1fr_1fr_1fr_1fr] gap-6 border-b border-line pb-2.5 md:grid">
              <span />
              {["Сетевая", "Гибридная", "Автономная"].map((h) => (
                <span key={h} className="font-head text-[11px] font-bold uppercase tracking-[0.16em] text-eco-dark">
                  {h}
                </span>
              ))}
            </div>
            {c.compare.rows.map((row) => (
              <div
                key={row.q}
                className="grid gap-x-6 gap-y-2 border-b border-line py-4 md:grid-cols-[1.1fr_1fr_1fr_1fr]"
              >
                <span className="font-head text-[15px] font-bold text-graphite md:text-[16px]">{row.q}</span>
                {[
                  ["Сетевая", row.grid],
                  ["Гибридная", row.hybrid],
                  ["Автономная", row.off],
                ].map(([label, value]) => (
                  <span key={label} className="text-[14.5px] leading-[1.5] text-muted md:text-[15px]">
                    <span className="mr-2 font-head text-[10.5px] font-bold uppercase tracking-[0.14em] text-eco-dark md:hidden">
                      {label}
                    </span>
                    {value}
                  </span>
                ))}
              </div>
            ))}
            <p className="mt-5 max-w-[46em] border-l-2 border-amber pl-4 text-[14.5px] leading-[1.6] text-muted">
              {c.compare.note}
            </p>

            {/* Однолинейный чертёж: он показывает то, чего не видно в таблице, —
                что именно размыкается при пропаже сети. До 06.09.2026 стоял на
                /solar рядом с такой же таблицей и дублировал её. */}
            <div className="mt-12">
              <StationSchemes />
            </div>
          </div>
        </Chapter>

        <CardsRow title={c.when.title} items={c.when.items} />

        <SplitMedia
          title={c.numbers.title}
          paragraphs={c.numbers.paragraphs}
          photo={c.numbers.photo}
          alt={c.numbers.alt}
          badge={c.numbers.badge}
          cta={c.numbers.cta}
        />

        <NextSteps {...c.next} />
        <SourcesNote items={c.sources} />
        <FormStrip source="to-know-grid-or-hybrid" interest="solar" />
      </main>
      <Footer />
    </>
  );
}
