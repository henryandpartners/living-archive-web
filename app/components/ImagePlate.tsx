"use client";

import Image from "next/image";
import { useReveal } from "../hooks/useReveal";

export interface ImagePlateProps {
  src: string;
  alt: string;
  plateId: string;
  caption: string;
  aspect?: "3/2" | "16/9";
  fullBleed?: boolean;
}

export function ImagePlate({
  src,
  alt,
  plateId,
  caption,
  aspect = "3/2",
  fullBleed,
}: ImagePlateProps) {
  const { ref, visible } = useReveal();

  return (
    <figure
      ref={ref}
      className={
        "my-12 reveal " +
        (visible ? "visible " : "") +
        (fullBleed ? "-mx-6 " : "")
      }
    >
      <div
        className={
          "relative overflow-hidden rounded-lg bg-accent-soft shadow-md " +
          (aspect === "16/9" ? "aspect-video" : "aspect-[3/2]")
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          sizes="(min-width: 768px) 680px, 100vw"
        />
      </div>
      <figcaption className="mt-3 font-mono text-[11px] tracking-[0.04em] text-text-faint leading-[1.5]">
        <span className="text-accent mr-3 font-semibold">Plate {plateId}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
