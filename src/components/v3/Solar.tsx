import { solar } from "@/content/home-v3";

/** Главный продуктовый блок: сравнительная таблица вместо карточек с иконками. */
export function Solar() {
  return (
    <section className="v3-sec v3-b" id="solar">
      <div className="v3-wrap">
        <h2 className="t-h2">{solar.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <p className="t-sub v3-measure">{solar.lead}</p>

        <div className="tbl-scroll" tabIndex={0} style={{ marginTop: 40 }}>
          <table className="tbl tbl-sticky">
            <thead>
              <tr>{solar.table.head.map((h, i) => <th key={i} className={i ? "num" : ""}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {solar.table.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i} className={i ? "num" : ""} style={i === 0 ? { fontWeight: 500 } : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="figs-row">
          {solar.figures.map((f) => (
            <span key={f.caption} className="fig">
              <span className="fig-num">{f.value}</span>
              <span className="fig-cap">{f.caption}</span>
            </span>
          ))}
        </div>

        <p style={{ marginTop: 32 }}>
          <a className="lnk" href={solar.link.href}>{solar.link.label}</a>
        </p>
      </div>
    </section>
  );
}
