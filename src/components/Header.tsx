"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { contacts } from "@/content/site";
import { categories, categoryHref, itemsOf } from "@/lib/catalog-view";
import LeadButton from "./LeadButton";

export default function Header() {
  const [open, setOpen] = useState(false);
  // Разделы каталога под «Каталогом» в шапке: с любой страницы видно всё дерево
  const [catalogOpen, setCatalogOpen] = useState(false);
  // Вверху страницы хедер крупный; после начала скролла сжимается и остаётся sticky
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Мобильное меню не должно оставлять фон прокручиваемым
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Без backdrop-blur: на iOS фильтр делает шапку containing block для
  // fixed-потомков, и мобильное меню оказывалось позади hero.
  return (
    <header
      className={`sticky top-0 z-[70] border-b bg-white transition-shadow duration-300 ${
        shrunk ? "border-line shadow-[0_2px_16px_rgba(20,20,20,0.06)]" : "border-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 md:px-6 ${
          shrunk ? "h-16 md:h-[72px]" : "h-20 md:h-[104px]"
        }`}
      >
        <Link href="/" aria-label="EcoConcept — на главную" className="flex shrink-0 items-center">
          <Image
            src="/brand/logo_full.png"
            alt="EcoConcept"
            width={101}
            height={63}
            priority
            className={`w-auto transition-all duration-300 ${
              shrunk ? "h-11 md:h-[50px]" : "h-14 md:h-[72px]"
            }`}
          />
        </Link>

        <div className="hidden shrink-0 items-center gap-4 md:flex">
          <Link
            href="/heat-pumps"
            className="whitespace-nowrap py-2 font-head text-[15px] font-semibold text-ink transition-colors hover:text-eco-dark"
          >
            Тепловые насосы
          </Link>
          <Link
            href="/solar"
            className="whitespace-nowrap py-2 font-head text-[15px] font-semibold text-ink transition-colors hover:text-eco-dark"
          >
            Солнечные станции
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setCatalogOpen(true)}
            onMouseLeave={() => setCatalogOpen(false)}
          >
            <Link
              href="/catalog"
              onFocus={() => setCatalogOpen(true)}
              aria-expanded={catalogOpen}
              className="flex items-center gap-1.5 whitespace-nowrap py-2 font-head text-[15px] font-semibold text-ink transition-colors hover:text-eco-dark"
            >
              Каталог
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="mt-0.5 opacity-60">
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </Link>

            {catalogOpen && (
              <div className="absolute left-1/2 top-full w-[300px] -translate-x-1/2 pt-3">
                <ul className="rounded-[12px] border border-line bg-white p-2 shadow-[0_12px_32px_rgba(20,20,20,0.14)]">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={categoryHref(c.id)}
                        onClick={() => setCatalogOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-[14px] text-ink transition-colors hover:bg-tint hover:text-eco-dark"
                      >
                        {c.title}
                        <span className="text-[13px] text-muted">{itemsOf(c.id).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link
            href="/to-know"
            className="whitespace-nowrap py-2 font-head text-[15px] font-semibold text-ink transition-colors hover:text-eco-dark"
          >
            Разбираемся
          </Link>
          <Link
            href="/about"
            className="whitespace-nowrap py-2 font-head text-[15px] font-semibold text-ink transition-colors hover:text-eco-dark"
          >
            О компании
          </Link>
          <a
            href={contacts.phoneHref}
            className="whitespace-nowrap font-head text-[15px] font-bold text-graphite hover:text-eco-dark"
          >
            {contacts.phoneDisplay}
          </a>
          <LeadButton source="header" className="btn-primary whitespace-nowrap !py-2.5 !px-5 text-sm">
            Получить расчёт
          </LeadButton>
          <span
            title="Кыргызская версия — скоро"
            className="cursor-default select-none whitespace-nowrap rounded-full border border-line px-2.5 py-1 font-head text-[12px] font-bold text-muted"
          >
            RU
          </span>
        </div>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="#141414" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="#141414" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className={`fixed inset-x-0 bottom-0 z-[80] overflow-y-auto border-t border-line bg-white px-4 pb-8 pt-4 md:hidden ${
            shrunk ? "top-16" : "top-20"
          }`}
        >
          <div className="flex flex-col gap-3">
            <Link
              href="/heat-pumps"
              onClick={() => setOpen(false)}
              className="font-head text-[16px] font-bold text-graphite"
            >
              Тепловые насосы
            </Link>
            <Link
              href="/solar"
              onClick={() => setOpen(false)}
              className="font-head text-[16px] font-bold text-graphite"
            >
              Солнечные станции
            </Link>
            <Link
              href="/catalog"
              onClick={() => setOpen(false)}
              className="font-head text-[16px] font-bold text-graphite"
            >
              Каталог
            </Link>
            <ul className="mb-1 space-y-1 border-b border-line pb-3 pl-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={categoryHref(c.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 py-1.5 text-[15px] text-muted"
                  >
                    {c.title}
                    <span className="text-[13px]">{itemsOf(c.id).length}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="font-head text-[16px] font-bold text-graphite"
            >
              О компании
            </Link>
            <a href={contacts.phoneHref} className="font-head text-lg font-bold text-graphite">
              {contacts.phoneDisplay}
            </a>
            <LeadButton source="header-mobile" onOpen={() => setOpen(false)} className="btn-primary">
              Получить расчёт
            </LeadButton>
            <a
              href={contacts.whatsapp("header-mobile")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
