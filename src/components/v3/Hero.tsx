"use client";

import { useState } from "react";
import { hero } from "@/content/home-v3";
import { calcSolar, formatSom, TARIFF_ABOVE, TARIFF_BASE } from "@/lib/calc-v2";
import { HouseScheme } from "./graphics/HouseScheme";

/**
 * Первый экран. Приём Palmetto: один вопрос с ползунком и мгновенный ответ
 * вместо лид-формы. Человек получает число раньше, чем у него что-то просят.
 */
export function Hero() {
  const [bill, setBill] = useState(hero.widget.initial);
  const r = calcSolar(bill);

  // Экономия в год: счёт, который станция закрывает своей выработкой.
  const savedKwh = Math.min(r.yieldPerYear, r.kwhPerYear);
  const savedSom = savedKwh * (r.aboveThresholdShare > 40 ? TARIFF_ABOVE : TARIFF_BASE);

  return (
    <section className="hero">
      <div className="v3-wrap hero-in">
        <div className="hero-text">
          <h1 className="t-display">{hero.title}</h1>
          <p className="t-sub hero-sub">{hero.sub}</p>

          <div className="widget">
            <label className="widget-q" htmlFor="hero-bill">
              {hero.widget.question}
            </label>

            <output className="widget-value" htmlFor="hero-bill">
              {formatSom(bill)} <span className="widget-unit">сом</span>
            </output>

            <input
              id="hero-bill"
              className="slider"
              type="range"
              min={hero.widget.min}
              max={hero.widget.max}
              step={hero.widget.step}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              style={{
                ["--fill" as string]:
                  `${((bill - hero.widget.min) / (hero.widget.max - hero.widget.min)) * 100}%`,
              }}
            />

            <div className="widget-out">
              <span className="fig">
                <span className="fig-num">{r.kwp.toFixed(1).replace(".", ",")} кВт</span>
                <span className="fig-cap">станция из {r.panels} модулей</span>
              </span>
              <span className="fig">
                <span className="fig-num">≈ {formatSom(savedSom)}</span>
                <span className="fig-cap">сом экономии в год</span>
              </span>
            </div>

            <a href="#calc" className="btn btn-primary widget-cta">
              {hero.widget.cta}
            </a>
          </div>
        </div>

        <div className="hero-media">
          <HouseScheme />
        </div>
      </div>
    </section>
  );
}
