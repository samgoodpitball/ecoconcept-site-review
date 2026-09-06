"use client";

import { useLeadModal } from "./LeadModal";

/** Кнопка, открывающая глобальную лид-модалку. Используется в шапке, hero и CTA-блоках. */
export default function LeadButton({
  children,
  interest,
  product,
  source,
  className = "btn-primary",
  onOpen,
}: {
  children: React.ReactNode;
  interest?: string;
  product?: string;
  source?: string;
  className?: string;
  onOpen?: () => void;
}) {
  const { open } = useLeadModal();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onOpen?.();
        open({ interest, product, source });
      }}
    >
      {children}
    </button>
  );
}
