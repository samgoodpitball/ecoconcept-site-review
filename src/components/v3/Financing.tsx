import { financing } from "@/content/home-v3";

/**
 * ЯКОРЬ 2. Госкредит — главная находка ресёрча, о ней не пишет ни один конкурент.
 * Дисклеймер обязателен, пока условия не подтверждены звонком в Минфин.
 */
export function Financing() {
  return (
    <section className="v3-sec v3-c" id="financing">
      <div className="v3-wrap">
        <h2 className="t-h2">{financing.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <p className="t-sub v3-measure">{financing.lead}</p>

        <div className="fin-figs">
          {financing.figures.map((f) => (
            <span key={f.caption} className="fig">
              <span className="fig-num">{f.value}</span>
              <span className="fig-cap">{f.caption}</span>
            </span>
          ))}
        </div>

        <div className="fin-help">
          <h3 className="t-h3">{financing.help.title}</h3>
          <p className="t-sub v3-measure" style={{ marginTop: 12 }}>{financing.help.body}</p>
          <a href={financing.cta.href} className="btn btn-primary" style={{ marginTop: 24 }}>
            {financing.cta.label}
          </a>
        </div>

        <p className="fin-disclaimer">{financing.disclaimer}</p>
      </div>
    </section>
  );
}
