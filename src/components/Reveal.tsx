import React, { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";

/** Hook de scroll-reveal via IntersectionObserver — mesmo usado na landing page */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

interface RevealProps {
  as?: ElementType;
  variant?: "up" | "scale" | "left" | "right";
  delay?: number;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

/** Junta dois ou mais refs num só callback ref — útil quando um elemento precisa
 * ser observado (scroll-reveal) E também referenciado externamente (ex: scrollIntoView) */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

/** Wrapper de animação fade+blur/scale/slide ao entrar na viewport — reaproveitado da landing page */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", children, ...rest }: RevealProps) {
  const [ref, inView] = useReveal();
  const variantClass =
    variant === "scale" ? "zuno-reveal-scale" :
    variant === "left" ? "zuno-reveal-left" :
    variant === "right" ? "zuno-reveal-right" :
    "zuno-reveal";

  return (
    <Tag
      ref={ref}
      className={`${variantClass} zuno-stagger ${inView ? "zuno-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}