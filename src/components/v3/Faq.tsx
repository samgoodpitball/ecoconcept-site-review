import { faq } from "@/content/home-v3";

/** Вопросы сформулированы как вопросы человека, а не как темы. Приём Kensa. */
export function Faq() {
  return (
    <section className="v3-sec v3-b">
      <div className="v3-wrap">
        <h2 className="t-h2">{faq.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <div className="faq">
          {faq.items.map((i) => (
            <details key={i.q} className="disc">
              <summary>{i.q}</summary>
              <div className="disc-body"><p className="t-sub">{i.a}</p></div>
            </details>
          ))}
        </div>
        <p style={{ marginTop: 32 }}>
          Не нашли ответ — <a className="lnk" href="#calc">посчитайте свой случай</a> или спросите инженера.
        </p>
      </div>
    </section>
  );
}
