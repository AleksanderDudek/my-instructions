/**
 * Provenance for intimacy-map.
 *
 * Checked by test/instruments/provenance.test.js.
 */
export default {
  construct: {
    name: "Specific sexual interests, asked per direction, matched across a couple",
    origin: "The negotiation-checklist tradition; asking the two directions of an act separately is the one structural idea taken from it",
    public: true,
    note: "No item text is taken from anywhere, and there was nowhere to take it from: no kink checklist in circulation carries a usable content licence. The two MIT-licensed repositories license the repository while their item text descends from older unattributed community lists, and MIT from a party that did not author the text grants nothing. Scarleteen's stocklist, Bex Caputo's sheets, bdsmtest.org and KNKI are all rights reserved. The Relationship Anarchy Smorgasbord is genuinely CC BY-NC-SA and was still refused, because ShareAlike would contradict this repository's own all-rights-reserved declaration over i18n. All fifty items are written here, in ordinary domain vocabulary that belongs to nobody. One idea is taken, because an idea is not an expression: that the two directions of an act have to be asked separately and the axis named per act, since giving and receiving is the wrong pair for being on top and a nonsense pair for being watched. What is done with it is not taken. Those worksheets rate both directions and then compare each against its own twin; this faces one person's giving against the other's receiving, which is the crossing that answers the question a couple actually has.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing here is a measurement. The per-side lean is an average of stated
     interest and is presented as a description of what the reader said, not as
     a score of anything; the pair comparison is set arithmetic over two
     people's stated interest. Neither claims a construct, so neither has a
     validity to report. Nothing is stored. */
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
