This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Что изменилось после первого аудита (06.09.2026)

Снимок обновлён по итогам внешнего аудита. Исправлено:

- **числа приведены к методике**: оффер главной и статья про насос показывали
  4 700 / 9 500 сом, тогда как `lib/heating-compare.ts` для того же дома считает
  2 700 / 6 900 — расхождение убрано;
- **градиенты** остались ровно в двух разрешённых местах (блоки главной и секция
  «Как мы работаем»); из кнопок, формы заявки, полос-заявлений и затемнений на
  `/about` они убраны;
- **дубль «Направления»** на главной удалён — карточки повторяли блоки-предложения;
- **«Объекты из последних»** на `/about` сняты: сток с плейсхолдером города
  читался как портфолио, которого нет;
- **черновик цитаты** бригадира с пропуском имени больше не показывается;
- **«фото ожидается»** убрано из ленты на `/solar`: снимков нет ни у одной из 29
  позиций Deye, поэтому карточка показывает две характеристики из каталога;
- **мороз** добавлен первым пунктом в «Зачем менять отопление» на `/heat-pumps`;
- удалены **39 файлов** вёрстки двух прошлых поколений и девять мёртвых веток в
  `src/content/site.ts` со ссылками на несуществующие страницы;
- `DESIGN.md` помечен архивным: он описывает другую систему (Geist, радиус 6 px),
  действующие правила — в этом файле выше;
- `PRODUCT.md`: источник правды по ассортименту — каталог сайта.

Сознательно **не** приняты две правки аудита: гарантия «2 года на оборудование и
работы» оставлена (это решение заказчика от 29.08, заводская гарантия PHNIX его
покрывает), и hero продуктовых остался без кнопок — это принятое решение
заказчика, вопрос открыт.
