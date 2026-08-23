/**
 * Provenance for intimacy-map.
 *
 * Checked by test/instruments/provenance.test.js.
 */
export default {
  construct: {
    name: "Areas of sexual interest, with a per-area role axis",
    origin: "The negotiation-checklist tradition; the per-area role axis is the one structural idea taken from it",
    public: true,
    note: "No item text is taken from anywhere, and there was nowhere to take it from: no kink checklist in circulation carries a usable content licence. The two MIT-licensed repositories license the repository while their item text descends from older unattributed community lists, and MIT from a party that did not author the text grants nothing. Scarleteen's stocklist, Bex Caputo's sheets, bdsmtest.org and KNKI are all rights reserved. The Relationship Anarchy Smorgasbord is genuinely CC BY-NC-SA and was still refused, because ShareAlike would contradict this repository's own all-rights-reserved declaration over i18n. What is used is ordinary domain vocabulary that belongs to nobody — restraint, impact, sensation, control — and one idea: that the role axis must be named per area, because giving and receiving is the wrong pair for bondage and meaningless for watching.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing is scored, nothing is counted and nothing is stored. There is no
     construct here whose validity could be claimed, and no measurement to
     validate — the answers are reported back grouped. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "There is also no outcome evidence anywhere in this tradition. Not one of the checklists surveyed cites research on whether such a list changes behaviour, prevents a boundary being crossed, or is ever looked at again after it is filled in. The convergence between them is descent from a common ancestor rather than independent discovery of a real taxonomy.",
  },

  reproduces: [],
  avoided: [
    "Kinklist item text",
    "bdsmchecklist item text and its answer ladders",
    "Scarleteen Yes/No/Maybe stocklist",
    "Bex Caputo yes/no/maybe sheets",
    "bdsmtest.org questions and archetype names",
    "KNKI checklist",
    "Relationship Anarchy Smorgasbord",
  ],
};
