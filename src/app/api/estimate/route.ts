import { NextResponse } from "next/server";
import { estimate, emptyAnswers, type Answers } from "@/lib/estimate";
import { priceHeat, priceSolar, type Price } from "@/lib/pricing.server";

/**
 * Расчёт цены «под ключ» для квиза.
 *
 * Почему отдельным маршрутом, а не на клиенте: цена считается от закупочных
 * цен, а они внутренние. Подбор мощности и модели квиз делает у себя, но за
 * ценой ходит сюда — наружу уходит только итог в сомах.
 */
export async function POST(req: Request) {
  let body: { answers?: Partial<Answers> };
  try {
    body = (await req.json()) as { answers?: Partial<Answers> };
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const answers: Answers = { ...emptyAnswers, ...(body.answers ?? {}) };
  const { heat, solar } = estimate(answers);

  const price: { heat: Price | null; solar: Price | null } = {
    heat: heat ? priceHeat(answers, heat) : null,
    solar: solar ? priceSolar(solar) : null,
  };

  return NextResponse.json({ ok: true, price });
}
