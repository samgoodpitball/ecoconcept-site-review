import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormStrip from "@/components/FormStrip";
import EstimateSection from "@/components/calculator/EstimateSection";
import SavingsSection from "@/components/product/SavingsSection";
import WhyUs from "@/components/product/WhyUs";
import { solar } from "@/content/solar";
import {
  SolHero,
  SolReasons,
  SolScheme,
  SolHow,
  SolModels,
  SolSteps,
  SolFaq,
} from "@/components/solar/SolarSections";

export const metadata: Metadata = {
  title: solar.meta.title,
  description: solar.meta.description,
  alternates: { canonical: "/solar" },
};

/**
 * Продуктовая страница «Солнечные станции».
 *
 * Порядок секций тот же, что на /heat-pumps, потому что порядок вопросов
 * покупателя тот же: что это → зачем ставить → как устроено → что мы ставим →
 * сколько это стоит → как мы работаем → остальные вопросы.
 *
 * Шапка, форма заявки и футер — те же компоненты, что на каталоге и /about.
 */
export default function SolarPage() {
  return (
    <>
      <Header />
      <main>
        <SolHero />
        <SolReasons />
        <SolScheme />
        <SolHow />
        <SolModels />
        <SavingsSection defaultKind="solar" />
        <EstimateSection source="solar" kind="solar" />
        <SolSteps />
        <WhyUs {...solar.why} />
        <SolFaq />
        <FormStrip source="solar" interest="solar" />
      </main>
      <Footer />
    </>
  );
}
