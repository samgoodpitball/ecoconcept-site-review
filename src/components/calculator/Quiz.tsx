"use client";

/**
 * Квиз-калькулятор: последовательность шагов, состояние ответов, отправка лида.
 *
 * Порядок и раскладка повторяют getstarted.elephantenergy.com. Два осознанных
 * отличия по логике:
 *  1. Шаг субсидий заменён шагом про электрику — у нас нет программ, зато есть
 *     однофазные сети и выделенная мощность, которые реально решают, что можно
 *     поставить.
 *  2. Набор шагов зависит от первого ответа: тому, кто пришёл за станцией, не
 *     задаются вопросы про стены и разводку отопления.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { calculator } from "@/content/calculator";
import { contacts } from "@/content/site";
import { catalog } from "@/content/catalog";
import { track } from "@/lib/analytics";
import {
  emptyAnswers,
  estimate,
  type Answers,
  type Circuit,
  type Estimate,
  type Product,
  type WallType,
} from "@/lib/estimate";
import Result, { type PriceView } from "./Result";
import {
  Field,
  GroupTitle,
  Hint,
  NavBar,
  Note,
  OptionCard,
  PillOption,
  ProductCard,
  Progress,
  Select,
  StepSubtitle,
  StepTitle,
  icons,
} from "./QuizUI";

const c = calculator;

/** Черновик: стены и разводка начинаются пустыми — их нельзя угадать за клиента. */
type Draft = Omit<Answers, "walls" | "circuit"> & {
  walls: WallType | "";
  circuit: Circuit | "";
};

const emptyDraft: Draft = { ...emptyAnswers, walls: "", circuit: "" };

function toAnswers(d: Draft): Answers {
  return { ...d, walls: d.walls || "unknown", circuit: d.circuit || "none" };
}

/** Иллюстрация к варианту продукта — фото реального товара из каталога. */
function productImage(product: string) {
  const slug =
    product === "solar" ? "trina-solar-tsm-635neg19rc-20" : "hisense-ahz-120heds1";
  const item = catalog.find((i) => i.slug === slug);
  if (!item?.image) return null;
  return <Image src={item.image} alt="" width={104} height={104} className="object-contain p-2" />;
}

/**
 * Режим приёмки: /calculator?demo=1 открывает готовый результат, минуя шаги.
 * demo=solar и demo=both показывают другие ветки расчёта.
 */
function demoDraft(demo: string): Draft {
  const product: Product = demo === "solar" ? "solar" : demo === "both" ? "both" : "heat";
  return { ...emptyDraft, product, area: 150, walls: "aerated", circuit: "floor", phase: "three" };
}

export default function Quiz({
  demo = "",
  demoPrice = null,
}: {
  demo?: string;
  /** Цена для режима приёмки: считается на странице, потому что это сервер. */
  demoPrice?: { heat: PriceView | null; solar: PriceView | null } | null;
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>(demo ? demoDraft(demo) : emptyDraft);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [result, setResult] = useState<Estimate | null>(
    demo ? estimate(toAnswers(demoDraft(demo))) : null
  );
  const [delivered, setDelivered] = useState(true);
  const [price, setPrice] = useState<{ heat: PriceView | null; solar: PriceView | null } | null>(demoPrice);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setD((prev) => ({ ...prev, [key]: value }));

  const needsHouse = d.product !== "solar";
  const steps = useMemo(
    () => c.steps.filter((s) => needsHouse || (s.id !== "house" && s.id !== "heating")),
    [needsHouse]
  );
  const current = steps[step];

  /* ─────────────────────────────────────────────── переходы и отправка */

  // Новый шаг начинается сверху: без этого длинный экран открывается с середины,
  // потому что страница осталась прокрученной к панели «Продолжить».
  useEffect(() => {
    // instant, а не smooth: в globals.css у html включён плавный скролл,
    // и анимация «доезжает» уже после того, как отрисован новый шаг.
    if (started) window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, started, result]);

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const answers = toAnswers(d);
    const calculated = estimate(answers);

    // Цена считается на сервере: закупочные цены в браузер не отдаём.
    let priced: { heat: PriceView | null; solar: PriceView | null } | null = null;
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) priced = ((await res.json()) as { price: typeof priced }).price;
    } catch {
      // Без цены результат всё равно показывается — остальные цифры считаются у клиента.
    }
    setPrice(priced);

    // Расчёт уходит в CRM вместе с лидом: менеджер видит те же цифры, что и клиент.
    const summary = [
      calculated.heat && `Насос ${calculated.heat.requiredKw} кВт`,
      calculated.heat?.models[0] &&
        `${calculated.heat.models[0].brand} ${calculated.heat.models[0].model}`,
      calculated.solar && `Станция ${calculated.solar.kwp} кВт, ${calculated.solar.panels} панелей`,
    ]
      .filter(Boolean)
      .join(" · ");

    const payload = {
      name,
      phone,
      source: "calculator",
      sourcePage: window.location.pathname,
      formType: "calculator",
      interest: d.product === "solar" ? "solar" : "heat",
      product: summary,
      calculatorData: { answers, result: calculated, price: priced },
      utm: {},
    };

    const send = async () => {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.ok;
    };

    let sent = false;
    try {
      sent = await send();
      if (!sent) sent = await send(); // одна повторная попытка: сеть подводит чаще, чем сервер
    } catch {
      sent = false;
    }

    if (sent) track("calculator_submit", { product: d.product });

    // Расчёт показываем в любом случае. Человек ответил на шесть экранов —
    // наказывать его за наш сбой нельзя; о неудачной отправке скажем в результате.
    setDelivered(sent);
    setResult(calculated);
    setStatus("idle");
  }

  /* ───────────────────────────────────────────────────────── результат */

  if (result) {
    return (
      <Result
        answers={toAnswers(d)}
        result={result}
        price={price}
        delivered={delivered}
        onRestart={() => {
          setResult(null);
          setD(emptyDraft);
          setName("");
          setPhone("");
          setStatus("idle");
          setDelivered(true);
          setPrice(null);
          setStep(0);
        }}
      />
    );
  }

  /* ────────────────────────────────────────────────────── экран входа */

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 md:px-6 md:py-20">
        <h1 className="text-center font-head text-[28px] font-bold leading-tight tracking-tight text-graphite md:text-[40px]">
          {c.intro.title}
        </h1>

        <p className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-tint px-4 py-2 text-[14px] font-semibold text-eco-dark">
          <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 5.5V10l3 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.intro.time}
        </p>

        {c.intro.text.map((p) => (
          <p key={p} className="mt-5 text-[15.5px] leading-[1.7] text-ink/85 md:text-[16.5px]">
            {p}
          </p>
        ))}

        <button type="button" onClick={() => setStarted(true)} className="btn-primary mt-8">
          {c.intro.cta}
          <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M6 2.5 11.5 8 6 13.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="mt-10 rounded-[20px] border border-line p-6">
          <p className="font-head text-[16px] font-bold text-graphite">{c.intro.asideTitle}</p>
          <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{c.intro.asideText}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={contacts.whatsapp("calculator-intro")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Написать в WhatsApp
            </a>
            <a href={contacts.phoneHref} className="btn-outline">
              {contacts.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────── шаги */

  const stepId = current.id;

  const canContinue =
    stepId === "house" ? d.walls !== "" && d.area > 0 : stepId === "heating" ? d.circuit !== "" : true;

  return (
    <div className="pb-4">
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-6 md:pt-10">
        <Progress steps={steps} current={step} />
      </div>

      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* ───── шаг 1: что ставим */}
        {stepId === "product" && (
          <>
            <StepTitle>{c.product.title}</StepTitle>
            <StepSubtitle>{c.product.subtitle}</StepSubtitle>
            <div className="mt-8 space-y-4">
              {c.product.options.map((o) => (
                <ProductCard
                  key={o.value}
                  title={o.title}
                  text={o.text}
                  image={productImage(o.value)}
                  checked={d.product === o.value}
                  onClick={() => set("product", o.value as Product)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                set("product", "both");
                next();
              }}
              className="mx-auto mt-6 block font-head text-[15px] font-semibold text-eco-dark hover:underline"
            >
              {c.product.unsure}
            </button>
          </>
        )}

        {/* ───── шаг 2: объект */}
        {stepId === "object" && (
          <>
            <StepTitle>{c.object.title}</StepTitle>
            <div className="mx-auto mt-8 max-w-md">
              <Select
                label={c.object.regionLabel}
                value={d.region}
                onChange={(v) => set("region", v as Answers["region"])}
                options={c.object.regions}
              />
            </div>
            <GroupTitle>{c.object.buildingTitle}</GroupTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.object.buildings.map((b) => (
                <OptionCard
                  key={b.value}
                  label={b.label}
                  icon={icons[b.icon]}
                  checked={d.building === b.value}
                  onClick={() => set("building", b.value as Answers["building"])}
                />
              ))}
            </div>
            {d.building === "flat" && (
              <Note title="Обратите внимание" text={c.object.flatWarning} />
            )}
            <Note title={c.object.note.title} text={c.object.note.text} />
          </>
        )}

        {/* ───── шаг 3: дом */}
        {stepId === "house" && (
          <>
            <StepTitle>{c.house.title}</StepTitle>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Field
                label={c.house.areaLabel}
                value={String(d.area || "")}
                inputMode="numeric"
                onChange={(v) => set("area", Math.min(2000, Number(v.replace(/\D/g, "")) || 0))}
              />
              <Field
                label={c.house.floorsLabel}
                value={String(d.floors || "")}
                inputMode="numeric"
                onChange={(v) => set("floors", Math.min(5, Number(v.replace(/\D/g, "")) || 0))}
              />
            </div>

            <GroupTitle>{c.house.ceilingsTitle}</GroupTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.house.ceilings.map((o) => (
                <PillOption
                  key={o.value}
                  label={o.label}
                  checked={d.tallCeilings === (o.value === "tall")}
                  onClick={() => set("tallCeilings", o.value === "tall")}
                />
              ))}
            </div>

            <GroupTitle>{c.house.wallsTitle}</GroupTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.house.walls.map((o) => (
                <OptionCard
                  key={o.value}
                  label={o.label}
                  checked={d.walls === o.value}
                  onClick={() => set("walls", o.value as WallType)}
                />
              ))}
            </div>

            <Note title={c.house.note.title} text={c.house.note.text} />
          </>
        )}

        {/* ───── шаг 4: отопление и климат */}
        {stepId === "heating" && (
          <>
            <StepTitle>{c.heating.title}</StepTitle>

            <GroupTitle>{c.heating.fuelTitle}</GroupTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.heating.fuels.map((o) => (
                <PillOption
                  key={o.value}
                  label={o.label}
                  checked={d.fuel === o.value}
                  onClick={() => set("fuel", o.value as Answers["fuel"])}
                />
              ))}
            </div>

            <GroupTitle>{c.heating.billTitle}</GroupTitle>
            <Hint>{c.heating.billHint}</Hint>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.heating.bills.map((o) => (
                <PillOption
                  key={o.value}
                  label={o.label}
                  checked={d.winterBill === Number(o.value)}
                  onClick={() => set("winterBill", Number(o.value))}
                />
              ))}
            </div>

            <GroupTitle>{c.heating.circuitTitle}</GroupTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.heating.circuits.map((o) => (
                <OptionCard
                  key={o.value}
                  label={o.label}
                  checked={d.circuit === o.value}
                  onClick={() => set("circuit", o.value as Circuit)}
                />
              ))}
            </div>
            <Note title={c.heating.circuitNote.title} text={c.heating.circuitNote.text} />

            <GroupTitle>{c.heating.dhwTitle}</GroupTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PillOption label={c.heating.dhwYes} checked={d.dhw} onClick={() => set("dhw", true)} />
              <PillOption label={c.heating.dhwNo} checked={!d.dhw} onClick={() => set("dhw", false)} />
            </div>
            {d.dhw && (
              <div className="mt-4 max-w-xs">
                <Field
                  label={c.heating.peopleLabel}
                  value={String(d.people || "")}
                  inputMode="numeric"
                  onChange={(v) => set("people", Math.min(20, Number(v.replace(/\D/g, "")) || 0))}
                />
              </div>
            )}

            <GroupTitle>{c.heating.coolingTitle}</GroupTitle>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PillOption
                label={c.heating.coolingYes}
                checked={d.cooling}
                onClick={() => {
                  set("cooling", true);
                  if (d.coolingRooms === 0) set("coolingRooms", 3);
                }}
              />
              <PillOption
                label={c.heating.coolingNo}
                checked={!d.cooling}
                onClick={() => {
                  set("cooling", false);
                  set("coolingRooms", 0);
                }}
              />
            </div>
            {d.cooling && (
              <>
                <div className="mt-4 max-w-xs">
                  <Field
                    label={c.heating.roomsLabel}
                    value={String(d.coolingRooms || "")}
                    inputMode="numeric"
                    onChange={(v) => set("coolingRooms", Math.min(30, Number(v.replace(/\D/g, "")) || 0))}
                  />
                </div>
                <Note title="Почему считаем комнаты" text={c.heating.roomsHint} />
              </>
            )}
          </>
        )}

        {/* ───── шаг 5: электричество */}
        {stepId === "power" && (
          <>
            <StepTitle>{c.power.title}</StepTitle>

            <div className="mx-auto mt-8 max-w-md">
              <Field
                label={c.power.billLabel}
                value={String(d.powerBill || "")}
                inputMode="numeric"
                onChange={(v) => set("powerBill", Math.min(999999, Number(v.replace(/\D/g, "")) || 0))}
              />
              <Hint>{c.power.billHint}</Hint>
            </div>

            {needsHouse && (
              <>
                <GroupTitle>{c.power.phaseTitle}</GroupTitle>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {c.power.phases.map((o) => (
                    <PillOption
                      key={o.value}
                      label={o.label}
                      checked={d.phase === o.value}
                      onClick={() => set("phase", o.value as Answers["phase"])}
                    />
                  ))}
                </div>

                <GroupTitle>{c.power.limitTitle}</GroupTitle>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {c.power.limits.map((o) => (
                    <PillOption
                      key={o.value}
                      label={o.label}
                      checked={d.gridLimit === Number(o.value)}
                      onClick={() => set("gridLimit", Number(o.value))}
                    />
                  ))}
                </div>
                <Note title={c.power.limitNote.title} text={c.power.limitNote.text} />
              </>
            )}

            {d.product !== "heat" && (
              <>
                <GroupTitle>{c.power.outagesTitle}</GroupTitle>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {c.power.outages.map((o) => (
                    <PillOption
                      key={o.value}
                      label={o.label}
                      checked={d.outages === o.value}
                      onClick={() => set("outages", o.value as Answers["outages"])}
                    />
                  ))}
                </div>
                <Note title={c.power.outagesNote.title} text={c.power.outagesNote.text} />
              </>
            )}
          </>
        )}

        {/* ───── шаг 6: контакты */}
        {stepId === "contact" && (
          <form onSubmit={submit}>
            <StepTitle>{c.contact.title}</StepTitle>
            <StepSubtitle>{c.contact.subtitle}</StepSubtitle>
            <div className="mx-auto mt-8 grid max-w-md gap-4">
              <Field label={c.contact.nameLabel} value={name} onChange={setName} required />
              <Field
                label={c.contact.phoneLabel}
                value={phone}
                onChange={setPhone}
                type="tel"
                inputMode="tel"
                placeholder="+996 700 000 000"
                required
              />
              <p className="text-[13px] leading-snug text-muted">{c.contact.privacy}</p>
              {status === "error" && (
                <p className="text-[13.5px] font-medium text-[color:var(--color-error)]">
                  {c.contact.error}
                </p>
              )}
            </div>
            <NavBar
              onBack={back}
              nextLabel={status === "sending" ? c.contact.sending : c.contact.submit}
              busy={status === "sending"}
              nextDisabled={name.trim().length < 2 || phone.replace(/\D/g, "").length < 9}
            />
          </form>
        )}
      </div>

      {stepId !== "contact" && (
        <NavBar onBack={step > 0 ? back : undefined} onNext={next} nextDisabled={!canContinue} />
      )}

      <p className="mx-auto mt-8 max-w-3xl px-4 text-center text-[13px] text-muted md:px-6">
        Нужен живой разговор?{" "}
        <Link href="/catalog/heat-pumps" className="font-semibold text-eco-dark underline underline-offset-2">
          посмотрите каталог
        </Link>{" "}
        или{" "}
        <a
          href={contacts.whatsapp("calculator-steps")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-eco-dark underline underline-offset-2"
        >
          напишите в WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
