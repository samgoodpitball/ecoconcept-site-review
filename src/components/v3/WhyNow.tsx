import { whyNow } from "@/content/home-v3";
import { TariffChart } from "./graphics/TariffChart";

/**
 * Рыночный контекст. Третья строка таблицы — честное признание про газ:
 * правило восьмое из design-principles. Ни один конкурент этого не пишет.
 */
export function WhyNow() {
  return (
    <section className="v3-sec v3-b">
      <div className="v3-wrap">
        <div className="split">
          <div className="split-text">
            <h2 className="t-h2">{whyNow.title}</h2>
            <hr className="rule-accent" style={{ marginTop: 24 }} />
            <p className="t-sub v3-measure">{whyNow.lead}</p>
          </div>
          <div className="split-media">
            <TariffChart />
            <p className="t-small" style={{ marginTop: 12 }}>{whyNow.chartCaption}</p>
          </div>
        </div>

        <div className="tbl-scroll" tabIndex={0} style={{ marginTop: 48 }}>
          <table className="tbl tbl-sticky">
            <tbody>
              {whyNow.rows.map((r) => (
                <tr key={r.fact}>
                  <td style={{ width: "26%", fontWeight: 500 }}>{r.fact}</td>
                  <td className="num" style={{ width: "16%", fontWeight: 600 }}>{r.figure}</td>
                  <td>{r.means}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
