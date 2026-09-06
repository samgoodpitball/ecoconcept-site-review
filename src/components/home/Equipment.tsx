import Image from "next/image";
import { equipment } from "@/content/home-v2";

/** Оборудование. Логотипы приведены к одной высоте, чтобы не прыгали. */
export default function Equipment() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6 md:py-16">
        <h2 className="t-h2">{equipment.title}</h2>
        <p className="t-lead mt-3">{equipment.lead}</p>

        <ul className="mt-8 grid border-t border-[color:var(--color-border-strong)] sm:grid-cols-2 lg:grid-cols-4">
          {equipment.items.map((b) => (
            <li
              key={b.name}
              className="flex flex-col items-start gap-3 border-b border-[color:var(--color-border)] py-6 lg:border-b-0 lg:border-r lg:pr-6 lg:last:border-r-0 lg:[&:not(:first-child)]:pl-6"
            >
              <div className="flex h-8 items-center">
                {b.logo ? (
                  <Image
                    src={b.logo}
                    alt={b.name}
                    width={200}
                    height={60}
                    className="max-h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="text-[1.125rem] font-semibold tracking-tight">{b.name}</span>
                )}
              </div>
              <span className="text-[0.875rem] text-[color:var(--color-fg-muted)]">{b.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
