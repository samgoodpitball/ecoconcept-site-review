import { doors } from "@/content/home-v3";
import { IconArrow, IconCombo, IconSun, IconHeat } from "./icons";

const icons = [IconCombo, IconSun, IconHeat];

/**
 * Три входа в маршрут. Приём 1KOMMA5°: связка стоит первой, а не третьей —
 * так продают систему, а не два товара. Разделители линиями, не рамками:
 * варианты сравниваются между собой.
 */
export function Doors() {
  return (
    <section className="v3-sec v3-a doors">
      <div className="v3-wrap">
        <div className="doors-grid">
          {doors.items.map((d, i) => {
            const Icon = icons[i];
            return (
              <a key={d.title} href={d.href} className={`door ${d.lead ? "is-lead" : ""}`}>
                <Icon size={32} className="door-icon" />
                <h2 className="t-h3 door-title">{d.title}</h2>
                <p className="t-small door-who">{d.who}</p>
                <span className="door-go">
                  {d.lead ? "Считать вместе" : "Считать"} <IconArrow size={18} />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
