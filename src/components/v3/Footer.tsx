import Link from "next/link";
import { footer, utility } from "@/content/home-v3";

/** Футер — продолжение третьего якоря, отдельной заливки не имеет. */
export function Footer() {
  return (
    <footer className="ft">
      <div className="v3-wrap">
        <hr className="rule" />
        <div className="ft-grid">
          <div className="ft-brand">
            <span className="ft-logo">Eco<span className="hd-logo-accent">Concept</span></span>
            <p className="t-small ft-note">
              Солнечные станции и тепловые насосы под ключ. Бишкек и область.
            </p>
          </div>

          {footer.columns.map((c) => (
            <div key={c.title}>
              <h3 className="ft-col-title">{c.title}</h3>
              <ul className="ft-list">
                {c.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className="ft-link">{i.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="ft-col-title">Контакты</h3>
            <ul className="ft-list">
              <li><a href={utility.phoneHref} className="ft-link">{utility.phone}</a></li>
              <li><a href={utility.whatsapp} className="ft-link" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><span className="t-small">{utility.hours}</span></li>
            </ul>
          </div>
        </div>

        <hr className="rule" />
        <div className="ft-bottom">
          <span className="t-small">© {new Date().getFullYear()} EcoConcept</span>
          <Link href={footer.legalHref} className="ft-link">{footer.legal}</Link>
        </div>
      </div>
    </footer>
  );
}
