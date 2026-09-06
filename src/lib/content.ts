import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Post, Project } from "@/payload-types";

export const postCategories: Record<string, string> = {
  "heat-pumps": "Тепловые насосы",
  solar: "Солнечная энергетика",
  payback: "Выбор и окупаемость",
  ecology: "Экология и уход от угля",
  company: "Компания",
};

export const projectTypes: Record<string, string> = {
  home: "Дом",
  business: "Бизнес",
  agro: "Агро",
};

export const projectDirections: Record<string, string> = {
  heat_pump: "Тепловой насос",
  solar: "Солнечная станция",
  climate: "Климат",
};

/** Опубликованные статьи, свежие сверху. При недоступной базе — пустой список. */
export const getPosts = cache(async (): Promise<Post[]> => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "posts",
      where: { published: { equals: true } },
      limit: 200,
      depth: 1,
      pagination: false,
      sort: "-publishedAt",
    });
    return res.docs;
  } catch {
    return [];
  }
});

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "projects",
      where: { published: { equals: true } },
      limit: 200,
      depth: 1,
      pagination: false,
      sort: "-date",
    });
    return res.docs;
  } catch {
    return [];
  }
});

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

/** Грубая оценка времени чтения, если поле не заполнено вручную. */
export function readingTimeOf(post: Post): number {
  if (post.readingTime) return post.readingTime;
  const outline = (post.outline ?? []).length;
  return Math.max(3, outline * 2);
}

export function formatDate(value?: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}
