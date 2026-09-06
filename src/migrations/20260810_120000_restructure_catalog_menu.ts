import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Реструктуризация каталога по запросу заказчика (10.08.2026):
 * левое меню каталога должно показывать ровно 3 верхних раздела —
 * «Тепловые насосы», «Солнечные станции», «Комплектующие».
 *
 * 1. Добавляем бренд Deye (для будущих инверторов/аккумуляторов) — Postgres enum,
 *    поэтому нужен raw SQL ALTER TYPE (Payload Local API этого не делает).
 * 2. «Баки ГВС и буферные» переезжают из «Тепловые насосы» в «Комплектующие»
 *    (там остаются только PHNIX и Hisense — как просил заказчик).
 * 3. Раздел «Климат» / «Мульти-сплит Hisense» был отдельным верхним разделом —
 *    сворачиваем его в подкатегорию «Комплектующие», сам верхний узел «Климат» удаляем.
 * 4. Добавляем пустую подкатегорию «Фанкойлы» под «Комплектующие» (характеристик
 *    товаров пока нет — заказчик пришлёт отдельно).
 *
 * Миграция идемпотентна: каждый шаг обёрнут в try/catch и опирается на slug,
 * повторный запуск ничего не сломает.
 */
export async function up({ payload, db }: MigrateUpArgs): Promise<void> {
  try {
    await db.execute(sql`ALTER TYPE "public"."enum_products_brand" ADD VALUE IF NOT EXISTS 'Deye';`)
  } catch (e) {
    payload.logger.warn(`migration: add Deye brand enum skipped: ${String(e)}`)
  }

  const accessories = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'accessories' } },
    limit: 1,
  })
  const accessoriesId = accessories.docs[0]?.id

  if (!accessoriesId) {
    payload.logger.warn('migration: "accessories" category not found — skipping catalog restructure')
    return
  }

  try {
    await payload.update({
      collection: 'categories',
      where: { slug: { equals: 'accessories' } },
      data: {
        description:
          'Баки, фанкойлы, климатическое оборудование и сопутствующие компоненты для тепловых насосов и солнечных станций.',
      },
    })
  } catch (e) {
    payload.logger.warn(`migration: accessories description update skipped: ${String(e)}`)
  }

  try {
    await payload.update({
      collection: 'categories',
      where: { slug: { equals: 'dhw-tanks' } },
      data: { parent: accessoriesId, order: 41 },
    })
  } catch (e) {
    payload.logger.warn(`migration: dhw-tanks reparent skipped: ${String(e)}`)
  }

  try {
    await payload.create({
      collection: 'categories',
      data: {
        title: 'Фанкойлы',
        slug: 'fan-coils',
        parent: accessoriesId,
        order: 42,
        description:
          'Номенклатура фанкойлов уточняется у поставщика. Подберём модель под контур отопления/охлаждения — напишите нам, пришлём характеристики и стоимость.',
      },
    })
  } catch (e) {
    payload.logger.warn(`migration: fan-coils category create skipped: ${String(e)}`)
  }

  try {
    await payload.update({
      collection: 'categories',
      where: { slug: { equals: 'multisplit' } },
      data: { parent: accessoriesId, order: 43 },
    })
  } catch (e) {
    payload.logger.warn(`migration: multisplit reparent skipped: ${String(e)}`)
  }

  try {
    await payload.delete({ collection: 'categories', where: { slug: { equals: 'climate' } } })
  } catch (e) {
    payload.logger.warn(`migration: climate category cleanup skipped: ${String(e)}`)
  }

  try {
    await payload.update({
      collection: 'categories',
      where: { slug: { equals: 'solar-panels' } },
      data: { title: 'Панели Trina Solar' },
    })
    await payload.update({
      collection: 'categories',
      where: { slug: { equals: 'inverters' } },
      data: {
        title: 'Инверторы Deye',
        description:
          'Номенклатура инверторов Deye уточняется у поставщика. Подберём модель под мощность станции — напишите нам, пришлём характеристики и стоимость.',
      },
    })
    await payload.update({
      collection: 'categories',
      where: { slug: { equals: 'batteries' } },
      data: {
        title: 'Аккумуляторы Deye',
        description:
          'Номенклатура аккумуляторов Deye уточняется у поставщика. Ёмкость подбираем под задачу: вечернее потребление или резерв на время отключений.',
      },
    })
  } catch (e) {
    payload.logger.warn(`migration: solar subcategory titles update skipped: ${String(e)}`)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Полный откат таксономии здесь не реализуем (та же причина, что и в
  // 20260807_120000): проще пересобрать через scripts/seed-catalog.ts
  // из версии кода до этой миграции. Добавленное значение enum 'Deye'
  // Postgres не позволяет удалить командой DROP VALUE.
  const heatPumps = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'heat-pumps' } },
    limit: 1,
  })
  const heatPumpsId = heatPumps.docs[0]?.id
  if (heatPumpsId) {
    try {
      await payload.update({
        collection: 'categories',
        where: { slug: { equals: 'dhw-tanks' } },
        data: { parent: heatPumpsId, order: 14 },
      })
    } catch (e) {
      payload.logger.warn(`migration down: dhw-tanks revert skipped: ${String(e)}`)
    }
  }
  try {
    await payload.delete({ collection: 'categories', where: { slug: { equals: 'fan-coils' } } })
  } catch (e) {
    payload.logger.warn(`migration down: fan-coils cleanup skipped: ${String(e)}`)
  }
}
