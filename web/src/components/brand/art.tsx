import { cn } from "@/lib/cn";
import type { Channel } from "@/core/types";

/**
 * Uriel and the glass roundels.
 *
 * Every piece exists twice: cut in the stained-glass palette and in White &
 * gold. Both are rendered and `art-glass` / `art-white` in globals.css decide
 * which is seen from `data-theme`, so the swap needs no client state and can
 * never put both sets on one screen. Both are lazy: a hidden lazy image is
 * never fetched, so each reader downloads one set.
 *
 * The files are fixed colours (an <img> cannot follow the theme) and are
 * never recoloured — the gold ring and each panel's own frame carry them on
 * every ground.
 */
export const URIEL = [
  "hello", "curious", "wise", "proud", "celebrate", "share",
  "cheers", "coffee", "sleepy", "oops", "avatar",
] as const;
export type UrielMood = (typeof URIEL)[number];

export const ICONS = [
  "tests", "sheet", "share", "profile", "paths", "key", "coffee", "achievement", "heart", "flame",
] as const;
export type IconName = (typeof ICONS)[number];

/**
 * The roundel each channel of the sheet is headed by. Channels are how a
 * reader reaches the person, so the glyph names the channel, never the
 * instrument that produced its cards.
 */
export const CHANNEL_ICON = {
  communication: "share",
  affection: "heart",
  work: "tests",
  conflict: "flame",
  energy: "profile",
  rhythm: "paths",
} as const satisfies Record<Channel, IconName>;

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Pair({ file, alt, className, width, height }: { file: string; alt: string; className?: string; width: number; height: number }) {
  const common = { width, height, loading: "lazy" as const, decoding: "async" as const, draggable: false };
  // Plain <img>: these are small vector files, and the static export runs with
  // `images.unoptimized`, so next/image would add a wrapper and nothing else.
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}/brand/${file}.svg`} alt={alt} className={cn("art-glass flex-none", className)} {...common} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}/brand/${file}-white.svg`} alt={alt} className={cn("art-white flex-none", className)} {...common} />
    </>
  );
}

/**
 * Uriel, marking a moment. Panels are 3:4 and read from 120px wide; below
 * that the face stops reading, so small spaces take the round `avatar`.
 * One Uriel per screen. `alt` is empty when a line of copy beside him already
 * says what the moment is.
 */
export function Uriel({ mood, alt = "", width = 120, className }: { mood: UrielMood; alt?: string; width?: number; className?: string }) {
  const height = mood === "avatar" ? width : Math.round((width * 4) / 3);
  return <Pair file={`uriel/uriel-${mood}`} alt={alt} width={width} height={height} className={className} />;
}

/** A glass roundel. Always beside a word, so it is decorative by default. */
export function Roundel({ name, size = 32, alt = "", className }: { name: IconName; size?: number; alt?: string; className?: string }) {
  return <Pair file={`icons/icon-${name}`} alt={alt} width={size} height={size} className={className} />;
}
