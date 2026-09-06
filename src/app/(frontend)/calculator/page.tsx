import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Quiz from "@/components/calculator/Quiz";
import { calculator } from "@/content/calculator";
import { emptyAnswers, estimate, type Answers } from "@/lib/estimate";
import { priceHeat, priceSolar } from "@/lib/pricing.server";

export const metadata: Metadata = {
  title: calculator.meta.title,
  description: calculator.meta.description,
  alternates: { canonical: "/calculator" },
};

/**
 * Страница расчёта: квиз из шести шагов и экран результата.
 * Вход — секция-витрина на главной и продуктовых страницах.
 */
export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  // ?demo=1 (насос), ?demo=solar, ?demo=both — открыть готовый результат для приёмки.
  const { demo } = await searchParams;

  // Цена считается здесь, на сервере: в браузер уходит только итог в сомах.
  let demoPrice = null;
  if (demo) {
    const answers: Answers = {
      ...emptyAnswers,
      product: demo === "solar" ? "solar" : demo === "both" ? "both" : "heat",
      area: 150,
      walls: "aerated",
      circuit: "floor",
      phase: "three",
    };
    const { heat, solar } = estimate(answers);
    demoPrice = {
      heat: heat ? priceHeat(answers, heat) : null,
      solar: solar ? priceSolar(solar) : null,
    };
  }
  return (
    <>
      <Header />
      <main className="bg-white">
        <Quiz demo={demo ?? ""} demoPrice={demoPrice} />
      </main>
      <Footer />
    </>
  );
}
