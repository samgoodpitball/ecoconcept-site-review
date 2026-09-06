import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { ru } from "@/content/site";

type Interest = "heat" | "solar" | "climate" | "wholesale" | "other";
type FormType = "general" | "wholesale" | "service" | "calculator";

type Utm = { source?: string; medium?: string; campaign?: string; content?: string; term?: string };

type LeadInput = {
  name: string;
  phone: string;
  message?: string;
  source?: string;
  interest?: Interest;
  product?: string;
  sourcePage?: string;
  formType?: FormType;
  company?: string;
  volume?: string;
  utm?: Utm;
};

const formTypeLabels: Record<FormType, string> = {
  general: "Заявка с сайта",
  wholesale: "Опт / партнёрство",
  service: "Сервис",
  calculator: "Калькулятор",
};

/** Человекочитаемое название интереса — для заголовка лида в Битриксе. */
function interestLabel(value?: string): string {
  if (!value) return "";
  return ru.lead.interestOptions.find((o) => o.value === value)?.label ?? value;
}

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/**
 * Приём заявок: валидация → Битрикс24 (если задан B24_WEBHOOK_URL) → запись в БД.
 * Лид сохраняется в базе в любом случае — даже если Битрикс недоступен,
 * поэтому заявки не теряются при проблемах с CRM.
 */
async function pushToBitrix(lead: LeadInput): Promise<boolean> {
  const hook = process.env.B24_WEBHOOK_URL;
  if (!hook) return false;

  const label = interestLabel(lead.interest);
  const typeLabel = formTypeLabels[lead.formType ?? "general"];
  const utm = lead.utm ?? {};
  const utmLine = Object.entries(utm)
    .filter(([, v]) => v)
    .map(([k, v]) => `utm_${k}=${v}`)
    .join(" · ");

  const comments = [
    lead.message,
    lead.company && `Компания: ${lead.company}`,
    lead.volume && `Объём: ${lead.volume}`,
    label && `Интересует: ${label}`,
    lead.product && `Товар / расчёт: ${lead.product}`,
    lead.sourcePage && `Страница: ${lead.sourcePage}`,
    utmLine && `Метки: ${utmLine}`,
  ]
    .filter(Boolean)
    .join("\n");

  const titleSubject = lead.company || lead.name;
  const title = label ? `${typeLabel}: ${label} — ${titleSubject}` : `${typeLabel}: ${titleSubject}`;

  try {
    const res = await fetch(`${hook.replace(/\/+$/, "")}/crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          TITLE: title,
          NAME: lead.name,
          ...(lead.company ? { COMPANY_TITLE: lead.company } : {}),
          PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
          COMMENTS: comments,
          SOURCE_ID: "WEB",
          SOURCE_DESCRIPTION: `${typeLabel} · страница: ${lead.sourcePage || lead.source || "home"}`,
          ...(utm.source ? { UTM_SOURCE: utm.source } : {}),
          ...(utm.medium ? { UTM_MEDIUM: utm.medium } : {}),
          ...(utm.campaign ? { UTM_CAMPAIGN: utm.campaign } : {}),
          ...(utm.content ? { UTM_CONTENT: utm.content } : {}),
          ...(utm.term ? { UTM_TERM: utm.term } : {}),
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[lead] bitrix responded", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    const body = (await res.json()) as { error?: string; error_description?: string };
    if (body.error) {
      console.error("[lead] bitrix error:", body.error, body.error_description);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[lead] bitrix push failed:", e);
    return false;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = str(body.name, 200);
  const phone = str(body.phone, 50);
  const message = str(body.message, 2000);
  const source = str(body.source, 100) || "home";
  const sourcePage = str(body.sourcePage, 200);
  const product = str(body.product, 300);
  const company = str(body.company, 200);
  const volume = str(body.volume, 200);

  // Две ловушки для ботов: скрытые поля company (лид-форма) и website (формы опта/сервиса).
  // В форме опта company — настоящее поле, поэтому honeypot там только website.
  const isWholesaleLike = body.formType === "wholesale";
  const honeypot = str(body.website, 100) || (isWholesaleLike ? "" : str(body.company, 100));

  const rawInterest = str(body.interest, 50);
  const interest = ru.lead.interestOptions.some((o) => o.value === rawInterest)
    ? (rawInterest as Interest)
    : undefined;

  const rawFormType = str(body.formType, 30);
  const formType: FormType = (["general", "wholesale", "service", "calculator"] as const).includes(
    rawFormType as FormType
  )
    ? (rawFormType as FormType)
    : "general";

  const rawUtm = (body.utm ?? {}) as Record<string, unknown>;
  const utm: Utm = {
    source: str(rawUtm.source, 200) || undefined,
    medium: str(rawUtm.medium, 200) || undefined,
    campaign: str(rawUtm.campaign, 200) || undefined,
    content: str(rawUtm.content, 200) || undefined,
    term: str(rawUtm.term, 200) || undefined,
  };

  if (honeypot) return NextResponse.json({ ok: true }); // бот — тихо игнорируем
  if (!name || phone.replace(/\D/g, "").length < 9) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const lead: LeadInput = {
    name,
    phone,
    message,
    source,
    interest,
    product,
    sourcePage,
    formType,
    company: isWholesaleLike ? company : undefined,
    volume,
    utm,
  };

  const bitrixSynced = await pushToBitrix(lead);

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "leads",
      data: {
        name,
        phone,
        message,
        source,
        sourcePage,
        product,
        formType,
        ...(isWholesaleLike && company ? { company } : {}),
        ...(volume ? { volume } : {}),
        ...(interest ? { interest } : {}),
        ...(body.calculatorData && typeof body.calculatorData === "object"
          ? { calculatorData: body.calculatorData as Record<string, unknown> }
          : {}),
        utm,
        status: "new",
        bitrixSynced,
      },
    });
  } catch (e) {
    console.error("[lead] db save failed:", e);
    if (!bitrixSynced) return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
