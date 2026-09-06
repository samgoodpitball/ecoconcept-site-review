"use client";

import { useState } from "react";
import { lead, contacts } from "@/content/home-v2";

type Status = "idle" | "sending" | "ok" | "error";

/**
 * Заявка. Три равнозначных пути: форма, WhatsApp, телефон.
 * По наблюдениям менеджер чаще звонит, чем пишет, поэтому телефон не второстепенен.
 *
 * Подпись всегда над полем, плейсхолдер подпись не заменяет.
 */
export default function Lead() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          message: data.get("message"),
          interest: data.get("interest"),
          source: "home-v2",
          sourcePage: "/v2",
          formType: "general",
          website: data.get("website"),
        }),
      });
      const ok = res.ok && (await res.json()).ok;
      setStatus(ok ? "ok" : "error");
      if (ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="lead" className="scroll-mt-16 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="t-h2">{lead.title}</h2>
          <p className="t-lead mt-4">{lead.lead}</p>

          <div className="mt-8 border-t border-[color:var(--color-border-strong)]">
            <a
              href={contacts.phoneHref}
              className="flex items-baseline justify-between gap-4 border-b border-[color:var(--color-border)] py-4"
            >
              <span className="text-[0.875rem] text-[color:var(--color-fg-muted)]">Позвонить</span>
              <span className="text-[1.0625rem] font-medium">{contacts.phone}</span>
            </a>
            <a
              href={contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline justify-between gap-4 border-b border-[color:var(--color-border)] py-4"
            >
              <span className="text-[0.875rem] text-[color:var(--color-fg-muted)]">Написать</span>
              <span className="text-[1.0625rem] font-medium text-[color:var(--color-brand)]">
                WhatsApp
              </span>
            </a>
            <div className="flex items-baseline justify-between gap-4 border-b border-[color:var(--color-border)] py-4">
              <span className="text-[0.875rem] text-[color:var(--color-fg-muted)]">Работаем</span>
              <span className="text-[0.9375rem]">{contacts.hours}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[color:var(--color-border-strong)] pt-7">
          {status === "ok" ? (
            <p className="py-10 text-center text-[0.9375rem] leading-relaxed">{lead.success}</p>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="field-label">
                    Имя
                  </label>
                  <input id="name" name="name" required className="field" autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="phone" className="field-label">
                    Телефон
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    defaultValue="+996 "
                    className="field"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="interest" className="field-label">
                  Что интересует
                </label>
                <select id="interest" name="interest" className="field" defaultValue="solar">
                  {lead.interests.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="field-label">
                  Коротко об объекте
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="field"
                  placeholder="Площадь, город, чем отапливаете сейчас"
                />
              </div>

              {/* Ловушка для ботов, для людей не видна */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute h-0 w-0 opacity-0"
              />

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary mt-6 w-full disabled:opacity-60"
              >
                {status === "sending" ? "Отправляем" : lead.submit}
              </button>

              {status === "error" && (
                <p className="mt-3 text-center text-[0.875rem] text-[color:var(--color-danger)]">
                  {lead.error}
                </p>
              )}

              <p className="mt-4 text-[0.75rem] leading-relaxed text-[color:var(--color-fg-subtle)]">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
