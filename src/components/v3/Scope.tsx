import { scope } from "@/content/home-v3";
import { IconCheck, IconMinus } from "./icons";

/** Границы работ на сайте, а не на объекте. Правило восьмое: честность как приём. */
export function Scope() {
  return (
    <section className="v3-sec v3-b">
      <div className="v3-wrap">
        <h2 className="t-h2">{scope.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <p className="t-sub v3-measure">{scope.lead}</p>

        <div className="scope-grid">
          <div>
            <h3 className="t-h3">{scope.included.title}</h3>
            <ul className="lst">
              {scope.included.items.map((i) => (
                <li key={i} className="lst-item">
                  <IconCheck size={20} className="lst-icon lst-yes" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="t-h3">{scope.excluded.title}</h3>
            <ul className="lst">
              {scope.excluded.items.map((i) => (
                <li key={i} className="lst-item">
                  <IconMinus size={20} className="lst-icon lst-no" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
