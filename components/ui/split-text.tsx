"use client";

import { useRef, useEffect, useState, useMemo } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: "chars" | "words";
  from?: { opacity?: number; y?: number };
  to?: { opacity?: number; y?: number };
  threshold?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 0.6,
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  tag: Tag = "p",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const units = useMemo(() => {
    if (splitType === "words") {
      return text.split(/(\s+)/);
    }
    // chars: split into characters, preserving spaces
    return text.split("");
  }, [text, splitType]);

  let charIndex = 0;

  return (
    // @ts-expect-error -- dynamic tag
    <Tag ref={ref} className={className} aria-label={text}>
      {units.map((unit, i) => {
        if (/^\s+$/.test(unit)) {
          if (splitType === "words") {
            return <span key={i}>{unit}</span>;
          }
          charIndex++;
          return <span key={i}>{unit}</span>;
        }

        if (splitType === "words") {
          const idx = charIndex;
          charIndex++;
          return (
            <span
              key={i}
              className="inline-block"
              style={{
                opacity: isVisible ? (to.opacity ?? 1) : (from.opacity ?? 0),
                transform: isVisible
                  ? `translateY(${to.y ?? 0}px)`
                  : `translateY(${from.y ?? 40}px)`,
                transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${idx * delay / 1000}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${idx * delay / 1000}s`,
                willChange: "opacity, transform",
              }}
            >
              {unit}
            </span>
          );
        }

        // chars
        const idx = charIndex;
        charIndex++;
        return (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: isVisible ? (to.opacity ?? 1) : (from.opacity ?? 0),
              transform: isVisible
                ? `translateY(${to.y ?? 0}px)`
                : `translateY(${from.y ?? 40}px)`,
              transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${idx * delay / 1000}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${idx * delay / 1000}s`,
              willChange: "opacity, transform",
            }}
          >
            {unit}
          </span>
        );
      })}
    </Tag>
  );
}
