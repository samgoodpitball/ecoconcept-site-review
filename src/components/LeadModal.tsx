"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ru } from "@/content/site";
import LeadFields, { type LeadStatus, submitLead } from "./LeadFields";
import { track } from "@/lib/analytics";

type OpenOptions = { interest?: string; product?: string; source?: string };

type LeadModalContextValue = {
  open: (options?: OpenOptions) => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

/** Открыть глобальную модалку «Получить расчёт» из любого клиентского компонента. */
export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal must be used within <LeadModalProvider>");
  return ctx;
}

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<OpenOptions | null>(null);
  const [status, setStatus] = useState<LeadStatus>("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((opts?: OpenOptions) => {
    setStatus("idle");
    setOptions(opts ?? {});
  }, []);

  const close = useCallback(() => setOptions(null), []);

  // Esc закрывает, фокус уходит в модалку, фон не скроллится
  useEffect(() => {
    if (!options) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [options, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const ok = await submitLead(form, options?.source ?? "modal", options?.product);
    if (ok) track("lead_submit", { formType: "general", interest: options?.interest });
    setStatus(ok ? "ok" : "error");
    if (ok) form.reset();
  }

  return (
    <LeadModalContext.Provider value={{ open }}>
      {children}
      {options && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-graphite/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[18px] bg-white p-6 shadow-[0_12px_32px_rgba(20,20,20,0.14)] sm:rounded-[20px] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="lead-modal-title" className="text-[22px] font-bold leading-snug">
                {ru.lead.modalTitle}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="-mr-1.5 -mt-1.5 shrink-0 rounded-full p-2 text-muted transition hover:bg-tint hover:text-graphite"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {status === "ok" ? (
              <div className="py-6">
                <p className="text-[15px] leading-relaxed text-ink">{ru.lead.success}</p>
                <button type="button" onClick={close} className="btn-primary mt-6 w-full">
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{ru.lead.modalText}</p>
                <form onSubmit={onSubmit} className="mt-5">
                  <LeadFields status={status} defaultInterest={options.interest} withInterest />
                  {options.product && (
                    <p className="mt-3 rounded-[12px] bg-tint px-3.5 py-2.5 text-[13px] text-eco-dark">
                      Интересует: <span className="font-semibold">{options.product}</span>
                    </p>
                  )}
                  <button type="submit" disabled={status === "sending"} className="btn-primary mt-5 w-full disabled:opacity-60">
                    {status === "sending" ? "Отправляем…" : ru.lead.submitModal}
                  </button>
                  {status === "error" && (
                    <p className="mt-3 text-[13px] font-medium text-[color:var(--color-error)]">{ru.lead.error}</p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </LeadModalContext.Provider>
  );
}
