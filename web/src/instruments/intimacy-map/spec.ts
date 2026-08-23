import type { Answers, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { INTEREST, KEEN, CURIOUS, SECTIONS, ACTS, facing, itemsFor, type Interest, type Section } from "./acts";

/**
 * A worksheet that is never written down, answered by two people in one room.
 *
 * This is the one instrument in the app that declares `persistence: "session"`.
 * Its answers live in memory for as long as the tab is open and nowhere else:
 * no draft while answering, nothing in localStorage, nothing in an export,
 * and — enforced by the contract, which refuses a session instrument that
 * permits any wider audience — nothing that can be put in a link.
 *
 * That is not caution for its own sake. A link in this app carries its own
 * data, so a shared one would outlive the thing that was deliberately never
 * saved, which inverts the entire point.
 *
 * The comparison is what the instrument is for, and the slot mechanism is what
 * makes it possible without a server: both people answer on the same device,
 * one after the other, and the two sets meet in memory. That constrains the
 * feature to the situation where it is a good idea anyway — the two of you,
 * together, deciding to do this — and closing the tab ends it. There is
 * nothing to revoke because there is nothing to revoke.
 *
 * Deliberately absent, each for a stated reason:
 *
 * **No image export, and no copy button on the comparison.** A rendered PNG is
 * the established sharing format in this tradition and the worst possible
 * artifact for this data: it lands in a camera roll, auto-backs-up to a cloud
 * photo library, is OCR-indexed by on-device search, and survives every
 * deletion control a web page could offer. The single-person page offers text
 * the reader copies deliberately, because those are their own answers to do as
 * they like with. The comparison offers nothing, because a document of two
 * people's answers is a different and much worse object than either half, and
 * only one of the two would be choosing to create it.
 *
 * **No like-for-like matching.** Every worksheet in this tradition rates
 * "giving" and "receiving" separately and then compares each against its own
 * twin, which answers a question nobody has. Here your giving faces their
 * receiving. See `facing()`.
 */

/** Level indices by item id. An unanswered item is absent, never zero. */
export type Picks = Record<string, number>;

export type SectionTally = { total: number; answered: number; keen: number; curious: number; limits: number };

/**
 * `unknown` carries nulls because an absent lean is not a neutral lean; every
 * other side has both numbers, so a reader that has checked the side does not
 * have to re-check the numbers.
 */
export type Lean =
  | { a: null | number; b: null | number; gap: null; side: "unknown" }
  | { a: number; b: number; gap: number; side: "a" | "b" | "both" | "neither" };

export type MapResult = {
  v: number;
  picks: Picks;
  sections: Record<Section, SectionTally>;
  lean: Lean;
  answered: number;
  total: number;
};

/**
 * An answer that is not one of the five levels is dropped rather than trusted.
 * `indexOf` already returned -1 for a number or an array in the vanilla
 * implementation; this is that test with the narrowing written down.
 */
const levelOf = (given: Answers[string]): number =>
  typeof given === "string" ? INTEREST.indexOf(given as Interest) : -1;

/** Everything the reader said, as level indices, with unanswered simply absent. */
function picksOf(answers: Answers): Picks {
  const picks: Picks = {};
  for (const { id } of ACTS) {
    const level = levelOf(answers[id]);
    if (level >= 0) picks[id] = level;
  }
  return picks;
}

/**
 * Which half of the facing pairs this person leans toward, 0..100 each side.
 *
 * A single number per side rather than per pair, because the useful finding is
 * the general one: whether somebody mostly wants to be the one doing or the
 * one being done to, and how strongly. `null` when nothing on that side was
 * answered — an absent lean is not a neutral lean, and reporting 50 would be
 * inventing an answer.
 */
export function leanOf(picks: Picks): Lean {
  const meanOf = (side: "a" | "b") => {
    const values = ACTS.filter((a) => a.side === side && picks[a.id] !== undefined).map((a) => picks[a.id]);
    if (!values.length) return null;
    const mean = values.reduce((x, y) => x + y, 0) / values.length;
    return Math.round((mean / (INTEREST.length - 1)) * 100);
  };
  const a = meanOf("a");
  const b = meanOf("b");
  if (a === null || b === null) return { a, b, gap: null, side: "unknown" };
  const gap = a - b;
  // Under a quarter on both sides is a quiet appetite, not a lean, and calling
  // it one would put somebody on a side they did not pick. Fifteen points is
  // the same threshold `dispersion` uses before it will call an ordering real.
  if (a < 25 && b < 25) return { a, b, gap, side: "neither" };
  if (Math.abs(gap) < 15) return { a, b, gap, side: "both" };
  return { a, b, gap, side: gap > 0 ? "a" : "b" };
}

export function score(answers: Answers): MapResult {
  const picks = picksOf(answers);

  const sections = Object.fromEntries(
    SECTIONS.map((name) => [name, { total: 0, answered: 0, keen: 0, curious: 0, limits: 0 }]),
  ) as Record<Section, SectionTally>;
  for (const { id, section } of ACTS) {
    const bucket = sections[section];
    bucket.total++;
    const level = picks[id];
    if (level === undefined) continue;
    bucket.answered++;
    if (level >= KEEN) bucket.keen++;
    else if (level === CURIOUS) bucket.curious++;
    else if (level === 0) bucket.limits++;
  }

  return {
    v: 2,
    picks,
    sections,
    lean: leanOf(picks),
    answered: Object.keys(picks).length,
    total: ACTS.length,
  };
}

/* ══ one person ═══════════════════════════════════════════════════ */

/** Item ids in a section at or above a level, in bank order. */
export const at = (result: MapResult, section: Section, test: (level: number) => boolean): string[] =>
  ACTS.filter((a) => a.section === section && result.picks[a.id] !== undefined && test(result.picks[a.id]))
    .map((a) => a.id);

/** The three groupings a section is read in, shared by the page and the text. */
export const BANDS: [band: string, test: (level: number) => boolean][] = [
  ["keen", (v) => v >= KEEN],
  ["curious", (v) => v === CURIOUS],
  ["limits", (v) => v === 0],
];

/** The named items of one section, band by band, empty bands dropped. */
export const bandsFor = (result: MapResult, section: Section) =>
  BANDS.map(([band, test]) => ({ band, ids: at(result, section, test) })).filter((row) => row.ids.length > 0);

/**
 * The text a person copies out.
 *
 * Composed here rather than in the view so that what is on screen and what
 * lands on the clipboard cannot drift apart — the thing they hand over should
 * be the thing they read.
 */
export function asText(result: MapResult, t: T): string {
  const lines = [t("text.heading"), ""];
  for (const section of SECTIONS) {
    const rows = bandsFor(result, section);
    if (!rows.length) continue;
    lines.push(`${t(`section.${section}`)}:`);
    for (const { band, ids } of rows) {
      lines.push(`  ${t(`band.${band}`)}: ${ids.map((id) => t(`act.${id}`)).join(", ")}`);
    }
    lines.push("");
  }
  lines.push(t("text.footer"));
  return lines.join("\n");
}

/* ══ two people ═══════════════════════════════════════════════════ */

export type Keen = "both" | "mine" | "theirs";
export type PairEntry = { id: string; keen: Keen };
export type BucketName = "shared" | "spark" | "bothCurious" | "oneWay" | "closed";
export type RoleFit = "unknown" | "quiet" | "flexible" | "oneFlexible" | "sameSide" | "complement";
export type PairResult = Record<BucketName, PairEntry[]> & { v: number; roles: RoleFit; overlap: number };

/**
 * Five ways two answers can meet, and the middle one is the point.
 *
 * `shared` is what you already agree on and `closed` is settled; neither
 * changes what anybody does next. `spark` — one of you keen, the other
 * curious — is the only category that does, and it is the category a yes/no
 * list cannot produce at all. It is deliberately named for what it is rather
 * than as "negotiable", because nothing here is owed to anyone.
 */
export function pairScore(mine: MapResult, theirs: MapResult): PairResult {
  const out: Record<BucketName, PairEntry[]> = { shared: [], spark: [], bothCurious: [], oneWay: [], closed: [] };

  for (const { id } of ACTS) {
    const m = mine?.picks?.[id];
    const o = theirs?.picks?.[facing(id)];
    if (m === undefined || o === undefined) continue;

    const mineKeen = m >= KEEN;
    const theirsKeen = o >= KEEN;
    if (mineKeen && theirsKeen) { out.shared.push({ id, keen: "both" }); continue; }
    if (m === CURIOUS && o === CURIOUS) { out.bothCurious.push({ id, keen: "both" }); continue; }
    if (!mineKeen && !theirsKeen) continue;

    // Name the act as the keen person's own, so "they are keen on being tied"
    // does not print under the item that describes tying somebody else.
    const keen: Keen = mineKeen ? "mine" : "theirs";
    const other = mineKeen ? o : m;
    const entry: PairEntry = { id: keen === "mine" ? id : facing(id), keen };
    if (other === CURIOUS) out.spark.push(entry);
    else if (other === 1) out.oneWay.push(entry);
    else if (other === 0) out.closed.push(entry);
  }

  return { v: 2, ...out, roles: roleFit(mine?.lean, theirs?.lean), overlap: out.shared.length + out.spark.length };
}

export function roleFit(mine: Lean | undefined, theirs: Lean | undefined): RoleFit {
  const a = mine?.side;
  const b = theirs?.side;
  if (!a || !b || a === "unknown" || b === "unknown") return "unknown";
  if (a === "neither" || b === "neither") return "quiet";
  if (a === "both" && b === "both") return "flexible";
  if (a === "both" || b === "both") return "oneFlexible";
  // Both leaning the same half of the facing pairs is a real finding: you both
  // want to be the one doing, or you both want to be the one done to.
  return a === b ? "sameSide" : "complement";
}

export const BUCKETS: BucketName[] = ["shared", "spark", "bothCurious", "oneWay", "closed"];

/**
 * One card, and it is a pointer rather than a disclosure.
 *
 * The instruction sheet is a document that gets handed to people, and nothing
 * from this worksheet belongs on it. The card says only that this exists and
 * where the actual content is, which is in the reader's own hands.
 */
export function instructions(result: MapResult, t: T): InstructionCard[] {
  return [{ channel: "affection", title: t("instructions.title"), body: t("instructions.body") }];
}

export const spec: InstrumentSpec<MapResult> = {
  id: "intimacy-map",
  version: 2,
  family: "questionnaire",
  glyph: "❋",
  minutes: 8,
  channels: ["affection"],
  tier: "premium",

  adult: true,
  sensitive: true,
  /** Never written down, and therefore never linkable. The contract enforces both. */
  persistence: "session",
  maxAudience: "private",
  /** Answered twice in one tab; the two sets meet in memory and nowhere else. */
  pairwise: true,

  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "items",
    items: itemsFor(t),
    shuffle: false,
    optional: true,
    pageSize: 6,
  }),
  score,
  instructions,
  pairScore,
};

export default spec;
