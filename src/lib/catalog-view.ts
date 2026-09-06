import { catalog, categories, type CatalogItem, type CatalogCategory } from "@/content/catalog";

/**
 * Представление каталога: названия, подписи и группировка.
 *
 * Сами данные приходят из vault генератором scripts/build-catalog.py и правятся
 * там, а не здесь. В этом файле — только то, как они называются на сайте.
 */

export { catalog, categories };
export type { CatalogItem, CatalogCategory };

const CATEGORY_NOUN: Record<CatalogCategory, string> = {
  "heat-pumps": "Тепловой насос",
  climate: "Климатика",
  tanks: "Бак",
  "solar-panels": "Солнечная панель",
  inverters: "Инвертор",
  batteries: "Аккумулятор",
};

/** Заголовок карточки: тип, бренд, модель и главные цифры — как в каталогах поставщиков. */
export function productTitle(item: CatalogItem): string {
  const parts: string[] = [];

  if (item.category === "heat-pumps") {
    parts.push(`Тепловой насос ${item.brand} ${item.model}`);
    if (item.kw) parts.push(`${format(item.kw)} кВт`);
    if (item.phase) parts.push(item.phase === "1ф" ? "одна фаза" : "три фазы");
    if (item.refrigerant) parts.push(item.refrigerant);
  } else if (item.category === "tanks") {
    // «YK-200L Combination» + «комбинированный» — одно и то же дважды, слово из
    // артикула убираем и оставляем суммарный объём вместо длинной формулы
    parts.push(`Бак ${item.brand} ${item.model.replace(/\s+(Combination|Buffer)$/i, "")}`);
    if (item.type) parts.push(item.type);
    parts.push(totalVolume(item));
  } else if (item.category === "solar-panels") {
    parts.push(`Солнечная панель ${item.brand} ${item.model}`);
    if (item.watt) parts.push(`${format(item.watt)} Вт`);
  } else if (item.category === "inverters") {
    parts.push(`Инвертор ${item.brand} ${item.model}`);
  } else if (item.category === "batteries") {
    parts.push(`Аккумулятор ${item.brand} ${item.model}`);
    if (item.capacity) parts.push(`${format(item.capacity)} кВт·ч`);
  } else {
    parts.push(`${item.brand} ${item.model}`);
    if (item.role) parts.push(item.role);
    else if (item.btu) parts.push(`${item.btu} BTU`);
  }

  return parts.join(", ");
}

/** Короткое имя для крошек, вкладки браузера и списков. */
export function shortTitle(item: CatalogItem): string {
  return `${item.brand} ${item.model}`;
}

/** Одна строка под заголовком карточки — что это за прибор. */
export function subtitle(item: CatalogItem): string {
  switch (item.category) {
    case "heat-pumps":
      return item.area ? `Для дома ${item.area} м²` : CATEGORY_NOUN[item.category];
    case "tanks":
      return item.volume ?? item.type ?? "Бак";
    case "climate":
      if (item.maxIndoor) return `Наружный блок, до ${format(item.maxIndoor)} внутренних`;
      if (item.role) return item.rule ?? item.role;
      return item.type ? `${item.type} блок` : "Внутренний блок";
    case "solar-panels":
      return "Двусторонний модуль N-TOPCon";
    case "inverters":
      return item.batteryType ? `Гибридный, ${item.batteryType} батарея` : "Сетевой, без батареи";
    case "batteries":
      return `${item.voltage === "низковольтная" ? "Низковольтный" : "Высоковольтный"} модуль`;
  }
}

/** Три коротких факта под названием — то, по чему выбирают. */
export function facts(item: CatalogItem): string[] {
  const out: string[] = [];
  switch (item.category) {
    case "heat-pumps":
      if (item.kw) out.push(`${format(item.kw)} кВт`);
      if (item.minTemp) out.push(`до ${formatTemp(item.minTemp)}`);
      if (item.refrigerant) out.push(item.refrigerant);
      break;
    case "tanks":
      out.push(totalVolume(item));
      if (item.forPump) out.push(`под насос ${item.forPump}`);
      break;
    case "solar-panels":
      if (item.watt) out.push(`${format(item.watt)} Вт`);
      out.push("bifacial");
      break;
    case "inverters":
      if (item.kw) out.push(`${format(item.kw)} кВт`);
      if (item.phase) out.push(item.phase === "1ф" ? "220 В" : "380 В");
      if (item.type) out.push(item.type);
      break;
    case "batteries":
      if (item.capacity) out.push(`${format(item.capacity)} кВт·ч`);
      if (item.voltage) out.push(item.voltage);
      break;
    case "climate":
      if (item.btu) out.push(`${item.btu} BTU`);
      if (item.type) out.push(item.type);
      if (item.maxIndoor) out.push(`до ${format(item.maxIndoor)} блоков`);
      break;
  }
  return out;
}

/**
 * Описание модели на её странице. Собирается из полей каталога — ничего, чего нет
 * в базе, здесь не появляется.
 */
export function description(item: CatalogItem): string[] {
  const out: string[] = [];

  if (item.category === "heat-pumps") {
    const phase = item.phase === "1ф" ? "однофазной сети 220 В" : "трёхфазной сети 380 В";
    out.push(
      `${item.brand} ${item.model} — тепловой насос воздух-вода на ${format(item.kw ?? 0)} кВт. ` +
        `Работает от ${phase}${item.refrigerant ? `, хладагент ${item.refrigerant}` : ""}` +
        `${item.minTemp ? `, нижняя рабочая температура улицы ${formatTemp(item.minTemp)}` : ""}.`
    );
    if (item.area) {
      out.push(
        `По каталогу поставщика модель рассчитана на дом площадью ${item.area} м². ` +
          `Точную мощность считаем по теплопотерям: утепление и остекление меняют результат сильнее площади.`
      );
    }
    const abilities = [
      "отопление",
      item.cooling ? "охлаждение летом" : null,
      item.dhw ? "горячую воду" : null,
    ].filter(Boolean);
    if (abilities.length > 1) out.push(`Закрывает ${abilities.join(", ")}.`);
  } else if (item.category === "tanks") {
    out.push(
      `${item.brand} ${item.model} — ${item.type ?? "бак"} на ${item.volume ?? "—"}.` +
        (item.forPump ? ` Штатно ставится к насосу на ${item.forPump}.` : "")
    );
  } else if (item.category === "inverters") {
    out.push(
      `${item.brand} ${item.model} — ${item.type ?? "инвертор"} на ${format(item.kw ?? 0)} кВт для ` +
        `${item.phase === "1ф" ? "однофазной" : "трёхфазной"} сети.` +
        (item.batteryType
          ? ` Работает с ${item.batteryType} батареей и держит дом при отключении сети.`
          : " Батарею не заряжает: отдаёт выработку в дом и в сеть.")
    );
  } else if (item.category === "batteries") {
    out.push(
      `${item.brand} ${item.model} — ${item.voltage} батарея на ${format(item.capacity ?? 0)} кВт·ч. ` +
        `Ёмкость набирается модулями, нужное количество считаем под ваше суточное потребление.`
    );
  } else if (item.category === "solar-panels") {
    out.push(
      `${item.brand} ${item.model} — двусторонний модуль на ${format(item.watt ?? 0)} Вт. ` +
        `Собирает свет и обратной стороной, добавляя выработку на светлой кровле или снегу.`
    );
  } else {
    out.push(
      `${item.brand} ${item.model}${item.role ? ` — ${item.role}` : ""}.` +
        (item.rule ? ` ${capitalize(item.rule)}.` : "")
    );
  }

  return out;
}

/**
 * Значение характеристики в русской записи: десятичная запятая и тире вместо
 * тильды в диапазонах. Строки вроде «220-240В~/50Гц» или «R290» не трогаем —
 * правило срабатывает только на числах.
 */
export function formatSpecValue(value: string): string {
  if (!/^[\d.,~\s/-]+$/.test(value)) return value;
  const decimal = value.replace(/(\d)\.(\d)/g, "$1,$2");
  // диапазон с отрицательной границей читается через многоточие: «−25…43»,
  // тире рядом со знаком минуса сливается в «-25–43»
  if (/^-/.test(decimal)) return decimal.replace(/^-/, "−").replace(/~/g, "…");
  return decimal.replace(/(\d)~(\d)/g, "$1–$2");
}

/** Условия измерения из даташита: дефис перед числом — это минус, а не тире. */
export function formatCondition(text: string): string {
  return text.replace(/(^|[\s(/])-(\d)/g, "$1−$2");
}

/** Температура со знаком минуса, а не с дефисом: «−25 °C». */
export function formatTemp(value: number): string {
  return `${String(value).replace("-", "−")} °C`;
}

/** Адрес страницы модели: раздел, потом модель. */
export function productHref(item: CatalogItem): string {
  return `/catalog/${item.category}/${item.slug}`;
}

export function categoryHref(id: CatalogCategory): string {
  return `/catalog/${id}`;
}

/** Сколько моделей помещается на одну страницу раздела. */
export const PAGE_SIZE = 6;

/** Адрес страницы раздела: первая — без номера, дальше /page/2, /page/3. */
export function pageHref(category: CatalogCategory, page: number): string {
  return page <= 1 ? categoryHref(category) : `${categoryHref(category)}/page/${page}`;
}

export function pageCount(category: CatalogCategory): number {
  return Math.max(1, Math.ceil(itemsOf(category).length / PAGE_SIZE));
}

/** Модели одной страницы раздела в порядке каталога. */
export function pageItems(category: CatalogCategory, page: number): CatalogItem[] {
  const start = (page - 1) * PAGE_SIZE;
  return itemsOf(category).slice(start, start + PAGE_SIZE);
}

/** Раздел, который открывается по клику на «Каталог». */
export const DEFAULT_CATEGORY: CatalogCategory = "heat-pumps";

/** Одна-две строки под заголовком раздела — что здесь лежит. */
export const CATEGORY_INTRO: Record<CatalogCategory, string> = {
  "heat-pumps":
    "Моноблоки и сплит-системы воздух-вода PHNIX и Hisense: от семи киловатт на дом до 120 м² до коммерческих 110 кВт на здание или теплицу. Отопление, охлаждение и горячая вода от одного прибора.",
  climate:
    "Мультисплит Hisense Hi-Multi: один наружный блок на несколько комнат, канальные и кассетные внутренние блоки, бранч-бокс и панель управления.",
  tanks:
    "Баки горячей воды и буферные ёмкости к тепловым насосам — от 100 до 300 литров, включая комбинированные, где ГВС и буфер собраны в одном корпусе.",
  "solar-panels":
    "Двусторонние модули Trina Solar: собирают свет и обратной стороной, добавляя выработку на светлой кровле и снегу.",
  inverters:
    "Инверторы Deye — сетевые и гибридные, от 5 до 110 кВт, для однофазной и трёхфазной сети. Сетевой отдаёт выработку в дом и в сеть, гибридный работает с аккумулятором и держит дом при отключении.",
  batteries:
    "Аккумуляторы Deye — низковольтные и высоковольтные модули от 5,1 до 10,24 кВт·ч. Нужная ёмкость набирается несколькими модулями.",
};

export function itemsOf(category: CatalogCategory): CatalogItem[] {
  return catalog.filter((i) => i.category === category);
}

export function bySlug(slug: string): CatalogItem | undefined {
  return catalog.find((i) => i.slug === slug);
}

/** Соседи по категории — для перехода между моделями внизу страницы. */
export function related(item: CatalogItem, limit = 3): CatalogItem[] {
  return catalog.filter((i) => i.category === item.category && i.slug !== item.slug).slice(0, limit);
}

export function categoryTitle(id: CatalogCategory): string {
  return categories.find((c) => c.id === id)?.title ?? id;
}

/** Подгруппы внутри категории в порядке появления (Бытовые / Коммерческие и т. п.). */
export function groupsOf(category: CatalogCategory): string[] {
  const seen: string[] = [];
  for (const item of itemsOf(category)) {
    if (item.group && !seen.includes(item.group)) seen.push(item.group);
  }
  return seen;
}

/** «120 л ГВС + 60 л буфер = 180 л» → «180 л»; простой объём остаётся как есть. */
function totalVolume(item: CatalogItem): string {
  if (!item.volume) return "";
  const sum = item.volume.split("=").pop();
  return (sum ?? item.volume).trim();
}

function format(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n).replace(".", ",");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
