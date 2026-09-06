import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lead from "@/components/Lead";

export const metadata: Metadata = {
  title: "Объекты EcoConcept — портфолио смонтированных систем",
  description:
    "Раздел с объектами компании: тепловые насосы и солнечные станции, смонтированные в Кыргызстане. Готовим съёмку.",
  alternates: { canonical: "/projects" },
  /* Пустой раздел индексировать незачем: страница откроется поиску, когда на
     ней появятся объекты. */
  robots: { index: false, follow: true },
};

/**
 * Заглушка раздела объектов.
 *
 * Ставится 06.09.2026, чтобы две ссылки с /about перестали вести в 404. Пустая
 * намеренно: портфолио на стоковых кадрах и ИИ-генерациях было бы обманом —
 * правило третье дизайн-системы требует фотографию своего объекта.
 */
export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-16 text-center md:px-6 md:pb-24 md:pt-24">
            <span className="block font-head text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
              Объекты
            </span>
            <h1 className="mx-auto mt-5 max-w-[13em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
              Снимаем свои объекты
            </h1>
            <p className="mx-auto mt-6 max-w-[36em] text-[16.5px] leading-[1.7] text-muted md:text-[17.5px]">
              Раздел готовится. Мы не станем собирать портфолио из стоковых кадров и генераций: объект в
              портфолио должен быть нашим, с монтажом нашей бригады и понятной историей — что стояло, что
              поставили, что получилось по счетам.
            </p>
            <p className="mx-auto mt-5 max-w-[36em] text-[16.5px] leading-[1.7] text-muted md:text-[17.5px]">
              Пока раздел пустует, инженер покажет фотографии и расскажет про похожие объекты на выезде —
              выезд и расчёт бесплатны.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/calculator" className="btn-primary">
                Получить расчёт
              </Link>
              <Link href="/about" className="btn-outline">
                О компании
              </Link>
            </div>
          </div>
        </section>

        <Lead source="projects" />
      </main>
      <Footer />
    </>
  );
}
