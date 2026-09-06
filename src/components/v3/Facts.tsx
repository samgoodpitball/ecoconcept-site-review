import { facts } from "@/content/home-v3";

/**
 * Полоса результатов. Не рендерится, пока нет реальных цифр о компании.
 * «Более 100 довольных клиентов» — ровно то, что запрещено правилом первым.
 */
export function Facts() {
  if (!facts) return null;

  return (
    <section className="v3-sec v3-a">
      <div className="v3-wrap facts-grid">
        {facts.map((f) => (
          <span key={f.caption} className="fig">
            <span className="fig-num">{f.value}</span>
            <span className="fig-cap">{f.caption}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
