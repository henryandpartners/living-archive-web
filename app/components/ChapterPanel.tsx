"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  number: number;
  title: string;
  align: "left" | "right";
  dark?: boolean;
  children: ReactNode;
}

export function ChapterPanel({ number, title, align, dark, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const bg = dark
    ? "bg-[#031d2e]"
    : "bg-[#f7f9fb]";

  const textColor = dark ? "text-white/90" : "text-[#42617a]";
  const headingColor = dark ? "text-white" : "text-ink";

  return (
    <section
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center px-[clamp(22px,5vw,56px)] ${bg}`}
    >
      <div
        className={
          "wrap w-full max-w-[1180px] mx-auto flex " +
          (align === "left" ? "justify-start" : "justify-end")
        }
      >
        {/* Number badge */}
        <div
          className={
            "absolute top-[20%] opacity-10 pointer-events-none font-serif font-bold text-[clamp(120px,18vw,220px)] leading-none select-none " +
            (align === "left" ? "right-[5%]" : "left-[5%]") +
            (dark ? " text-white" : " text-ink")
          }
        >
          {String(number).padStart(2, "0")}
        </div>

        <div
          className={
            "content max-w-[540px] transition-all duration-500 " +
            (inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9")
          }
          style={{
            padding: "30px 34px",
            background: dark
              ? "radial-gradient(125% 120% at 50% 45%, rgba(3,29,46,0.94) 0%, rgba(3,29,46,0.72) 46%, rgba(3,29,46,0) 86%)"
              : "radial-gradient(125% 120% at 50% 45%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.72) 46%, rgba(255,255,255,0) 86%)",
            borderRadius: 8,
          }}
        >
          <p className="font-serif text-[12px] tracking-[0.3em] uppercase text-azure mb-4">
            Chapter {String(number).padStart(2, "0")}
          </p>
          <h2 className={`font-serif font-light text-[clamp(28px,5vw,48px)] leading-[1.06] tracking-[-0.01em] mb-5 ${headingColor}`}>
            {title}
          </h2>

          <div className={`${textColor} text-[clamp(15px,2.2vw,17px)] leading-[1.7] space-y-4 font-light`}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
