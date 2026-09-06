import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormStrip from "@/components/FormStrip";
import LeadButton from "@/components/LeadButton";
import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import ProductGallery from "@/components/catalog/ProductGallery";
import { contacts } from "@/content/site";
import {
  bySlug,
  catalog,
  categoryHref,
  categoryTitle,
  description,
  formatCondition,
  formatSpecValue,
  productHref,
  productTitle,
  shortTitle,
  subtitle,
} from "@/lib/catalog-view";

export function generateStaticParams() {
  return catalog.map((item) => ({ category: item.category, slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = bySlug(slug);
  if (!item) return {};
  return {
    title: `${productTitle(item)} — купить в Бишкеке | EcoConcept`,
    description: description(item)[0],
    alternates: { canonical: productHref(item) },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const item = bySlug(slug);
  // адрес раздела должен совпадать с разделом модели, иначе одна и та же
  // страница открывалась бы по нескольким адресам
  if (!item || item.category !== category) notFound();

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 py-8 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <CatalogSidebar category={item.category} slug={item.slug} />
          </div>

          <div>
            <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <Link href="/" className="hover:text-eco-dark">
                Главная
              </Link>
              <span className="text-line">/</span>
              <Link href="/catalog" className="hover:text-eco-dark">
                Каталог
              </Link>
              <span className="text-line">/</span>
              <Link href={categoryHref(item.category)} className="hover:text-eco-dark">
                {categoryTitle(item.category)}
              </Link>
              <span className="text-line">/</span>
              <span className="text-graphite">{shortTitle(item)}</span>
            </nav>

            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
              <div>
                <h1 className="text-[28px] font-extrabold leading-tight tracking-tight md:text-[34px]">
                  {productTitle(item)}
                </h1>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{subtitle(item)}</p>

                <p className="mt-6 font-head text-2xl font-bold text-graphite">Цена по запросу</p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  Считаем комплект целиком: оборудование, обвязка и монтаж под ваш объект.
                </p>

                <p className="mt-5 flex items-center gap-2 text-[15px] font-medium text-eco-dark">
                  <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-eco" />
                  В наличии на складе в Бишкеке
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <LeadButton
                    product={shortTitle(item)}
                    source={`product-${item.slug}`}
                    className="btn-primary"
                  >
                    Узнать цену
                  </LeadButton>
                  <a
                    href={contacts.whatsapp(`product-${item.slug}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    Написать в WhatsApp
                  </a>
                </div>

                <ul className="mt-7 grid gap-3 rounded-[12px] border border-line bg-off p-5 sm:grid-cols-2">
                  {[
                    "Гарантия производителя",
                    "Доставка по Кыргызстану",
                    "Монтаж своей бригадой",
                    "Оплата наличными и переводом",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[13.5px] leading-snug text-ink">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="shrink-0 text-eco"
                      >
                        <path d="M4 10.5l3.8 3.8L16 6" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-first lg:order-none">
                <ProductGallery item={item} />
              </div>
            </div>

            <section className="mt-12 border-t border-line pt-8">
              {description(item).map((p) => (
                <p key={p} className="mt-4 text-[16px] leading-relaxed text-ink first:mt-0">
                  {p}
                </p>
              ))}
            </section>

            {item.specs && item.specs.length > 0 && (
              <section className="mt-10 rounded-[12px] bg-off p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h2 className="text-[22px] font-bold">Технические характеристики</h2>
                  {item.source && (
                    <p className="max-w-md text-[13px] leading-snug text-muted">Источник: {item.source}</p>
                  )}
                </div>

                <dl className="mt-5 grid gap-x-12 md:grid-cols-2">
                  {item.specs.map((s, i) => (
                    <div
                      key={`${s.label}-${i}`}
                      className="flex items-baseline justify-between gap-6 border-b border-line py-3"
                    >
                      <dt className="text-[14.5px] leading-snug text-muted">
                        {s.label}
                        {s.condition && (
                          <span className="block text-[12.5px] leading-snug text-muted/80">
                            {formatCondition(s.condition)}
                          </span>
                        )}
                      </dt>
                      <dd className="text-right font-head text-[15px] font-semibold text-graphite">
                        {formatSpecValue(s.value)}
                        {s.unit ? `\u00A0${s.unit}` : ""}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Ролик объясняет работу теплового насоса — на страницах инверторов и баков он не к месту */}
            {item.category === "heat-pumps" && (
            <section className="mt-12">
              <h2 className="text-[22px] font-bold">Как это работает</h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                Минутный ролик: откуда берётся тепло зимой, куда уходит летом и что стоит в доме.
              </p>
              <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[12px] bg-tint">
                <Image
                  src="/video/scheme-poster.webp"
                  alt="Схема дома с тепловым насосом и солнечными панелями"
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-graphite/70">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                </div>
                <span className="absolute bottom-4 left-5 rounded-full bg-graphite/70 px-3.5 py-1.5 text-[13px] text-white">
                  Ролик, 58 секунд
                </span>
              </div>
            </section>
            )}
          </div>
        </div>

        <FormStrip source={`product-${item.slug}`} interest={categoryTitle(item.category)} />
      </main>
      <Footer />
    </>
  );
}
