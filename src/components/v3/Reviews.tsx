import { reviews } from "@/content/home-v3";

/** Не рендерится, пока нет отзывов. Обязателен хотя бы один про зиму. */
export function Reviews() {
  if (!reviews) return null;

  return (
    <section className="v3-sec v3-a">
      <div className="v3-wrap">
        <h2 className="t-h2">Отзывы</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <div className="rev-grid">
          {reviews.map((r) => (
            <blockquote key={r.name + r.date} className="rev">
              <p className="t-body">{r.text}</p>
              <footer className="rev-foot">
                <span style={{ fontWeight: 500 }}>{r.name}</span>
                <span className="t-small">{r.city} · {r.date}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
