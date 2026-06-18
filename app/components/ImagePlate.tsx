"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
  return (
    <motion.figure
      className={(fullBleed ? "-mx-6 " : "") + "my-12"}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className={
          "relative overflow-hidden bg-bg-elev " +
          (aspect === "16/9" ? "aspect-video" : "aspect-[3/2]")
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 680px, 100vw"
        />
      </div>
      <figcaption
        className="mt-4 text-text-faint text-[11px] leading-[1.6] tracking-[0.04em]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="text-accent mr-3">Plate {plateId}</span>
        {caption}
      </figcaption>
    </motion.figure>
  );
}
