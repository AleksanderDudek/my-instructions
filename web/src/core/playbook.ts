/**
 * The reader's own OK and not-OK, resolved for rendering.
 *
 * The instrument suggests lines from the result. The reader ticks some, ignores
 * the rest, and writes their own. What gets stored is the *ids* of the ticked
 * ones and the *text* of the written ones — never the text of a suggestion —
 * so a line the reader endorsed in English comes back in Polish when they
 * switch languages, while a line they typed comes back exactly as they typed
 * it. Storing the rendered sentence instead would freeze one translation into
 * the record and turn a language switch into a page that is half in each.
 *
 * The consequence is the whole reason this module is a pure function rather
 * than three lines inside a component: a stored id can stop existing. An
 * instrument gets revised, or the reader retakes it and scores differently, and
 * the suggestion that id named is no longer offered. That line is dropped
 * silently at render. A stale sentence shown as if it were still the reader's
 * current position is worse than a shorter list — it is a sentence they would
 * hand to somebody, attributed to them, that they never chose today.
 *
 * Order is the declared order of the instrument's suggestions, then the
 * reader's own lines in the order they wrote them. Stable, because the sheet is
 * printed and a document whose lines move between two prints of the same day is
 * a document nobody trusts.
 */
import type { Playbook, PlaybookSuggestion } from "./types";
import type { Practice } from "./store";

export type { Playbook, PlaybookSuggestion };

/**
 * A line to draw. `own` is not decoration: the sheet says which words are the
 * reader's, and it is the only distinction the sheet makes between a sentence
 * we wrote that they endorsed and one we could not have written.
 */
export type PlaybookLine = { id: string; text: string; own: boolean };
export type ResolvedPlaybook = { ok: PlaybookLine[]; notOk: PlaybookLine[] };

/** Own lines have no id of their own, so their position becomes one. */
export const ownLineId = (side: "ok" | "notOk", index: number) => `own:${side}:${index}`;

const side = (
  suggestions: readonly PlaybookSuggestion[],
  picked: readonly string[],
  own: readonly string[],
  which: "ok" | "notOk",
): PlaybookLine[] => {
  const chosen = new Set(picked);
  // One id is one line, whichever half it came from. The reader's picks are a
  // Set already; the instrument's suggestions are an array, and two of them
  // sharing an id renders as two checkboxes that tick together and two sheet
  // rows under one React key. `contract.test.ts` requires unique ids, but it
  // can only sample one answer set, and §4.1 asks instruments to derive their
  // suggestions *from the result* — so the collision that ships is the one for
  // the result nobody sampled. First declared wins, which keeps the order the
  // instrument asked for.
  const byId = new Map<string, PlaybookSuggestion>();
  for (const s of suggestions) if (!byId.has(s.id)) byId.set(s.id, s);

  return [
    ...[...byId.values()].filter((s) => chosen.has(s.id)).map((s) => ({ id: s.id, text: s.text, own: false })),
    ...own
      .map((text, i) => ({ id: ownLineId(which, i), text: text.trim(), own: true }))
      .filter((line) => line.text.length > 0),
  ];
};

/**
 * What to render, from what the instrument offers today and what was stored.
 *
 * Takes both halves as data and returns lines. It knows nothing about storage,
 * React or language, which is what makes the dropping rule testable in one
 * assertion instead of through a component.
 */
export function resolvePlaybook(
  suggestions: Playbook | null | undefined,
  practice: Practice | null | undefined,
): ResolvedPlaybook {
  const offered = { ok: suggestions?.ok ?? [], notOk: suggestions?.notOk ?? [] };
  return {
    ok: side(offered.ok, practice?.ok ?? [], practice?.ownOk ?? [], "ok"),
    notOk: side(offered.notOk, practice?.notOk ?? [], practice?.ownNotOk ?? [], "notOk"),
  };
}

/** Nothing ticked and nothing written — the sheet has no card to draw. */
export const isEmptyPlaybook = (lines: ResolvedPlaybook): boolean => !lines.ok.length && !lines.notOk.length;
