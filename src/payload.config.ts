import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { Categories, Products, Posts, Projects } from "./collections";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: "users",
    meta: { titleSuffix: " · EcoConcept" },
    // Светлая тема принудительно: по умолчанию Payload следует системной,
    // и у пользователя с тёмной ОС админка была почти чёрной.
    // Фирменные акценты — в src/styles/admin.css, подключён в (payload)/layout.tsx.
    theme: "light",
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [
    // На Vercel файловая система временная — медиа храним в Vercel Blob.
    // Локально (без токена) плагин выключается флагом enabled, но остаётся
    // в конфиге: иначе его клиентский компонент не попадает в importMap,
    // и на проде админка падает с «PayloadComponent not found in importMap».
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  collections: [
    {
      slug: "users",
      labels: { singular: "Сотрудник", plural: "Сотрудники" },
      auth: true,
      admin: { useAsTitle: "email" },
      fields: [{ name: "name", label: "Имя", type: "text" }],
    },
    {
      slug: "media",
      labels: { singular: "Файл", plural: "Медиатека" },
      access: { read: () => true },
      upload: {
        staticDir: path.resolve(dirname, "../media"),
        mimeTypes: ["image/*", "application/pdf"],
      },
      fields: [
        { name: "alt", label: "Описание (alt)", type: "text", localized: true },
        {
          name: "slotId",
          label: "ID слота",
          type: "text",
          index: true,
          admin: {
            description:
              "Куда встанет картинка на сайте: например home-hero, solar-hero, product-phnix-g20. Список — в манифесте изображений. Пока файла нет, на месте слота показывается плейсхолдер.",
          },
        },
      ],
    },
    {
      slug: "leads",
      labels: { singular: "Заявка", plural: "Заявки" },
      admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "phone", "interest", "source", "status", "createdAt"],
        description: "Заявки с форм сайта. Копия каждой заявки уходит в Битрикс24.",
      },
      access: { create: () => false }, // создаются только сервером через local API
      fields: [
        { name: "name", label: "Имя", type: "text", required: true },
        { name: "phone", label: "Телефон", type: "text", required: true },
        {
          name: "interest",
          label: "Что интересует",
          type: "select",
          admin: { readOnly: true },
          options: [
            { label: "Тепловые насосы", value: "heat" },
            { label: "Солнечные станции", value: "solar" },
            { label: "Климат", value: "climate" },
            { label: "Опт / партнёрство", value: "wholesale" },
            { label: "Другое", value: "other" },
          ],
        },
        { name: "message", label: "Комментарий", type: "textarea" },
        { name: "product", label: "Товар / расчёт", type: "text", admin: { readOnly: true } },
        {
          name: "formType",
          label: "Тип формы",
          type: "select",
          defaultValue: "general",
          admin: { readOnly: true },
          options: [
            { label: "Обычная заявка", value: "general" },
            { label: "Опт / партнёрство", value: "wholesale" },
            { label: "Сервис", value: "service" },
            { label: "Калькулятор", value: "calculator" },
          ],
        },
        { name: "company", label: "Компания", type: "text", admin: { readOnly: true } },
        { name: "volume", label: "Ориентировочный объём", type: "text", admin: { readOnly: true } },
        {
          name: "calculatorData",
          label: "Данные калькулятора",
          type: "json",
          admin: { readOnly: true, description: "Введённые параметры и результат расчёта." },
        },
        { name: "source", label: "Источник (форма)", type: "text", admin: { readOnly: true } },
        { name: "sourcePage", label: "Страница", type: "text", admin: { readOnly: true } },
        {
          name: "utm",
          label: "UTM-метки",
          type: "group",
          admin: { readOnly: true },
          fields: [
            { name: "source", label: "utm_source", type: "text" },
            { name: "medium", label: "utm_medium", type: "text" },
            { name: "campaign", label: "utm_campaign", type: "text" },
            { name: "content", label: "utm_content", type: "text" },
            { name: "term", label: "utm_term", type: "text" },
          ],
        },
        {
          name: "status",
          label: "Статус",
          type: "select",
          defaultValue: "new",
          options: [
            { label: "Новая", value: "new" },
            { label: "В работе", value: "inwork" },
            { label: "Завершена", value: "done" },
          ],
        },
        { name: "bitrixSynced", label: "Передана в Битрикс24", type: "checkbox", defaultValue: false, admin: { readOnly: true } },
      ],
    },
    {
      slug: "cases",
      labels: { singular: "Кейс", plural: "Кейсы" },
      admin: { useAsTitle: "title", description: "Реальные объекты для раздела «Решения» на сайте." },
      fields: [
        { name: "title", label: "Название объекта", type: "text", required: true },
        {
          name: "tag",
          label: "Направление",
          type: "select",
          options: [
            { label: "Тепловой насос", value: "heat" },
            { label: "Солнечная станция", value: "solar" },
            { label: "Климат", value: "climate" },
          ],
        },
        { name: "excerpt", label: "Кратко (для карточки)", type: "textarea" },
        { name: "body", label: "Описание", type: "richText" },
        { name: "photo", label: "Фото", type: "upload", relationTo: "media" },
        {
          name: "metrics",
          label: "Цифры (экономия, мощность и т.п.)",
          type: "array",
          fields: [
            { name: "label", label: "Показатель", type: "text" },
            { name: "value", label: "Значение", type: "text" },
          ],
        },
        { name: "published", label: "Показывать на сайте", type: "checkbox", defaultValue: false },
      ],
    },
    {
      slug: "brands",
      labels: { singular: "Бренд", plural: "Бренды-партнёры" },
      admin: { useAsTitle: "name" },
      access: { read: () => true },
      fields: [
        { name: "name", label: "Название", type: "text", required: true },
        { name: "note", label: "Подпись (сегмент)", type: "text" },
        { name: "logo", label: "Логотип", type: "upload", relationTo: "media" },
      ],
    },
    Categories,
    Products,
    Posts,
    Projects,
  ],
});
