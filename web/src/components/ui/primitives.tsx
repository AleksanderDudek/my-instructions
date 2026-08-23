import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Plate({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("mb-10 rounded-sm border border-rule bg-panel p-6 shadow-plate sm:p-8", className)}>
      {children}
    </section>
  );
}

export function PlateHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-4">
      <h2 className="text-xl">{title}</h2>
      <span className="h-px flex-1 bg-rule" aria-hidden />
      {note ? <span className="label-caps shrink-0">{note}</span> : null}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-sm border border-rule bg-panel-2 p-5", className)}>{children}</div>;
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("max-w-[62ch] leading-relaxed text-ink/90", className)}>{children}</p>;
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="label-caps">{children}</span>;
}
