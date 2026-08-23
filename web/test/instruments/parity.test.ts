import { describe, expect, test } from "vitest";
import { registry } from "@/instruments";
import type { Answers, Form } from "@/core/types";

/**
 * The ported instrument must score identically to the one in production.
 *
 * This is the check the whole rewrite rests on, and it is deliberately not a
 * review. Reading two implementations side by side and agreeing they look the
 * same is exactly how a flipped reverse flag survives: it produces plausible
 * wrong numbers forever and nothing downstream can tell. So both are imported
 * and run, and the numbers are compared.
 *
 * Answers are built from the VANILLA bank and fed to BOTH. That direction
 * matters: if the port renamed an item, the ported score() sees an answer it
 * does not recognise, falls back to the scale midpoint, and the numbers
 * diverge. Building from the ported bank instead would hide the very thing
 * being tested.
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

const ported = registry.all().map((m) => m.spec.id);

describe.each(ported)("%s", (id) => {
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
