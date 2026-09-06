import { heat } from "@/content/home-v3";
import { SeasonScheme } from "./graphics/SeasonScheme";

/**
 * Компактнее солнца — это и есть 40 из 60/40.
 * Возражения стоят явным списком, а не спрятаны в FAQ. Приём Octopus.
 */
export function Heat() {
  return (
    <section className="v3-sec v3-b" id="heat">
      <div className="v3-wrap">
        <div className="split">
          <div className="split-text">
            <h2 className="t-h2">{heat.title}</h2>
            <hr className="rule-accent" style={{ marginTop: 24 }} />
            <p className="t-sub v3-measure">{heat.lead}</p>

            <span className="fig" style={{ marginTop: 32, display: "block" }}>
              <span className="fig-num">{heat.figure.value}</span>
              <span className="fig-cap">{heat.figure.caption}</span>
            </span>

            <div className="cold">
              <h3 className="t-h3">{heat.cold.title}</h3>
              <p className="cold-claim">{heat.cold.claim}</p>
              <p className="t-sub v3-measure">{heat.cold.body}</p>
            </div>
          </div>

          <div className="split-media">
            <SeasonScheme winter={heat.scheme.winter} summer={heat.scheme.summer} />
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <h3 className="t-h3">{heat.objections.title}</h3>
          <div className="disc-wrap" style={{ marginTop: 16 }}>
            {heat.objections.items.map((o) => (
              <details key={o.q} className="disc">
                <summary>{o.q}</summary>
                <div className="disc-body"><p className="t-sub">{o.a}</p></div>
              </details>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 32 }}>
          <a className="lnk" href={heat.link.href}>{heat.link.label}</a>
        </p>
      </div>
    </section>
  );
}
