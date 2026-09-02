"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { EASE, prefersStaticMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ImageMaskReveal({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className = "",
  objectPosition = "center",
  zoom = true,
  trigger = "scroll",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
  zoom?: boolean;
  trigger?: "scroll" | "mount";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const img = imgRef.current;
      if (!wrap || !img) return;

      const reduced = prefersStaticMotion();

      if (reduced) {
        gsap.set(wrap, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(img, { scale: 1 });
        return;
      }

      gsap.set(wrap, { clipPath: "inset(100% 0% 0% 0%)" });
      if (zoom) gsap.set(img, { scale: 1.08 });

      const tl = gsap.timeline({ paused: true });
      tl.to(wrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE.mask });
      if (zoom) tl.to(img, { scale: 1, duration: 1.8, ease: EASE.soft }, 0.05);

      if (trigger === "mount") {
        tl.play();
      } else {
        ScrollTrigger.create({
          trigger: wrap,
          start: "top 85%",
          once: true,
          onEnter: () => tl.play(),
        });
      }
    },
    { scope: wrapRef, dependencies: [src, trigger] },
  );

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover", objectPosition }}
      />
    </div>
  );
}
