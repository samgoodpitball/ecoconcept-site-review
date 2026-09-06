import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lead from "@/components/Lead";
import EstimateSection from "@/components/calculator/EstimateSection";
import WhyUs from "@/components/product/WhyUs";
import HeatingCompare from "@/components/product/HeatingCompare";
import SavingsSection from "@/components/product/SavingsSection";
import { Brands, Steps } from "@/components/home/HomeSections";
import Hero from "@/components/home/Hero";
import Offer from "@/components/home/Offer";
import { home } from "@/content/home";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Ритм фонов (находка №5): два оффера с тёмными панелями больше не
            стоят вплотную — между ними таблица «Сколько стоит месяц тепла».
            Деньги встают сразу за обещанием насоса, которое на них ссылается,
            и страница чередует якорь → данные → якорь → шаги. */}
        <Hero />
        <Brands />
        <Offer data={home.offer} />
        <HeatingCompare />
        <Offer data={home.offerSolar} reverse />
        <SavingsSection />
        <Steps />
        <WhyUs title={home.why.title} subtitle={home.why.subtitle} items={home.why.items} />
        <EstimateSection source="home" />
        <Lead />
      </main>
      <Footer />
    </>
  );
}
