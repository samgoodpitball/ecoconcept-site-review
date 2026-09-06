import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lead from "@/components/Lead";
import EstimateSection from "@/components/calculator/EstimateSection";
import WhyUs from "@/components/product/WhyUs";
import HeatingCompare from "@/components/product/HeatingCompare";
import { Brands, Directions, Steps } from "@/components/home/HomeSections";
import Hero from "@/components/home/Hero";
import Offer from "@/components/home/Offer";
import { home } from "@/content/home";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Brands />
        <Directions />
        <Offer data={home.offer} />
        <Offer data={home.offerSolar} reverse />
        <HeatingCompare />
        <Steps />
        <WhyUs title={home.why.title} subtitle={home.why.subtitle} items={home.why.items} />
        <EstimateSection source="home" />
        <Lead />
      </main>
      <Footer />
    </>
  );
}
