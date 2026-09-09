import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The app's one surface. `plate-edge` draws the gilded hairline across the top
 * — the device that makes a panel read as an instrument plate rather than a
 * card in a dashboard. Padding starts at phone size and grows.
 */
export function Plate({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  /** Set when the plate is an anchor target, as the catalogue's groups are. */
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "plate-edge mb-8 overflow-hidden rounded-sm border border-rule bg-panel p-5 shadow-plate sm:mb-10 sm:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * A heading, its hairline rule, and an optional note.
 *
 * The note used to be `shrink-0` on one line with the title, which is correct
 * on a desktop column and forces 232px of horizontal scroll at 390px: notes in
 * this app are sentences ("facts about you, read as a pattern"), and a sentence
 * that may not shrink sets the width of the whole document.
 *
 * So the note may shrink and the row may wrap, and which happens is left to
 * the content: the sheet's notes are a single digit and stay on the heading's
 * line, the catalogue's are clauses and drop below it. Forcing `w-full` on a
 * phone did fix the overflow and left every one-character count stranded on a
 * line of its own.
 */
export function PlateHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <h2 className="min-w-0 text-xl">{title}</h2>
      <span className="h-px min-w-6 flex-1 bg-rule" aria-hidden />
      {note ? <span className="label-caps min-w-0">{note}</span> : null}
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
