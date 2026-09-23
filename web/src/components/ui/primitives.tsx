import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Roundel, type IconName } from "@/components/brand/art";

/**
 * The app's one surface: a pane of leaded glass. `plate` is the glass and its
 * leading, `plate-edge` the gilded edge across the top — the device that makes
 * a panel read as a pane of the window rather than a card in a dashboard.
 * Padding starts at phone size and grows. `lancet` arches the head, for
 * feature moments only (and only on panes 240px wide or more).
 */
export function Plate({
  children,
  className,
  id,
  lancet = false,
}: {
  children: ReactNode;
  className?: string;
  /** Set when the plate is an anchor target, as the catalogue's groups are. */
  id?: string;
  lancet?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "plate plate-edge mb-8 overflow-hidden p-5 sm:mb-10 sm:p-8",
        lancet && "lancet sm:pt-12",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * A heading, its hairline rule running from gold into bronze, and an optional note.
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
export function PlateHead({ title, note, icon }: { title: string; note?: string; icon?: IconName }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      {icon ? <Roundel name={icon} size={32} className="self-center" /> : null}
      <h2 className="min-w-0 text-xl">{title}</h2>
      <span className="h-px min-w-6 flex-1 bg-linear-to-r from-brass to-rule to-40%" aria-hidden />
      {note ? <span className="label-caps min-w-0">{note}</span> : null}
    </div>
  );
}

/** A glass inset inside a pane: `panel-2` with the same leading, cut to `radius-sm`. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("leaded rounded-sm bg-panel-2 p-5", className)}>{children}</div>;
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("max-w-[62ch] leading-relaxed text-ink/90", className)}>{children}</p>;
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="label-caps">{children}</span>;
}
