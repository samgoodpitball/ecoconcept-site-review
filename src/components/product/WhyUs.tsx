import { Icon, type IconName } from "@/components/ui/icons";
import { Eyebrow } from "./SectionKit";

/**
 * Секция «Почему EcoConcept» — причины выбрать нас, а не соседа по рынку.
 *
 * Подача — «протокол преимуществ»: линованный перечень с моно-номером,
 * чертёжной иконкой сущности и полным текстом причины. Фотографий здесь нет
 * сознательно (находка №2 брифа): четыре из пяти карточек стояли на сером
 * стоке и на телефоне давали полтора экрана серых прямоугольников. Своей
 * съёмки долго не будет — а протокол работает без неё и читается целиком,
 * без наведений и кликов. Поля photo/alt/badge в контенте сохранены: когда
 * появится съёмка, решим, возвращать ли её сюда или в раздел объектов.
 *
 * Секция общая для главной и обеих продуктовых; различается только контент.
 */

export type WhyItem = {
  readonly title: string;
  readonly text: string;
  /** Чертёжная иконка сущности из общего модуля (метаданные подачи). */
  readonly icon?: IconName;
  readonly photo?: string;
  readonly alt?: string;
  readonly badge?: string;
};

export default function WhyUs({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: readonly WhyItem[];
}) {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        {/* Подзаголовок встал в роль рубрики: у секции появляется та же левая
            шапка с номером, что у всех остальных. */}
        <Eyebrow>{subtitle}</Eyebrow>
        <h2 className="mt-5 max-w-[16em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
          {title}
        </h2>

        <div className="mt-10 border-t border-line md:mt-12">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="grid gap-x-10 gap-y-2.5 border-b border-line py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:py-7"
            >
              <div className="flex items-start gap-4">
                <span aria-hidden className="num pt-0.5 text-[0.82rem] font-medium text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.icon && <Icon name={item.icon} size={26} className="mt-px shrink-0 text-eco-dark" />}
                <h3 className="font-head text-[17.5px] font-bold leading-[1.3] text-graphite md:text-[19px]">
                  {item.title}
                </h3>
              </div>
              <p className="pl-9 text-[15.5px] leading-[1.65] text-muted md:pl-0 md:text-[16px]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
