/**
 * The registry.
 *
 * An instrument is now a *module*, not a spec: pure logic in `spec`, a React
 * component in `View`, an optional `Compare`, and a provenance record. The
 * split is the point of the rewrite — `spec` can be imported by a test, a
 * server route or a script without dragging React in, and `View` can render on
 * the server without the spec knowing that servers exist.
 */
import type { ComponentType } from "react";
import type { Answers, Audience, InstrumentSpec, Item, T, Tier } from "./types";
import { AUDIENCE_ORDER } from "./audience";

export type ProvenanceRecord = {
  construct: { name: string; origin?: string; public: boolean; note?: string };
  items: { origin: string; writtenFor?: string };
  evidence: { reliability: string; factorStructure: string; criterion: string; note?: string };
  reproduces: string[];
  avoided?: string[];
};

export type InstrumentModule<R = unknown> = {
  spec: InstrumentSpec<R>;
  /**
   * `answers` is optional and most Views ignore it, which is the point.
   *
   * A scored instrument's View draws the result and nothing else — the answers
   * are an implementation detail of the score. An inventory's View has to print
   * the reader's own sentences, and those are deliberately *not* in the result:
   * a result is stored, shared and re-read in another language, so prose inside
   * one is prose that cannot be translated later. The words stay in `answers`,
   * where no share token can reach them, and the View reads them from there.
   *
   * ── What is already drawn around you ──────────────────────────────────
   *
   * A View draws the reading and stops. `components/result/result-view.tsx`
   * wraps it with the instrument's own `sourceNote`, the `result.inventoryNote`
   * paragraph for the inventory family, the instruction cards built from
   * `spec.instructions()`, and the playbook — so a View that draws any of those
   * prints it on the page twice. The first inventory's did exactly that, and
   * the reader met the same hundreds of words of apologia under themselves.
   */
  View: ComponentType<{ result: R; answers?: Answers; t: T }>;
  Compare?: ComponentType<{ a: R; b: R; nameA?: string; nameB?: string; t: T }>;
  PairView?: ComponentType<{ comparison: unknown; t: T }>;
  provenance: ProvenanceRecord;
};

export const FAMILIES = new Set(["questionnaire", "profiler", "inventory"]);
const ITEM_KINDS = new Set(["likert", "choice", "multi", "rating", "text"]);
/** The kinds that answer with one of a declared list, and therefore need one. */
const OPTIONED_KINDS = new Set(["choice", "multi"]);
const ITEM_TIERS = new Set(["shared", "private"]);
const FIELD_KINDS = new Set(["date", "time", "text", "number", "select", "multi"]);
const TIERS = new Set<Tier>(["free", "premium"]);

/**
 * Validation renders no words, so it needs no language. An identity `t`
 * returns its own key, which is enough to check that every item has *a* prompt
 * without asserting anything about what the prompt says.
 */
export const identity: T = (key) => key;

export function validate(module: InstrumentModule): void {
  const spec = module?.spec;
  const where = spec?.id ? `instrument "${spec.id}"` : "instrument";

  for (const k of ["id", "version", "family", "glyph", "minutes", "messages", "form", "score", "instructions"] as const) {
    if (spec?.[k] == null) throw new TypeError(`${where}: missing "${k}"`);
  }
  if (typeof module.View !== "function") throw new TypeError(`${where}: missing a View component`);
  if (!FAMILIES.has(spec.family)) throw new TypeError(`${where}: family must be one of ${[...FAMILIES].join(", ")}`);
  if (!TIERS.has(spec.tier)) throw new TypeError(`${where}: tier must be "free" or "premium"`);

  if (spec.maxAudience != null && !AUDIENCE_ORDER.includes(spec.maxAudience)) {
    throw new TypeError(`${where}: maxAudience must be one of ${AUDIENCE_ORDER.join(", ")}`);
  }
  if (spec.sensitive && spec.maxAudience === "public") {
    throw new TypeError(`${where}: a sensitive instrument must not permit a public audience`);
  }
  if (spec.persistence != null && spec.persistence !== "session") {
    throw new TypeError(`${where}: persistence, if set, must be "session"`);
  }
  if (spec.persistence === "session" && (spec.maxAudience ?? "public") !== "private") {
    throw new TypeError(`${where}: a session-only instrument must set maxAudience to "private"`);
  }
  /**
   * A pairwise instrument is answered twice in one tab and compared in memory.
   * Requiring session persistence is not belt-and-braces: a stored pair
   * comparison is a written record of two people's answers, a different and
   * much worse object than either half, and the only reliable way not to have
   * one is to make the shape impossible to declare.
   */
  if (spec.pairwise) {
    if (typeof spec.pairScore !== "function" || typeof module.PairView !== "function") {
      throw new TypeError(`${where}: a pairwise instrument needs pairScore() and a PairView`);
    }
    if (spec.persistence !== "session") {
      throw new TypeError(`${where}: a pairwise instrument must set persistence to "session"`);
    }
  }

  const form = spec.form(identity, "en");
  if (form.kind === "items") {
    if (!form.items?.length) throw new TypeError(`${where}: form.items must be a non-empty array`);
    const seen = new Set<string>();
    for (const it of form.items) {
      if (!it.id) throw new TypeError(`${where}: every item needs an id`);
      if (seen.has(it.id)) throw new TypeError(`${where}: duplicate item id "${it.id}"`);
      seen.add(it.id);
      if (!ITEM_KINDS.has(it.kind)) throw new TypeError(`${where}: item "${it.id}" has unknown kind "${it.kind}"`);
      if (!it.prompt) throw new TypeError(`${where}: item "${it.id}" has no prompt`);
      if (it.kind === "likert" && !it.scale) throw new TypeError(`${where}: likert item "${it.id}" needs a scale name`);
      if (OPTIONED_KINDS.has(it.kind) && !Array.isArray((it as { options?: unknown }).options)) {
        throw new TypeError(`${where}: item "${it.id}" needs options`);
      }
      /**
       * A rating renders as one target per point, so an infinite or inverted
       * range is not a wrong number on a page — it is a loop that never
       * terminates or a row with nothing in it. Both are caught at import
       * rather than at first render, which is the difference between a build
       * that fails and a reader whose page is blank.
       */
      if (it.kind === "rating") {
        if (!Number.isFinite(it.min) || !Number.isFinite(it.max) || it.min >= it.max) {
          throw new TypeError(`${where}: rating item "${it.id}" needs a finite min below its max`);
        }
      }
      /**
       * An honest escape has to actually escape.
       *
       * Every option set here is required to carry a way out — "none of these",
       * "I have not thought about it", "it touches none of my money" — and
       * `exclusive` is what makes that way out exclusive in a `multi`, where
       * nothing else would. Three declarations can go wrong, all three are
       * silent at runtime, and all three end the same way: a reader states a
       * contradiction about themselves and the app stores it, scores it, and
       * prints it back to them as their own position.
       *
       * A value that is not one of the item's own options clears nothing. It is
       * a typo or an option renamed on one line and not the other, and the page
       * still renders a checkbox that works — which is exactly why import is
       * the only place it can be caught. Nothing downstream can tell an escape
       * that failed to fire from a reader who meant both.
       *
       * A `multi` that cannot hold two options at once is a `choice` wearing
       * the wrong kind: it offers checkboxes that behave like radios, and a
       * reader who wants two of anything cannot have it.
       *
       * The arithmetic for that is "fewer than two options left that are not
       * exclusive", not "every option is exclusive". An exclusive value can
       * never be held beside anything — including another exclusive value — so
       * the only pair a reader can ever hold is a pair of ordinary options, and
       * one ordinary option is already too few. `[hours, none, unsure]` with
       * both escapes marked leaves exactly one, and every pair the reader
       * reaches for collapses to a single tick; an all-exclusive set is just
       * the far end of the same fault, and checking only for it lets the
       * ordinary case through.
       *
       * And `exclusive` on any other kind is a rule with nothing to enforce it.
       * A `choice` is exclusive by construction; a `rating` and a `text` have no
       * options to clear. The field would be read by nobody while the author
       * believed a restriction was in force.
       */
      const declaredExclusive = (it as { exclusive?: unknown }).exclusive;
      if (declaredExclusive != null && it.kind !== "multi") {
        throw new TypeError(`${where}: item "${it.id}" is a ${it.kind} and cannot declare exclusive options`);
      }
      if (it.kind === "multi" && it.exclusive != null) {
        const exclusive = it.exclusive;
        const values = new Set(it.options.map((o) => o.value));
        for (const value of exclusive) {
          if (!values.has(value)) {
            throw new TypeError(`${where}: multi item "${it.id}" marks "${value}" exclusive, which is not one of its options`);
          }
        }
        if (it.options.filter((o) => !exclusive.includes(o.value)).length < 2) {
          throw new TypeError(
            `${where}: multi item "${it.id}" leaves fewer than two options that can be held together, which is a choice`,
          );
        }
      }
      /**
       * A cap of zero is a form nobody can fill in.
       *
       * `max` is the number of positions a reader may take, so the smallest
       * honest one is one. Zero renders every real option greyed out at first
       * paint with only the escape tickable, which is not a limit — it is a
       * question that has been withdrawn while still being asked. A fraction is
       * worse than useless in the same place: `selectionAtCap` compares a count
       * to it, so `max: 1.5` silently means one and reads on the page as an
       * off-by-one nobody can find. Neither is visible to `stanceItems`, which
       * passes `block.max` through on `!= null` and would carry a zero from a
       * bank all the way to the reader.
       */
      if (it.kind === "multi" && it.max !== undefined) {
        if (!Number.isInteger(it.max) || it.max < 1) {
          throw new TypeError(`${where}: multi item "${it.id}" has a max of ${it.max}; a max must be a whole number of at least one`);
        }
      }
      /**
       * Options on a text item are the sign of a choice item that was changed
       * to text and half-edited. Left alone, the options are silently dropped
       * at render and the reader is asked an open question the author believed
       * was closed.
       */
      if (it.kind === "text" && (it as { options?: unknown }).options != null) {
        throw new TypeError(`${where}: text item "${it.id}" must not declare options`);
      }
      /**
       * Free text is never shareable, whatever the item is called.
       *
       * A closed option is a word we wrote and a Likert point is a number.
       * Typed prose is the only answer in this app whose contents nobody has
       * reviewed: it can hold a third party's name, a diagnosis, a confession
       * or an address, and the person writing it is thinking about the question
       * rather than about who might read the URL later. The rule the codebase
       * lives by is that withheld content is absent from the link rather than
       * hidden by the page that renders it — so this is a property of the item
       * kind, not a setting an author weighs up per instrument.
       *
       * Both checks stay, because they catch different mistakes. The kind check
       * catches a standalone open question — the closing letter to yourself, an
       * "anything else" box — which nobody thinks of as a reason and which no
       * naming rule would ever have covered. The id check catches the opposite
       * slip: a `.why` written as a `choice` or a `multi`, which is a stated
       * reason wearing a kind the first check does not look at.
       */
      if (it.kind === "text" && it.tier !== "private") {
        throw new TypeError(`${where}: free text item "${it.id}" must carry tier "private"`);
      }
      if (it.id.endsWith(".why") && it.tier !== "private") {
        throw new TypeError(`${where}: item "${it.id}" is a stated reason and must carry tier "private"`);
      }
      if (it.tier != null && !ITEM_TIERS.has(it.tier)) throw new TypeError(`${where}: item "${it.id}" has unknown tier`);
    }
    if (form.items.some((i) => i.kind === "likert") && !form.scale) {
      throw new TypeError(`${where}: an items form with Likert items needs a scale`);
    }
    /**
     * A private block is private entire — and this is the half of that rule
     * import can actually see.
     *
     * `stanceItems` puts every item of a private block on `tier: "private"`,
     * and a group whose own question is private with a shared weight beside it
     * is that expansion having gone wrong, or a hand-written bank imitating it
     * badly. Either way the failure is silent and it is the exact one the flag
     * exists to prevent: `packAnswers` strips on the tier, so a token would
     * carry `undisclosed-debt.weight = 9` with no answer under it and tell the
     * reader precisely what was being withheld. Half a redaction is worse than
     * none, because the person who drew it believed they had said nothing.
     *
     * The check hangs off the item whose id *is* the group — the question the
     * block asked — because that is the only item whose tier can distinguish a
     * private block from an ordinary one. It cannot be "every item in a group
     * agrees": `<id>.why` is private in every block by construction, so that
     * rule would refuse the ordinary case and pass nothing else.
     *
     * ── And what import cannot check: the instruction card ──
     *
     * The other consequence of `private` is that no instruction card may be
     * built from the block, and `validate()` cannot verify it. An
     * `InstructionCard` is `{ channel, title, body }` — a channel and two
     * finished strings — so by the time a card reaches this function the block
     * it was derived from is not merely hidden, it is absent. There is nothing
     * to compare against a list of private block ids.
     *
     * Guessing is available and is refused. Calling `instructions()` with the
     * identity `t` yields message keys rather than sentences, and a key such as
     * `stance.undisclosed-debt.card.title` does name its block — but a card
     * built from a private block under a key that does not name it passes, and
     * a card built from a public block whose key happens to contain a private
     * block's id fails. A check that is wrong in both directions is worse than
     * no check at all, because an author reading this file would come away
     * believing the sheet was policed.
     *
     * So the guarantee is made where it can be: `cardable(blocks)` in
     * `core/stance.ts` returns the ids a card may be built from, instruments
     * derive `instructions()` through it rather than remembering the rule eight
     * times, and `test/core/stance.test.ts` holds it there.
     */
    const groups = new Map<string, Item[]>();
    for (const it of form.items) {
      /**
       * The id prefix, not just `group`.
       *
       * The check exists for two cases: an expansion that went wrong, and a
       * hand-written bank that imitates one badly. Keying only on `group` gets
       * the first and misses the second, because `group` is set by
       * `stanceItems` and nothing else in this function requires it — so the
       * bank most likely to forget it is the one this rule was written for. A
       * dot is how a derived id is spelled and `stanceItems` refuses one inside
       * a block id, so the prefix is unambiguous.
       */
      const key = it.group ?? (it.id.includes(".") ? it.id.slice(0, it.id.indexOf(".")) : it.id);
      groups.set(key, [...(groups.get(key) ?? []), it]);
    }
    for (const [group, members] of groups) {
      if (members.find((i) => i.id === group)?.tier !== "private") continue;
      const shared = members.filter((i) => i.tier !== "private").map((i) => `"${i.id}"`);
      if (shared.length) {
        throw new TypeError(
          `${where}: block "${group}" is private, but ${shared.join(", ")} would be shared; a private block is private entire`,
        );
      }
    }
    /**
     * Shuffling defeats acquiescence bias on a scored scale, where the items
     * are interchangeable by construction. An inventory's are not: a weight
     * question shuffled away from the question it weighs asks how important
     * *nothing in particular* is, and `group` ordering is what keeps a block on
     * one screen. Declared rather than defaulted, so the author has said it.
     */
    if (spec.family === "inventory" && form.shuffle !== false) {
      throw new TypeError(`${where}: an inventory must declare shuffle: false`);
    }
  } else if (form.kind === "fields") {
    if (!form.fields?.length) throw new TypeError(`${where}: form.fields must be a non-empty array`);
    const seen = new Set<string>();
    for (const f of form.fields) {
      if (!f.id || seen.has(f.id)) throw new TypeError(`${where}: field ids must exist and be unique`);
      seen.add(f.id);
      if (!FIELD_KINDS.has(f.kind)) throw new TypeError(`${where}: field "${f.id}" has unknown kind "${f.kind}"`);
    }
  } else {
    throw new TypeError(`${where}: form.kind must be "items" or "fields"`);
  }
}

export function createRegistry(modules: InstrumentModule[]) {
  const byId = new Map<string, InstrumentModule>();
  for (const m of modules) {
    validate(m);
    if (byId.has(m.spec.id)) throw new Error(`instrument "${m.spec.id}" is already registered`);
    byId.set(m.spec.id, m);
  }

  const all = () => [...byId.values()];
  const ungated = (family: string) => all().filter((m) => m.spec.family === family && !m.spec.adult);

  return {
    get: (id: string) => byId.get(id) ?? null,
    has: (id: string) => byId.has(id),
    all,
    ids: () => [...byId.keys()],
    byFamily: ungated,
    adult: () => all().filter((m) => m.spec.adult),
    byTier: (tier: Tier) => all().filter((m) => m.spec.tier === tier),
    /**
     * Grouped for the catalogue. The adult group comes last and carries
     * `gated: true`; the page decides whether its items are rendered at all.
     * `byFamily` already excludes them, so an adult instrument appears in
     * exactly one group and cannot leak into the ungated list.
     *
     * Inventories sit between the profilers and the tests, ahead of the thing
     * a first-time reader came for. They are the cheapest honest output in the
     * app — nothing is estimated, so nothing needs the paragraph of hedging a
     * scored result carries — and burying them under sixteen questionnaires
     * would sort the catalogue by how much machinery an instrument has rather
     * than by what it gives back.
     */
    groups() {
      return [
        { family: "profiler", labelKey: "catalog.group.profilers", noteKey: "catalog.group.profilersNote", items: ungated("profiler") },
        { family: "inventory", labelKey: "catalog.group.inventories", noteKey: "catalog.group.inventoriesNote", items: ungated("inventory") },
        { family: "questionnaire", labelKey: "catalog.group.tests", noteKey: "catalog.group.testsNote", items: ungated("questionnaire") },
        { family: "adult", gated: true, labelKey: "catalog.group.adult", noteKey: "catalog.group.adultNote", items: all().filter((m) => m.spec.adult) },
      ].filter((g) => g.items.length);
    },
  };
}

/** What the sharing page may offer for one instrument. */
export function audiencesFor(spec: { maxAudience?: Audience } | null | undefined): Audience[] {
  const ceiling = AUDIENCE_ORDER.indexOf(spec?.maxAudience ?? "public");
  return AUDIENCE_ORDER.slice(0, (ceiling < 0 ? AUDIENCE_ORDER.length - 1 : ceiling) + 1);
}

export type Registry = ReturnType<typeof createRegistry>;
