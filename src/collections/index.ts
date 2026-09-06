import type { CollectionConfig } from "payload";

/** Переиспользуемая группа SEO-полей. */
const seoField = {
  name: "seo",
  label: "SEO",
  type: "group" as const,
  fields: [
    { name: "title", label: "Title (до 60 знаков)", type: "text" as const },
    { name: "description", label: "Description (до 155 знаков)", type: "textarea" as const },
    { name: "ogImage", label: "OG-картинка", type: "upload" as const, relationTo: "media" as const },
  ],
};

/** Слаг: генерируется из названия, но остаётся редактируемым. */
const slugField = {
  name: "slug",
  label: "Слаг (адрес страницы)",
  type: "text" as const,
  required: true,
  unique: true,
  index: true,
  admin: { description: "Латиницей, через дефис. Например: phnix-g20" },
};

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Категория", plural: "Категории каталога" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "parent", "order"],
    description: "Разделы каталога. Подкатегории указывают родителя.",
    group: "Каталог",
  },
  access: { read: () => true },
  fields: [
    { name: "title", label: "Название", type: "text", required: true, localized: true },
    slugField,
    {
      name: "parent",
      label: "Родительская категория",
      type: "relationship",
      relationTo: "categories",
      admin: { description: "Оставьте пустым для раздела верхнего уровня." },
    },
    {
      name: "description",
      label: "Описание (SEO-текст внизу листинга)",
      type: "textarea",
      localized: true,
    },
    { name: "image", label: "Изображение", type: "upload", relationTo: "media" },
    { name: "order", label: "Порядок сортировки", type: "number", defaultValue: 100 },
    seoField,
  ],
};

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Товар", plural: "Каталог товаров" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "brand", "category", "availability", "featured"],
    description: "Характеристики публикуются на сайте. Закупочная цена — служебное поле, на сайт не выводится.",
    group: "Каталог",
  },
  access: { read: () => true },
  fields: [
    { name: "title", label: "Название", type: "text", required: true, localized: true },
    slugField,
    {
      name: "brand",
      label: "Бренд",
      type: "select",
      required: true,
      options: [
        { label: "PHNIX", value: "PHNIX" },
        { label: "Hisense", value: "Hisense" },
        { label: "Trina Solar", value: "Trina Solar" },
        { label: "Deye", value: "Deye" },
      ],
    },
    { name: "category", label: "Категория", type: "relationship", relationTo: "categories", required: true },
    { name: "short", label: "Кратко (одна строка)", type: "textarea", localized: true },
    { name: "image", label: "Главное фото", type: "upload", relationTo: "media" },
    {
      name: "imageSlot",
      label: "ID слота изображения",
      type: "text",
      admin: { description: "Например product-phnix-g20 — по манифесту изображений. Пока фото нет, показывается плейсхолдер." },
    },
    { name: "gallery", label: "Галерея", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] },
    {
      name: "badges",
      label: "Бейджи (ключевые факты)",
      type: "array",
      localized: true,
      fields: [{ name: "value", label: "Текст", type: "text" }],
    },
    {
      name: "specs",
      label: "Характеристики",
      type: "array",
      localized: true,
      fields: [
        { name: "label", label: "Параметр", type: "text" },
        { name: "value", label: "Значение", type: "text" },
      ],
    },
    {
      name: "benefits",
      label: "Что это даёт",
      type: "array",
      localized: true,
      fields: [{ name: "value", label: "Текст", type: "text" }],
    },
    {
      name: "usedWith",
      label: "С чем используется",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "documents",
      label: "Документы (PDF)",
      type: "array",
      fields: [
        { name: "title", label: "Название", type: "text" },
        { name: "file", label: "Файл", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "availability",
      label: "Наличие",
      type: "select",
      defaultValue: "on_order",
      options: [
        { label: "В наличии в Бишкеке", value: "in_stock_bishkek" },
        { label: "Под заказ", value: "on_order" },
      ],
    },
    {
      name: "power",
      label: "Мощность, кВт (для фильтра)",
      type: "number",
      admin: { description: "Для фильтра по мощности. Пусто — если неприменимо." },
    },
    {
      name: "minTemp",
      label: "Минимальная рабочая температура, °C",
      type: "number",
      admin: { description: "Например −25 или −38. Для фильтра по морозостойкости." },
    },
    {
      name: "refrigerant",
      label: "Хладагент",
      type: "select",
      options: [
        { label: "R290", value: "R290" },
        { label: "R410A", value: "R410A" },
        { label: "R32", value: "R32" },
      ],
    },
    {
      name: "priceInternal",
      label: "Закупочная цена (служебное — НЕ публикуется)",
      type: "number",
      access: {
        read: ({ req }) => Boolean(req.user),
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
      admin: { description: "Видно только авторизованным в админке. На сайт не выводится никогда." },
    },
    { name: "featured", label: "Показывать в подборках", type: "checkbox", defaultValue: false },
    { name: "order", label: "Порядок сортировки", type: "number", defaultValue: 100 },
    seoField,
  ],
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Статья", plural: "Блог" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "published"],
    group: "Контент",
  },
  access: { read: () => true },
  fields: [
    { name: "title", label: "Заголовок", type: "text", required: true, localized: true },
    slugField,
    {
      name: "category",
      label: "Рубрика",
      type: "select",
      required: true,
      options: [
        { label: "Тепловые насосы", value: "heat-pumps" },
        { label: "Солнечная энергетика", value: "solar" },
        { label: "Выбор и окупаемость", value: "payback" },
        { label: "Экология и уход от угля", value: "ecology" },
        { label: "Компания", value: "company" },
      ],
    },
    { name: "cover", label: "Обложка", type: "upload", relationTo: "media" },
    { name: "excerpt", label: "Превью (1–2 строки)", type: "textarea", localized: true },
    { name: "readingTime", label: "Время чтения, мин", type: "number" },
    { name: "body", label: "Текст статьи", type: "richText", localized: true },
    {
      name: "outline",
      label: "План статьи (черновик)",
      type: "array",
      localized: true,
      admin: { description: "Опорные подзаголовки. Заполняется при подготовке материала." },
      fields: [{ name: "heading", label: "Подзаголовок", type: "text" }],
    },
    { name: "related", label: "Читайте также", type: "relationship", relationTo: "posts", hasMany: true },
    { name: "publishedAt", label: "Дата публикации", type: "date" },
    { name: "published", label: "Опубликована", type: "checkbox", defaultValue: false },
    seoField,
  ],
};

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Проект", plural: "Проекты и кейсы" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "direction", "city", "published"],
    group: "Контент",
  },
  access: { read: () => true },
  fields: [
    { name: "title", label: "Название объекта", type: "text", required: true, localized: true },
    slugField,
    {
      name: "type",
      label: "Тип объекта",
      type: "select",
      options: [
        { label: "Дом", value: "home" },
        { label: "Бизнес", value: "business" },
        { label: "Агро", value: "agro" },
      ],
    },
    {
      name: "direction",
      label: "Направление",
      type: "select",
      options: [
        { label: "Тепловой насос", value: "heat_pump" },
        { label: "Солнечная станция", value: "solar" },
        { label: "Климат", value: "climate" },
      ],
    },
    { name: "city", label: "Город", type: "text", localized: true },
    { name: "summary", label: "Кратко (для карточки)", type: "textarea", localized: true },
    { name: "before", label: "Что было раньше", type: "textarea", localized: true },
    { name: "equipment", label: "Что смонтировали", type: "relationship", relationTo: "products", hasMany: true },
    { name: "power", label: "Мощность", type: "text" },
    { name: "duration", label: "Срок работ", type: "text", localized: true },
    {
      name: "gallery",
      label: "Галерея",
      type: "array",
      fields: [
        { name: "image", label: "Фото", type: "upload", relationTo: "media" },
        {
          name: "kind",
          label: "Тип кадра",
          type: "select",
          defaultValue: "gallery",
          options: [
            { label: "Было", value: "before" },
            { label: "Стало", value: "after" },
            { label: "Галерея", value: "gallery" },
          ],
        },
      ],
    },
    {
      name: "results",
      label: "Результат в цифрах",
      type: "array",
      localized: true,
      fields: [
        { name: "metric", label: "Показатель", type: "text" },
        { name: "value", label: "Значение", type: "text" },
      ],
    },
    {
      name: "review",
      label: "Отзыв клиента",
      type: "group",
      fields: [
        { name: "author", label: "Имя", type: "text" },
        { name: "text", label: "Текст отзыва", type: "textarea", localized: true },
      ],
    },
    {
      name: "isPlaceholder",
      label: "Заглушка (нет реальных данных)",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Помечает карточку как пример-заглушку, пока не поступили реальные данные объекта." },
    },
    { name: "date", label: "Дата сдачи", type: "date" },
    { name: "featured", label: "Показывать на главной", type: "checkbox", defaultValue: false },
    { name: "published", label: "Опубликован", type: "checkbox", defaultValue: false },
    seoField,
  ],
};
