import { redirect } from "next/navigation";
import { DEFAULT_CATEGORY, categoryHref } from "@/lib/catalog-view";

/** «Каталог» без раздела открывает тепловые насосы — с них начинается ассортимент. */
export default function CatalogIndex() {
  redirect(categoryHref(DEFAULT_CATEGORY));
}
