"use client";

import { useState } from "react";
import Link from "next/link";
import { ru, contacts } from "@/content/site";
import { submitLead, type LeadStatus } from "./LeadFields";
import { track } from "@/lib/analytics";

type Field = { name: string; label: string; type?: "text" | "tel" | "textarea"; required?: boolean; placeholder?: string };

/**
 * Форма для /wholesale и /service: тот же пайплайн, что и у обычной заявки
 * (Битрикс + дубль в БД), но с меткой formType и своими полями.
 */
export default function SpecialForm({
  formType,
  title,
  text,
  fields,
  submitLabel,
  source,
}: {
  formType: "wholesale" | "service";
  title: string;
  text: string;
  fields: Field[];
  submitLabel: string;
  source: string;
}) {
  const [status, setStatus] = useState<LeadStatus>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const ok = await submitLead(form, source, undefined, { formType });
    if (ok) track("lead_submit", { formType });
    setStatus(ok ? "ok" : "error");
    if (ok) form.reset();
  }

  return (
    <section id="form" className="scroll-mt-24 bg-off">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{text}</p>
          <p className="mt-6 text-[14px] text-muted">
            Или свяжитесь напрямую:{" "}
            <a href={contacts.phoneHref} className="font-semibold text-eco-dark underline underline-offset-4">
              {contacts.phoneDisplay}
            </a>
          </p>
          <a
            href={contacts.whatsapp(source)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { page: source })}
            className="btn-outline mt-4"
          >
            Написать в WhatsApp
          </a>
        </div>

        <div className="rounded-[20px] border border-line bg-white p-6 md:p-8">
          {status === "ok" ? (
            <p className="py-8 text-center text-[15px] leading-relaxed text-ink">{ru.lead.success}</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label htmlFor={`sf-${f.name}`} className="field-label">
                    {f.label} {f.required && <span className="text-eco-dark">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={`sf-${f.name}`}
                      name={f.name}
                      rows={3}
                      required={f.required}
                      disabled={status === "sending"}
                      placeholder={f.placeholder}
                      className="field resize-none"
                    />
                  ) : (
                    <input
                      id={`sf-${f.name}`}
                      name={f.name}
                      type={f.type ?? "text"}
                      inputMode={f.type === "tel" ? "tel" : undefined}
                      required={f.required}
                      disabled={status === "sending"}
                      defaultValue={f.type === "tel" ? "+996 " : undefined}
                      placeholder={f.placeholder}
                      className="field"
                    />
                  )}
                </div>
              ))}

              {/* Ловушка для ботов */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />

              <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  disabled={status === "sending"}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-eco)]"
                />
                <span>
                  {ru.lead.consent} —{" "}
                  <Link href="/privacy" target="_blank" className="text-eco-dark underline underline-offset-2">
                    {ru.lead.consentLinkLabel}
                  </Link>
                </span>
              </label>

              <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
                {status === "sending" ? "Отправляем…" : submitLabel}
              </button>
              {status === "error" && (
                <p className="text-center text-[13px] font-medium text-[color:var(--color-error)]">{ru.lead.error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
