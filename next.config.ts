import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import { catalog } from "./src/content/catalog";

const nextConfig: NextConfig = {
  images: {
    // Next 16 отдаёт 400 на quality, которого нет в этом списке — из-за этого
    // hero-картинки с quality={70} не отрисовывались.
    // 80 нужен для Hero.tsx и PageKit.tsx — без него /v2 остаётся без единой картинки.
    qualities: [70, 75, 80],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Старый сайт жил на языковых префиксах /ru/ и /en/ — именно эти адреса
      // до сих пор в индексе Google и до этой правки отдавали 404.
      // Конкретные страницы идут раньше catch-all: Next применяет правила по порядку.
      { source: "/ru/climate/teplovye-nasosy", destination: "/catalog/heat-pumps", permanent: true },
      { source: "/ru/climate/ventilyaciya", destination: "/catalog/climate", permanent: true },
      { source: "/ru/climate/vrf-kondicionirovanie", destination: "/catalog/climate", permanent: true },
      { source: "/ru/climate/:path*", destination: "/catalog/climate", permanent: true },
      { source: "/ru/solar/elektrostancii", destination: "/catalog/solar-panels", permanent: true },
      { source: "/ru/solar/vodonagrevateli", destination: "/catalog/tanks", permanent: true },
      { source: "/ru/solar/:path*", destination: "/catalog/solar-panels", permanent: true },
      // Эти две страницы старого сайта — то, что Google показывает по брендовым
      // запросам («экоконцепт», «эко концепт бишкек»). Ведём их на главную, чтобы
      // именно она стала лицом бренда в выдаче, а не «О компании» старого сайта.
      { source: "/ru/o-kompanii", destination: "/", permanent: true },
      { source: "/ru/proekty", destination: "/", permanent: true },
      { source: "/ru/kontakty", destination: "/", permanent: true },
      // Всё прочее из старой структуры — на главную, чтобы ни одна ссылка из
      // выдачи не упиралась в 404.
      { source: "/ru", destination: "/", permanent: true },
      { source: "/ru/:path*", destination: "/", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/", permanent: true },

      // Адреса без языкового префикса — на случай, если такие ссылки где-то остались.
      { source: "/teplovye-nasosy", destination: "/catalog/heat-pumps", permanent: true },
      { source: "/solnechnye-stancii", destination: "/catalog/solar-panels", permanent: true },
      { source: "/klimat", destination: "/catalog/climate", permanent: true },
      { source: "/o-kompanii", destination: "/", permanent: true },
      { source: "/kontakty", destination: "/", permanent: true },
      { source: "/resheniya", destination: "/", permanent: true },
      { source: "/proekty", destination: "/", permanent: true },

      // 04.09.2026 модели переехали внутрь разделов: /catalog/phnix-g20 →
      // /catalog/heat-pumps/phnix-g20. Ведём старые адреса на новые.
      ...catalog.map((item) => ({
        source: `/catalog/${item.slug}`,
        destination: `/catalog/${item.category}/${item.slug}`,
        permanent: true,
      })),
    ];
  },
};

export default withPayload(nextConfig);
