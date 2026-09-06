"use client";

import Link from "next/link";
import { ru } from "@/content/site";

export type LeadStatus = "idle" | "sending" | "ok" | "error";

/** utm-метки из адресной строки — чтобы в CRM было видно, откуда пришёл лид. */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["source", "medium", "campaign", "content", "term"]) {
    const v = params.get(`utm_${key}`);
    if (v) utm[key] = v.slice(0, 200);
  }
  return utm;
}

/**
 * Отправка лида: собирает поля формы и шлёт на /api/lead.
 * Общая логика для инлайн-секции, модалки и форм опта/сервиса.
 */
export async function submitLead(
  form: HTMLFormElement,
  source: string,
  product?: string,
  extra?: Record<string, unknown>
): Promise<boolean> {
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        ...extra,
        source,
        product,
        utm: readUtm(),
        sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
        ts: Date.now(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Поля лид-формы: имя, телефон, (опц.) интерес, комментарий, honeypot, согласие на обработку ПД. */
export default function LeadFields({
  status,
  withInterest = false,
  defaultInterest,
  compact = false,
}: {
  status: LeadStatus;
  withInterest?: boolean;
  defaultInterest?: string;
  compact?: boolean;
}) {
  const disabled = status === "sending";
  return (
    <div className={compact ? "space-y-3.5" : "space-y-4"}>
      <div>
        <label htmlFor="lead-name" className="field-label">
          {ru.lead.nameLabel} <span className="text-eco-dark">*</span>
        </label>
        <input
          id="lead-name"
          name="name"
          required
          disabled={disabled}
          autoComplete="name"
          placeholder={ru.lead.namePlaceholder}
          className="field"
        />
      </div>

      <div>
        <label htmlFor="lead-phone" className="field-label">
          {ru.lead.phoneLabel} <span className="text-eco-dark">*</span>
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          required
          disabled={disabled}
          autoComplete="tel"
          defaultValue="+996 "
          placeholder={ru.lead.phonePlaceholder}
          className="field"
        />
      </div>

      {withInterest && (
        <div>
          <label htmlFor="lead-interest" className="field-label">
            {ru.lead.interestLabel}
          </label>
          <select
            id="lead-interest"
            name="interest"
            disabled={disabled}
            defaultValue={defaultInterest ?? ""}
            className="field"
          >
            <option value="">Не выбрано</option>
            {ru.lead.interestOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="lead-message" className="field-label">
          {ru.lead.messageLabel}
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={3}
          disabled={disabled}
          placeholder={ru.lead.messagePlaceholder}
          className="field resize-none"
        />
      </div>

      {/* Ловушка для ботов — реальные люди это поле не видят */}
      <input
        type="text"
        name="company"
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
          disabled={disabled}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-eco)]"
        />
        <span>
          {ru.lead.consent} —{" "}
          <Link href="/privacy" target="_blank" className="text-eco-dark underline underline-offset-2">
            {ru.lead.consentLinkLabel}
          </Link>
        </span>
      </label>
    </div>
  );
}
