/**
 * Манифест слотов изображений (файл 10-image-asset-manifest.md).
 * Размеры задают соотношение сторон — место резервируется заранее, поэтому
 * подстановка реального фото не двигает вёрстку (CLS ≈ 0).
 */
export type ImageSlotSpec = {
  w: number;
  h: number;
  alt: string;
  /** Готовый файл в /public. Если в CMS для слота ничего не загружено — берётся он. */
  src?: string;
};

export const imageSlots = {
  // Главная
  "home-hero": {
    w: 1800,
    h: 1500,
    alt: "Дом в Кыргызстане с тепловым насосом и солнечными панелями зимой",
    src: "/photo/H-01.webp",
  },
  "home-dir-hp": { w: 1600, h: 1200, alt: "Тепловой насос у частного дома", src: "/photo/H-02.webp" },
  "home-dir-solar": { w: 1600, h: 1200, alt: "Солнечные панели на крыше дома", src: "/photo/H-03.webp" },
  "home-dir-climate": {
    w: 1600,
    h: 1200,
    alt: "Интерьер с потолочным блоком мульти-сплит",
    src: "/photo/H-04.webp",
  },

  // Направления: hero 4:3, схемы 16:9
  "hp-hero": { w: 2000, h: 1500, alt: "Тепловой насос работает у дома в мороз", src: "/photo/HP-01.webp" },
  "hp-scheme": {
    w: 2752,
    h: 1536,
    alt: "Схема работы теплового насоса: испаритель, компрессор, конденсатор, клапан",
    src: "/photo/HP-02.webp",
  },
  "solar-hero": {
    w: 2000,
    h: 1500,
    alt: "Солнечная электростанция на крыше дома в Кыргызстане",
    src: "/photo/S-01.webp",
  },
  "solar-compare": {
    w: 2752,
    h: 1536,
    alt: "Сравнение сетевой и гибридной солнечной станции",
    src: "/photo/S-02.webp",
  },
  "solar-scheme": {
    w: 2752,
    h: 1536,
    alt: "Схема солнечной станции: панели, инвертор, дом, сеть, аккумулятор",
    src: "/photo/S-03.webp",
  },
  "climate-hero": {
    w: 2000,
    h: 1500,
    alt: "Интерьер дома со скрытым канальным кондиционированием",
    src: "/photo/CL-01.webp",
  },
  "climate-scheme": {
    w: 2752,
    h: 1536,
    alt: "Схема мульти-сплит: один наружный блок и до пяти внутренних",
    src: "/photo/CL-02.webp",
  },

  // Решения — карточки хаба (4:3) и hero подстраниц (16:9)
  "sol-card-home": { w: 1600, h: 1200, alt: "Частный дом с чистой энергией", src: "/photo/SOL-01.webp" },
  "sol-card-business": {
    w: 1600,
    h: 1200,
    alt: "Кафе с тепловым насосом и солнечными панелями",
    src: "/photo/SOL-02.webp",
  },
  "sol-card-greenhouse": {
    w: 1600,
    h: 1200,
    alt: "Теплица с обогревом тепловым насосом",
    src: "/photo/SOL-03.webp",
  },
  "sol-card-developers": {
    w: 1600,
    h: 1200,
    alt: "Новый дом с интегрированными инженерными системами",
    src: "/photo/SOL-04.webp",
  },
  "sol-home": { w: 2400, h: 1350, alt: "Тёплый частный дом вечером", src: "/photo/SOL-05.webp" },
  "sol-business": { w: 2400, h: 1350, alt: "Уютный отель-кафе с чистой энергией", src: "/photo/SOL-06.webp" },
  "sol-greenhouse": { w: 2400, h: 1350, alt: "Современная теплица в предгорьях", src: "/photo/SOL-07.webp" },
  "sol-developers": {
    w: 2400,
    h: 1350,
    alt: "Новый жилой объект с солнечными панелями",
    src: "/photo/SOL-08.webp",
  },

  // Логотипы брендов-партнёров (файлы добавит заказчик — через CMS по slotId)
  "logo-trina": { w: 320, h: 96, alt: "Trina Solar" },
  "logo-phnix": { w: 320, h: 96, alt: "PHNIX" },
  "logo-hisense": { w: 320, h: 96, alt: "Hisense" },

  // О компании
  office: { w: 1200, h: 800, alt: "Офис EcoConcept, Бишкек" },
} as const satisfies Record<string, ImageSlotSpec>;

export type KnownSlotId = keyof typeof imageSlots;

/** Динамические слоты: товары, кейсы, статьи. Размеры по манифесту. */
export const dynamicSlotSpecs = {
  product: { w: 1000, h: 1000, alt: "Фото товара" },
  case: { w: 1200, h: 800, alt: "Фото объекта" },
  blog: { w: 1200, h: 630, alt: "Обложка статьи" },
  team: { w: 600, h: 600, alt: "Сотрудник EcoConcept" },
} as const;

export function getSlotSpec(slotId: string): ImageSlotSpec {
  if (slotId in imageSlots) return imageSlots[slotId as KnownSlotId];
  if (slotId.startsWith("product-")) return dynamicSlotSpecs.product;
  if (slotId.startsWith("case-")) return dynamicSlotSpecs.case;
  if (slotId.startsWith("blog-")) return dynamicSlotSpecs.blog;
  if (slotId.startsWith("team-")) return dynamicSlotSpecs.team;
  // Безопасный дефолт 4:3 — вёрстка не поедет даже для неизвестного слота
  return { w: 1200, h: 900, alt: "Изображение EcoConcept" };
}
