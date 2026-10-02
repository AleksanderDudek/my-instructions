import { describe, expect, test } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { registry } from "@/instruments";
import { validateProvenance, ITEM_ORIGINS, EVIDENCE, REFERENCE_KINDS } from "@/core/provenance";
import { TAGS, loadShell, loadInstrument } from "@/core/locales";
import type { Locale } from "@/core/types";

/**
 * Provenance, held to the contract and to the sentence that depends on it.
 *
 * `createRegistry` already runs `validateProvenance` at import, so a folder
 * that breaks the rules cannot reach this file. What is left here is what a
 * registry cannot see: folders on disk that were never registered, and the
 * one claim the app makes to every reader about all of them at once.
 */
const root = join(__dirname, "../../src/instruments");
const folders = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(root, d.name, "index.ts")))
  .map((d) => d.name);

describe.each(folders)("%s", (id) => {
  test("has a provenance record the contract accepts", async () => {
    const mod = await import(`@/instruments/${id}/provenance`);
    expect(() => validateProvenance(mod.default, id)).not.toThrow();
  });
});

test("every registered instrument is a folder on disk, and the reverse", () => {
  expect([...registry.ids()].sort()).toEqual([...folders].sort());
});

/**
 * `app.noValidation` tells every reader, in four languages, that each
 * questionnaire here writes its own items. That is true exactly as long as
 * every `items.origin` is "original". The day one instrument borrows — IPIP
 * items for character strengths, the Sadomasochism Checklist for the intimacy
 * map, both considered in reports/Six test sources and licences.md — this
 * fails, and the fix is not to relax it: it is to give that instrument its own
 * wording of the disclaimer in all four locales, and then narrow this test.
 */
test("the shared disclaimer is still true of every instrument", async () => {
  const borrowed = registry.all().filter((m) => m.provenance.items.origin !== "original").map((m) => m.spec.id);
  expect(borrowed, "these borrow items, so app.noValidation is false for them").toEqual([]);
  for (const locale of TAGS) {
    const shell = await loadShell(locale as Locale);
    expect(shell["app.noValidation"]?.length, `${locale} has no disclaimer`).toBeGreaterThan(0);
  }
});

describe("the contract itself", () => {
  const good = {
    construct: { name: "x", public: true },
    items: { origin: "original" },
    evidence: { reliability: "none", factorStructure: "none", criterion: "none" },
    reproduces: [],
  };

  test("accepts the shape every instrument uses", () => {
    expect(() => validateProvenance(good)).not.toThrow();
  });

  test.each([
    ["an unknown origin", { ...good, items: { origin: "found-online" } }],
    ["licensed items without a licence", { ...good, items: { origin: "licensed", source: "Weierstall and Giebel 2017" } }],
    ["public-domain items without a source", { ...good, items: { origin: "public-domain" } }],
    ["evidence that is neither none, borrowed nor collected", { ...good, evidence: { ...good.evidence, reliability: "good" } }],
    ["reproduced copyrighted material", { ...good, reproduces: ["MMPI-2 items"] }],
    ["a missing reproduces list", { ...good, reproduces: undefined }],
    ["a construct with no name", { ...good, construct: { public: true } }],
    ["a reference of an unknown kind", { ...good, references: [{ authors: "A, B.", year: 2000, title: "T", kind: "praise" }] }],
    ["a reference over plain http", { ...good, references: [{ authors: "A, B.", year: 2000, title: "T", kind: "review", url: "http://x" }] }],
    ["a reference with no year", { ...good, references: [{ authors: "A, B.", title: "T", kind: "review" }] }],
  ])("refuses %s", (_label, record) => {
    expect(() => validateProvenance(record)).toThrow(TypeError);
  });

  test("accepts borrowed items that say where they came from and under what", () => {
    expect(() =>
      validateProvenance({
        ...good,
        items: { origin: "licensed", licence: "CC BY 4.0", source: "Weierstall and Giebel 2017" },
        evidence: { reliability: "borrowed", factorStructure: "borrowed", criterion: "none" },
      }),
    ).not.toThrow();
  });
});

/**
 * The page never prints a provenance field raw.
 *
 * It once did: a Polish reader met "Two-dimensional adult attachment",
 * "original" and "none" in English, because the values were free text and the
 * renderer could not know what to translate. Now every value the contract
 * allows is a key, and every key has a word in every language — and the
 * framework's record is a sentence each instrument writes, not a field.
 */

describe("the provenance section speaks the reader's language", () => {
  test.each(TAGS)("%s has a word for every origin and every evidence level", async (locale) => {
    const shell = await loadShell(locale as Locale);
    const keys = [
      ...ITEM_ORIGINS.map((o) => `provenance.origin.${o}`),
      ...EVIDENCE.map((e) => `provenance.evidence.${e}`),
      ...["reliability", "factorStructure", "criterion"].map((f) => `provenance.${f}`),
      "provenance.framework",
      "provenance.ours",
      "provenance.inventory",
      "provenance.readAs",
      "provenance.why",
      "provenance.reading",
      "provenance.opensNewTab",
      ...REFERENCE_KINDS.map((k) => `provenance.kind.${k}`),
    ];
    expect(keys.filter((k) => !shell[k]), `${locale} is missing`).toEqual([]);
  });

  test.each(registry.all().map((m) => m.spec.id))("%s states its lineage and names its framework", async (id) => {
    const spec = registry.get(id)!.spec;
    const en = await loadInstrument(spec, "en");
    expect(en[`${id}.lineage`]?.length ?? 0).toBeGreaterThan(40);
    expect(en[`${id}.framework`]?.length ?? 0).toBeGreaterThan(0);
  });
});
