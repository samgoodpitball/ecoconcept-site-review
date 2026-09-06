import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lead from "@/components/Lead";
import {
  AboutHero,
  AboutTurnkey,
  AboutTeam,
  AboutScope,
  AboutBrands,
  AboutProjects,
  AboutOffice,
  AboutCareers,
} from "@/components/about/AboutSections";

export const metadata: Metadata = {
  title: "О компании — EcoConcept, инженерная компания в Бишкеке",
  description:
    "Расчёт, проект, монтаж и сервис тепловых насосов и солнечных станций делаем сами. Наших мастеров обучали инженеры производителей. Что входит в «под ключ» и чего мы не делаем.",
  alternates: { canonical: "/about" },
};

/**
 * Страница «О компании». Шапка, форма заявки и футер — те же компоненты, что и
 * на каталоге; между ними идёт содержание страницы в стиле «инженерный
 * документ» (решение заказчика 04.09.2026).
 *
 * Секции чисел о компании здесь намеренно нет: компания молодая, и стажем
 * хвастаться нечем — вместо неё работает блок про обучение у производителей.
 */
export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <AboutTurnkey />
        <AboutTeam />
        <AboutScope />
        <AboutBrands />
        <AboutProjects />
        <AboutOffice />
        <AboutCareers />
        <Lead source="about" />
      </main>
      <Footer />
    </>
  );
}
