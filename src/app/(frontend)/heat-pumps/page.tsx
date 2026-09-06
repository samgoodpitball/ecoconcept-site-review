import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lead from "@/components/Lead";
import EstimateSection from "@/components/calculator/EstimateSection";
import WhyUs from "@/components/product/WhyUs";
import HeatingCompare from "@/components/product/HeatingCompare";
import { heatPumps } from "@/content/heat-pumps";
import {
  HpHero,
  HpReasons,
  HpHow,
  HpModels,
  HpSteps,
  HpFaq,
} from "@/components/heat-pumps/HeatPumpSections";

export const metadata: Metadata = {
  title: heatPumps.meta.title,
  description: heatPumps.meta.description,
  alternates: { canonical: "/heat-pumps" },
};

/**
 * Продуктовая страница «Тепловые насосы».
 *
 * Порядок секций — порядок вопросов покупателя, а не порядок ассортимента:
 * что это → зачем менять отопление → как устроено → что мы ставим →
 * сколько платить потом → сколько стоит поставить → как мы работаем →
 * остальные вопросы.
 *
 * Шапка, форма заявки и футер — те же компоненты, что на каталоге и /about.
 */
export default function HeatPumpsPage() {
  return (
    <>
      <Header />
      <main>
        <HpHero />
        <HpReasons />
        <HpHow />
        <HpModels />
        <HeatingCompare />
        <EstimateSection source="heat-pumps" />
        <HpSteps />
        <WhyUs {...heatPumps.why} />
        <HpFaq />
        <Lead source="heat-pumps" interest="heat" />
      </main>
      <Footer />
    </>
  );
}
