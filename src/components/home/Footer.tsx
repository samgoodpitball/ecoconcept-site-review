import Image from "next/image";
import Link from "next/link";
import { contacts } from "@/content/home-v2";

const columns = [
  {
    title: "Направления",
    links: [
      { label: "Солнечные станции", href: "/solar" },
      { label: "Тепловые насосы", href: "/heat-pumps" },
      { label: "Калькулятор", href: "#calculator" },
      { label: "Стоимость", href: "/pricing" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О компании", href: "/about" },
      { label: "Объекты", href: "/projects" },
      { label: "Сервис и гарантия", href: "/service" },
      { label: "Оптом и дилерам", href: "/wholesale" },
      { label: "Блог", href: "/blog" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[color:var(--color-ink)] text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Image
            src="/brand/logo_white.png"
            alt="EcoConcept"
            width={128}
            height={80}
            className="h-10 w-auto"
          />
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/60">
            Инженерная компания в Бишкеке. Солнечные станции и тепловые насосы под ключ, от
            расчёта до сервиса.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="t-eyebrow !text-white/40">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[0.9375rem] text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="t-eyebrow !text-white/40">Контакты</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={contacts.phoneHref} className="text-[1.0625rem] font-medium hover:underline">
                {contacts.phone}
              </a>
            </li>
            <li>
              <a
                href={contacts.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.9375rem] text-white/70 hover:text-white"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={contacts.addressLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.9375rem] leading-relaxed text-white/70 hover:text-white"
              >
                {contacts.address}
              </a>
            </li>
            <li className="text-[0.9375rem] text-white/50">{contacts.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-5 text-[0.8125rem] text-white/40 md:px-6">
          <span>© {new Date().getFullYear()} EcoConcept, Бишкек</span>
          <Link href="/privacy" className="hover:text-white/70">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
