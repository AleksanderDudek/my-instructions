import { describe, expect, test } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { registry } from "@/instruments";
import { validateProvenance, ITEM_ORIGINS, EVIDENCE, EVIDENCE_LOCALES, REFERENCE_KINDS } from "@/core/provenance";
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
 * `app.noValidation` tells every reader, in four languages, that unless a test
 * says otherwise on its own page, each questionnaire here writes its own
 * items. An instrument that borrows items — public-domain IPIP scales, say —
 * is the "otherwise": it must carry its own `disclaimer`, saying where the
 * items came from and which languages the published evidence covers, and the
 * page shows that instead of the shared text. An original instrument must
 * not carry one, so the shared sentence stays the single source for them.
 */
test("every instrument that borrows items says so in its own words, and no other does", async () => {
  for (const locale of TAGS) {
    const shell = await loadShell(locale as Locale);
    expect(shell["app.noValidation"]?.length, `${locale} has no disclaimer`).toBeGreaterThan(0);
  }
  for (const m of registry.all()) {
    const en = await loadInstrument(m.spec, "en");
    const own = typeof en[`${m.spec.id}.disclaimer`] === "string" && en[`${m.spec.id}.disclaimer`].length > 80;
    const borrowed = m.provenance.items.origin !== "original";
    expect({ id: m.spec.id, borrowed, ownDisclaimer: own }).toEqual({ id: m.spec.id, borrowed, ownDisclaimer: borrowed });
  }
});

/**
 * Borrowed evidence names its languages, and the claim has to be coherent
 * with the items: evidence collected in Polish for a scale whose Polish items
 * are the app's own translation would be a lie, so an instrument may not
 * claim evidence in a locale unless its provenance says the items in that
 * locale come from the source too (`items.source` is expected to say which
 * translations are adopted; this test holds the structural half).
 */
test("borrowed evidence is confined to the languages it was collected in", () => {
  for (const m of registry.all()) {
    const e = m.provenance.evidence;
    const claims = e.reliability !== "none" || e.factorStructure !== "none" || e.criterion !== "none";
    if (!claims) continue;
    expect(m.provenance.items.origin, `${m.spec.id} claims evidence for original items`).not.toBe("original");
    expect(e.appliesTo?.length, `${m.spec.id} claims evidence in no language`).toBeGreaterThan(0);
    expect(e.appliesTo, `${m.spec.id}: evidence has to start in the source language`).toContain("en");
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
    ["borrowed evidence with no languages", { ...good, items: { origin: "public-domain", source: "IPIP" }, evidence: { reliability: "borrowed", factorStructure: "none", criterion: "none" } }],
    ["borrowed evidence in an unknown language", { ...good, items: { origin: "public-domain", source: "IPIP" }, evidence: { reliability: "borrowed", factorStructure: "none", criterion: "none", appliesTo: ["fr"] } }],
    ["languages named with no evidence", { ...good, evidence: { ...good.evidence, appliesTo: ["en"] } }],
  ])("refuses %s", (_label, record) => {
    expect(() => validateProvenance(record)).toThrow(TypeError);
  });

  test("accepts borrowed items that say where they came from and under what", () => {
    expect(() =>
      validateProvenance({
        ...good,
        items: { origin: "licensed", licence: "CC BY 4.0", source: "Weierstall and Giebel 2017" },
        evidence: { reliability: "borrowed", factorStructure: "borrowed", criterion: "none", appliesTo: ["en", "pl"] },
      }),
    ).not.toThrow();
    expect(EVIDENCE_LOCALES).toEqual(["en", "pl", "es", "de"]);
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
      "provenance.ownWords",
      "provenance.evidence.borrowedElsewhere",
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
