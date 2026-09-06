import { Icon, type IconName } from "@/components/ui/icons";
import { solar } from "@/content/solar";

/**
 * Чертёжная схема «сетевая / гибридная» — визуальный конспект таблицы ниже.
 *
 * На /heat-pumps схемы — самое сильное место сайта, у солнца их не было
 * (находка №6 брифа). Схема не добавляет ни одного нового утверждения:
 * узлы — сущности комплекта (панели, инвертор, дом, сеть, батарея), а
 * подпись «когда сети нет» под каждой колонкой берётся дословно из строки
 * таблицы в src/content/solar.ts. Конкретика остаётся таблице, схема даёт
 * мгновенное «чем они отличаются».
 *
 * Язык тот же, что у иконок: контур, моно-подписи, деления. Днём поток
 * идёт сплошной зелёной линией, ветка излишка — штрихом.
 */

const outageRow = solar.how.rows.find((r) => r.label === "Когда сети нет");

function Node({ icon, label, tone = "ink" }: { icon: IconName; label: string; tone?: "ink" | "accent" }) {
  return (
    <div className="flex w-[74px] flex-col items-center gap-2">
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-[8px] border bg-white ${
          tone === "accent" ? "border-eco text-eco-dark" : "border-line text-graphite"
        }`}
      >
        <Icon name={icon} size={28} />
      </span>
      <span className="mono-label !text-[0.62rem] text-center leading-tight">{label}</span>
    </div>
  );
}

/** Горизонтальная стрелка потока: сплошная — рабочий поток, штрих — излишек. */
function Flow({ dashed = false }: { dashed?: boolean }) {
  return (
    <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden className="mt-7 shrink-0 text-eco">
      <path
        d="M1 7h27"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray={dashed ? "4 4" : undefined}
      />
      <path d="m27 3 5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Scheme({
  title,
  tail,
  tailIcon,
  outageText,
}: {
  title: string;
  tail: "grid" | "battery";
  tailIcon: IconName;
  outageText?: string;
}) {
  return (
    <figure className="min-w-[420px] flex-1 rounded-[10px] border border-line bg-white p-5 md:p-6">
      <figcaption className="mono-label">{title}</figcaption>
      <div className="mt-5 flex items-start">
        <Node icon="sun" label="солнце" />
        <Flow />
        <Node icon="panel" label="панели" />
        <Flow />
        <Node icon="inverter" label="инвертор" tone="accent" />
        <Flow />
        <Node icon="house" label="дом" />
        <Flow dashed />
        <Node icon={tailIcon} label={tail === "grid" ? "сеть" : "батарея"} />
      </div>
      {outageText && (
        <div className="mt-5 border-t border-line pt-4">
          <span className="mono-label !text-[0.62rem]">Когда сети нет</span>
          <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted">{outageText}</p>
        </div>
      )}
    </figure>
  );
}

export default function StationSchemes() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-5 md:gap-6">
        <Scheme
          title={solar.how.columns[0]}
          tail="grid"
          tailIcon="grid"
          outageText={outageRow?.grid}
        />
        <Scheme
          title={solar.how.columns[1]}
          tail="battery"
          tailIcon="battery"
          outageText={outageRow?.hybrid}
        />
      </div>
    </div>
  );
}
