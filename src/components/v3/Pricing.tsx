import { pricing } from "@/content/home-v3";

/**
 * Таблица цены с вычетом господдержки и строкой «итого». Приём Elephant Energy.
 * Не рендерится, пока заказчик не разрешил публиковать диапазоны.
 */
export function Pricing() {
  if (!pricing) return null;

  return (
    <section className="v3-sec v3-a" id="pricing">
      <div className="v3-wrap">
        <h2 className="t-h2">{pricing.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <div className="tbl-scroll" tabIndex={0}>
          <table className="tbl">
            <thead>
              <tr><th></th><th className="num">Солнечная станция</th><th className="num">Тепловой насос</th></tr>
            </thead>
            <tbody>
              {pricing.rows.map((r) => (
                <tr key={r.label}>
                  <td style={{ fontWeight: 500 }}>{r.label}</td>
                  <td className="num">{r.solar}</td>
                  <td className="num">{r.heat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
