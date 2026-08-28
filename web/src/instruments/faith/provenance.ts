/**
 * Provenance for faith.
 *
 * Transcribed from `docs/banks/faith.json`, where the argument was made and
 * critiqued, and where the reading list behind it is kept in full. The point of
 * this record is narrow: religiosity research supplied a map of the subject
 * area and nothing else, and the difference between using a map and using an
 * item bank is the difference between citing a literature and infringing it.
 *
 * The evidence block is empty and says so at length. That is not an oversight
 * being dressed up. Reliability and validity describe how well a measurement
 * estimates something hidden; nothing here is hidden and nothing is estimated.
 * The reader states a position, states its weight, and states what it rests on.
 * There is no true score for an answer to be closer to or further from.
 */
export default {
  construct: {
    name: "Stated religious position — belief, practice, belonging, and grounds",
    origin:
      "Glock 1962, five dimensions of religiosity (belief, practice, experience, knowledge, consequences); Davie 1994, believing without belonging; Huber and Huber 2012, the centrality-of-religiosity construct (intellect, ideology, public practice, private practice, experience)",
    public: true,
    note: "Public as a map of a subject area, not as an item bank, and that is the only use made of it. Glock's dimensions and Huber's centrality construct decided what the twelve blocks are about — belief, private practice, public belonging, and consequences in money and time — and contributed nothing else. No item, no response scale, no phrasing and no option list is taken from any published religiosity measure; every prompt and every option was written for this repo. Two places where an earlier draft drifted close enough to name are recorded in `avoided` and in the bank's `rejected` list: a frequency-of-attendance ladder, which is the shape of DUREL's first item and of the CRS public-practice item, and a «what do you look to for guidance on right and wrong» item, which is the shape of a Pew Religious Landscape Study question. Both were cut rather than reworded, and what replaced them asks a different question — where you belong, and when you last prayed. The grounds vocabulary is this repo's own and is the load-bearing part: two people can hold the same belief at the same weight on entirely different grounds, and that pattern is only legible because the grounds options are identical across all twelve blocks. Grounds carries seven options rather than the house maximum of six — deliberate, and it is the format spec's own list (§7.4). It is one shared vocabulary used twelve times rather than a per-block option set, and collapsing «scripture» into «the teaching of my church», or dropping «I have not worked that out», would destroy the comparison the fourth part exists to make. Where a year is named it is a plain Anno Domini year with no comparative era set beside it.",
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
    note: "None, and none is required. Reliability and validity are properties of a specific item set given to a specific sample, and they describe how well a measurement estimates something hidden. Nothing here is hidden and nothing is estimated: the reader states a position, states its weight from one to ten, and states what it rests on. There is no true score for an answer to be closer to or further from. This bank has never been administered to a sample, has no norms, and produces no score — no devoutness figure, no orthodoxy figure, and no number that could be read as either. The honest entry is «none», not a coefficient borrowed from an instrument whose items are not these.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /**
   * Named instruments deliberately not used, and whose items are not present.
   *
   * The specific items are named rather than only the instruments, because
   * naming an instrument while shipping its item in a paraphrase is the exact
   * failure this list exists to prevent — and it is the failure an earlier draft
   * of this bank committed twice.
   */
  avoided: [
    "Centrality of Religiosity Scale (CRS-5 / CRS-10 / CRS-15), Huber and Huber 2012 — including its public-practice item on frequency of attending services and its private-practice item on frequency of prayer",
    "Duke University Religion Index (DUREL), Koenig and Büssing — including item 1 (organisational activity, frequency of attendance) and item 2 (private religious activity)",
    "Religious Orientation Scale (intrinsic / extrinsic), Allport and Ross 1967",
    "Religious Commitment Inventory-10, Worthington and colleagues 2003",
    "Santa Clara Strength of Religious Faith Questionnaire (SCSORF)",
    "Brief Multidimensional Measure of Religiousness/Spirituality (Fetzer Institute / National Institute on Aging, 1999)",
    "Batson Quest scale",
    "Pew Religious Landscape Study item wording, including the «guidance on questions of right and wrong» item",
    "European Values Study and Eurobarometer item wording, including the four-step «which comes closest to your belief — a personal God, a spirit or life force, don't know, none» ladder",
  ],
};
