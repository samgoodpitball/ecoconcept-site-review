import { team } from "@/content/home-v3";

/**
 * Доверие строится на квалификации бригады, а не на бренде оборудования — Heat Geek.
 * Сроки гарантии не выводятся, пока не подтверждены документом поставщика.
 */
export function Team() {
  return (
    <section className="v3-sec v3-a">
      <div className="v3-wrap">
        <h2 className="t-h2">{team.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />

        <div className="team-grid">
          <div>
            <h3 className="t-h3">{team.crews.title}</h3>
            <p className="t-sub" style={{ marginTop: 12 }}>{team.crews.body}</p>
          </div>
          <div>
            <h3 className="t-h3">{team.service.title}</h3>
            <p className="t-sub" style={{ marginTop: 12 }}>{team.service.body}</p>
            {team.service.reaction && (
              <span className="fig" style={{ marginTop: 16, display: "block" }}>
                <span className="fig-num">{team.service.reaction}</span>
                <span className="fig-cap">время реакции сервиса</span>
              </span>
            )}
          </div>
        </div>

        <h3 className="t-h3" style={{ marginTop: 48 }}>{team.equipment.title}</h3>
        <div className="tbl-scroll" tabIndex={0} style={{ marginTop: 16 }}>
          <table className="tbl tbl-sticky">
            <thead>
              <tr>
                <th>Бренд</th>
                <th>Что поставляет</th>
                {team.equipment.warrantyNote && <th className="num">Гарантия</th>}
              </tr>
            </thead>
            <tbody>
              {team.equipment.brands.map((b) => (
                <tr key={b.name}>
                  <td style={{ fontWeight: 500 }}>{b.name}</td>
                  <td>{b.what}</td>
                  {team.equipment.warrantyNote && <td className="num">{b.warranty ?? "—"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
