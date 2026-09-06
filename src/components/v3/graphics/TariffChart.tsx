/**
 * График блочного тарифа: две линии, базовый блок и блок сверх 700 кВт·ч.
 * Чертёжная графика, не фотография. Числа — из research-market.
 */
export function TariffChart() {
  // Ось X: 2026…2030. Ось Y: сом за кВт·ч.
  const years = [2026, 2027, 2028, 2029, 2030];
  const base = [1.64, 1.84, 2.04, 2.24, 2.44];
  const above = [2.94, 3.24, 3.54, 3.84, 4.14];

  const W = 480, H = 260, padL = 44, padR = 16, padT = 20, padB = 34;
  const maxY = 4.5;
  const x = (i: number) => padL + (i * (W - padL - padR)) / (years.length - 1);
  const y = (v: number) => H - padB - (v / maxY) * (H - padT - padB);
  const path = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Рост тарифа на электричество с 2026 по 2030 год: базовый блок с 1,64 до 2,44 сом, блок сверх 700 киловатт-часов с 2,94 до 4,14 сом">
        {[0, 1, 2, 3, 4].map((v) => (
          <g key={v}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
            <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--ink-2)">{v}</text>
          </g>
        ))}

        <path d={path(above)} fill="none" stroke="var(--accent-bright)" strokeWidth="2.5" />
        <path d={path(base)} fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeDasharray="5 4" />

        {above.map((v, i) => <circle key={`a${i}`} cx={x(i)} cy={y(v)} r="3.5" fill="var(--accent-bright)" />)}
        {base.map((v, i) => <circle key={`b${i}`} cx={x(i)} cy={y(v)} r="3" fill="var(--ink-2)" />)}

        <text x={x(0)} y={y(above[0]) - 12} fontSize="12" fill="var(--ink)" fontWeight="500">2,94</text>
        <text x={x(4)} y={y(above[4]) - 12} textAnchor="end" fontSize="12" fill="var(--ink)" fontWeight="500">4,14</text>
        <text x={x(0)} y={y(base[0]) + 20} fontSize="12" fill="var(--ink-2)">1,64</text>

        {years.map((yr, i) => (
          <text key={yr} x={x(i)} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--ink-2)">{yr}</text>
        ))}
      </svg>

      <figcaption className="chart-legend">
        <span className="lg"><i className="lg-line lg-above" />сверх 700 кВт·ч в месяц</span>
        <span className="lg"><i className="lg-line lg-base" />до 700 кВт·ч в месяц</span>
      </figcaption>
    </figure>
  );
}
