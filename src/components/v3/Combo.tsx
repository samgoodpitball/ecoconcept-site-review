import { combo } from "@/content/home-v3";
import { calcSolar } from "@/lib/calc-v2";

/**
 * ЯКОРЬ 1. Первая тёмная секция страницы.
 * Доля дорогого блока считается той же функцией, что и калькулятор,
 * чтобы число в тексте не разошлось с числом в расчёте.
 */
export function Combo() {
  const share = Math.round(calcSolar(3000).aboveThresholdShare);

  return (
    <section className="v3-sec v3-c" id="combo">
      <div className="v3-wrap">
        <div className="split">
          <div className="split-text">
            <h2 className="t-h2">{combo.title}</h2>
            <hr className="rule-accent" style={{ marginTop: 24 }} />
            <p className="t-sub v3-measure">{combo.body}</p>
            <p className="t-small" style={{ marginTop: 24 }}>{combo.note}</p>
          </div>

          <div className="split-media combo-figure">
            <span className="combo-num">{share} %</span>
            <span className="fig-cap combo-cap">{combo.figureCaption}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
