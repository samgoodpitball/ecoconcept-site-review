/**
 * Чертёжные иконки сущностей, повторяющихся по сайту.
 *
 * Правило из задания: иконка обозначает сущность (насос, панель, дом, счёт…),
 * а не украшает место. Стиль один на всех — контур 1.6, скруглённые стыки,
 * сетка 24×24, цвет наследуется через currentColor: иконка ведёт себя как
 * знак в тексте документа, а не как цветная картинка.
 *
 * Инлайновый SVG в общем модуле — по требованию задания (не картинки).
 */

export type IconName =
  | "pump"
  | "panel"
  | "inverter"
  | "tank"
  | "house"
  | "bill"
  | "crew"
  | "service"
  | "frost"
  | "sun"
  | "battery"
  | "grid"
  | "credit"
  | "ruler";

function Base({ children, size = 24, className = "" }: { children: React.ReactNode; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Тепловой насос: корпус, вентилятор, выход тепла */
const pump = (
  <>
    <rect x="2.5" y="5" width="15" height="14" rx="1.5" />
    <circle cx="10" cy="12" r="4.2" />
    <path d="M10 9.4v5.2M7.8 12h4.4" />
    <path d="M20 9h1.5M20 12h1.5M20 15h1.5" />
  </>
);

/** Солнечная панель на опоре */
const panel = (
  <>
    <rect x="3.5" y="4.5" width="17" height="11" rx="1" transform="skewX(-6)" />
    <path d="M6.2 10h14.4M9.5 4.7 8.2 15.3M15.6 4.7l-1.3 10.6" />
    <path d="M11 19.5h6M14 15.5v4" />
  </>
);

/** Инвертор: корпус, индикатор, волна 220 В */
const inverter = (
  <>
    <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" />
    <path d="M8 7.5h8" />
    <path d="M8 13c1.3-2.4 2.7-2.4 4 0s2.7 2.4 4 0" />
    <path d="M8 17h3" />
  </>
);

/** Бак горячей воды */
const tank = (
  <>
    <rect x="7" y="3" width="10" height="18" rx="4" />
    <path d="M7 8.5h10M7 15.5h10" />
    <path d="M12 11a1.6 2 0 1 0 0 .01" />
  </>
);

/** Частный дом */
const house = (
  <>
    <path d="m3.5 11 8.5-7 8.5 7" />
    <path d="M5.5 9.6V20h13V9.6" />
    <rect x="10" y="14" width="4" height="6" />
  </>
);

/** Счёт за электричество */
const bill = (
  <>
    <path d="M6 3.5h12V20l-2-1.4-2 1.4-2-1.4L10 20l-2-1.4L6 20z" />
    <path d="M9 8h6M9 11.5h6" />
    <path d="m13.2 14-1.7 2.6h2.4L12.2 19" />
  </>
);

/** Своя бригада: гаечный ключ */
const crew = (
  <>
    <path d="M14.5 6.5a4 4 0 0 0-5.6 4.9L4 16.3a2 2 0 1 0 2.8 2.8l4.9-4.9a4 4 0 0 0 4.9-5.6l-2.5 2.5-2.1-.6-.6-2.1z" />
  </>
);

/** Сервис: шестерня */
const service = (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8" />
  </>
);

/** Мороз: снежинка */
const frost = (
  <>
    <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    <path d="m12 3-1.8 2M12 3l1.8 2M12 21l-1.8-2M12 21l1.8-2" />
  </>
);

/** Солнце */
const sun = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
  </>
);

/** Аккумулятор */
const battery = (
  <>
    <rect x="3" y="8" width="16" height="9" rx="1.5" />
    <path d="M21 11v3" />
    <path d="m10.5 9.5-1.8 3h2.6l-1.8 3" />
  </>
);

/** Сеть: опора ЛЭП */
const grid = (
  <>
    <path d="M8 21 12 4l4 17M6 8.5h12M7 13h10" />
    <path d="m8.6 8.5 6.8 4.5M15.4 8.5l-6.8 4.5" />
  </>
);

/** Госкредит: процент в рамке документа */
const credit = (
  <>
    <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
    <circle cx="9.2" cy="9.2" r="1.7" />
    <circle cx="14.8" cy="14.8" r="1.7" />
    <path d="M15.5 8.5 8.5 15.5" />
  </>
);

/** Линейка: измерение и расчёт */
const ruler = (
  <>
    <rect x="2.5" y="9" width="19" height="6.5" rx="1" />
    <path d="M6.5 9v3M10.2 9v2.2M13.9 9v3M17.6 9v2.2" />
  </>
);

const shapes: Record<IconName, React.ReactNode> = {
  pump, panel, inverter, tank, house, bill, crew, service, frost, sun, battery, grid, credit, ruler,
};

export function Icon({ name, size = 24, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <Base size={size} className={className}>
      {shapes[name]}
    </Base>
  );
}
