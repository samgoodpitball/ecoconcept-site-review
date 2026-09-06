import { Fragment } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormStrip from "@/components/FormStrip";
import CatalogSidebar from "./CatalogSidebar";
import CategoryTabs from "./CategoryTabs";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import {
  CATEGORY_INTRO,
  categoryTitle,
  itemsOf,
  pageCount,
  pageItems,
  type CatalogCategory,
} from "@/lib/catalog-view";

/**
 * Страница раздела каталога. Первая страница и страницы с номером рисуются
 * одним и тем же кодом — различается только срез моделей.
 *
 * Модели идут по шесть на страницу. Подзаголовок группы («Бытовые»,
 * «Внутренние блоки») выводится там, где группа начинается, поэтому деление
 * на страницы не ломает структуру раздела.
 */
export default function CategoryView({
  category,
  page,
}: {
  category: CatalogCategory;
  page: number;
}) {
  const total = pageCount(category);
  const items = pageItems(category, page);
  const all = itemsOf(category);

  // группа, с которой страница начинается, уже была на предыдущей —
  // повторять её заголовок не нужно
  const firstIndex = all.indexOf(items[0]);
  const previousGroup = firstIndex > 0 ? all[firstIndex - 1].group : undefined;

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 py-8 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <CatalogSidebar category={category} />
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
              <span className="text-graphite">{categoryTitle(category)}</span>
              {page > 1 && (
                <>
                  <span className="text-line">/</span>
                  <span className="text-graphite">страница {page}</span>
                </>
              )}
            </nav>

            <header className="mt-4">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight md:text-[38px]">
                  {categoryTitle(category)}
                </h1>
                <span className="text-[15px] text-muted">{all.length}</span>
              </div>
              <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-muted">
                {CATEGORY_INTRO[category]}
              </p>
            </header>

            {/* На узком экране левой колонки нет — разделы переезжают в полосу над списком */}
            <div className="mt-6 lg:hidden">
              <CategoryTabs active={category} />
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item, i) => {
                const groupStarts =
                  item.group && item.group !== (i === 0 ? previousGroup : items[i - 1].group);
                return (
                  <Fragment key={item.slug}>
                    {groupStarts && (
                      <h2 className="col-span-full -mb-3 font-head text-[13px] font-bold uppercase tracking-[0.18em] text-eco-dark">
                        {item.group}
                      </h2>
                    )}
                    <ProductCard item={item} />
                  </Fragment>
                );
              })}
            </div>

            <Pagination category={category} current={page} total={total} />

            {total > 1 && (
              <p className="mt-4 text-center text-[13.5px] text-muted">
                Страница {page} из {total} · всего {all.length} моделей
              </p>
            )}

            <section className="mt-14 border-t border-line pt-8">
              <h2 className="text-xl font-bold">Что важно знать перед покупкой</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{ADVICE[category]}</p>
            </section>
          </div>
        </div>

        <FormStrip source={`catalog-${category}`} />
      </main>
      <Footer />
    </>
  );
}

/** Ответ на главное сомнение в разделе — то, о чём чаще всего спрашивают по телефону. */
const ADVICE: Record<CatalogCategory, string> = {
  "heat-pumps":
    "Мощность считается от теплопотерь, а не от площади в таблице: утепление, остекление и высота потолков меняют результат сильнее квадратных метров. Однофазные модели ставятся с обычным вводом 220 В, всё остальное требует трёх фаз — это стоит проверить до выбора модели. Хладагент R290 — природный пропан, его не выводят из оборота, в отличие от R410A. Все модели работают до −25 °C, но отдача на морозе падает, и это закладывается в расчёт.",
  climate:
    "Мультисплит выгоден там, где нужно охладить несколько комнат: один наружный блок вместо трёх-четырёх отдельных кондиционеров, меньше блоков на фасаде. На каждый наружный блок нужен бранч-бокс, а на каждый кассетный внутренний — декоративная панель: без них система не собирается. Число внутренних блоков и общая длина трассы ограничены — проверяем на этапе расчёта.",
  tanks:
    "Бак нужен, если от насоса берут горячую воду: сам насос её не запасает. Комбинированный бак объединяет ГВС и буфер в одном корпусе и экономит место в котельной; отдельный буферный ставят, чтобы насос не включался короткими циклами. Объём подбирается под число жильцов и мощность насоса, а не «чем больше, тем лучше».",
  "solar-panels":
    "Панель сама по себе не работает: нужен инвертор, а для независимости от отключений — аккумуляторы. Количество панелей считается от нужной выработки и площади крыши, а не по принципу «10 кВт — 10 панелей». Двусторонние модули добавляют выработку там, где под ними светлая поверхность или снег.",
  inverters:
    "Сетевой инвертор дешевле, но батарею не заряжает: при отключении сети дом остаётся без электричества. Гибридный работает с аккумулятором и держит нагрузку. Однофазные модели — для обычного ввода 220 В, трёхфазные — для 380 В. Низковольтные и высоковольтные батареи между собой не совместимы, поэтому инвертор и аккумулятор выбираются вместе.",
  batteries:
    "Ёмкость набирается модулями: на шесть киловатт-часов выгоднее один модуль на 10,24, чем два по 5,12. Низковольтные и высоковольтные батареи работают только со своим типом инвертора. Считаем от того, что должно пережить отключение — весь дом или холодильник, свет и котёл.",
};
