/**
 * Provenance for boundaries.
 *
 * Transcribed from `docs/banks/boundaries.json`, where the argument was made
 * and critiqued. Two things in it are unusual enough to point at from here.
 *
 * The first is that the statutory material is cited for what it says must not
 * be *collected*. The CPS and Home Office guidance on controlling or coercive
 * behaviour under s.76 of the Serious Crime Act 2015 shaped the option sets
 * and killed four proposed blocks; it is not used to assess anybody, and this
 * instrument screens for nothing.
 *
 * The second is that the evidence block is empty and says so at length. That
 * is not an oversight being dressed up. Nothing here is inferred — the
 * instrument records a threshold, a current practice, a weight and a reason,
 * all four of which the person answering already knows — and there is nothing
 * to borrow either: the boundary scales that exist measure something else and
 * are copyrighted besides.
 */
export default {
  construct: {
    name: "Stated household boundaries — a threshold or current practice, its weight, and the reason",
    origin:
      "«Boundary» as ordinary English, with the family-systems sense (Minuchin, structural family therapy, 1974) as background only. No scale, no typology, no dimensions. The safety design — what is asked, what is deliberately not asked, and the symmetry of the option sets — is informed by the CPS and Home Office statutory guidance on controlling or coercive behaviour under s.76 of the Serious Crime Act 2015, which is used to decide what this instrument refuses to collect, never to assess anybody.",
    public: true,
    note: "No published instrument is used, adapted, abbreviated or paraphrased; every item is original wording written for this repo. Hartmann's Boundary Questionnaire and its short forms measure permeability of mental boundaries — a different construct — and are under publisher copyright. Skowron and Friedlander's Differentiation of Self Inventory is APA-copyrighted and is a scored trait measure, which is the thing this format exists not to be. Cloud and Townsend's Boundaries and the quiz on its site are copyrighted commercial self-help and are not drawn on for content or structure; the nearest brush is `volunteered`, which is why it asks what you did about a specific commitment rather than how hard you find it to say no — the second is their territory and is a trait rating besides. The Duluth Power and Control Wheel is neither reproduced nor adapted: DAIP permit reproduction only exactly as published with credit, and more to the point, an abuse-education graphic turned into a questionnaire becomes a screen, which this is not. Item ideas were refused outright on the same ground the intimacy instrument refuses an activity checklist — the list is the harm: no question asks what another adult may do with their own contacts or friendships, no question asks for access to somebody else's device, and no question asks where anybody is. Two blocks carry «Not something I decide» so that a person for whom the arrangement is not an arrangement has a true answer available that reads innocuously to anyone else, and that option is deliberately wired to produce no playbook line at all — the page must not hand somebody a sentence to be held to. Nothing is flagged, scored for distress, or interpreted back at the reader.",
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
    note: "None — reliability, factor structure and criterion validity are all absent, and none is needed, because nothing here is inferred. The instrument records a threshold, a current practice, a weight and a reason, all four of which the person answering already knows. There is also, honestly, nothing to borrow: searching for outcome evidence that writing boundaries down in advance changes anything returns therapist blog posts and no trial. The boundary scales that do exist measure something else and are copyrighted besides, so a reliability figure quoted on this page would be a figure about a different instrument measuring a different thing. The same restraint applies to the item notes: this bank makes no claim about what most people answer, because it has never counted.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /**
   * Named instruments deliberately not used, and whose items are not present.
   *
   * The last three are a different refusal from the first four. A risk
   * checklist is not a thing this bank could have borrowed items from and then
   * declined to — it is a thing this bank must not become, whatever it borrows.
   */
  avoided: [
    "Hartmann Boundary Questionnaire (and BQ-18 short forms)",
    "Differentiation of Self Inventory (DSI-R, short form, brief version)",
    "Cloud and Townsend, Boundaries — the book and its online quiz",
    "Duluth Power and Control Wheel",
    "Family Boundary Ambiguity scales (Boss)",
    "DASH and any other domestic abuse risk checklist",
    "any coercive-control screening instrument",
  ],
};
