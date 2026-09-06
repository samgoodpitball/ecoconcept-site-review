"use client";

import { usePathname } from "next/navigation";
import { contacts } from "@/content/site";
import { track } from "@/lib/analytics";

/** Плавающая кнопка WhatsApp в правом нижнем углу — на всех страницах. */
export default function FloatingWhatsapp() {
  const pathname = usePathname();
  // В админке Payload не показываем
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={contacts.whatsapp(pathname ?? "site")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      onClick={() => track("whatsapp_click", { page: pathname })}
      className="fixed bottom-5 right-5 z-40 max-md:bottom-4 max-md:right-4 flex h-14 w-14 items-center justify-center rounded-full bg-eco text-white shadow-[0_12px_32px_rgba(20,20,20,0.14)] transition hover:bg-eco-dark"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.6.1-.8l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    </a>
  );
}
