#!/usr/bin/env python3
"""
Собирает каталог сайта из двух источников в vault и пишет src/content/catalog.ts.

  Projects/ecoconcept/products/bot-catalog.md   — номенклатура (выгрузка catalog.json КП-бота)
  Projects/ecoconcept/tools/data/specs/*.json   — характеристики из даташитов

Закупочные цены из bot-catalog.md намеренно НЕ переносятся: клиенту они не
показываются (решение 29.08.2026). Розничных цен в базе пока нет — на сайте
вместо цифры стоит «цена по запросу».

YKR на сайте не показываем, кроме баков — решение заказчика 04.09.2026.
Фанкойлы YKR не попадают в каталог по той же причине.

Запуск:  python3 scripts/build-catalog.py
"""

import json
import re
from pathlib import Path

VAULT = Path.home() / "Desktop/Samat/Projects/ecoconcept"
BOT_CATALOG = VAULT / "products/bot-catalog.md"
SPECS_DIR = VAULT / "tools/data/specs"
OUT = Path(__file__).resolve().parent.parent / "src/content/catalog.ts"
IMAGES = Path(__file__).resolve().parent.parent / "public/models"

# Раздел каталога бота -> категория сайта. Порядок задаёт порядок в левой колонке.
CATEGORIES = [
    ("heat-pumps", "Тепловые насосы"),
    ("climate", "Климатика Hi-Multi"),
    ("tanks", "Баки"),
    ("solar-panels", "Солнечные панели"),
    ("inverters", "Инверторы"),
    ("batteries", "Батареи"),
]


# Названия инверторов и батарей в каталоге бота русские («Гибрид 10 кВт 220В/48В»),
# а слаг идёт в адрес страницы — переводим на латиницу словами, а не транслитом.
WORDS = {
    "сетевой": "grid",
    "гибрид": "hybrid",
    "квт": "kw",
    "кВт": "kw",
    "в": "v",
    "hv": "hv",
}
TRANSLIT = str.maketrans(
    {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "zh",
        "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
        "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "c",
        "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "", "э": "e",
        "ю": "yu", "я": "ya",
    }
)


def slugify(brand: str, model: str) -> str:
    raw = f"{brand}-{model}".lower().replace("/", "-")
    parts = re.split(r"[^a-z0-9а-яё.]+", raw)
    out = []
    for p in parts:
        if not p:
            continue
        # «220в» → «220v», «10квт» → «10kw»
        m = re.fullmatch(r"(\d+(?:\.\d+)?)(квт|в)", p)
        if m:
            out.append(m.group(1) + WORDS[m.group(2)])
            continue
        out.append(WORDS.get(p, p.translate(TRANSLIT)))
    slug = "-".join(out).replace(".", "-")
    return re.sub(r"-+", "-", slug).strip("-")


def read_tables(text: str):
    """Разбирает markdown на (заголовок раздела, заголовок подраздела, строки таблицы)."""
    section = sub = None
    rows = []
    header = None
    for line in text.splitlines():
        if line.startswith("## "):
            section, sub, header = line[3:].strip(), None, None
        elif line.startswith("### "):
            sub, header = line[4:].strip(), None
        elif line.startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if set("".join(cells)) <= set("-: "):
                continue  # разделитель шапки
            if header is None:
                header = cells
            else:
                rows.append((section, sub, dict(zip(header, cells))))
        else:
            # таблица кончилась — следующая начнёт со своей шапки
            header = None
    return rows


def clean(value: str) -> str:
    """Убирает пометку распродажи и лишние пробелы."""
    return value.replace("⏳", "").strip()


def num(value: str):
    m = re.search(r"-?\d+(?:[.,]\d+)?", value.replace(",", "."))
    return float(m.group()) if m else None


def load_specs():
    """slug -> список характеристик из даташита."""
    out = {}
    for path in SPECS_DIR.glob("*.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        specs = []
        for s in data.get("specs", []):
            spec = {"label": s["param_ru"], "value": s["value"]}
            for key in ("unit", "condition", "page"):
                if s.get(key):
                    spec[key] = s[key]
            specs.append(spec)
        if specs:
            out[data["slug"]] = {"specs": specs, "sources": data.get("sources", [])}
    return out


# Слаг в каталоге бота не всегда совпадает со слагом техбазы — сводим руками там,
# где названия разошлись.
SPEC_ALIASES = {
    "hisense-integra-ahs-100-ahw-100": "hisense-ahw-100heds1",
    "hisense-hdhwt-200l30he": "hisense-hdhwt-200l30he",
    "ykr-yk-200l-combination": "ykr-yk-200l",
    "ykr-yk-250l-combination": "ykr-yk-250l",
    "ykr-yk-300l-combination": "ykr-yk-300l",
    "trina-solar-tsm-635neg19rc-20": "trina-solar-tsm-635neg19rc.20",
    "hisense-f15a-e": "hisense-f15a-e",
    "hisense-pe-qfa-cd": "hisense-pe-qfa-cd",
}


def build():
    rows = read_tables(BOT_CATALOG.read_text(encoding="utf-8"))
    specs = load_specs()
    items = []

    for section, sub, r in rows:
        if section is None:
            continue
        brand = clean(r.get("Бренд", ""))
        model = clean(r.get("Модель", ""))
        if not brand or not model:
            continue

        # YKR на сайт не идёт нигде, кроме баков
        if brand == "YKR" and not section.startswith("Баки"):
            continue
        if section.startswith("Фанкойлы"):
            continue

        if section.startswith("Тепловые насосы"):
            category, group = "heat-pumps", ("Бытовые" if sub and "Бытовые" in sub else "Коммерческие")
        elif section.startswith("Баки"):
            category, group = "tanks", None
        elif section.startswith("Солнечная станция"):
            if sub and sub.startswith("Панель"):
                category, group = "solar-panels", None
            elif sub and sub.startswith("Инверторы"):
                category, group = "inverters", None
            elif sub and sub.startswith("Батареи"):
                category, group = "batteries", None
            else:
                continue
        elif section.startswith("Мультисплит"):
            category = "climate"
            group = {"Наружные блоки": "Наружные блоки", "Внутренние блоки": "Внутренние блоки"}.get(
                (sub or "").split(" —")[0], "Обвязка"
            )
        else:
            continue

        slug = slugify(brand, model)
        item = {
            "slug": slug,
            "brand": brand,
            "model": model,
            "category": category,
            "availability": "in_stock",
        }
        if group:
            item["group"] = group

        for key, field, conv in [
            ("кВт", "kw", num),
            ("Сеть", "phase", clean),
            ("Хладагент", "refrigerant", clean),
            ("До °C", "minTemp", num),
            ("Площадь, м²", "area", clean),
            ("Объём", "volume", clean),
            ("Тип", "type", clean),
            ("Вт", "watt", num),
            ("Напряжение", "voltage", clean),
            ("кВт·ч", "capacity", num),
            ("BTU", "btu", clean),
            ("Макс. внутренних", "maxIndoor", num),
            ("Под насос", "forPump", clean),
            ("Батарея", "batteryType", clean),
            ("Что", "role", clean),
            ("Правило", "rule", clean),
        ]:
            if r.get(key) and clean(r[key]) not in ("", "—", "-"):
                item[field] = conv(clean(r[key]))

        for key, field in [("Охл.", "cooling"), ("ГВС", "dhw")]:
            if key in r:
                item[field] = "✅" in r[key]

        # Фото готовит scripts/prepare-images.py, в имени файла — отпечаток
        # содержимого. Чего нет — на сайте рисуется заглушка.
        for suffix, field in (("", "image"), ("-2", "image2")):
            found = sorted(IMAGES.glob(f"{slug}{suffix}.*.webp"))
            if found:
                item[field] = f"/models/{found[0].name}"

        spec_slug = SPEC_ALIASES.get(slug, slug)
        if spec_slug in specs:
            item["specs"] = specs[spec_slug]["specs"]
            if specs[spec_slug]["sources"]:
                item["source"] = specs[spec_slug]["sources"][0].get("url", "")

        items.append(item)

    return items


def main():
    items = build()
    body = json.dumps(items, ensure_ascii=False, indent=2)
    OUT.write_text(
        "// СГЕНЕРИРОВАНО scripts/build-catalog.py — не править руками.\n"
        "// Источники: products/bot-catalog.md и tools/data/specs/*.json в vault.\n"
        "// Обновить: python3 scripts/build-catalog.py\n\n"
        "export type CatalogCategory =\n"
        + "".join(f'  | "{c}"\n' for c, _ in CATEGORIES)
        + ";\n\n"
        "export type Spec = {\n"
        "  label: string;\n"
        "  value: string;\n"
        "  unit?: string;\n"
        "  condition?: string;\n"
        "  page?: string;\n"
        "};\n\n"
        "export type CatalogItem = {\n"
        "  slug: string;\n"
        "  brand: string;\n"
        "  model: string;\n"
        "  category: CatalogCategory;\n"
        "  group?: string;\n"
        "  availability: \"in_stock\";\n"
        "  kw?: number;\n"
        "  phase?: string;\n"
        "  refrigerant?: string;\n"
        "  minTemp?: number;\n"
        "  area?: string;\n"
        "  volume?: string;\n"
        "  type?: string;\n"
        "  watt?: number;\n"
        "  voltage?: string;\n"
        "  capacity?: number;\n"
        "  btu?: string;\n"
        "  maxIndoor?: number;\n"
        "  forPump?: string;\n"
        "  batteryType?: string;\n"
        "  role?: string;\n"
        "  rule?: string;\n"
        "  cooling?: boolean;\n"
        "  dhw?: boolean;\n"
        "  image?: string;\n"
        "  image2?: string;\n"
        "  specs?: Spec[];\n"
        "  source?: string;\n"
        "};\n\n"
        "export const categories: { id: CatalogCategory; title: string }[] = "
        + json.dumps([{"id": c, "title": t} for c, t in CATEGORIES], ensure_ascii=False, indent=2)
        + ";\n\n"
        f"export const catalog: CatalogItem[] = {body};\n",
        encoding="utf-8",
    )
    by_cat = {}
    for i in items:
        by_cat[i["category"]] = by_cat.get(i["category"], 0) + 1
    print(f"{OUT.name}: {len(items)} позиций")
    for c, t in CATEGORIES:
        print(f"   {t}: {by_cat.get(c, 0)}")
    print(f"   с характеристиками: {sum(1 for i in items if i.get('specs'))}")
    print(f"   с фотографией: {sum(1 for i in items if i.get('image'))}")


if __name__ == "__main__":
    main()
