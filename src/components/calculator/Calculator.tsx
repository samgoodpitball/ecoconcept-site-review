"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculatorConfig as cfg, recommendModel } from "@/lib/calculatorConfig";
import { useLeadModal } from "@/components/LeadModal";
import { contacts } from "@/content/site";
import { track } from "@/lib/analytics";
import MonthlyChart from "./MonthlyChart";

type Tab = "solar" | "heat";

const fmtNum = (v: number, digits = 0) =>
  v.toLocaleString("ru-RU", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const fmtMoney = (v: number) => `${fmtNum(Math.round(v))} сом`;

/** Единый вид карточки результата. */
function Result({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-white p-4">
      <div className="text-[12.5px] text-muted">{label}</div>
      <div className="mt-1 font-head text-[22px] font-extrabold leading-tight text-graphite">{value}</div>
      {hint && <div className="mt-1 text-[12px] leading-snug text-muted">{hint}</div>}
    </div>
  );
}

export default function Calculator({ initialTab = "heat" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div>
      <div role="tablist" aria-label="Тип расчёта" className="inline-flex rounded-full border border-line bg-white p-1">
        {(
          [
            ["heat", "Тепловой насос"],
            ["solar", "Солнечная станция"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2.5 font-head text-[14px] font-semibold transition-colors ${
              tab === id ? "bg-eco text-white" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-7">{tab === "heat" ? <HeatPumpTab /> : <SolarTab />}</div>

      <p className="mt-8 rounded-[12px] bg-tint px-5 py-4 text-[13.5px] leading-relaxed text-eco-dark">
        Предварительный расчёт. Точные цифры — после инженерного обследования объекта. Часть констант (тарифы,
        ценовые ориентиры, курс) сейчас заданы рабочими значениями и будут уточнены — поэтому смотрите на порядок
        величин, а не на точную сумму.
      </p>
    </div>
  );
}

/* ------------------------------- Тепловой насос ------------------------------- */

function HeatPumpTab() {
  const { open } = useLeadModal();
  const [area, setArea] = useState(120);
  const [insulation, setInsulation] = useState<"good" | "average" | "poor">("average");
  const [heating, setHeating] = useState<"coal" | "electric" | "gas">("coal");
  const [extremeFrost, setExtremeFrost] = useState(false);

  const areaValid = area >= 20 && area <= 2000;

  const r = useMemo(() => {
    const c = cfg.heatPump;
    const requiredKw = (area * c.heatLossWPerM2[insulation]) / 1000 * c.safetyFactor;
    const annualHeatDemandKwh = requiredKw * c.fullLoadHours;
    const hpElectricityKwh = annualHeatDemandKwh / c.scop;
    const hpCostKgs = hpElectricityKwh * c.tariffKgsPerKwh;

    let currentCostKgs = 0;
    if (heating === "coal") currentCostKgs = (annualHeatDemandKwh / (c.coal.kWhPerKg * c.coal.boilerEff)) * c.coal.priceKgsPerKg;
    else if (heating === "electric") currentCostKgs = (annualHeatDemandKwh / c.electricBoilerEff) * c.tariffKgsPerKwh;
    else currentCostKgs = (annualHeatDemandKwh / (c.gas.kWhPerM3 * c.gas.boilerEff)) * c.gas.priceKgsPerM3;

    const annualSavingsKgs = Math.max(0, currentCostKgs - hpCostKgs);
    const equipmentKgs = c.equipmentFromUsd * cfg.currency.usdToKgs;
    const paybackYears = annualSavingsKgs > 0 ? equipmentKgs / annualSavingsKgs : null;
    const co2Reduction = heating === "coal" ? annualHeatDemandKwh * c.co2CoalKgPerKwh : null;
    const model = recommendModel(requiredKw, extremeFrost);

    return { requiredKw, annualHeatDemandKwh, hpCostKgs, currentCostKgs, annualSavingsKgs, paybackYears, co2Reduction, model };
  }, [area, insulation, heating, extremeFrost]);

  function requestExact() {
    track("calculator_submit", { type: "heat", power: Math.round(r.requiredKw) });
    open({
      interest: "heat",
      source: "calculator",
      product: `Расчёт ТН: ${fmtNum(r.requiredKw, 1)} кВт, дом ${area} м², утепление ${
        { good: "хорошее", average: "среднее", poor: "слабое" }[insulation]
      }, сейчас ${{ coal: "уголь", electric: "электрокотёл", gas: "газ" }[heating]}. Рекомендация: ${r.model.name}. Экономия ~${fmtMoney(r.annualSavingsKgs)}/год`,
    });
  }

  const waText = encodeURIComponent(
    `Здравствуйте! Посчитал на сайте: дом ${area} м², нужна мощность ~${fmtNum(r.requiredKw, 1)} кВт, ` +
      `рекомендация — ${r.model.name}. Экономия ~${fmtMoney(r.annualSavingsKgs)} в год. Хочу точный расчёт.`
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="rounded-[12px] border border-line bg-off p-5 md:p-6">
        <label className="block">
          <span className="field-label">Площадь дома, м²</span>
          <input
            type="number"
            min={20}
            max={2000}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="field"
          />
        </label>
        {!areaValid && (
          <p className="mt-1.5 text-[12.5px] text-[color:var(--color-error)]">
            Укажите площадь от 20 до 2000 м² — для других объектов посчитаем индивидуально.
          </p>
        )}

        <fieldset className="mt-5">
          <legend className="field-label">Утепление</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["good", "Хорошее"],
                ["average", "Среднее"],
                ["poor", "Слабое"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setInsulation(id)}
                className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  insulation === id ? "border-eco bg-eco text-white" : "border-line bg-white text-ink hover:border-eco"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] leading-snug text-muted">
            Хорошее — новый дом с утеплением и стеклопакетами; слабое — старый дом без утепления.
          </p>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="field-label">Чем отапливаетесь сейчас</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["coal", "Уголь"],
                ["electric", "Электрокотёл"],
                ["gas", "Газ"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setHeating(id)}
                className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  heating === id ? "border-eco bg-eco text-white" : "border-line bg-white text-ink hover:border-eco"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-[13.5px] text-ink">
          <input
            type="checkbox"
            checked={extremeFrost}
            onChange={(e) => setExtremeFrost(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[color:var(--color-eco)]"
          />
          Бывают морозы ниже −25 °C
        </label>
      </div>

      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Result label="Нужная мощность" value={`${fmtNum(r.requiredKw, 1)} кВт`} hint="с запасом 15 % на пиковые холода" />
          <Result label="Рекомендуемая модель" value={r.model.name} hint={r.model.note} />
          <Result label="Затраты на тепло с насосом" value={`${fmtMoney(r.hpCostKgs)}/год`} />
          <Result
            label="Сейчас платите"
            value={`${fmtMoney(r.currentCostKgs)}/год`}
            hint={{ coal: "отопление углём", electric: "электрокотёл", gas: "газовый котёл" }[heating]}
          />
          <Result
            label="Экономия"
            value={r.annualSavingsKgs > 0 ? `${fmtMoney(r.annualSavingsKgs)}/год` : "нет экономии"}
            hint={r.annualSavingsKgs > 0 ? undefined : "при текущих вводных насос не выигрывает — посчитаем детальнее"}
          />
          <Result
            label="Окупаемость оборудования"
            value={r.paybackYears ? `≈ ${fmtNum(r.paybackYears, 1)} лет` : "—"}
            hint={`от $${fmtNum(cfg.heatPump.equipmentFromUsd)} за комплект`}
          />
          {r.co2Reduction != null && (
            <Result label="Снижение выбросов" value={`${fmtNum(r.co2Reduction)} кг CO₂/год`} hint="против отопления углём" />
          )}
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-muted">
          Точная мощность зависит от расчёта теплопотерь: высота потолков, площадь остекления, вентиляция.
          Это ориентир — финальный подбор после обследования.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={requestExact} className="btn-primary">
            Получить точный расчёт
          </button>
          <a
            href={`https://wa.me/996704403020?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { page: "calculator" })}
            className="btn-outline"
          >
            Отправить результат в WhatsApp
          </a>
          {r.model.slug && (
            <Link href={`/catalog/${r.model.slug}`} className="btn-outline">
              Открыть модель
            </Link>
          )}
        </div>
        <p className="mt-4 text-[13px] text-muted">
          Или позвоните:{" "}
          <a href={contacts.phoneHref} className="font-semibold text-eco-dark underline underline-offset-4">
            {contacts.phoneDisplay}
          </a>
        </p>
      </div>
    </div>
  );
}

/* ----------------------------- Солнечная станция ------------------------------ */

function SolarTab() {
  const { open } = useLeadModal();
  const [type, setType] = useState<"grid" | "hybrid">("grid");
  const [mode, setMode] = useState<"kwh" | "bill">("bill");
  const [value, setValue] = useState(4000);
  const [city, setCity] = useState<string>(cfg.solar.cities[0]);
  const [power, setPower] = useState<number | "auto">("auto");

  const valid = value > 0;

  const r = useMemo(() => {
    const c = cfg.solar;
    const yieldPerKwp = c.yieldPerKwpYear[city] ?? c.yieldPerKwpYear.default;
    const monthlyKwh = mode === "bill" ? value / c.tariffKgsPerKwh : value;
    const annualConsumption = monthlyKwh * 12;
    const kWp = power === "auto" ? annualConsumption / yieldPerKwp : power;
    const annualGeneration = kWp * yieldPerKwp;
    const monthlyGeneration = c.monthlyProfile.map((f) => annualGeneration * f);
    const coverage = annualConsumption > 0 ? Math.min(100, (annualGeneration / annualConsumption) * 100) : 0;
    const selfUse = Math.min(annualGeneration, annualConsumption);
    const exportKwh = Math.max(0, annualGeneration - annualConsumption) * c.exportShareCounted;
    const annualSavingsKgs = (selfUse + exportKwh) * c.tariffKgsPerKwh;
    const costUsd = kWp * c.pricePerKwUsd[type];
    const costKgs = costUsd * cfg.currency.usdToKgs;
    const paybackYears = annualSavingsKgs > 0 ? costKgs / annualSavingsKgs : null;
    const co2SavedKgYear = annualGeneration * c.co2FactorKgPerKwh;

    return {
      kWp,
      annualGeneration,
      monthlyGeneration,
      monthlyConsumption: monthlyKwh,
      coverage,
      annualSavingsKgs,
      costUsd,
      costKgs,
      paybackYears,
      co2SavedKgYear,
    };
  }, [type, mode, value, city, power]);

  function requestExact() {
    track("calculator_submit", { type: "solar", power: Math.round(r.kWp) });
    open({
      interest: "solar",
      source: "calculator",
      product: `Расчёт СЭС: ${type === "grid" ? "сетевая" : "гибридная"}, ${fmtNum(r.kWp, 1)} кВт, ${city}. ` +
        `Выработка ~${fmtNum(r.annualGeneration)} кВт·ч/год, экономия ~${fmtMoney(r.annualSavingsKgs)}/год, покрытие ${fmtNum(r.coverage)} %`,
    });
  }

  const waText = encodeURIComponent(
    `Здравствуйте! Посчитал на сайте: ${type === "grid" ? "сетевая" : "гибридная"} станция ~${fmtNum(r.kWp, 1)} кВт, ` +
      `${city}. Выработка ~${fmtNum(r.annualGeneration)} кВт·ч в год. Хочу точный расчёт.`
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="rounded-[12px] border border-line bg-off p-5 md:p-6">
        <fieldset>
          <legend className="field-label">Тип станции</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["grid", "Сетевая"],
                ["hybrid", "Гибридная"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setType(id)}
                className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  type === id ? "border-eco bg-eco text-white" : "border-line bg-white text-ink hover:border-eco"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="field-label">Как укажете потребление</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["bill", "Сумма счёта, сом/мес"],
                ["kwh", "кВт·ч в месяц"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  mode === id ? "border-eco bg-eco text-white" : "border-line bg-white text-ink hover:border-eco"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-5 block">
          <span className="field-label">{mode === "bill" ? "Счёт за месяц, сом" : "Потребление, кВт·ч/мес"}</span>
          <input type="number" min={1} value={value} onChange={(e) => setValue(Number(e.target.value))} className="field" />
        </label>
        {!valid && <p className="mt-1.5 text-[12.5px] text-[color:var(--color-error)]">Введите значение больше нуля.</p>}

        <label className="mt-5 block">
          <span className="field-label">Город</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="field">
            {cfg.solar.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block">
          <span className="field-label">Мощность станции</span>
          <select
            value={String(power)}
            onChange={(e) => setPower(e.target.value === "auto" ? "auto" : Number(e.target.value))}
            className="field"
          >
            <option value="auto">Подобрать под потребление</option>
            {cfg.solar.powerPresets.map((p) => (
              <option key={p} value={p}>
                {p} кВт
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Result label="Рекомендованная мощность" value={`${fmtNum(r.kWp, 1)} кВт`} />
          <Result label="Годовая выработка" value={`${fmtNum(r.annualGeneration)} кВт·ч`} />
          <Result label="Экономия" value={`${fmtMoney(r.annualSavingsKgs)}/год`} />
          <Result
            label="Ориентировочная стоимость"
            value={`от $${fmtNum(r.costUsd)}`}
            hint={`≈ ${fmtMoney(r.costKgs)}`}
          />
          <Result label="Окупаемость" value={r.paybackYears ? `≈ ${fmtNum(r.paybackYears, 1)} лет` : "—"} />
          <Result label="Покрытие потребления" value={`${fmtNum(r.coverage)} %`} />
          <Result label="Снижение CO₂" value={`${fmtNum(r.co2SavedKgYear)} кг/год`} />
        </div>

        <div className="mt-7 rounded-[12px] border border-line bg-white p-5">
          <MonthlyChart values={r.monthlyGeneration} reference={r.monthlyConsumption} />
        </div>

        {type === "hybrid" && (
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Гибридная станция дороже за счёт аккумулятора: финальная стоимость зависит от нужной ёмкости АКБ
            и особенностей объекта.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={requestExact} className="btn-primary">
            Получить точный расчёт
          </button>
          <a
            href={`https://wa.me/996704403020?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { page: "calculator" })}
            className="btn-outline"
          >
            Отправить результат в WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
