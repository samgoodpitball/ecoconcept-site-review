"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ru, contacts } from "@/content/site";
import { about } from "@/content/about";
import { submitLead, type LeadStatus } from "@/components/LeadFields";
import { track } from "@/lib/analytics";

/**
 * Отклик на вакансию: ссылка открывает модалку с формой.
 *
 * Заявка уходит в тот же `/api/lead`, что и остальные формы сайта, но с
 * source «careers-about» и специальностью в тексте комментария: отдельного
 * типа формы в CRM нет, а заводить его ради вакансий — лишнее.
 */
export default function CareersForm() {
  const f = about.careers.form;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LeadStatus>("idle");
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    const role = String(data.get("role") ?? "");
    const experience = String(data.get("experience") ?? "");
    const ok = await submitLead(form, "careers-about", undefined, {
      message: [`Отклик на вакансию · ${role}`, experience].filter(Boolean).join("\n"),
    });
    if (ok) track("lead_submit", { formType: "career", interest: role });
    setStatus(ok ? "ok" : "error");
    if (ok) form.reset();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStatus("idle");
          setOpen(true);
        }}
        className="border-b-2 border-graphite pb-1 font-head text-[16px] font-bold text-graphite transition-colors hover:border-eco hover:text-eco-dark"
      >
        {about.careers.cta}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-graphite/60 p-0 md:items-center md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={f.title}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto bg-white p-6 shadow-[0_24px_60px_rgba(20,20,20,0.28)] md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="font-head text-[22px] font-bold leading-tight text-graphite">{f.title}</h3>
                <p className="mt-2.5 max-w-[32em] text-[14.5px] leading-relaxed text-muted">{f.text}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-muted transition-colors hover:bg-off hover:text-graphite"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {status === "ok" ? (
              <p className="py-10 text-center text-[15.5px] leading-relaxed text-ink">{f.success}</p>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="career-name" className="field-label">
                    {ru.lead.nameLabel} <span className="text-eco-dark">*</span>
                  </label>
                  <input
                    id="career-name"
                    name="name"
                    required
                    autoComplete="name"
                    disabled={status === "sending"}
                    placeholder={ru.lead.namePlaceholder}
                    className="field"
                  />
                </div>

                <div>
                  <label htmlFor="career-phone" className="field-label">
                    {ru.lead.phoneLabel} <span className="text-eco-dark">*</span>
                  </label>
                  <input
                    id="career-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    disabled={status === "sending"}
                    defaultValue="+996"
                    className="field"
                  />
                </div>

                <div>
                  <label htmlFor="career-role" className="field-label">
                    {f.roleLabel}
                  </label>
                  <select id="career-role" name="role" disabled={status === "sending"} className="field">
                    {f.roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="career-experience" className="field-label">
                    {f.messageLabel}
                  </label>
                  <textarea
                    id="career-experience"
                    name="experience"
                    rows={3}
                    disabled={status === "sending"}
                    placeholder={f.messagePlaceholder}
                    className="field"
                  />
                </div>

                {/* ловушка для ботов — то же поле, что и в остальных формах сайта */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {status === "sending" ? "Отправляем…" : f.submit}
                </button>

                {status === "error" && (
                  <p className="text-center text-[13.5px] font-medium text-[color:var(--color-error)]">{f.error}</p>
                )}

                <p className="text-center text-[12.5px] leading-relaxed text-muted">
                  Или позвоните:{" "}
                  <a href={contacts.phoneHref} className="font-semibold text-eco-dark underline underline-offset-2">
                    {contacts.phoneDisplay}
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
