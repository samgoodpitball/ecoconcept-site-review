#!/usr/bin/env python3
"""
Готовит фотографии каталога: public/models/<slug>.webp — квадрат 1000×1000 на белом.

Источник — Projects/ecoconcept/files/products/<папка>/img/ в vault.

🔴 Четыре модели PASRW сюда не входят: у поставщика чёрный корпус снят на чёрном
фоне, границы объекта неразличимы по яркости, и заливка от краёв съедает сам
прибор. Нужны студийные фото от PHNIX — до тех пор на сайте у них заглушка.
Функция drop_dark_background оставлена: она работает там, где корпус светлее фона.

Позиции без фотографий (инверторы и батареи Deye, баки YKR) здесь тоже не
обрабатываются — на сайте у них рисуется та же заглушка.

Запуск:  python3 scripts/prepare-images.py
"""

import hashlib
import io
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

VAULT = Path.home() / "Desktop/Samat/Projects/ecoconcept/files/products"
OUT = Path(__file__).resolve().parent.parent / "public/models"
SIZE = 1000

# слаг в каталоге сайта -> папка модели в vault
SOURCES = {
    "phnix-g20": "phnix-g20",
    "phnix-g40s": "phnix-g40s",
    "phnix-g60s": "phnix-g60s",
    "hisense-ahz-120heds1": "hisense-ahz-120heds1",
    "hisense-ahz-160heds1": "hisense-ahz-160heds1",
    "hisense-integra-ahs-100-ahw-100": "hisense-ahw-100heds1",
    "hisense-hdhwt-200l30he": "hisense-hdhwt-200l30he",
    "hisense-amw-42u4rqc": "hisense-amw-42u4rqc",
    "hisense-adt-09ux4rbl8": "hisense-adt-09ux4rbl8",
    "hisense-adt-12ux4rbl8": "hisense-adt-12ux4rbl8",
    "hisense-adt-18ux4rcl8": "hisense-adt-18ux4rcl8",
    "hisense-auc-18ur4rjc8": "hisense-auc-18ur4rjc8",
    "hisense-f15a-e": "hisense-f15a-e",
    "hisense-pe-qfa-cd": "hisense-pe-qfa-cd",
    "trina-solar-tsm-635neg19rc-20": "trina-solar-tsm-635neg19rc.20",
}

# Второе фото у комплекта Integra: главным идёт наружный блок — по нему модель
# узнают на площадке, — а вторым внутренний с баком ГВС.
EXTRA = {"hisense-integra-ahs-100-ahw-100": "hisense-ahs-100hedsaa-23"}


def luminance(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def is_dark_background(im: Image.Image) -> bool:
    w, h = im.size
    corners = [im.getpixel(p) for p in [(1, 1), (w - 2, 1), (1, h - 2), (w - 2, h - 2)]]
    return sum(luminance(c) for c in corners) / 4 < 200


def drop_dark_background(im: Image.Image, tol: int = 42) -> Image.Image:
    """Срезает тёмный фон заливкой от краёв и кладёт объект на белое."""
    w, h = im.size
    px = im.load()
    bg = bytearray(w * h)
    queue = deque()

    def seed(x, y):
        if not bg[y * w + x] and luminance(px[x, y]) < tol:
            bg[y * w + x] = 1
            queue.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bg[ny * w + nx] and luminance(px[nx, ny]) < tol:
                bg[ny * w + nx] = 1
                queue.append((nx, ny))

    # Верхняя кромка часто тёмная (решётка вентилятора) и срезается вместе с фоном —
    # возвращаем верхнюю десятую часть объекта в каждой колонке.
    for x in range(w):
        column = [y for y in range(h) if not bg[y * w + x]]
        if len(column) < 2:
            continue
        top, bottom = column[0], column[-1]
        for y in range(top, min(bottom, top + int((bottom - top) * 0.12))):
            bg[y * w + x] = 0

    alpha = Image.frombytes("L", (w, h), bytes(0 if v else 255 for v in bg))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))
    out = Image.new("RGB", (w, h), (255, 255, 255))
    out.paste(im, mask=alpha)
    return out


def square(im: Image.Image, pad: float = 0.06) -> Image.Image:
    """Вписывает изображение в белый квадрат SIZE×SIZE с одинаковым полем."""
    inner = int(SIZE * (1 - pad * 2))
    im = im.copy()
    im.thumbnail((inner, inner), Image.LANCZOS)
    canvas = Image.new("RGB", (SIZE, SIZE), (255, 255, 255))
    canvas.paste(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2))
    return canvas


def pick_source(folder: str):
    d = VAULT / folder / "img"
    if not d.is_dir():
        return None
    files = sorted(d.glob("*1000x1000*")) or sorted(f for f in d.iterdir() if f.is_file())
    return files[0] if files else None


def process(slug: str, folder: str, suffix: str = "") -> str:
    """Кладёт фото как <slug><suffix>.<отпечаток>.webp.

    Отпечаток содержимого в имени нужен, чтобы при замене снимка менялся адрес:
    иначе браузер продолжает показывать старую картинку из кеша.
    """
    src = pick_source(folder)
    if src is None:
        return f"нет исходника: {folder}"
    im = Image.open(src).convert("RGB")
    note = ""
    if is_dark_background(im):
        im = drop_dark_background(im)
        note = " (срезан тёмный фон)"

    buffer = io.BytesIO()
    square(im).save(buffer, "WEBP", quality=86, method=6)
    data = buffer.getvalue()
    digest = hashlib.md5(data).hexdigest()[:8]

    OUT.mkdir(parents=True, exist_ok=True)
    for stale in OUT.glob(f"{slug}{suffix}.*.webp"):
        stale.unlink()
    name = f"{slug}{suffix}.{digest}.webp"
    (OUT / name).write_bytes(data)
    return f"{name}{note}"


def main():
    for slug, folder in SOURCES.items():
        print(" ", process(slug, folder))
    for slug, folder in EXTRA.items():
        print(" ", process(slug, folder, suffix="-2"))
    total = len(list(OUT.glob("*.webp")))
    weight = sum(f.stat().st_size for f in OUT.glob("*.webp")) // 1024
    print(f"готово: {total} файлов, {weight} КБ")


if __name__ == "__main__":
    main()
