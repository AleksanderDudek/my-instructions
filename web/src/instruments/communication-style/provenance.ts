/**
 * Provenance for communication-style.
 *
 * Transcribed from `docs/banks/communication-style.json`, where the argument
 * was made and critiqued. Two separate rights are involved and the record keeps
 * them separate: copyright covers the item text, option wording, report prose,
 * adjective checklists and wheel graphics of every commercial four-colour
 * product; trade marks cover the product names and the branded colour epithets,
 * which stay marks however public the underlying idea is. Nothing here
 * reproduces either.
 *
 * The evidence block is empty and says so at length. That is not an oversight
 * being dressed up — there is nothing here to validate. The instrument records
 * a stated preference, and a preference cannot be correct or incorrect.
 */
export default {
  construct: {
    name: "Stated communication preference",
    origin:
      "Four-temperament schemes descending from Galen; Jung's function pairs (Psychological Types, 1921); Marston's four-quadrant description of normal emotion (Emotions of Normal People, 1928 — a book, with no assessment and no patent); the assertiveness-by-responsiveness grid published by Merrill and Reid (Personal Styles and Effective Performance, 1981); Lowry's application of colour names to four temperaments (1978).",
    public: true,
    note: "The lineage is public and is the reason the four-colour vocabulary may be discussed at all. None of it is applied to an answer here, because this instrument computes nothing: no tally, no axis position, no colour. It contains no colour word in any prompt, option, section or playbook line; no wheel; no forced-choice tetrad, which is the item format of the products and is refused in the bank's `rejected` list; and no adjective list keyed to a colour. Nothing was reverse-engineered — no commercial questionnaire was consulted while writing, and the twelve blocks are organised by communication event rather than by colour, which is why they do not map onto any product's factor set. What may be claimed is that these twelve answers are what this person says they want and that they weighted them as recorded. What may not be claimed is that the answers constitute a type, a temperament, a measurement, a position on either axis, or a prediction of how this person actually behaves.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing was borrowed, so nothing was inherited — including the evidence. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "None, and none is needed: reliability, factor structure and criterion validity are properties of a specific item set administered to a specific sample, and this bank has never been administered to any sample. Two adjacent literatures are named rather than borrowed from. No independent peer-reviewed evidence of criterion validity for commercial four-colour instruments could be found; what exists is vendor-published, and a figure of the form «over 90% of respondents rate the statements as accurate» measures how agreeable a description is rather than whether it is true, which is the Barnum effect reported as validity. A British Psychological Society PTC registration is a compliance review against test-review guidelines, not a finding of criterion validity. Separately, the meshing hypothesis — that matching delivery to a stated preference improves outcomes — was tested properly in the learning-styles literature (Pashler, McDaniel, Rohrer and Bjork, 2008) and was not supported. This instrument therefore claims no benefit whatsoever from being obeyed. It claims only that the request was made.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named products deliberately not used, and whose items are not present. */
  avoided: [
    "Insights Discovery",
    "Insights Discovery Preference Evaluator",
    "The Insights Wheel",
    "Insights' branded colour energy names (Fiery Red, Sunshine Yellow, Earth Green, Cool Blue)",
    "DiSC and Everything DiSC (John Wiley & Sons)",
    "The DISC most/least forced-choice tetrad, as an item format",
    "SOCIAL STYLE and Versatility (TRACOM Group)",
    "True Colors and its colour-keyed card and adjective material (True Colors International)",
    "MBTI and 16 Personalities",
    "Keirsey Temperament Sorter",
    "Personality Plus adjective lists (Littauer)",
  ],
};
