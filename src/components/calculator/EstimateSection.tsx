import Link from "next/link";
import { calculator } from "@/content/calculator";
import { estimateHeat, estimateSolar, emptyAnswers, dec, num, type Answers } from "@/lib/estimate";
import { priceHeat, priceSolar } from "@/lib/pricing.server";

/**
 * Секция-витрина расчёта. Стоит на главной и на продуктовых страницах.
 *
 * Раскладка снята с блока «Honest pricing» на elephantenergy.com: цветная
 * подложка во всю ширину, слева текст с призывом, справа карточка с тёмной
 * шапкой, строками «показатель — значение» и выделенным итогом внизу.
 *
 * Строки другие по необходимости: у референса это деньги за монтаж и субсидии,
 * которых у нас нет. Показываем то, что можем посчитать честно — мощность,
 * модель и расход на отопление при действующем тарифе. Цифры не выдуманы:
 * карточка считается той же функцией, что и результат квиза.
 *
 * У станции пример строится не от дома, а от счёта за электричество: это
 * единственное число, которое клиент знает про себя точно.
 */

const p = calculator.promo;

/** Пример: типовой дом, по которому чаще всего и приходят. */
const sampleAnswers: Answers = {
  ...emptyAnswers,
  area: 150,
  walls: "aerated",
  circuit: "floor",
  phase: "three",
  people: 4,
  powerBill: 3000,
};
const sample = estimateHeat(sampleAnswers);

// Цена считается здесь же: секция серверная, закупка в браузер не уходит.
const samplePrice = priceHeat(sampleAnswers, sample);

/** Пример станции: тот же счёт, но однофазный ввод и перебои со светом. */
const solarAnswers: Answers = {
  ...emptyAnswers,
  product: "solar",
  phase: "single",
  outages: "sometimes",
  powerBill: 3000,
};
const solarSample = estimateSolar(solarAnswers);
const solarPrice = priceSolar(solarSample);

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-5 border-b border-line py-3.5 last:border-b-0 md:py-4">
      <span className="text-[14px] text-muted md:text-[15px]">{label}</span>
      <span className="num shrink-0 text-right text-[14.5px] font-semibold text-graphite md:text-[15.5px]">
        {value}
      </span>
    </div>
  );
}

export default function EstimateSection({
  source = "page",
  kind = "heat",
}: {
  source?: string;
  /** Что показывать в карточке: подбор насоса или подбор станции. */
  kind?: "heat" | "solar";
}) {
  const model = sample.models[0];
  const ratio = dec(sample.boilerCost / Math.max(1, sample.winterCost));
  const isSolar = kind === "solar";

  return (
    <section className="bg-white px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[10px] bg-tint px-5 py-10 md:px-12 md:py-14">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <span className="kicker">{p.kicker}</span>
            <h2 className="mt-3 font-head text-[26px] font-bold leading-[1.15] tracking-tight text-graphite md:text-[38px]">
              {p.title}
            </h2>
            <p className="mt-5 max-w-[34em] text-[15px] leading-[1.7] text-ink/85 md:text-[16.5px]">
              {isSolar ? p.solarText : p.text}
            </p>
            <Link href={`/calculator?from=${source}`} className="btn-primary mt-7">
              {p.cta}
              <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-2">
                <path d="M6 2.5 11.5 8 6 13.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-line bg-white">
            <div className="bg-graphite px-5 py-4 md:px-6 md:py-5">
              <p className="font-head text-[16px] font-bold text-white md:text-[18px]">
                {isSolar ? p.solarCardTitle : p.cardTitle}
              </p>
              <p className="mt-1 text-[12.5px] text-white/70">{isSolar ? p.solarCardNote : p.cardNote}</p>
            </div>

            {isSolar ? (
              <div className="px-5 md:px-6">
                <Row label="Мощность станции" value={`${dec(solarSample.kwp)} кВт`} />
                <Row label="Панелей" value={`${solarSample.panels} шт. по 635 Вт`} />
                <Row label="Выработка за год" value={`≈ ${num(solarSample.yearKwh)} кВт·ч`} />
                <Row label="Покрытие потребления" value={`≈ ${solarSample.coverage}%`} />
                {solarSample.inverter && (
                  <Row
                    label={solarSample.hybrid ? "Гибридный инвертор" : "Сетевой инвертор"}
                    value={`${solarSample.inverter.brand} ${solarSample.inverter.model}`}
                  />
                )}
                {solarPrice && <Row label="Монтаж и пусконаладка" value={`${num(solarPrice.installKgs)} сом`} />}
              </div>
            ) : (
              <div className="px-5 md:px-6">
                <Row label="Нужная мощность" value={`${dec(sample.requiredKw)} кВт`} />
                {model && <Row label="Подходящая модель" value={`${model.brand} ${model.model}`} />}
                <Row label="Отопление зимой" value={`≈ ${num(sample.winterCost)} сом/мес`} />
                <Row label="Электрокотёл на этом же доме" value={`≈ ${num(sample.boilerCost)} сом/мес`} />
                {samplePrice && <Row label="Монтаж и пусконаладка" value={`${num(samplePrice.installKgs)} сом`} />}
              </div>
            )}

            <div className="px-5 pb-5 md:px-6 md:pb-6">
              <div className="mt-3 flex items-center justify-between gap-5 rounded-[8px] bg-tint px-4 py-3.5 md:px-5">
                {isSolar ? (
                  <>
                    <span className="font-head text-[15px] font-bold text-graphite md:text-[16.5px]">
                      {solarPrice ? "Под ключ, без батареи" : "По дорогому блоку сейчас"}
                    </span>
                    <span className="num-hero text-[20px] text-eco-dark md:text-[24px]">
                      {solarPrice
                        ? `≈ ${num(solarPrice.totalKgs)} сом`
                        : `≈ ${num(solarSample.highBlockCost)} сом/мес`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-head text-[15px] font-bold text-graphite md:text-[16.5px]">
                      {samplePrice ? "Под ключ" : "Дешевле электрокотла"}
                    </span>
                    <span className="num-hero text-[20px] text-eco-dark md:text-[24px]">
                      {samplePrice ? `≈ ${num(samplePrice.totalKgs)} сом` : `в ${ratio} раза`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {isSolar ? (
          <p className="mt-8 text-[13px] leading-relaxed text-ink/70 md:mt-10">
            Расчёт предварительный: мощность станции считается от вашего счёта, а размещение панелей — от
            кровли, её несущей способности и затенения. Аккумуляторы в сумму не входят: ёмкость подбирают
            под то, что должно работать при отключении света. Потребление восстановлено по счёту при
            действующем тарифе — 1,64 сом до 700 кВт·ч в месяц и 2,94 сом свыше.
          </p>
        ) : (
          <p className="mt-8 text-[13px] leading-relaxed text-ink/70 md:mt-10">
            Расчёт предварительный: мощность и комплект зависят от стен, окон и разводки, а точную смету
            инженер считает после бесплатного выезда. Расход показан при действующем тарифе — 1,64 сом до
            700 кВт·ч в месяц и 2,94 сом свыше.
          </p>
        )}
      </div>
    </section>
  );
}
