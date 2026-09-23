import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Roundel, Uriel, type IconName, type UrielMood } from "./art";

/**
 * Uriel's moments: the places the angel guide appears.
 *
 * He marks a moment and never explains a result — the plates beside him do
 * that. One Uriel per screen, beside the moment and never over its text; his
 * line is first person, short, and the joke (at most one) is on his halo,
 * never on the reader.
 */

/**
 * Nothing yet, something went wrong, or something untried: a lancet pane,
 * centred, with Uriel over an h4-sized title and one line. Errors set the
 * title in `madder` and always say what to do next.
 */
export function EmptyState({
  mood,
  title,
  children,
  kicker,
  tone = "calm",
  action,
  level = 2,
  className,
}: {
  mood: Extract<UrielMood, "sleepy" | "oops" | "curious">;
  title: string;
  children?: ReactNode;
  kicker?: string;
  tone?: "calm" | "error" | "new";
  action?: ReactNode;
  /** 1 when the state is the whole page, as a dead link is. */
  level?: 1 | 2;
  className?: string;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <section
      className={cn(
        "plate plate-edge lancet mx-auto my-10 flex max-w-md flex-col items-center px-5 pb-8 text-center sm:px-8",
        className,
      )}
    >
      <Uriel mood={mood} width={120} />
      {kicker ? (
        <span className={cn("label-caps mt-3", tone === "error" && "text-madder", tone === "new" && "text-flame")}>
          {kicker}
        </span>
      ) : null}
      <Heading className={cn("mt-2 text-[1.15rem]", tone === "error" && "text-madder")}>{title}</Heading>
      {children ? <div className="mt-2 max-w-[46ch] leading-relaxed text-muted">{children}</div> : null}
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </section>
  );
}

/**
 * A step marked: a finished test, the whole sheet, a link sent. A pane with
 * Uriel beside a kicker, a title of six words or fewer and his one line.
 *
 * Announced with `role="status"` so a screen reader hears it without focus
 * moving. Shown one at a time and never over the result itself — callers put
 * it above the result, not on it.
 */
export function Moment({
  mood,
  kicker,
  icon,
  title,
  line,
  actions,
  kickerTone = "muted",
  onDismiss,
  dismissLabel,
  className,
  as: Tag = "div",
  label,
}: {
  mood: UrielMood;
  kicker: string;
  icon?: IconName;
  title: string;
  line: string;
  actions?: ReactNode;
  kickerTone?: "muted" | "done";
  /** A close control in the corner, for moments that may be waved away. */
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
  as?: "div" | "aside";
  label?: string;
}) {
  return (
    <Tag
      role={Tag === "div" ? "status" : undefined}
      aria-label={label}
      className={cn(
        "plate plate-edge mb-8 flex items-center gap-4 p-5 sm:mb-10 sm:gap-6 sm:p-8",
        onDismiss && "pr-12 sm:pr-14",
        className,
      )}
    >
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="absolute right-1.5 top-1.5 grid size-11 place-items-center rounded-sm text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden>✕</span>
        </button>
      ) : null}
      <Uriel mood={mood} width={120} />
      <div className="min-w-0">
        <span className="flex items-center gap-2">
          {icon ? <Roundel name={icon} size={24} /> : null}
          <span className={cn("label-caps", kickerTone === "done" && "text-verdigris")}>{kicker}</span>
        </span>
        <h2 className="mt-1.5 text-[1.3rem] sm:text-[1.35rem]">{title}</h2>
        <p className="mt-1.5 max-w-[52ch] leading-relaxed text-ink/90">{line}</p>
        {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </Tag>
  );
}
