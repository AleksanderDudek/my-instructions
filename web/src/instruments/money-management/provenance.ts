/**
 * Provenance for money-management.
 *
 * Transcribed from `docs/banks/money-management.json`, where the argument was
 * made and critiqued. Two things are being kept apart here, and the record
 * keeps them apart deliberately: the *subject* — where household money sits,
 * who controls it, who pays what — is public and belongs to nobody, while the
 * *instruments* that measure in this area belong to their publishers, several
 * of whom state in writing that their items are proprietary. Nothing here
 * reproduces or paraphrases any of them, and no commercial money questionnaire
 * was consulted while the bank was written.
 *
 * The evidence block is empty and says so at length. That is not an oversight
 * being dressed up. Reliability, factor structure and criterion validity are
 * properties of a scored item set administered to a sample; nothing here is
 * scored, summed, banded or normed, and a position a person states about their
 * own money cannot be correct or incorrect.
 *
 * Two outside findings are carried in the source note as somebody else's
 * evidence with its limits stated, and neither is offered as support for this
 * bank. Where no number exists — how many partners keep a money secret — the
 * note reports that the spread between commercial polls is the finding, rather
 * than picking the most quotable of them.
 */
export default {
  construct: {
    name: "Household money organisation, recorded as stated positions",
    origin:
      "Jan Pahl, 'Patterns of Money Management within Marriage', Journal of Social Policy 9(3), 1980, pp. 313–335; 'The Allocation of Money and the Structuring of Inequality within Marriage', Sociological Review 31(2), 1983; and Money and Marriage (Macmillan, 1989) — for the account-structure and control categories. The remaining topics are the ordinary contents of a household budget and belong to no one.",
    public: true,
    note: "What is taken is a public typology and a list of subjects — where money sits, who controls it, who pays what. Not one item, option label or response format comes from any published money instrument. Every prompt and every option in this bank was written for this repo. Five structural decisions are worth recording. (1) The undisclosed-debt block asks only yes or no and offers 'I would rather not answer this', because an option set that demands a figure from someone hiding a debt collects a false figure; the block carries private: true, so both its answer and its 'why' are absent from every share token rather than hidden by the page that renders them. (2) The playbook line 'Ask to see my statements at any time' is derived from that private answer. It stays local under §4.4, and it must be excluded by id if playbook lines are ever put into a share token: whether the line is present or absent is itself a read on a private answer, and an inference channel leaks as surely as a field does. (3) The account options are Pahl's systems written in our own words, and they are worded to be mutually exclusive — a single pot both people spend from is not the same arrangement as one person holding it and the other drawing a share, and the earlier wording let one answer be true of both. (4) An option may not be double-barrelled any more than a prompt may. 'Gambling or trading kept quiet' was cut for that reason as well as for being close to universally endorsed, which makes it a weak discriminator inside a set the rules cap at six. (5) The two multi blocks carry an exclusive escape option, and retirement-source says 'mainly' in its prompt, because a cap of two on a list of real sources is a lie unless the question asks which ones matter most.",
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
    note: "None, and none is needed. Reliability, factor structure and criterion validity are properties of a scored item set administered to a sample; nothing here is scored, summed, banded or normed, and there is no latent thing behind these thirteen questions for a coefficient to be about. Every answer is a position the person states about arrangements they already know, so the only accuracy question is whether they answered honestly — which no psychometric number can tell you. Where outside evidence is relevant it is cited in the source note as somebody else's finding, with its limits stated, and never as support for this bank.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: [
    "Financial Infidelity Scale (FI-Scale), Garbinsky, Gladstone, Nikolova & Olson 2020",
    "Klontz Money Script Inventory and KMSI-R",
    "Klontz Money Behavior Inventory",
    "Money Attitude Scale (Yamauchi & Templer 1982)",
    "Money Beliefs and Behaviours Scale (Furnham)",
    "Financial Management Behavior Scale (Dew & Xiao 2011)",
    "Financial Anxiety Scale (Archuleta, Dale & Spann 2013)",
    "InCharge Financial Distress / Financial Well-Being Scale (Prawitz et al. 2006)",
    "PREPARE/ENRICH",
    "SYMBIS",
    "FOCCUS",
    "Money Habitudes",
    "Gottman Relationship Checkup",
  ],
};
