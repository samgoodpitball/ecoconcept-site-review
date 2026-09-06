import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lead from "@/components/Lead";
import VideoExplainer from "@/components/product/VideoExplainer";
import Link from "next/link";
import { ModelCard } from "@/components/product/SectionKit";
import { catalog } from "@/content/catalog";
import { categoryHref } from "@/lib/catalog-view";
import {
  ArticleHero,
  Statement,
  Chapter,
  NumberedList,
  SplitMedia,
  NextSteps,
  SourcesNote,
} from "@/components/to-know/ArticleKit";
import { whatIsHeatPump as c } from "@/content/to-know/heat-pump";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: "/to-know/what-is-a-heat-pump" },
};

/**
 * «Что такое тепловой насос» — первая страница раздела объяснений.
 *
 * Порядок глав повторяет разбор octopus.energy: обложка с врезкой → полоса с
 * главным утверждением → как это работает → ролик → чем выгодно → мороз →
 * сколько стоит → что мы ставим → когда не стоит → призыв и переходы.
 *
 * Глава про мороз — то, ради чего страница в первую очередь и делалась: ответа
 * на главное возражение рынка не было ни на одной странице сайта.
 */
export default function WhatIsAHeatPumpPage() {
  return (
    <>
      <Header />
      <main>
        <ArticleHero {...c.hero} />
        <Statement>{c.statement}</Statement>

        <Chapter title={c.what.title} paragraphs={c.what.paragraphs}>
          <div className="mt-10">
            <VideoExplainer {...c.video} />
          </div>
        </Chapter>

        <Chapter title={c.benefits.title} tone="off">
          <NumberedList items={c.benefits.items} />
        </Chapter>

        <Chapter title={c.cold.title} paragraphs={c.cold.paragraphs}>
          {/* Таблица, а не карточки: здесь сравниваются режимы работы. */}
          <div className="mt-9 max-w-[46em]">
            <div className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-line pb-2.5">
              <span className="font-head text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Режим</span>
              <span className="text-right font-head text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                COP
              </span>
            </div>
            {c.cold.table.rows.map((r) => (
              <div key={r.mode} className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-line py-3.5">
                <span className="text-[15.5px] leading-[1.5] text-graphite md:text-[16px]">{r.mode}</span>
                <span className="num text-[17px] font-semibold text-graphite md:text-[18px]">
                  {r.value}
                </span>
              </div>
            ))}
            <p className="mt-5 border-l-2 border-amber pl-4 text-[14.5px] leading-[1.6] text-muted">
              {c.cold.table.note}
            </p>
          </div>
        </Chapter>

        <SplitMedia
          title={c.cost.title}
          paragraphs={c.cost.paragraphs}
          photo={c.cost.photo}
          alt={c.cost.alt}
          badge={c.cost.badge}
          cta={c.cost.cta}
        />

        {/* Модели берём из каталога, а не переписываем руками: пополнился
            каталог — обновилась страница, и характеристики не разъезжаются. */}
        <Chapter title={c.models.title} paragraphs={[c.models.text]} tone="off">
          <div className="mt-9 grid gap-5 md:grid-cols-3 md:gap-6">
            {c.models.slugs
              .map((slug) => catalog.find((i) => i.slug === slug))
              .filter((i) => i !== undefined)
              .map((item) => (
                <ModelCard key={item.slug} item={item} />
              ))}
          </div>
          <Link
            href={categoryHref("heat-pumps")}
            className="group mt-8 inline-flex items-center gap-2.5 font-head text-[14px] font-semibold text-graphite transition-colors hover:text-eco-dark"
          >
            {c.models.link}
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Chapter>

        <SplitMedia
          title={c.notForYou.title}
          paragraphs={c.notForYou.paragraphs}
          photo={c.notForYou.photo}
          alt={c.notForYou.alt}
          badge={c.notForYou.badge}
          reverse
        />

        <NextSteps {...c.next} />
        <SourcesNote items={c.sources} />
        <Lead source="to-know-heat-pump" interest="heat" />
      </main>
      <Footer />
    </>
  );
}
