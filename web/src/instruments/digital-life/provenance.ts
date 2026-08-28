/**
 * Provenance for digital-life.
 *
 * Transcribed from `docs/banks/digital-life.json`, where the argument was made
 * and critiqued. Three things about it are worth pointing at from here.
 *
 * The first is what was and was not taken. Four research literatures were read
 * — partner phubbing and technoference, sharenting, electronic partner
 * surveillance, and digital legacy — and none of them supplied an item. They
 * supplied the topic map: which twelve questions are worth asking, and which
 * are not worth asking because nothing is known about them. Every prompt and
 * every option label was written for this repo. Where a published scale exists
 * on one of these subjects it was read for what the field thinks is worth
 * asking about and then closed; nothing was paraphrased from one and no item
 * was reconstructed from a description of one. The one overlap close enough to
 * name rather than leave implicit is the Partner Phubbing Scale, which has
 * items about a partner's phone at a shared meal and about a phone placed on
 * the table — the same *subject* as `phone-at-meals`, asked here as a
 * first-person rule chosen from named alternatives, with no frequency scale,
 * no partner as the subject and nothing summed.
 *
 * The second is that the evidence block is empty and says so at length. This
 * instrument measures nothing: it records a position, its weight and the
 * grounds under it. Reliability, test–retest stability, factor structure and
 * criterion validity are properties of a measurement, and claiming any of them
 * would be inventing a credential for something that does not need one.
 *
 * The third is the size of the research that chose the questions, which is
 * stated here at the size it actually supports and nowhere larger. The
 * partner-phubbing meta-analysis (Ni and colleagues, Frontiers in Psychology,
 * 2025) reports the association between feeling phubbed by a partner and
 * relationship satisfaction as r = −0.22 across 30 samples and 9,040 people —
 * real, small, and drawn almost entirely from cross-sectional data that cannot
 * say which way it runs. The dyadic diary study (Carnelley, Vowels, Stanton,
 * Millings and Hart, Computers in Human Behavior 147, 2023) found the effect
 * attaches to the perception rather than the behaviour: a partner's own
 * reported phone use predicted nothing, feeling phubbed predicted lower
 * relationship quality on the day, and that day-level effect did not hold two
 * months later. On sharenting the reviewed harms are documented — a permanent
 * footprint the child did not choose, image misuse, conflict with the grown
 * child over posts they never agreed to — while the studies behind them are
 * small and largely descriptive; in one survey of 1,460 Czech and Spanish
 * parents around four in five had posted pictures of their child and around
 * one in five had asked the child first. For group chats, for what should
 * never be typed at all, and for what people want done with their accounts
 * after they die there is no useful evidence whatever, and those three blocks
 * are here because the questions get settled by default rather than because
 * anything is known about them.
 *
 * The bank's `sources` are named in the prose here rather than carried as a
 * field, because `ProvenanceRecord` has none and inventing one would put a
 * shape in front of the reader that no other instrument has. In full, the
 * twenty-two are: the Frontiers in Psychology 2025 phubbing meta-analysis and
 * its PubMed record; the Carnelley and colleagues diary study in Computers in
 * Human Behavior 147 (2023) and its Sheffield Hallam open-access copy; the
 * PLOS ONE and Journal of Communication papers on technoference and on
 * interpersonal electronic surveillance; the Journal of Family Theory and
 * Review synthesis on sharenting; the American Academy of Pediatrics guidance
 * on sharing photographs and videos of children; the Children and Youth
 * Services Review and the 2024 PubMed-indexed sharenting surveys, including
 * the 1,460-parent Czech and Spanish study; the Collabra and PMC papers on
 * parental sharing and child consent; the CHI 2024 paper on children's own
 * views; the Computers in Human Behavior and Social Media + Society papers on
 * partner monitoring; the Frontiers in Human Dynamics and PMC papers on
 * digital legacy; the Occupational Health Science and Journal of Management
 * papers on after-hours availability and telepressure; Tokunaga's 2011 paper
 * on interpersonal electronic surveillance; Nolo's summary of the Revised
 * Uniform Fiduciary Access to Digital Assets Act; and Everplans' description
 * of Apple's Digital Legacy programme. Every URL is in the bank.
 */
export default {
  construct: {
    name: "Digital household agreements",
    origin:
      "An original topic map assembled for this repo out of four separate research literatures — partner phubbing and technoference, sharenting, electronic partner surveillance, and digital legacy — none of which supplies a questionnaire that this instrument uses. The topics are public; the twelve questions are not taken from anywhere.",
    public: true,
    note: "There is no proprietary construct here to license and no canonical instrument to reproduce, which makes the licence position unusually simple. The vocabulary — phubbing, technoference, sharenting, telepressure, legacy contact — is public and comes from published papers and from platform documentation. Every prompt and every option label is original wording written for this repo. Where a published scale exists on one of these subjects it was read for what the field thinks is worth asking about, and then closed; nothing was paraphrased from one, and no item was reconstructed from a description of one. One overlap is close enough to name rather than leave implicit: the Partner Phubbing Scale contains items about a partner's phone at a shared meal and about a phone placed on the table, which is the same subject as this instrument's first block. What is asked here is a rule, in the first person, chosen from named alternatives, with no frequency scale, no partner as the subject, and nothing summed — the overlap is topical, and a household rule about the dinner table is not a reconstruction of anybody's item. The same standard the repo already applies to DISC, MBTI, the RHETI and Chapman's quiz applies here without needing to be argued again.",
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
    note: "None, and none is needed. This instrument measures nothing: it records a position you state, the weight you put on it, and the reason you give. Reliability, test–retest stability, factor structure and criterion validity are properties of a measurement, and there is no measurement here to have them — so claiming any of them would be inventing a credential for something that does not require one. The research named in the source note decided which twelve questions were worth asking. It says nothing about what your answers mean, and this instrument does not either.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /**
   * Named instruments deliberately not used, and whose items are not present.
   *
   * The Interpersonal Electronic Surveillance Scale is the one to read twice.
   * It is the standard measure in the partner-monitoring literature and it
   * measures *behaviour* — how often somebody checks. That is why the two
   * access blocks here ask permission instead: what may be read and who may
   * see where you are, stated as a rule that holds today, rather than a count
   * of what anybody has already done.
   */
  avoided: [
    "Partner Phubbing Scale (Roberts & David, 2016) — including its mealtime and phone-on-the-table items, the nearest published neighbours to this instrument's first block",
    "Generic Scale of Phubbing and Generic Scale of Being Phubbed (Chotpitayasunondh & Douglas, 2018)",
    "McDaniel & Coyne's Technoference measure",
    "Interpersonal Electronic Surveillance Scale for SNSs (Tokunaga, Computers in Human Behavior 27, 2011) — the standard measure in the partner-surveillance literature, and the reason the access blocks ask permission rather than behaviour",
    "Facebook Intrusion Questionnaire (Elphinston & Noller, 2011)",
    "Smartphone Addiction Scale – Short Version (Kwon et al., 2013)",
    "Bergen Social Media Addiction Scale (Andreassen et al.)",
    "Workplace Telepressure Measure (Barber & Santuzzi, 2015)",
    "The published sharenting attitude and behaviour scales — none open-licensed, none opened; they are not named individually here because a citation written from memory is not a citation",
    "DISC, MBTI, the RHETI and Chapman's quiz — already rejected in docs/candidate-instruments.md on the same grounds",
  ],
};
