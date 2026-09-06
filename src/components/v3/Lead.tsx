"use client";

import { useState } from "react";
import { lead, utility } from "@/content/home-v3";
import { IconPhone, IconWhatsapp } from "./icons";

/**
 * ЯКОРЬ 3. Три равнозначных пути: форма, WhatsApp, телефон.
 * Один призыв и одна формулировка на всю страницу.
 */
export function Lead() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          message: data.get("object"),
          source: "Главная v3",
          sourcePage: "/v3",
          formType: "general",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="v3-sec v3-c" id="lead">
      <div className="v3-wrap">
        <div className="lead-grid">
          <div>
            <h2 className="t-h2">{lead.title}</h2>
            <hr className="rule-accent" style={{ marginTop: 24 }} />
            <p className="t-sub v3-measure">{lead.lead}</p>

            <div className="lead-alt">
              <h3 className="t-h3">{lead.alt.title}</h3>
              <div className="lead-alt-row">
                <a className="btn btn-secondary" href={utility.whatsapp} target="_blank" rel="noopener">
                  <IconWhatsapp size={20} /> {lead.alt.whatsapp}
                </a>
                <a className="btn btn-secondary" href={utility.phoneHref}>
                  <IconPhone size={20} /> {utility.phone}
                </a>
              </div>
            </div>
          </div>

          <form className="lead-form" onSubmit={submit}>
            {state === "done" ? (
              <p className="t-body lead-done">
                Заявка принята. Инженер перезвонит в рабочее время и согласует замер.
              </p>
            ) : (
              <>
                <label className="lead-label" htmlFor="lead-name">{lead.form.name}</label>
                <input id="lead-name" name="name" className="field" required />

                <label className="lead-label" htmlFor="lead-phone">{lead.form.phone}</label>
                <input id="lead-phone" name="phone" className="field" type="tel" required placeholder="+996 700 000 000" />

                <label className="lead-label" htmlFor="lead-object">{lead.form.object}</label>
                <input id="lead-object" name="object" className="field" />

                <button className="btn btn-primary lead-submit" disabled={state === "sending"}>
                  {state === "sending" ? "Отправляем…" : lead.form.submit}
                </button>

                {state === "error" && (
                  <p className="lead-error">
                    Не удалось отправить. Напишите в WhatsApp или позвоните — так быстрее.
                  </p>
                )}

                <p className="t-small lead-note">{lead.form.note}</p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
