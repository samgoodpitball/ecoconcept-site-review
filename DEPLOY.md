# Деплой EcoConcept на Vercel — пошагово

Проект: Next.js 16 + Payload CMS 3 + PostgreSQL. Всё уже настроено, включая миграции БД при сборке
(скрипт `vercel-build`) и хранение медиа в Vercel Blob.

## Шаг 1. Код на GitHub (~5 минут)
1. Распакуйте архив `ecoconcept-site.zip` в папку на компьютере.
2. Создайте пустой приватный репозиторий на github.com (например, `ecoconcept-site`).
3. В терминале, в папке проекта:
   ```
   git init && git add -A && git commit -m "EcoConcept site v1"
   git branch -M main
   git remote add origin https://github.com/ВАШ_ЛОГИН/ecoconcept-site.git
   git push -u origin main
   ```

## Шаг 2. База данных Neon (~3 минуты, бесплатно)
1. Зарегистрируйтесь на neon.tech (можно через GitHub).
2. Создайте проект → скопируйте Connection string (с `?sslmode=require`).

## Шаг 3. Vercel (~5 минут)
1. vercel.com → Add New → Project → импортируйте репозиторий `ecoconcept-site`.
2. Перед первым деплоем добавьте Environment Variables (список — в `.env.example`):
   - `DATABASE_URI` — строка из Neon
   - `PAYLOAD_SECRET` — новая длинная случайная строка
   - `SITE_URL` — https://ваш-домен
   - `B24_WEBHOOK_URL` — вебхук Битрикс24 (можно добавить позже)
3. Deploy. Таблицы в БД создадутся автоматически (миграции запускаются в сборке).
4. Vercel → Storage → Create Blob store → Connect to project (появится `BLOB_READ_WRITE_TOKEN`) → Redeploy.

## Шаг 4. Домен
Vercel → Project → Settings → Domains → Add → введите домен → пропишите у регистратора
DNS-записи, которые покажет Vercel (A 76.76.21.21 или CNAME cname.vercel-dns.com).

## Шаг 5. Первый вход в админку
1. Откройте `https://ваш-домен/admin` — форма «Create first user».
2. Создайте свой аккаунт (это будет продакшен-админ; пароль из песочницы здесь не действует).
3. В админке: Бренды — добавьте 4 бренда; Кейсы — по мере появления фото.

## Шаг 6. После запуска (попросите Клода)
- Финальный Lighthouse-аудит на реальном домене.
- Google Search Console: подтвердить домен, отправить sitemap.xml.
- Сменить/проверить все доступы.

## Полезное
- Локальный запуск: `npm install && npm run dev` (нужен PostgreSQL и `.env`).
- Заявки падают: в Битрикс24 (если задан вебхук) и всегда — в админку `/admin` → Заявки.
- WhatsApp-ссылка кнопок меняется в одном месте: `src/content/site.ts` → `contacts.whatsapp`.
