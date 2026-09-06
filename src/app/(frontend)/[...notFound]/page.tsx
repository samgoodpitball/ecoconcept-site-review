import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Страница не найдена | EcoConcept",
  description: "Такой страницы нет — возможно, ссылка устарела. Загляните в каталог оборудования.",
  robots: { index: false, follow: true },
};

/**
 * Ловит любые несуществующие адреса и отдаёт брендированную страницу 404
 * из (frontend)/not-found.tsx. Без этого Next показывал бы свою
 * англоязычную заглушку: not-found.tsx внутри группы срабатывает только
 * на notFound() из самой группы, а не на неизвестный URL.
 *
 * Конкретные маршруты (/catalog/…, /admin, /api/…) приоритетнее catch-all,
 * поэтому они продолжают работать как раньше.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
