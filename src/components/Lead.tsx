"use client";

import { useState } from "react";
import { ru, contacts } from "@/content/site";
import LeadFields, { type LeadStatus, submitLead } from "./LeadFields";
import { track } from "@/lib/analytics";

export default function Lead({ source = "home", interest }: { source?: string; interest?: string }) {
  const [status, setStatus] = useState<LeadStatus>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const ok = await submitLead(form, source);
    if (ok) track("lead_submit", { formType: "general", interest });
    setStatus(ok ? "ok" : "error");
    if (ok) form.reset();
  }

  return (
    <section id="lead" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-eco to-eco-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 opacity-[0.05]"
        style={{ backgroundImage: "url(/brand/leaf_white.png)", backgroundSize: "112px", transform: "rotate(-6deg)" }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
        <div className="text-white">
          <span className="kicker !text-white/80">{ru.lead.kicker}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight !text-white md:text-4xl">{ru.lead.title}</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85">{ru.lead.text}</p>
          <a
            href={contacts.whatsapp(source)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-light mt-6"
          >
            {ru.lead.whatsappCta}
          </a>
          <p className="mt-6 text-[14px] text-white/80">
            Или позвоните:{" "}
            <a href={contacts.phoneHref} className="font-semibold text-white underline underline-offset-4">
              {contacts.phoneDisplay}
            </a>
          </p>
        </div>

        <div className="rounded-[20px] bg-white p-6 shadow-xl md:p-8">
          {status === "ok" ? (
            <p className="py-8 text-center text-[15px] leading-relaxed text-ink">{ru.lead.success}</p>
          ) : (
            <form onSubmit={onSubmit}>
              <LeadFields status={status} withInterest defaultInterest={interest} compact />
              <button type="submit" disabled={status === "sending"} className="btn-primary mt-5 w-full disabled:opacity-60">
                {status === "sending" ? "Отправляем…" : ru.lead.submit}
              </button>
              {status === "error" && (
                <p className="mt-3 text-center text-[13px] font-medium text-[color:var(--color-error)]">{ru.lead.error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
