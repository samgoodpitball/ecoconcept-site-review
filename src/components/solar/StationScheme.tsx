import { solar } from "@/content/solar";

/**
 * Чертёж двух схем станции — переработка третьего захода.
 *
 * Прежний вариант (ряд иконок со стрелками) заказчик назвал невыразительным.
 * Теперь это электросхема в духе однолинейных чертежей: миллиметровочная
 * подложка, блоки-узлы с моно-подписями, ортогональные трассы с точками
 * соединений и — главное — коммутационные аппараты прямо в графике.
 *
 * Состояние «когда сети нет» показано самой схемой, а не подписью:
 * рубильник на вводе сети разомкнут в обеих схемах, но у сетевой вместе с
 * ним разомкнут и выход инвертора (станция обязана отключиться — терракота,
 * дом обесточен), а у гибридной замкнутая жирная трасса батарея → дом
 * держит питание (зелёная). Разница видна за секунду по цвету правой
 * половины чертежа.
 *
 * Ни одного нового утверждения: узлы — состав комплекта из таблицы ниже,
 * подписи сценария — дословные строки «Когда сети нет» из
 * src/content/solar.ts. Текст остаётся таблице; чертёж — конспект.
 */

const outageRow = solar.how.rows.find((r) => r.label === "Когда сети нет");

const INK = "var(--color-ink)";
const MUT = "var(--color-muted)";
const ECO = "var(--color-eco)";
const HEAT = "var(--color-heat)";
const LINE = "var(--color-line)";

/** Моно-подпись чертежа */
function Label({ x, y, children, tone = MUT, anchor = "middle" }: {
  x: number; y: number; children: string; tone?: string; anchor?: "middle" | "start" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={tone}
      style={{ font: "600 10.5px var(--font-mono)", letterSpacing: "0.12em" }}
    >
      {children.toUpperCase()}
    </text>
  );
}

/** Узел-блок схемы */
function Block({ x, y, w, h, tone = INK }: { x: number; y: number; w: number; h: number; tone?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx="4" fill="#fff" stroke={tone} strokeWidth="1.5" />;
}

/** Точка соединения трасс */
function Dot({ x, y, tone = INK }: { x: number; y: number; tone?: string }) {
  return <circle cx={x} cy={y} r="2.4" fill={tone} />;
}

/** Стрелка направления потока на трассе */
function Arrow({ x, y, dir = "r", tone = ECO }: { x: number; y: number; dir?: "r" | "d" | "u"; tone?: string }) {
  const d =
    dir === "r" ? `M${x - 5} ${y - 4} L${x + 1} ${y} L${x - 5} ${y + 4}`
    : dir === "d" ? `M${x - 4} ${y - 5} L${x} ${y + 1} L${x + 4} ${y - 5}`
    : `M${x - 4} ${y + 5} L${x} ${y - 1} L${x + 4} ${y + 5}`;
  return <path d={d} fill="none" stroke={tone} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />;
}

/**
 * Рубильник (разъединитель) на вертикальной трассе.
 * closed — плечо лежит на линии; open — отведено на 40°, цепь разорвана.
 */
function Switch({ x, y, closed, tone }: { x: number; y: number; closed: boolean; tone: string }) {
  return (
    <g stroke={tone} strokeWidth="1.6" strokeLinecap="round">
      <circle cx={x} cy={y} r="2.6" fill="#fff" />
      <circle cx={x} cy={y + 20} r="2.6" fill="#fff" />
      {closed ? (
        <line x1={x} y1={y + 2.6} x2={x} y2={y + 17.4} />
      ) : (
        <line x1={x} y1={y + 17.4} x2={x + 12} y2={y + 4} />
      )}
    </g>
  );
}

/** Солнце над панелью */
function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={MUT} strokeWidth="1.5" strokeLinecap="round" fill="none">
      <circle cx={x} cy={y} r="9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={x + Math.cos(r) * 13}
            y1={y + Math.sin(r) * 13}
            x2={x + Math.cos(r) * (a % 90 === 0 ? 18 : 16)}
            y2={y + Math.sin(r) * (a % 90 === 0 ? 18 : 16)}
          />
        );
      })}
    </g>
  );
}

/** Одна панель чертежа */
function Sheet({
  title,
  hybrid,
  outageText,
}: {
  title: string;
  hybrid: boolean;
  outageText?: string;
}) {
  /* Цвет правой половины — мгновенный ответ схемы: терракота (обесточено)
     или зелень (дом работает). */
  const emerg = hybrid ? ECO : HEAT;

  return (
    <figure className="min-w-[460px] flex-1">
      <div className="overflow-hidden rounded-[10px] border border-line bg-white">
        <svg viewBox="0 0 640 330" className="block w-full" role="img" aria-label={title}>
          {/* Миллиметровка: мелкая клетка 10, крупная 50 */}
          <defs>
            <pattern id="mm" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0H0v10" fill="none" stroke={LINE} strokeWidth="0.4" opacity="0.55" />
            </pattern>
            <pattern id="cm" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0H0v50" fill="none" stroke={LINE} strokeWidth="0.8" opacity="0.8" />
            </pattern>
          </defs>
          <rect width="640" height="330" fill="url(#mm)" />
          <rect width="640" height="330" fill="url(#cm)" />

          {/* ── солнце и панель */}
          <Sun x={78} y={52} />
          <g stroke={INK} strokeWidth="1.5" fill="#fff">
            <path d="M120 88 L232 88 L252 132 L140 132 Z" />
            <path d="M130 110 L242 110M158 88 L150 132M196 88 L192 132" fill="none" />
          </g>
          <Label x={186} y={150}>панели</Label>

          {/* трасса панель → инвертор (постоянный ток) */}
          <path d="M186 132v46" fill="none" stroke={ECO} strokeWidth="2" />
          <Arrow x={186} y={172} dir="d" />

          {/* ── инвертор */}
          <Block x={136} y={180} w={100} h={56} />
          <path d="M150 208c6-11 12-11 18 0s12 11 18 0" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
          <Label x={186} y={254}>инвертор</Label>

          {/* трасса инвертор → дом; у сетевой при аварии этот участок разомкнут */}
          <path d="M236 208h84" fill="none" stroke={ECO} strokeWidth="2" />
          <Arrow x={312} y={208} dir="r" />
          <Dot x={352} y={208} />
          {!hybrid && (
            /* выход инвертора обязан отключиться вместе с сетью */
            <g>
              <line x1={268} y1={196} x2={288} y2={220} stroke={HEAT} strokeWidth="1.8" strokeLinecap="round" />
              <line x1={288} y1={196} x2={268} y2={220} stroke={HEAT} strokeWidth="1.8" strokeLinecap="round" />
            </g>
          )}

          {/* ── дом */}
          <g stroke={emerg} strokeWidth="1.6" fill="#fff">
            <path d="m352 160 46-34 46 34" strokeLinejoin="round" />
            <path d="M364 152v60h68v-60" />
            <path d="M384 212v-24h20v24" />
          </g>
          <Label x={412} y={230} tone={emerg}>{hybrid ? "дом работает" : "дом обесточен"}</Label>

          {/* ── ввод внешней сети: опора + рубильник (разомкнут в сценарии) */}
          <g stroke={MUT} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M560 44 570 108M580 44 570 108" transform="translate(0 0)" />
            <path d="M548 56h44M554 72h32" />
            <path d="M548 56v8M592 56v8M554 72v8M586 72v8" />
          </g>
          <Label x={570} y={126}>сеть</Label>
          <path d="M570 132v18" fill="none" stroke={MUT} strokeWidth="1.6" />
          <Switch x={570} y={150} closed={false} tone={HEAT} />
          <path d="M570 172v36h-138" fill="none" stroke={MUT} strokeWidth="1.6" strokeDasharray="5 5" />
          <Label x={505} y={222} tone={HEAT}>сети нет</Label>

          {hybrid ? (
            <>
              {/* излишек: инвертор → батарея (заряд), штрих */}
              <path d="M152 236v34" fill="none" stroke={ECO} strokeWidth="1.6" strokeDasharray="5 5" />
              <Arrow x={152} y={264} dir="d" />
              {/* ── батарея */}
              <Block x={132} y={272} w={108} h={38} tone={ECO} />
              <g stroke={ECO} strokeWidth="1.5">
                <line x1={150} y1={282} x2={150} y2={300} />
                <line x1={166} y1={282} x2={166} y2={300} />
                <line x1={182} y1={282} x2={182} y2={300} />
                <line x1={244} y1={286} x2={244} y2={296} />
              </g>
              <Label x={252} y={282} tone={ECO} anchor="start">батарея</Label>
              {/* аварийное питание: батарея → дом, жирная зелёная */}
              <path d="M240 291h124v-79" fill="none" stroke={ECO} strokeWidth="3" />
              <Arrow x={364} y={220} dir="u" tone={ECO} />
            </>
          ) : (
            <>
              {/* излишек: дом → сеть (продажа), штрих зелёный по нижней трассе */}
              <path d="M432 176h74v-24" fill="none" stroke={ECO} strokeWidth="1.6" strokeDasharray="5 5" />
              <Arrow x={506} y={158} dir="u" tone={ECO} />
              <Label x={436} y={170} anchor="start">излишек</Label>
            </>
          )}

          {/* ── штамп чертежа */}
          <g>
            <rect x={422} y={281} width={210} height={41} fill="#fff" stroke={INK} strokeWidth="1.2" />
            <line x1={422} y1={301} x2={632} y2={301} stroke={LINE} strokeWidth="1" />
            <Label x={432} y={295} anchor="start" tone={INK}>{title}</Label>
            <Label x={432} y={315} anchor="start">ecoconcept · схема станции</Label>
          </g>
        </svg>
      </div>

      {outageText && (
        <figcaption className="mt-3 flex gap-2.5 px-1">
          <span className="mono-label shrink-0 pt-px !text-[0.62rem]" style={{ color: hybrid ? "var(--color-eco-dark)" : "var(--color-heat)" }}>
            Когда сети нет
          </span>
          <span className="text-[13.5px] leading-[1.5] text-muted">{outageText}</span>
        </figcaption>
      )}
    </figure>
  );
}

export default function StationSchemes() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-5 md:gap-6">
      <Sheet title={solar.how.columns[0]} hybrid={false} outageText={outageRow?.grid} />
      <Sheet title={solar.how.columns[1]} hybrid outageText={outageRow?.hybrid} />
      </div>
    </div>
  );
}
