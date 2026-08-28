import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { registry } from "@/instruments";
import type { Answers, Form } from "@/core/types";

/**
 * The ported instrument must score identically to the one in production.
 *
 * This is the check the rewrite rests on, and it is deliberately not a review.
 * Reading two implementations side by side and agreeing they look the same is
 * exactly how a flipped reverse flag survives: it produces plausible wrong
 * numbers forever and nothing downstream can tell. So both are imported and
 * run, and the numbers are compared.
 *
 * Answers are built from the VANILLA bank and fed to BOTH. That direction
 * matters: if the port renamed an item, the ported score() sees an answer it
 * does not recognise, falls back to the scale midpoint, and the numbers
 * diverge. Building from the ported bank instead would hide the very thing
 * being tested.
 *
 * ── The case list, and why it comes from the other side ───────────────
 *
 * It used to be derived from the web registry, with `src/instruments/<id>`
 * imported for each entry. That quietly turned a test about a *port* into a
 * requirement that every instrument this app will ever have must first be
 * written twice, in two languages, one of which is no longer being developed.
 * An instrument that never shipped in the vanilla app has nothing to be
 * compared to, and the failure it produced was an unresolvable import rather
 * than anything about scoring.
 *
 * So the list is derived from the directories under `src/instruments/`, which
 * is the set of things that were in production, and a second test asserts that
 * every one of them is present in the web registry. Nothing is lost: a ported
 * instrument still cannot silently drop its parity check — deleting the check
 * now means deleting the vanilla folder, and the pinned count below turns that
 * from a quieter diff into a red test — and the app is free to grow
 * instruments that were never in production without writing them twice to
 * satisfy a test about a port.
 */

type VanillaSpec = {
  id: string;
  form: (t: (k: string) => string) => Form;
  score: (a: Answers) => unknown;
  channels: string[];
  version: number;
  glyph: string;
  minutes: number;
  adult?: boolean;
  sensitive?: boolean;
  persistence?: string;
  maxAudience?: string;
  pairwise?: boolean;
};

const identity = (key: string) => key;

/**
 * Every instrument that shipped in the vanilla app.
 *
 * Read from the filesystem rather than from `src/instruments/index.js`, so a
 * folder dropped out of that manifest while its code is still on disk is
 * still checked. The manifest is what the old app loads; the folder is what
 * somebody would edit believing it live.
 */
const VANILLA_IDS = readdirSync("../src/instruments", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

/**
 * How many instruments were in production, pinned.
 *
 * The case list below is generated from the folders, so a folder that goes
 * missing does not fail anything — `describe.each` simply generates one case
 * fewer, that instrument's score is no longer compared to anything, and the
 * suite is green. That is the failure this number exists to make impossible:
 * losing a parity check now takes a deliberate edit here, in a file that says
 * why, rather than a rename nobody reads as a deletion.
 *
 * Bump it only when an instrument is genuinely retired, which is the moment
 * its parity check is meant to go with it. A folder *added* is not a failure
 * here — "every instrument that was in production has been ported" is what
 * catches one that the rewrite never picked up.
 */
const PORTED_FROM_VANILLA = 16;

// Thrown at collection rather than asserted in a test, because an empty read
// is the case where the whole file is meaningless: zero cases, nothing
// compared, and every remaining test passing. A path that stops resolving
// must stop the suite, not thin it out.
if (VANILLA_IDS.length === 0) {
  throw new Error("parity: no instrument folders under ../src/instruments — the suite would compare nothing");
}

test("the vanilla catalogue was found at all", () => {
  expect(VANILLA_IDS.length).toBeGreaterThanOrEqual(PORTED_FROM_VANILLA);
});

test("every instrument that was in production has been ported", () => {
  // The other half of the rescoping. The case list no longer comes from the
  // registry, so nothing else would notice a vanilla instrument that the
  // rewrite simply never picked up.
  expect(VANILLA_IDS.filter((id) => !registry.has(id))).toEqual([]);
});

/** Deterministic pseudo-random, so a failure is reproducible. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

/** Answer every item, varying with the seed so flat and peaked profiles both occur. */
function answersFrom(form: Form, seed: number): Answers {
  const rand = rng(seed);
  const out: Answers = {};
  if (form.kind === "items") {
    for (const item of form.items) {
      if (item.kind === "likert") {
        const scale = form.scale!;
        out[item.id] = scale.min + Math.floor(rand() * (scale.max - scale.min + 1));
      } else if (item.kind === "multi") {
        const picked = item.options.filter(() => rand() > 0.5);
        out[item.id] = (picked.length ? picked : [item.options[0]]).map((o) => o.value);
      } else if (item.kind === "rating") {
        out[item.id] = item.min + Math.floor(rand() * (item.max - item.min + 1));
      } else if (item.kind === "text") {
        out[item.id] = "It is what I would say.";
      } else {
        out[item.id] = item.options[Math.floor(rand() * item.options.length)].value;
      }
    }
  } else {
    for (const field of form.fields) {
      if (field.kind === "multi") out[field.id] = [field.options?.[0]?.value ?? ""];
      else if (field.kind === "select") out[field.id] = field.options?.[Math.floor(rand() * (field.options?.length ?? 1))]?.value ?? "";
      else if (field.kind === "number") out[field.id] = field.min ?? 1;
      else out[field.id] = field.value ?? (field.kind === "text" ? "Ada" : "2000-01-01");
    }
  }
  return out;
}

describe.each(VANILLA_IDS)("%s", (id) => {
  test("scores identically to the app in production", async () => {
    const vanilla = (await import(`../../../src/instruments/${id}/index.js`)).default as VanillaSpec;
    const port = registry.get(id)!.spec;

    // The bank itself, before any arithmetic. A renamed id or a moved reverse
    // flag is caught here with a readable diff rather than as a number that is
    // merely different.
    const vForm = vanilla.form(identity);
    const pForm = port.form(identity, "en");
    expect(pForm.kind).toBe(vForm.kind);
    if (vForm.kind === "items" && pForm.kind === "items") {
      expect(pForm.items.map((i) => i.id)).toEqual(vForm.items.map((i) => i.id));
      expect(pForm.items.map((i) => i.kind)).toEqual(vForm.items.map((i) => i.kind));
      expect(pForm.items.map((i) => (i.kind === "likert" ? `${i.scale}${i.reverse ? "!" : ""}` : "")))
        .toEqual(vForm.items.map((i) => (i.kind === "likert" ? `${i.scale}${i.reverse ? "!" : ""}` : "")));
      expect(pForm.scale?.min).toBe(vForm.scale?.min);
      expect(pForm.scale?.max).toBe(vForm.scale?.max);
    } else if (vForm.kind === "fields" && pForm.kind === "fields") {
      expect(pForm.fields.map((f) => `${f.id}:${f.kind}`)).toEqual(vForm.fields.map((f) => `${f.id}:${f.kind}`));
    }

    // Twelve answer sets, from the vanilla bank, through both implementations.
    for (let seed = 1; seed <= 12; seed++) {
      const answers = answersFrom(vForm, seed);
      expect(JSON.parse(JSON.stringify(port.score(answers))), `seed ${seed}`)
        .toEqual(JSON.parse(JSON.stringify(vanilla.score(answers))));
    }
  });

  test("carries the same declarations as the app in production", async () => {
    const vanilla = (await import(`../../../src/instruments/${id}/index.js`)).default as VanillaSpec;
    const port = registry.get(id)!.spec;

    // Privacy flags are the ones that matter most. A dropped
    // `persistence: "session"` starts writing somebody's answers to disk, and
    // nothing about the page would look different.
    for (const key of ["version", "glyph", "minutes", "adult", "sensitive", "persistence", "maxAudience", "pairwise"] as const) {
      expect({ key, value: port[key] ?? null }).toEqual({ key, value: vanilla[key] ?? null });
    }
    expect([...port.channels].sort()).toEqual([...vanilla.channels].sort());
  });
});
