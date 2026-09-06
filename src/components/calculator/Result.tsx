"use client";

/**
 * Экран результата.
 *
 * Карточка построена по образцу «Heat pump estimate» с elephantenergy.com:
 * тёмная шапка, строки «показатель — значение» с разделителями, выделенный
 * итог внизу. Отличие вынужденное и принципиальное: у референса в строках
 * деньги за монтаж и субсидии, у нас — мощность, модель и расход на отопление.
 * Цен на оборудование сайт не называет.
 */

import Link from "next/link";
import Image from "next/image";
import { contacts } from "@/content/site";
import { calculator } from "@/content/calculator";
import { dec, num, type Answers, type Estimate } from "@/lib/estimate";
import { productHref } from "@/lib/catalog-view";
import type { CatalogItem } from "@/content/catalog";

const t = calculator.result;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white">
      <div className="bg-[#111c14] px-5 py-4 md:px-7 md:py-5">
        <h2 className="font-head text-[17px] font-bold !text-white md:text-[20px]">{title}</h2>
      </div>
      <div className="px-5 md:px-7">{children}</div>
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line py-4 last:border-b-0 md:py-5">
      <div className="min-w-0">
        <p className="text-[14.5px] leading-snug text-muted md:text-[15.5px]">{label}</p>
        {hint && <p className="mt-1 text-[13px] leading-snug text-muted/80">{hint}</p>}
      </div>
      <div className="shrink-0 text-right font-head text-[15px] font-bold text-graphite md:text-[17px]">
        {value}
      </div>
    </div>
  );
}

function Total({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="mt-4 rounded-[12px] bg-tint px-5 py-4 md:px-6 md:py-5">
      <div className="flex items-center justify-between gap-6">
        <span className="font-head text-[16px] font-bold text-graphite md:text-[18px]">{label}</span>
        <span className="font-head text-[19px] font-bold text-eco-dark md:text-[24px]">{value}</span>
      </div>
      {note && <p className="mt-2 text-[13.5px] leading-snug text-ink/75">{note}</p>}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-r-[10px] border-l-[3px] border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/8 px-5 py-4">
      <p className="text-[14px] leading-[1.6] text-ink/85">{children}</p>
    </div>
  );
}

function ModelLine({ item }: { item: CatalogItem }) {
  return (
    <Link
      href={productHref(item)}
      className="flex items-center gap-3 rounded-[12px] border border-line p-3 transition-colors hover:border-eco"
    >
      {item.image && (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-off">
          <Image src={item.image} alt="" fill sizes="56px" className="object-contain p-1" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-head text-[14.5px] font-bold text-graphite">
          {item.brand} {item.model}
        </span>
        <span className="mt-0.5 block text-[13px] text-muted">
          {dec(item.kw ?? 0)} кВт · {item.phase === "1ф" ? "220 В" : "380 В"} · до {item.minTemp} °C
        </span>
      </span>
      <span aria-hidden className="text-eco-dark">
        <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-2">
          <path d="M6 2.5 11.5 8 6 13.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

/** Цена приходит с сервера: считается от закупки, которой в браузере быть не должно. */
export type PriceView = { equipmentKgs: number; installKgs: number; totalKgs: number };

export default function Result({
  answers,
  result,
  price,
  delivered = true,
  onRestart,
}: {
  answers: Answers;
  result: Estimate;
  price?: { heat: PriceView | null; solar: PriceView | null } | null;
  /** Ушла ли заявка. Если нет — расчёт всё равно показываем, но зовём написать. */
  delivered?: boolean;
  onRestart: () => void;
}) {
  const { heat, solar } = result;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 md:px-6">
      <h1 className="mt-10 text-center font-head text-[26px] font-bold leading-tight tracking-tight text-graphite md:mt-14 md:text-[38px]">
        {t.title}
      </h1>

      {!delivered && (
        <Warning>
          Расчёт готов, но заявка до нас не дошла — что-то с соединением. Чтобы инженер увидел эти
          цифры, напишите нам в WhatsApp: расчёт откроется у нас вместе с вашим сообщением.
        </Warning>
      )}

      <div className="mt-8 space-y-6 md:mt-10">
        {heat && (
          <Card title={t.heatTitle}>
            <Row
              label={t.powerRow}
              value={`${dec(heat.requiredKw)} кВт`}
              hint={`Теплопотери дома ≈ ${dec(heat.heatLossKw)} кВт плюс запас 15%`}
            />
            <Row
              label={t.winterRow}
              value={`≈ ${num(heat.winterCost)} сом/мес`}
              hint={`${num(heat.winterKwh)} кВт·ч в зимний месяц при сезонном COP ${dec(heat.cop)}`}
            />
            <Row
              label={t.boilerRow}
              value={`≈ ${num(heat.boilerCost)} сом/мес`}
              hint="Тот же дом, та же зима, но нагрев напрямую электричеством"
            />
            {heat.currentCost > 0 && (
              <Row
                label={t.currentRow}
                value={`≈ ${num(heat.currentCost)} сом/мес`}
                hint="Ваш собственный ответ — сравнивайте с расчётом выше"
              />
            )}

            <div className="border-t border-line py-5">
              <p className="text-[14.5px] text-muted md:text-[15.5px]">{t.modelsRow}</p>
              <div className="mt-3 space-y-2">
                {heat.models.map((m) => (
                  <ModelLine key={m.slug} item={m} />
                ))}
              </div>
            </div>

            {heat.kit.length > 0 && (
              <div className="border-t border-line py-5">
                <p className="text-[14.5px] text-muted md:text-[15.5px]">{t.kitTitle}</p>
                <ul className="mt-3 space-y-2">
                  {heat.kit.map((k) => (
                    <li key={k} className="flex gap-3 text-[14.5px] leading-snug text-graphite">
                      <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-eco" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {price?.heat && (
              <>
                <Row label={t.priceRow} value={`≈ ${num(price.heat.equipmentKgs)} сом`} hint="Насос и всё, что перечислено в комплекте" />
                <Row label={t.installRow} value={`${num(price.heat.installKgs)} сом`} hint="Монтаж, подключение и запуск системы" />
              </>
            )}

            <div className="pb-6">
              {price?.heat ? (
                <Total
                  label={t.totalRow}
                  value={`≈ ${num(price.heat.totalKgs)} сом`}
                  note={`Отопление обойдётся дешевле электрокотла в ${dec(
                    heat.boilerCost / Math.max(1, heat.winterCost)
                  )} раза — это ≈ ${num(heat.boilerCost - heat.winterCost)} сом разницы в зимний месяц.`}
                />
              ) : (
                heat.boilerCost > heat.winterCost && (
                  <Total
                    label="Дешевле электрокотла"
                    value={`в ${dec(heat.boilerCost / Math.max(1, heat.winterCost))} раза`}
                    note={`Разница ≈ ${num(heat.boilerCost - heat.winterCost)} сом в зимний месяц. Сравнение с электричеством честнее всего: обе цифры считаются по одному тарифу.`}
                  />
                )
              )}

              {heat.issue === "phase" && (
                <Warning>
                  На однофазной сети 220 В в линейке есть только модель на 7 кВт — вашему дому нужно
                  больше. Потребуется трёхфазный ввод: помогаем с оформлением, но заложите на это время.
                </Warning>
              )}
              {heat.issue === "cascade" && (
                <Warning>
                  Одной установкой такой дом не закрыть — собирается каскад из двух насосов. Это рабочая
                  схема, но расчёт делается индивидуально.
                </Warning>
              )}
              {heat.gridWarning && (
                <Warning>
                  Выделенной мощности по вашему договору может не хватить: насосу нужно около{" "}
                  {Math.ceil(heat.requiredKw / heat.cop)} кВт электрической мощности плюс всё остальное в
                  доме. Увеличение лимита — отдельная процедура, начните её заранее.
                </Warning>
              )}
              {answers.fuel === "gas" && (
                <Warning>
                  Вы отапливаетесь газом — и честно скажем: экономии в деньгах может не быть, газ пока
                  дешевле. Насос выигрывает в другом: охлаждение летом той же машиной, нет дымохода и
                  продуктов горения, не нужно ждать очереди на подключение.
                </Warning>
              )}
              {answers.building === "flat" && <Warning>{calculator.object.flatWarning}</Warning>}
              {answers.region === "highland" && (
                <Warning>
                  В Нарыне и Таласе расчётная зима холоднее −25 °C — предела нашей линейки. Насос
                  ставится в паре с резервным источником: он закрывает основную часть сезона, котёл
                  включается в самые морозные дни.
                </Warning>
              )}
            </div>
          </Card>
        )}

        {solar && (
          <Card title={t.solarTitle}>
            <Row
              label={t.kwpRow}
              value={`${dec(solar.kwp)} кВт`}
              hint={`${solar.panels} панелей Trina Solar по 635 Вт`}
            />
            <Row label={t.yearRow} value={`≈ ${num(solar.yearKwh)} кВт·ч`} />
            <Row
              label={t.coverRow}
              value={`≈ ${solar.coverage}%`}
              hint={`Потребление ${num(solar.monthlyKwh)} кВт·ч в месяц${
                heat ? ", в среднем за год вместе с насосом" : ""
              }`}
            />
            {solar.inverter && (
              <Row
                label={t.inverterRow}
                value={`${solar.inverter.brand} ${solar.inverter.model}`}
                hint={solar.hybrid ? "Гибридный: работает при отключениях света" : "Сетевой"}
              />
            )}
            {price?.solar && (
              <>
                <Row label={t.priceRow} value={`≈ ${num(price.solar.equipmentKgs)} сом`} hint="Панели и инвертор" />
                <Row label={t.installRow} value={`${num(price.solar.installKgs)} сом`} hint="Монтаж конструкций, подключение и запуск" />
              </>
            )}

            <div className="pb-6">
              {price?.solar ? (
                <Total
                  label={t.totalRow}
                  value={`≈ ${num(price.solar.totalKgs)} сом`}
                  note={
                    solar.highBlockCost > 0
                      ? `Сейчас ≈ ${num(solar.highBlockCost)} сом в месяц вашего счёта уходит по дорогому блоку 2,94 сом — станция срезает эту часть первой.`
                      : undefined
                  }
                />
              ) : (
                solar.highBlockCost > 0 && (
                  <Total
                    label={t.highBlockRow}
                    value={`≈ ${num(solar.highBlockCost)} сом/мес`}
                    note="Это та часть счёта, которая уходит по тарифу 2,94 сом вместо 1,64. Станция срезает её первой."
                  />
                )
              )}
            </div>
          </Card>
        )}
      </div>

      <ul className="mt-8 space-y-3">
        {t.disclaimers.map((d) => (
          <li key={d} className="flex gap-3 text-[13.5px] leading-[1.6] text-muted">
            <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-muted" />
            {d}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={contacts.whatsapp("calculator")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          {t.ctaWhatsapp}
        </a>
        <Link href="/catalog/heat-pumps" className="btn-outline">
          {t.ctaCatalog}
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="font-head text-[15px] font-semibold text-eco-dark hover:underline"
        >
          {t.again}
        </button>
      </div>
    </div>
  );
}
