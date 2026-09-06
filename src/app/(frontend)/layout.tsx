import type { Metadata } from "next";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { ru, contacts } from "@/content/site";
import { LeadModalProvider } from "@/components/LeadModal";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";

const siteUrl = process.env.SITE_URL ?? "https://www.ecoconcept.kg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: ru.meta.title,
  description: ru.meta.description,
  alternates: {
    canonical: "/",
    languages: { ru: "/", "x-default": "/" },
  },
  openGraph: {
    title: ru.meta.title,
    description: ru.meta.description,
    locale: "ru_RU",
    type: "website",
    siteName: "EcoConcept",
    // Временная OG до появления отдельной картинки под соцсети
    images: [{ url: "/photo/H-01.webp", width: 1800, height: 1500, alt: ru.meta.title }],
  },
  twitter: { card: "summary_large_image" },
  // Подтверждение прав на сайт в Google Search Console (ресурс
  // https://www.ecoconcept.kg, аккаунт samakirov@gmail.com). Значение публичное —
  // оно и так отдаётся в <head>. Удалять нельзя: подтверждение слетит.
  verification: { google: "yKpTxdBKMTGCsaTgFZcbJL1bO6V-wOd48pqGjKcgPtI" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "EcoConcept",
  // Ищут преимущественно кириллицей — без этих вариантов Google хуже связывает
  // запрос «экоконцепт» с сайтом.
  alternateName: ["ЭкоКонцепт", "Эко Концепт", "Эко-концепт", "Экоконцепт"],
  url: siteUrl,
  description: ru.meta.description,
  telephone: [contacts.phoneDisplay, contacts.phone2Display].map((n) =>
    n.replace(/\s/g, "")
  ),
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Сухэ-Батора, 19, Eon Executive Hub",
    addressLocality: "Бишкек",
    addressCountry: "KG",
  },
  hasMap: contacts.addressLink,
  openingHours: "Mo-Sa 09:00-18:00",
  areaServed: "Кыргызстан",
  slogan: ru.footer.slogan,
  knowsAbout: ["тепловые насосы", "солнечные электростанции", "климатические системы"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LeadModalProvider>
          {children}
          <FloatingWhatsapp />
        </LeadModalProvider>
      </body>
    </html>
  );
}
