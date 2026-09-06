import { projects } from "@/content/home-v3";

/** Не рендерится, пока нет фотографий своих объектов. */
export function Projects() {
  if (!projects) return null;

  return (
    <section className="v3-sec v3-b">
      <div className="v3-wrap">
        <h2 className="t-h2">Объекты</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />
        <div className="prj-grid">
          {projects.map((p) => (
            <article key={p.city + p.power} className="prj">
              <div className="prj-img" style={{ backgroundImage: `url(${p.image})` }} />
              <h3 className="t-h3" style={{ marginTop: 16 }}>{p.city}, {p.type}</h3>
              <p className="t-small">{p.power}</p>
              <p className="t-sub" style={{ marginTop: 8 }}>
                Было: {p.before}. Стало: {p.result}.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
