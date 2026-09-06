"use client";

import { useState } from "react";
import Link from "next/link";
import { nav, utility } from "@/content/home-v3";
import { IconMenu, IconClose, IconChevron, IconPhone, IconWhatsapp } from "./icons";

/** Утилитарная полоса над шапкой. Приём Sunrun: телефон выше логотипа. */
export function UtilityBar() {
  return (
    <div className="ub">
      <div className="v3-wrap ub-in">
        <span className="t-small">{utility.hours}</span>
        <span className="ub-links">
          <a className="ub-link" href={utility.whatsapp} target="_blank" rel="noopener">
            <IconWhatsapp size={16} /> WhatsApp
          </a>
          <a className="ub-link" href={utility.phoneHref}>
            <IconPhone size={16} /> {utility.phone}
          </a>
        </span>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState(false);

  return (
    <header className="hd">
      <div className="v3-wrap hd-in">
        <Link href="/v3" className="hd-logo">
          Eco<span className="hd-logo-accent">Concept</span>
        </Link>

        <nav className="hd-nav" aria-label="Основная навигация">
          {nav.items.map((i) => (
            <Link key={i.href} href={i.href} className="hd-link">
              {i.label}
            </Link>
          ))}
          <div
            className="hd-drop"
            onMouseEnter={() => setCompany(true)}
            onMouseLeave={() => setCompany(false)}
          >
            <button
              className="hd-link hd-drop-btn"
              aria-expanded={company}
              onClick={() => setCompany((v) => !v)}
            >
              {nav.company.label}
              <IconChevron size={16} />
            </button>
            {company && (
              <div className="hd-drop-menu">
                {nav.company.items.map((i) => (
                  <Link key={i.href} href={i.href} className="hd-drop-item">
                    {i.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hd-right">
          <a href={nav.cta.href} className="btn btn-primary hd-cta">
            {nav.cta.label}
          </a>
          <button
            className="hd-burger"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="hd-mobile">
          <div className="v3-wrap">
            {nav.items.map((i) => (
              <Link key={i.href} href={i.href} className="hd-mobile-link" onClick={() => setOpen(false)}>
                {i.label}
              </Link>
            ))}
            <hr className="rule" style={{ margin: "16px 0" }} />
            {nav.company.items.map((i) => (
              <Link key={i.href} href={i.href} className="hd-mobile-link hd-mobile-sub" onClick={() => setOpen(false)}>
                {i.label}
              </Link>
            ))}
            <a href={nav.cta.href} className="btn btn-primary" style={{ width: "100%", marginTop: 24 }} onClick={() => setOpen(false)}>
              {nav.cta.label}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
