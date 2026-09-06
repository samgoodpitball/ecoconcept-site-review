import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Чистка данных по решению заказчика (август 2026):
 * 1. Бренд YKR выведен из ассортимента — удаляем его товары и подкатегорию.
 * 2. Проекты-заглушки («Пример-заглушка») убраны с сайта — удаляем их из БД.
 *
 * Удаляем через Payload Local API: он сам чистит связанные таблицы
 * (badges, specs, rels и т.д.). Миграция идемпотентна — повторный запуск
 * просто ничего не найдёт.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Проекты-заглушки (ссылаются на товары — удаляем первыми)
  try {
    await payload.delete({ collection: 'projects', where: { isPlaceholder: { equals: true } } })
  } catch (e) {
    payload.logger.warn(`migration: projects cleanup skipped: ${String(e)}`)
  }

  // Товары YKR (насосы и баки)
  try {
    await payload.delete({ collection: 'products', where: { brand: { equals: 'YKR' } } })
  } catch (e) {
    payload.logger.warn(`migration: YKR products cleanup skipped: ${String(e)}`)
  }

  // Подкатегория YKR
  try {
    await payload.delete({ collection: 'categories', where: { slug: { equals: 'heat-pumps-ykr' } } })
  } catch (e) {
    payload.logger.warn(`migration: YKR category cleanup skipped: ${String(e)}`)
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Данные восстанавливаются повторным запуском scripts/seed-catalog.ts
  // (из версии кода до этой миграции) — откат здесь не реализуем.
}
