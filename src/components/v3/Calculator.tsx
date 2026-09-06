"use client";

import { useState } from "react";
import { calc } from "@/content/home-v3";
import {
  calcSolar, calcHeat, formatSom,
  TARIFF_ABOVE, TARIFF_BASE,
} from "@/lib/calc-v2";

type Tab = "solar" | "heat";

/**
 * Калькулятор прямо на главной, а не ссылкой. Солнце открыто по умолчанию — 60/40.
 * Сноска «как мы считаем» обязательна: она превращает калькулятор из рекламы
 * в инструмент. Приём Aira.
 */
export function Calculator() {
  const [tab, setTab] = useState<Tab>("solar");

  return (
    <section className="v3-sec v3-a" id="calc">
      <div className="v3-wrap">
        <h2 className="t-h2">{calc.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <p className="t-sub v3-measure">{calc.lead}</p>

        <div className="tabs" role="tablist" aria-label="Что считаем">
          <button
            role="tab" aria-selected={tab === "solar"}
            className={`tab ${tab === "solar" ? "is-on" : ""}`}
            onClick={() => setTab("solar")}
          >
            {calc.tabs.solar}
          </button>
          <button
            role="tab" aria-selected={tab === "heat"}
            className={`tab ${tab === "heat" ? "is-on" : ""}`}
            onClick={() => setTab("heat")}
          >
            {calc.tabs.heat}
          </button>
        </div>

        {tab === "solar" ? <SolarCalc /> : <HeatCalc />}

        <details className="disc disc-wrap" style={{ marginTop: 40 }}>
          <summary>{calc.method.summary}</summary>
          <div className="disc-body">
            {calc.method.body.map((p, i) => (
              <p key={i} className="t-sub" style={{ marginTop: i ? 12 : 0 }}>{p}</p>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

function SolarCalc() {
  const [bill, setBill] = useState(3000);
  const [house, setHouse] = useState("house");
  const [outage, setOutage] = useState("no");

  const r = calcSolar(bill);
  const savedKwh = Math.min(r.yieldPerYear, r.kwhPerYear);
  const savedSom = savedKwh * (r.aboveThresholdShare > 40 ? TARIFF_ABOVE : TARIFF_BASE);

  const type =
    outage === "none" ? "Автономная" : outage === "yes" ? "Гибридная" : "Сетевая";
  const typeWhy =
    outage === "none"
      ? "сети нет, станция работает сама на себя"
      : outage === "yes"
        ? "аккумуляторы держат выделенную группу при отключении"
        : "самая быстрая окупаемость, аккумуляторы не нужны";

  return (
    <div className="calc">
      <div className="calc-form">
        <div className="calc-q">
          <label className="calc-label" htmlFor="calc-bill">{calc.solar.billLabel}</label>
          <output className="calc-value" htmlFor="calc-bill">
            {formatSom(bill)} <span className="widget-unit">сом</span>
          </output>
          <input
            id="calc-bill" className="slider" type="range"
            min={800} max={15000} step={100}
            value={bill} onChange={(e) => setBill(Number(e.target.value))}
            style={{ ["--fill" as string]: `${((bill - 800) / 14200) * 100}%` }}
          />
        </div>

        <Choice
          label={calc.solar.houseLabel} name="house"
          options={calc.solar.houses} value={house} onChange={setHouse}
        />
        <Choice
          label={calc.solar.outageLabel} name="outage"
          options={calc.solar.outages} value={outage} onChange={setOutage}
        />
      </div>

      <div className="calc-out">
        <h3 className="t-h3">Что получается</h3>
        <div className="calc-figs">
          <span className="fig">
            <span className="fig-num">{r.kwp.toFixed(1).replace(".", ",")} кВт</span>
            <span className="fig-cap">мощность станции, {r.panels} модулей по 635 Вт</span>
          </span>
          <span className="fig">
            <span className="fig-num">{formatSom(r.yieldPerYear)}</span>
            <span className="fig-cap">кВт·ч выработки в год</span>
          </span>
          <span className="fig">
            <span className="fig-num">≈ {formatSom(savedSom)}</span>
            <span className="fig-cap">сом экономии в год</span>
          </span>
          <span className="fig">
            <span className="fig-num">{Math.round(r.coverage)} %</span>
            <span className="fig-cap">годового потребления закрывает станция</span>
          </span>
        </div>

        <div className="tbl-scroll" tabIndex={0} style={{ marginTop: 32 }}>
          <table className="tbl tbl-sticky">
            <tbody>
              <tr><td>Потребление по счёту</td><td className="num">{formatSom(r.kwhPerMonth)} кВт·ч в месяц</td></tr>
              <tr><td>Из них сверх порога 700 кВт·ч</td><td className="num">{Math.round(r.aboveThresholdShare)} % счёта</td></tr>
              <tr><td>Подходящий тип станции</td><td className="num">{type}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="t-small" style={{ marginTop: 12 }}>{type}: {typeWhy}.</p>

        {r.aboveThresholdShare > 35 && (
          <p className="t-sub calc-hint">
            Больше трети вашего счёта — это киловатты сверх порога по 2,94 сом.
            Станция срезает в первую очередь именно их.
          </p>
        )}
      </div>
    </div>
  );
}

function HeatCalc() {
  const [area, setArea] = useState(calc.heat.areaInitial);
  const [heating, setHeating] = useState("coal");
  const [phase, setPhase] = useState("3");
  const [dhw, setDhw] = useState("no");

  // «Не знаю» про сеть: не сужаем выдачу, но говорим, что это надо проверить
  const r = calcHeat(area, phase === "1" ? 1 : 3);
  // Горячая вода от системы доступна не у всех моделей линейки
  const models = dhw === "yes" ? r.models.filter((m) => m.dhw) : r.models;
  const dhwEmpty = dhw === "yes" && models.length === 0 && r.models.length > 0;
  const best = models[0] ?? null;

  return (
    <div className="calc">
      <div className="calc-form">
        <div className="calc-q">
          <label className="calc-label" htmlFor="calc-area">{calc.heat.areaLabel}</label>
          <output className="calc-value" htmlFor="calc-area">
            {area} <span className="widget-unit">м²</span>
          </output>
          <input
            id="calc-area" className="slider" type="range"
            min={calc.heat.areaMin} max={calc.heat.areaMax} step={calc.heat.areaStep}
            value={area} onChange={(e) => setArea(Number(e.target.value))}
            style={{
              ["--fill" as string]:
                `${((area - calc.heat.areaMin) / (calc.heat.areaMax - calc.heat.areaMin)) * 100}%`,
            }}
          />
        </div>

        <Choice
          label={calc.heat.heatingLabel} name="heating"
          options={calc.heat.heatings} value={heating} onChange={setHeating}
        />
        <Choice
          label={calc.heat.phaseLabel} name="phase"
          options={calc.heat.phases} value={phase} onChange={setPhase}
        />
        <Choice
          label={calc.heat.dhwLabel} name="dhw"
          options={calc.heat.dhws} value={dhw} onChange={setDhw}
        />
      </div>

      <div className="calc-out">
        <h3 className="t-h3">Что подходит</h3>

        {r.cascade && (
          <p className="t-warn" style={{ marginTop: 16 }}>
            ⚠️ Свыше 280 м² одна установка не закрывает: нужен каскад из двух машин.
            Такой проект считается индивидуально.
          </p>
        )}

        {phase === "?" && (
          <p className="t-small" style={{ marginTop: 16 }}>
            Тип сети мы уточним на замере. На 220 В доступны модели примерно до 7 кВт,
            и это ограничение чаще всего решает, какой проект вообще возможен.
          </p>
        )}

        {dhwEmpty && (
          <p className="t-warn" style={{ marginTop: 16 }}>
            ⚠️ Для этой площади моделей со встроенным баком горячей воды в линейке нет.
            Горячую воду можно сделать отдельным бойлером: подберём на замере.
          </p>
        )}

        {r.phaseLimited && (
          <p className="t-warn" style={{ marginTop: 16 }}>
            ⚠️ На однофазной сети 220 В подходящих моделей для этой площади нет.
            Понадобится трёхфазный ввод — это отдельная работа с энергокомпанией.
          </p>
        )}

        {best && !r.phaseLimited ? (
          <>
            <div className="calc-figs">
              <span className="fig">
                <span className="fig-num">{best.kw} кВт</span>
                <span className="fig-cap">тепловая мощность, {best.name}</span>
              </span>
              <span className="fig">
                <span className="fig-num">{best.phases === 1 ? "220 В" : "380 В"}</span>
                <span className="fig-cap">{best.phases === 1 ? "обычная сеть" : "три фазы"}</span>
              </span>
              <span className="fig">
                <span className="fig-num">{best.refrigerant}</span>
                <span className="fig-cap">хладагент</span>
              </span>
            </div>

            <div className="tbl-scroll" tabIndex={0} style={{ marginTop: 32 }}>
              <table className="tbl tbl-sticky">
                <thead>
                  <tr><th>Модель</th><th className="num">Мощность</th><th className="num">Сеть</th><th>Особенность</th></tr>
                </thead>
                <tbody>
                  {models.map((m) => (
                    <tr key={m.name}>
                      <td>{m.name}</td>
                      <td className="num">{m.kw} кВт</td>
                      <td className="num">{m.phases === 1 ? "220 В" : "380 В"}</td>
                      <td className="t-small">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          !r.cascade && !r.phaseLimited && (
            <p className="t-sub" style={{ marginTop: 16 }}>
              Для этой площади нужен индивидуальный подбор — оставьте заявку,
              инженер посчитает теплопотери.
            </p>
          )
        )}

        {heating === "gas" && (
          <p className="t-sub calc-hint">
            У вас газ. Если он уже подведён и работает — в эксплуатации котёл обычно
            дешевле насоса, и мы скажем это на замере. Насос имеет смысл, если газа
            в доме фактически нет, давления не хватает или подключение дорого.
          </p>
        )}
      </div>
    </div>
  );
}

function Choice({
  label, name, options, value, onChange,
}: {
  label: string;
  name: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="calc-q choice">
      <legend className="calc-label">{label}</legend>
      <div className="choice-row">
        {options.map((o) => (
          <label key={o.id} className={`choice-item ${value === o.id ? "is-on" : ""}`}>
            <input
              type="radio" name={name} value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
