import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { solar } from "@/content/home-v2";

/**
 * Солнечные станции. Приоритетный блок.
 * Три типа станций сравниваются таблицей, а не тремя одинаковыми карточками:
 * так видно, чем они отличаются построчно.
 */
export default function Solar() {
  return (
    <section id="solar" className="scroll-mt-16 border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-20">
        <h2 className="t-h2 max-w-3xl">{solar.title}</h2>
        <p className="t-lead mt-4">{solar.lead}</p>

        <div className="mt-9 overflow-x-auto border-t border-[color:var(--color-border-strong)] pt-1">
          <table className="tbl min-w-[720px]">
            <thead>
              <tr>
                <th className="w-[150px]">Тип станции</th>
                <th>Кому подходит</th>
                <th>Как работает</th>
                <th>При отключении сети</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {solar.types.map((t) => (
                <tr key={t.name}>
                  <td>{t.name}</td>
                  <td>{t.forWhom}</td>
                  <td>{t.works}</td>
                  <td>{t.blackout}</td>
                  <td>{t.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-8 border-t border-[color:var(--color-border-strong)] pt-8 sm:grid-cols-3">
          {solar.numbers.map((n) => (
            <div key={n.label}>
              <div className="flex items-baseline gap-1.5">
                <span className="t-num text-[2rem] font-medium leading-none text-[color:var(--color-fg)]">
                  {n.value}
                </span>
                <span className="text-[0.9375rem] text-[color:var(--color-fg-muted)]">{n.unit}</span>
              </div>
              <p className="mt-2 text-[0.875rem] leading-snug text-[color:var(--color-fg-muted)]">
                {n.label}
              </p>
            </div>
          ))}
        </div>

        <Link
          href={solar.href}
          className="mt-9 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-[color:var(--color-brand)] hover:underline"
        >
          Всё о солнечных станциях
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
