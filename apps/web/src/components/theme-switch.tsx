"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const options: {
  theme: Theme;
  label: string;
  icon: typeof SunIcon | typeof MoonIcon;
}[] = [
  { theme: "dark", label: "Dark", icon: MoonIcon },
  { theme: "light", label: "Light", icon: SunIcon },
];

export function ThemeSwitch() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useLayoutEffect(() => {
    const stored = localStorage.getItem("theme");
    const next: Theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function apply(next: Theme, point: { x: number; y: number }) {
    flushSync(() => setOpen(false));

    if (next === theme) return;

    const commit = () => {
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      flushSync(() => setTheme(next));
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const start = document.startViewTransition?.bind(document);

    if (reduced || !start) {
      commit();
      return;
    }

    document.documentElement.style.setProperty("--theme-x", `${point.x}px`);
    document.documentElement.style.setProperty("--theme-y", `${point.y}px`);
    start(commit);
  }

  return (
    <div
      ref={rootRef}
      className="fixed right-3 bottom-1 z-50 flex flex-col items-end gap-2"
    >
      {open ? (
        <div id={menuId} className="flex flex-col items-end gap-2">
          {options.map((option) => {
            const Icon = option.icon;
            const selected = theme === option.theme;

            return (
              <Button
                key={option.theme}
                type="button"
                variant={selected ? "default" : "outline"}
                aria-pressed={selected}
                onClick={(event) =>
                  apply(option.theme, { x: event.clientX, y: event.clientY })
                }
                className="h-11 gap-2 rounded-full pr-3.5 pl-3 shadow-md"
              >
                <Icon
                  data-icon="inline-start"
                  weight={selected ? "fill" : "regular"}
                />
                {option.label}
              </Button>
            );
          })}
        </div>
      ) : null}
      <Button
        type="button"
        size="icon"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Fechar tema" : "Abrir tema"}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "size-14 rounded-full shadow-lg",
          open && "ring-2 ring-ring",
        )}
      >
        <SunIcon weight="fill" className="dark:hidden" />
        <MoonIcon weight="fill" className="hidden dark:block" />
      </Button>
    </div>
  );
}
