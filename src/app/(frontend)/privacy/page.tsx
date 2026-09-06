import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { privacy as c } from "@/content/privacy";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: false },
};

/** Юридический документ: одна колонка, крупный набор, никаких украшений. */
export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-16">
            <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[40px]">{c.title}</h1>
            <p className="mt-4 font-head text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
              Обновлено {c.updated}
            </p>
            <p className="mt-6 text-[16.5px] leading-[1.7] text-graphite md:text-[17.5px]">{c.intro}</p>

            {c.sections.map((s) => (
              <section key={s.title} className="mt-12">
                <h2 className="font-head text-[20px] font-bold leading-[1.25] text-graphite md:text-[24px]">
                  {s.title}
                </h2>
                {"list" in s && s.list ? (
                  <ul className="mt-5 flex flex-col gap-3">
                    {s.list.map((i) => (
                      <li key={i} className="flex gap-3 text-[16px] leading-[1.65] text-muted md:text-[16.5px]">
                        <span aria-hidden className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-eco" />
                        {i}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {"paragraphs" in s && s.paragraphs
                  ? s.paragraphs.map((p) => (
                      <p key={p} className="mt-5 text-[16px] leading-[1.7] text-muted md:text-[16.5px]">
                        {p}
                      </p>
                    ))
                  : null}
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
