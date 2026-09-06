"use client";

import { useState } from "react";

/**
 * Схема работы насоса с переключателем зима/лето. Приём Dandelion:
 * одна иллюстрация объясняет оба режима.
 * Это авторский момент движения на странице — единственный, кроме отклика калькулятора.
 */
export function SeasonScheme({ winter, summer }: { winter: string; summer: string }) {
  const [isWinter, setWinter] = useState(true);

  return (
    <figure className="scheme">
      <div className="scheme-switch" role="group" aria-label="Режим работы">
        <button
          className={`scheme-btn ${isWinter ? "is-on" : ""}`}
          onClick={() => setWinter(true)}
          aria-pressed={isWinter}
        >
          {winter}
        </button>
        <button
          className={`scheme-btn ${!isWinter ? "is-on" : ""}`}
          onClick={() => setWinter(false)}
          aria-pressed={!isWinter}
        >
          {summer}
        </button>
      </div>

      <svg viewBox="0 0 480 280" role="img" aria-label={isWinter
        ? "Зимой насос забирает тепло с улицы и отдаёт его в дом"
        : "Летом насос забирает тепло из дома и отдаёт его на улицу"}>
        {/* дом: контур */}
        <path d="M250 120 L330 70 L410 120 L410 230 L250 230 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M250 120 L330 70 L410 120" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <rect x="300" y="170" width="30" height="60" fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />
        <rect x="350" y="150" width="34" height="28" fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />

        {/* наружный блок */}
        <rect x="60" y="150" width="90" height="70" rx="4" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="105" cy="185" r="22" fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />
        <path d="M105 168 A17 17 0 0 1 120 193 M105 168 A17 17 0 0 0 90 193 M120 193 A17 17 0 0 1 90 193"
              fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />

        {/* поток: направление меняется */}
        <g stroke={isWinter ? "var(--accent-bright)" : "#3f7fb8"} strokeWidth="2.5" fill="none">
          {isWinter ? (
            <>
              <path d="M155 175 L240 175" />
              <path d="M232 168 L240 175 L232 182" />
            </>
          ) : (
            <>
              <path d="M240 175 L155 175" />
              <path d="M163 168 L155 175 L163 182" />
            </>
          )}
        </g>

        {/* воздух снаружи */}
        <g stroke="var(--ink-2)" strokeWidth="1.2" fill="none" opacity="0.7">
          <path d="M30 120 h50 M30 132 h34 M30 144 h42" />
        </g>

        <text x="105" y="240" textAnchor="middle" fontSize="12" fill="var(--ink-2)">наружный блок</text>
        <text x="330" y="255" textAnchor="middle" fontSize="12" fill="var(--ink-2)">дом</text>
        <text x="197" y="163" textAnchor="middle" fontSize="12" fill="var(--ink)" fontWeight="500">
          {isWinter ? "тепло" : "жара"}
        </text>
        <text x="55" y="105" fontSize="12" fill="var(--ink-2)">
          {isWinter ? "−25 °C" : "+35 °C"}
        </text>
        <text x="285" y="105" fontSize="12" fill="var(--ink-2)">
          {isWinter ? "+22 °C" : "+24 °C"}
        </text>
      </svg>

      <figcaption className="t-small scheme-cap">
        {isWinter
          ? "Зимой насос забирает тепло из наружного воздуха даже в мороз и отдаёт его в систему отопления. Из 1 кВт·ч электричества получается 3–4 кВт·ч тепла."
          : "Летом цикл разворачивается: та же машина забирает тепло из дома и сбрасывает его на улицу. Отдельный кондиционер не нужен."}
      </figcaption>
    </figure>
  );
}
