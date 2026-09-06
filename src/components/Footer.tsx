import Image from "next/image";
import Link from "next/link";
import { ru, contacts } from "@/content/site";
import { categories, categoryHref } from "@/lib/catalog-view";

const PAGES = [
  { href: "/heat-pumps", label: "Тепловые насосы" },
  { href: "/solar", label: "Солнечные станции" },
  { href: "/calculator", label: "Расчёт" },
  { href: "/to-know", label: "Разбираемся" },
  { href: "/projects", label: "Объекты" },
  { href: "/about", label: "О компании" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-graphite text-white">
      <Image
        src="/brand/leaf_white.png"
        alt=""
        aria-hidden
        width={420}
        height={394}
        className="pointer-events-none absolute -right-16 -bottom-20 w-[300px] opacity-[0.07]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Image src="/brand/logo_white.png" alt="EcoConcept" width={128} height={80} className="h-14 w-auto" />
          <p className="mt-4 font-head font-bold" style={{ color: "#7CC24B" }}>
            {ru.footer.slogan}
          </p>
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-white/70">{ru.footer.about}</p>

          {/* Страницы сайта: расчёт живёт здесь, а не в шапке — в шапке его
              роль играет кнопка «Получить расчёт». */}
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
            {PAGES.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-white/85 transition-colors hover:text-white">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-head text-sm font-bold uppercase tracking-[0.18em] text-white/60">Каталог</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={categoryHref(c.id)} className="text-white/85 transition-colors hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-head text-sm font-bold uppercase tracking-[0.18em] text-white/60">
            {ru.footer.contactsTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={contacts.phoneHref} className="font-head text-lg font-bold text-white hover:underline">
                {contacts.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={contacts.phone2Href} className="font-head text-lg font-bold text-white hover:underline">
                {contacts.phone2Display}
              </a>
            </li>
            <li>
              <a
                href={contacts.whatsapp("footer")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 underline-offset-4 hover:underline"
              >
                WhatsApp — ответим быстро
              </a>
            </li>
            <li>
              <a
                href={contacts.addressLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 underline-offset-4 hover:underline"
              >
                {contacts.address}
              </a>
            </li>
            <li className="text-white/60">{contacts.workHours}</li>

          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-[13px] text-white/50 md:px-6">
          <span>{ru.footer.copyright}</span>
          <span>{ru.footer.partners}</span>
        </div>
      </div>
    </footer>
  );
}
