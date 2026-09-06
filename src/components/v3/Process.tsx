import { process } from "@/content/home-v3";

/**
 * Четыре шага. Нумерация здесь не украшение: это настоящая последовательность,
 * и только поэтому цифры допустимы.
 */
export function Process() {
  return (
    <section className="v3-sec v3-a">
      <div className="v3-wrap">
        <h2 className="t-h2">{process.title}</h2>
        <hr className="rule-accent" style={{ marginTop: 24 }} />

        <ol className="steps">
          {process.steps.map((s) => (
            <li key={s.n} className="step">
              <span className="step-n">{s.n}</span>
              <div className="step-body">
                <h3 className="t-h3">{s.title}</h3>
                {s.figure && <span className="step-fig">{s.figure}</span>}
                <p className="t-sub">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="t-sub v3-measure" style={{ marginTop: 32 }}>{process.note}</p>
      </div>
    </section>
  );
}
