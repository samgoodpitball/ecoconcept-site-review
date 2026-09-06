"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { contacts } from "@/content/home-v2";

/** Плоская навигация. Солнце первым: приоритет направления 60/40. */
const nav = [
  { label: "Солнечные станции", href: "/solar" },
  { label: "Тепловые насосы", href: "/heat-pumps" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Стоимость", href: "/pricing" },
  { label: "Объекты", href: "/projects" },
];

const more = [
  { label: "О компании", href: "/about" },
  { label: "Сервис и гарантия", href: "/service" },
  { label: "Оптом и дилерам", href: "/wholesale" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "/contacts" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 md:px-6">
        <Link href="/v2" aria-label="EcoConcept, на главную" className="shrink-0">
          <Image
            src="/brand/logo_full.png"
            alt="EcoConcept"
            width={101}
            height={63}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden flex-1 items-center gap-0.5 lg:flex" aria-label="Основная навигация">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="r whitespace-nowrap px-2.5 py-2 text-[0.875rem] text-[color:var(--color-fg-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className="r whitespace-nowrap px-2.5 py-2 text-[0.875rem] text-[color:var(--color-fg-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg)]"
            >
              Компания
            </button>
            <div className="invisible absolute right-0 top-full w-56 pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <ul className="r border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] p-1 shadow-[var(--v2-shadow-pop)]">
                {more.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="r block px-3 py-2 text-[0.9375rem] text-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-3 md:flex">
          <a
            href={contacts.phoneHref}
            className="hidden whitespace-nowrap text-[0.875rem] font-medium text-[color:var(--color-fg)] hover:text-[color:var(--color-brand)] xl:block"
          >
            {contacts.phone}
          </a>
          <a href="#lead" className="btn btn-primary !py-2 !px-4 text-[0.875rem]">
            Получить расчёт
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="r ml-auto flex h-10 w-10 items-center justify-center border border-[color:var(--color-border-strong)] lg:hidden"
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 lg:hidden">
          <nav aria-label="Мобильная навигация">
            {[...nav, ...more].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-[color:var(--color-border)] py-3.5 text-[1rem] text-[color:var(--color-fg)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3 pb-6">
            <a href="#lead" onClick={() => setOpen(false)} className="btn btn-primary">
              Получить расчёт
            </a>
            <a href={contacts.phoneHref} className="btn btn-secondary">
              {contacts.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
