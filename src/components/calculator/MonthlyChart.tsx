"use client";

import { useId, useState } from "react";
import { monthLabels } from "@/lib/calculatorConfig";

/**
 * Выработка по месяцам: один ряд столбцов в брендовом зелёном плюс нейтральная
 * пунктирная линия среднемесячного потребления. Ряды различаются и цветом,
 * и формой, и прямыми подписями — идентичность не держится на одном цвете.
 */
export default function MonthlyChart({
  values,
  reference,
  referenceLabel = "Ваше потребление",
}: {
  values: number[];
  reference?: number;
  referenceLabel?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const titleId = useId();

  const max = Math.max(...values, reference ?? 0);
  if (!isFinite(max) || max <= 0) return null;

  const chartH = 190;
  const scale = (v: number) => (v / max) * chartH;
  const peak = values.indexOf(Math.max(...values));
  const low = values.indexOf(Math.min(...values));

  const fmt = (v: number) => Math.round(v).toLocaleString("ru-RU");

  return (
    <figure className="mt-2">
      <figcaption id={titleId} className="text-[15px] font-bold text-graphite">
        Выработка по месяцам, кВт·ч
      </figcaption>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[4px] bg-eco" aria-hidden="true" />
          Выработка станции
        </span>
        {reference != null && (
          <span className="flex items-center gap-1.5">
            <svg width="18" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="18" y2="4" stroke="#55605A" strokeWidth="2" strokeDasharray="4 3" />
            </svg>
            {referenceLabel}
          </span>
        )}
      </div>

      <div className="relative mt-4 select-none" style={{ height: chartH + 34 }} aria-hidden="true">
        {/* Ненавязчивая сетка */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <div
            key={f}
            className="absolute inset-x-0 border-t border-line"
            style={{ bottom: 34 + chartH * f }}
          />
        ))}
        <div className="absolute inset-x-0 border-t border-line" style={{ bottom: 34 }} />

        {reference != null && reference <= max && (
          <div
            className="absolute inset-x-0 border-t-2 border-dashed"
            style={{ bottom: 34 + scale(reference), borderColor: "#55605A" }}
          />
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end gap-[2px]" style={{ height: chartH + 34 }}>
          {values.map((v, i) => (
            <div
              key={i}
              className="relative flex flex-1 flex-col items-center justify-end"
              style={{ height: "100%" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {hover === i && (
                <div className="absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-[12px] bg-graphite px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg">
                  {monthLabels[i]}: {fmt(v)} кВт·ч
                </div>
              )}
              {/* Прямые подписи только на пике и минимуме — не на каждом столбце.
                  Позиционируем абсолютно, чтобы подпись не сдвигала столбец и месяц. */}
              {(i === peak || i === low) && hover !== i && (
                <span
                  className="pointer-events-none absolute text-[11px] font-semibold text-muted"
                  style={{ bottom: 34 + scale(v) + 4 }}
                >
                  {fmt(v)}
                </span>
              )}
              <div
                className="w-full rounded-t-[4px] bg-eco transition-opacity"
                style={{ height: scale(v), opacity: hover === null || hover === i ? 1 : 0.55 }}
              />
              <span className="mt-2 h-[22px] text-[11px] text-muted">{monthLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Доступная альтернатива графику */}
      <details className="mt-3">
        <summary className="cursor-pointer text-[13px] text-eco-dark underline underline-offset-4">
          Показать данные таблицей
        </summary>
        <div className="mt-3 overflow-x-auto rounded-[12px] border border-line">
          <table className="w-full min-w-[520px] border-collapse text-[13px]" aria-labelledby={titleId}>
            <thead>
              <tr className="bg-off text-left">
                <th scope="col" className="px-3 py-2 font-medium text-muted">Месяц</th>
                {monthLabels.map((m) => (
                  <th key={m} scope="col" className="px-2 py-2 font-medium text-muted">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <th scope="row" className="px-3 py-2 text-left font-medium text-muted">кВт·ч</th>
                {values.map((v, i) => (
                  <td key={i} className="px-2 py-2 font-medium text-ink">{fmt(v)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
