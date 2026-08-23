/**
 * Areas, not acts. This is the whole design decision.
 *
 * The obvious build here is the one every kink checklist does: 120 to 160 line
 * items in fifteen categories, each rated twice for role, rendered as a
 * colour grid. Three things ruled it out.
 *
 * **Nothing in that space is licensed.** The two MIT repositories carry MIT on
 * the repository while the item text descends from older unattributed
 * community lists — you cannot license out what you never held, and a file
 * extension does not turn prose into software. Everything else (Scarleteen,
 * Bex Caputo's sheets, bdsmtest.org, KNKI) is all rights reserved. The one
 * genuinely licensed set nearby is CC BY-NC-SA, whose ShareAlike would land on
 * an i18n folder this repository's LICENSE declares all rights reserved.
 *
 * **The convergence argument is circular.** Four "independent" taxonomies turn
 * out to be one list and its forks, plus a repo whose text is lifted from a
 * roleplay site, plus a sheet that credits the other two. Descent is not
 * agreement, and there is no outcome evidence that any of these artifacts
 * changes anything for anybody.
 *
 * **An itemised list of a named person's sexual interests is the harm.** That
 * ruling is already in this codebase, in intimacy-conditions/items.js, and it
 * still holds. What changes it from a refusal to a design is granularity: a
 * person saying "restraint, and I would rather be the one restrained" has told
 * you what they wanted to tell you, and has not produced the itemised document
 * that gets screenshotted into a custody filing.
 *
 * So: fourteen areas, each asked once for interest and once for role, in
 * ordinary domain nouns that belong to nobody. The one idea taken from the
 * checklist tradition is Kinklist's genuinely good structural finding — that
 * the role axis has to be *per area*, because "giving and receiving" is the
 * wrong pair for bondage and a nonsense pair for watching. That is an idea
 * rather than an expression, and the labels below are ours.
 */

/**
 * Interest, with a conditional middle rather than a midpoint.
 *
 * Every mature list in this tradition refuses a flat yes / no / maybe, and
 * refuses it in the same way: the middle state is *conditional* — it depends
 * on who, or when, or what else is true — and is not a lukewarm yes. The top
 * end splits willing from enthusiastic, and the bottom end splits "not now"
 * from a limit. Five states, in our own words.
 */
const INTEREST = ["limit", "notNow", "depends", "yes", "favourite"];

/**
 * Role axes, named per area.
 *
 * Six shapes rather than one, because a single give/receive axis is wrong for
 * most of these. An area with no meaningful role split simply has none, and
 * asks one question instead of two.
 */
const ROLE_AXES = {
  giveReceive: ["giving", "receiving", "both"],
  leadFollow: ["leading", "following", "both"],
  holdHeld: ["holding", "held", "both"],
  sayHear: ["saying", "hearing", "both"],
  watchSeen: ["watching", "watched", "both"],
};

/**
 * Fourteen areas. Deliberately excluded: anything whose category name is
 * itself a theme this app is not going to print in four languages. That is a
 * scope decision rather than a judgement about anybody — the line is that a
 * general-audience product naming a category is different from a person
 * naming their own interest, and the free-text note exists for the latter.
 */
const AREAS = [
  { id: "pace", axis: "leadFollow" },
  { id: "touch", axis: "giveReceive" },
  { id: "oral", axis: "giveReceive" },
  { id: "penetrative", axis: "giveReceive" },
  { id: "toys", axis: null },
  { id: "restraint", axis: "holdHeld" },
  { id: "sensation", axis: "giveReceive" },
  { id: "impact", axis: "giveReceive" },
  { id: "control", axis: "leadFollow" },
  { id: "words", axis: "sayHear" },
  { id: "roleplay", axis: null },
  { id: "watching", axis: "watchSeen" },
  { id: "others", axis: null },
  { id: "apart", axis: null },
];

/** The two areas that are about being alone rather than with somebody. */
const SOLO = new Set(["apart"]);

function itemsFor(t) {
  const items = [];
  for (const area of AREAS) {
    items.push({
      id: `i.${area.id}`, kind: "choice", area: area.id,
      prompt: t(`area.${area.id}.prompt`),
      options: INTEREST.map((value) => ({ value, label: t(`interest.${value}`) })),
    });
    if (area.axis) {
      items.push({
        id: `r.${area.id}`, kind: "choice", area: area.id,
        prompt: t(`area.${area.id}.rolePrompt`),
        options: [...ROLE_AXES[area.axis], "unsure"].map((value) => ({
          value, label: value === "unsure" ? t("role.unsure") : t(`role.${area.axis}.${value}`),
        })),
      });
    }
  }
  return items;
}

export { INTEREST, ROLE_AXES, AREAS, SOLO, itemsFor };
