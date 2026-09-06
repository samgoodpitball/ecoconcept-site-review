"use client";

import { useRef, useState } from "react";

/**
 * Ролик о работе теплового насоса во всю ширину секции.
 *
 * Стоит на месте статичного разреза дома: это его же анимированная версия —
 * тот же дом, та же разводка, но по шагам и с озвучкой. Статичная схема
 * (`scheme-house-3d.webp`) осталась в public, вернуть её — одна строка.
 *
 * Обычный <video>: со звуком приходят нативные контролы, громкость и
 * полноэкранный режим. До нажатия виден постер — движение и звук только как
 * отклик на действие.
 */
export default function VideoExplainer({
  src,
  poster,
  caption,
  label = "Смотреть, как работает тепловой насос",
}: {
  src: string;
  poster: string;
  caption?: string;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <figure className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="group relative overflow-hidden rounded-[12px] border border-line bg-white">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls={started}
          preload="metadata"
          playsInline
          onPlay={() => setStarted(true)}
          className="block aspect-[1280/868] w-full bg-white"
        />

        {!started ? (
          <button
            type="button"
            onClick={() => {
              setStarted(true);
              void videoRef.current?.play();
            }}
            className="absolute inset-0 flex items-center justify-center bg-graphite/5 transition-colors hover:bg-graphite/15"
            aria-label={label}
          >
            <span className="flex h-[74px] w-[74px] items-center justify-center rounded-full border border-white/70 bg-white/85 backdrop-blur-[2px] transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none md:h-[86px] md:w-[86px]">
              <svg width="24" height="28" viewBox="0 0 22 26" aria-hidden className="ml-1.5">
                <path d="M0 0v26l22-13z" fill="#2e6210" />
              </svg>
            </span>
          </button>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-[13px] leading-[1.5] text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
