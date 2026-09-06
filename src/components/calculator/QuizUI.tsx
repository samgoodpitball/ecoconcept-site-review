"use client";

/**
 * Примитивы квиза.
 *
 * Раскладка скопирована с getstarted.elephantenergy.com: шкала шагов сверху,
 * один вопрос на экран, крупный заголовок по центру, карточки-варианты во всю
 * ширину, плашка-объяснение с полосой слева, панель «Назад / Продолжить» внизу.
 * Цвета и типографика — наши: зелёный вместо сиреневого, Montserrat в заголовках.
 */

import type { ReactNode } from "react";

/* ───────────────────────────────────────────────────────── шкала шагов */

export function Progress({
  steps,
  current,
}: {
  steps: readonly { id: string; label: string }[];
  current: number;
}) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 md:gap-x-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex items-center gap-1 md:gap-2">
            <span
              aria-hidden
              className={`num flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] text-[12px] font-semibold md:h-7 md:w-7 md:text-[13px] ${
                done || active
                  ? "bg-eco-dark text-white"
                  : "border border-line bg-white text-muted"
              }`}
            >
              {done ? (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.5]">
                  <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span
              className={`font-head text-[12px] md:text-[13.5px] ${
                active ? "font-bold text-eco-dark" : done ? "text-muted" : "text-muted/70"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden className="mx-1 hidden h-px w-6 bg-line md:block md:w-8" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ────────────────────────────────────────────────── заголовки вопроса */

export function StepTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="mt-8 text-center font-head text-[26px] font-bold leading-[1.2] tracking-tight text-graphite md:mt-12 md:text-[38px]">
      {children}
    </h1>
  );
}

export function StepSubtitle({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mt-4 max-w-[42em] text-center text-[15px] leading-[1.65] text-muted md:text-[16.5px]">
      {children}
    </p>
  );
}

export function GroupTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 text-center font-head text-[17px] font-bold text-graphite md:mt-12 md:text-[20px]">
      {children}
    </h2>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-center text-[13.5px] leading-relaxed text-muted">{children}</p>;
}

/* ─────────────────────────────────────────────────── карточки выбора */

/** Крупная карточка с картинкой — шаг выбора продукта. */
export function ProductCard({
  title,
  text,
  image,
  checked,
  onClick,
}: {
  title: string;
  text: string;
  image?: ReactNode;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`flex w-full items-center gap-4 rounded-[12px] border bg-white p-4 text-left transition-colors md:gap-6 md:p-5 ${
        checked ? "border-eco ring-1 ring-eco" : "border-line hover:border-muted/40"
      }`}
    >
      {image && (
        <span className="flex h-[86px] w-[86px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-off md:h-[104px] md:w-[104px]">
          {image}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-head text-[17px] font-bold text-eco-dark md:text-[20px]">{title}</span>
        <span className="mt-1.5 block text-[14px] leading-[1.55] text-muted md:text-[15px]">{text}</span>
      </span>
      <Check checked={checked} />
    </button>
  );
}

/** Строка-вариант с иконкой — тип объекта. */
export function OptionCard({
  label,
  icon,
  checked,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`flex w-full items-center gap-3 rounded-[12px] border bg-white px-4 py-4 text-left transition-colors ${
        checked ? "border-eco ring-1 ring-eco" : "border-line hover:border-muted/40"
      }`}
    >
      {icon && <span className="shrink-0 text-graphite">{icon}</span>}
      <span className="flex-1 font-head text-[15px] font-semibold text-graphite md:text-[16px]">{label}</span>
      <Radio checked={checked} />
    </button>
  );
}

/** Компактный вариант-таблетка — для коротких списков в ряд. */
export function PillOption({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`flex w-full items-center gap-3 rounded-full border bg-white px-4 py-3 text-left transition-colors ${
        checked ? "border-eco ring-1 ring-eco" : "border-line hover:border-muted/40"
      }`}
    >
      <Radio checked={checked} />
      <span className="flex-1 text-[14.5px] leading-tight text-graphite">{label}</span>
    </button>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        checked ? "border-eco-dark" : "border-line"
      }`}
    >
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-eco-dark" />}
    </span>
  );
}

function Check({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-2 ${
        checked ? "border-eco-dark bg-eco-dark" : "border-line"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-white stroke-[2.5]">
          <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/* ──────────────────────────────────────────────────────── поля ввода */

/** Поле с подписью в вырезе рамки — как в анкете референса. */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "numeric" | "tel" | "text";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="relative block">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1.5 font-head text-[11.5px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[12px] border border-line bg-white px-4 py-3.5 text-[16px] text-graphite outline-none transition-colors focus:border-eco-dark"
      />
    </label>
  );
}

/** Выпадающий список в той же рамке. */
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="relative block">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1.5 font-head text-[11.5px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-[12px] border border-line bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22><path d=%22M1 1.5 6 6.5 11 1.5%22 fill=%22none%22 stroke=%22%2355605a%22 stroke-width=%221.6%22 stroke-linecap=%22round%22/></svg>')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 pr-10 text-[16px] text-graphite outline-none transition-colors focus:border-eco-dark"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ──────────────────────────────────────────────────────────── плашка */

/** Объяснение с полосой слева. У референса тут соцдоказательство, у нас — зачем задан вопрос. */
export function Note({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-8 rounded-r-[10px] border-l-[3px] border-eco bg-tint/60 px-5 py-4 md:mt-10">
      <p className="font-head text-[14.5px] font-bold text-graphite">{title}</p>
      <p className="mt-1.5 text-[14px] leading-[1.6] text-ink/80">{text}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── навигация */

export function NavBar({
  onBack,
  onNext,
  nextLabel = "Продолжить",
  nextDisabled,
  busy,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  busy?: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-12 border-t border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 font-head text-[15px] font-semibold text-eco-dark hover:underline"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M10 2.5 4.5 8l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Назад
          </button>
        ) : (
          <span />
        )}
        <button
          type={onNext ? "button" : "submit"}
          onClick={onNext}
          disabled={nextDisabled || busy}
          className="btn-primary disabled:opacity-50"
        >
          {nextLabel}
          <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M6 2.5 11.5 8 6 13.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── иконки */

export const icons: Record<string, ReactNode> = {
  house: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.6]" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V20h13V9.5" strokeLinejoin="round" />
      <path d="M10 20v-5.5h4V20" strokeLinejoin="round" />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.6]" aria-hidden>
      <path d="M3 20h18" strokeLinecap="round" />
      <path d="M6 20V9l6-4.5L18 9v11" strokeLinejoin="round" />
      <path d="M9 20v-4h6v4" strokeLinejoin="round" />
      <path d="M2.5 6.5 8 3" strokeLinecap="round" strokeDasharray="2 2.5" />
    </svg>
  ),
  flat: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.6]" aria-hidden>
      <path d="M5 21V4.5h14V21" strokeLinejoin="round" />
      <path d="M3 21h18" strokeLinecap="round" />
      <path d="M8.5 8h2M13.5 8h2M8.5 12h2M13.5 12h2M8.5 16h2M13.5 16h2" strokeLinecap="round" />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.6]" aria-hidden>
      <path d="M4 9.5V20h16V9.5" strokeLinejoin="round" />
      <path d="M2.5 9.5 4.5 4h15l2 5.5a3 3 0 0 1-5.6 1.6 3 3 0 0 1-5.6 0 3 3 0 0 1-5.6-1.6Z" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" strokeLinejoin="round" />
    </svg>
  ),
};
