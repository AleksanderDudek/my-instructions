import { html, join } from "../../core/html.js";
import { factsHTML, verdictHTML } from "../../ui/components/scorecard.js";

/**
 * A strength you can produce a receipt for.
 *
 * The question the brief asks — what is genuinely a strength and what is not —
 * is the one question in this app that cannot be asked directly. Self-rated
 * ability correlates around r = .29 with measured performance, so a slider
 * saying "I am good at X" is the single most misleading thing this platform
 * could emit, and `docs/next-four-instruments.md` refused them on exactly that
 * ground.
 *
 * Refusing the format is not the same as refusing the question. That memo left
 * one door open: a field naming something you were the reason went well,
 * labelled as a **claim** rather than a measurement. This folder walks through
 * it and makes it the whole instrument.
 *
 * Three episodes. For each: what happened, what you specifically did, which
 * kind of work was the active ingredient, and how much of it was you. Then,
 * separately and afterwards, which kinds you would claim as strengths.
 *
 * Nothing is scored. The output is a three-way sort, and the second and third
 * entries are the ones worth the reader's time:
 *
 *   backed     you claimed it and you described an occasion that used it
 *   unbacked   you claimed it and nothing you described used it. Not a verdict
 *              that you are wrong — a statement that it is currently
 *              unevidenced, which is the only honest form the "what is not a
 *              strength" question can take
 *   unclaimed  it appeared in your own episodes and you did not list it
 *
 * Forcing an instance converts an unverifiable trait rating into a checkable
 * assertion, and it is hard to invent a receipt.
 */

/**
 * The eight kinds of work, deliberately re-declared rather than imported from
 * `work-shape`. Nothing in this app knows another instrument by name, and a
 * shared constant would make one folder's version bump silently break
 * another's stored results.
 */
const SHAPES = ["depth", "variety", "structure", "openEnded", "making", "people", "improving", "starting"];

const EPISODES = ["ep1", "ep2", "ep3"];
const SHARE = ["mostly", "large", "part"];

/** How many claims a reader may make. Three is a page; eight is a horoscope. */
const MAX_CLAIMS = 3;

function form(t) {
  const fields = [];
  for (const [n, ep] of EPISODES.entries()) {
    const first = n === 0;
    fields.push(
      { id: `${ep}What`, kind: "text", label: t(`field.${ep}.what`), optional: !first, placeholder: t("form.whatPlaceholder") },
      { id: `${ep}Did`, kind: "text", label: t(`field.${ep}.did`), optional: !first, placeholder: t("form.didPlaceholder") },
      {
        id: `${ep}Shape`, kind: "select", label: t(`field.${ep}.shape`), value: SHAPES[0],
        options: SHAPES.map((value) => ({ value, label: t(`shape.${value}.label`) })),
      },
      {
        id: `${ep}Share`, kind: "select", label: t(`field.${ep}.share`), value: "large",
        options: SHARE.map((value) => ({ value, label: t(`share.${value}`) })),
      },
    );
  }
  fields.push({
    id: "claimed", kind: "multi", label: t("field.claimed.label"), max: MAX_CLAIMS,
    options: SHAPES.map((value) => ({ value, label: t(`shape.${value}.label`) })),
  });
  return { kind: "fields", fields, note: t("form.note") };
}

function validate(answers, t = (key) => key) {
  const errors = {};
  if (!String(answers.ep1What ?? "").trim()) errors.ep1What = t("form.needEpisode");
  if (!String(answers.ep1Did ?? "").trim()) errors.ep1Did = t("form.needAction");
  const claimed = Array.isArray(answers.claimed) ? answers.claimed : [];
  if (!claimed.length) errors.claimed = t("form.needClaim");
  else if (claimed.length > MAX_CLAIMS) errors.claimed = t("form.tooManyClaims", { max: MAX_CLAIMS });
  return errors;
}

/** Trimmed, length-capped free text. Storage is not a diary. */
const textOf = (value) => String(value ?? "").trim().slice(0, 400);

function score(answers) {
  const episodes = [];
  for (const ep of EPISODES) {
    const what = textOf(answers[`${ep}What`]);
    const did = textOf(answers[`${ep}Did`]);
    // An episode with no story is not an episode. Half-filled ones count —
    // somebody who named the occasion and skipped the detail still told us
    // which shape was in play, and dropping that would punish brevity.
    if (!what && !did) continue;
    const shape = SHAPES.includes(answers[`${ep}Shape`]) ? answers[`${ep}Shape`] : SHAPES[0];
    const share = SHARE.includes(answers[`${ep}Share`]) ? answers[`${ep}Share`] : "large";
    episodes.push({ id: ep, what, did, shape, share });
  }

  const counts = {};
  for (const e of episodes) counts[e.shape] = (counts[e.shape] ?? 0) + 1;

  const claimed = (Array.isArray(answers.claimed) ? answers.claimed : [])
    .filter((v) => SHAPES.includes(v)).slice(0, MAX_CLAIMS);

  const evidenced = SHAPES.filter((s) => counts[s]);

  return {
    v: 1,
    episodes,
    claimed,
    counts,
    evidenced,
    /** Claimed and described. The part of the claim that stands up. */
    backed: claimed.filter((s) => counts[s]),
    /** Claimed with nothing behind it. The honest form of "not a strength". */
    unbacked: claimed.filter((s) => !counts[s]),
    /** Turned up in the episodes and was never claimed. */
    unclaimed: evidenced.filter((s) => !claimed.includes(s)),
    /** Twice or more across three episodes — the only pattern three can show. */
    repeated: SHAPES.filter((s) => (counts[s] ?? 0) >= 2),
    filled: episodes.length,
    /** One episode is an anecdote. The copy has to say so. */
    thin: episodes.length < 2,
  };
}

const names = (list, t) => list.map((s) => t(`shape.${s}.label`)).join(", ");

function view(result, { t }) {
  const lead = result.backed[0] ?? result.repeated[0] ?? result.evidenced[0] ?? result.claimed[0] ?? SHAPES[0];

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: result.backed.length
        ? t("view.title", { count: result.backed.length, names: names(result.backed, t) })
        : t("view.titleNone"),
      body: result.backed.length ? t("view.body", { lead: t(`shape.${lead}.label`) }) : t("view.bodyNone"),
    })}

    <section class="sub-plate">
      <h4>${t("view.sortHeading")} <span class="label">${t("view.sortNote")}</span></h4>
      <div class="cards">
        <div class="card pad instruction-card">
          <span class="label">${t("view.backedLabel")}</span>
          <h4>${result.backed.length ? names(result.backed, t) : t("view.backedNone")}</h4>
          <p class="prose">${t(result.backed.length ? "view.backedBody" : "view.backedNoneBody")}</p>
        </div>
        <div class="card pad instruction-card">
          <span class="label">${t("view.unbackedLabel")}</span>
          <h4>${result.unbacked.length ? names(result.unbacked, t) : t("view.unbackedNone")}</h4>
          <p class="prose">${t(result.unbacked.length ? "view.unbackedBody" : "view.unbackedNoneBody")}</p>
        </div>
        <div class="card pad instruction-card">
          <span class="label">${t("view.unclaimedLabel")}</span>
          <h4>${result.unclaimed.length ? names(result.unclaimed, t) : t("view.unclaimedNone")}</h4>
          <p class="prose">${t(result.unclaimed.length ? "view.unclaimedBody" : "view.unclaimedNoneBody")}</p>
        </div>
      </div>
    </section>

    <section class="sub-plate">
      <h4>${t("view.episodesHeading")} <span class="label">${t("view.episodesNote")}</span></h4>
      <div class="cards">
        ${join(result.episodes.map((e) => html`<div class="card pad instruction-card">
          <span class="label">${t(`shape.${e.shape}.label`)} · ${t(`share.${e.share}`)}</span>
          <h4>${e.what || t("view.episodeUnnamed")}</h4>
          <p class="prose">${e.did || t("view.episodeNoAction")}</p>
        </div>`))}
      </div>
    </section>

    ${factsHTML([
      [t("view.fact.episodes"), t("view.episodesValue", { count: result.filled })],
      [t("view.fact.repeated"), result.repeated.length
        ? t("view.repeatedValue", { names: names(result.repeated, t) })
        : t("view.repeatedNone")],
      [t("view.fact.claimed"), result.claimed.length ? names(result.claimed, t) : t("view.claimedNone")],
    ])}

    ${result.thin ? html`<div class="note prose"><p>${t("view.thinNote")}</p></div>` : ""}
    <div class="note prose"><p>${t("view.notAMeasureNote")}</p></div>
    <div class="note warn-note prose"><p>${t("view.notForHiringNote")}</p></div>`;
}

function instructions(result, t) {
  const cards = [];
  if (result.backed.length) {
    cards.push({
      channel: "work",
      title: t("instructions.backedTitle", { names: names(result.backed, t) }),
      body: t("instructions.backedBody", { shape: t(`shape.${result.backed[0]}.label`) }),
    });
  }
  if (result.repeated.length) {
    cards.push({
      channel: "work",
      title: t("instructions.repeatedTitle", { names: names(result.repeated, t) }),
      body: t("instructions.repeatedBody"),
    });
  }
  if (result.unclaimed.length) {
    cards.push({
      channel: "work",
      title: t("instructions.unclaimedTitle", { names: names(result.unclaimed, t) }),
      // The body names no shape, but it says "this" or "these" about however
      // many there are, so it needs the count even though it needs no list.
      body: t("instructions.unclaimedBody", { count: result.unclaimed.length }),
    });
  }
  if (result.unbacked.length) {
    cards.push({
      channel: "energy",
      title: t("instructions.unbackedTitle", { names: names(result.unbacked, t) }),
      body: t("instructions.unbackedBody", { count: result.unbacked.length }),
    });
  }
  // Every branch above can be empty at once — somebody who wrote one episode,
  // claimed the shape it used, and nothing else. A card is still owed.
  if (!cards.length) {
    cards.push({ channel: "work", title: t("instructions.fallbackTitle"), body: t("instructions.fallbackBody") });
  }
  return cards;
}

export { SHAPES, EPISODES, SHARE, MAX_CLAIMS };

export default {
  id: "strength-evidence",
  version: 1,
  family: "profiler",
  glyph: "✓",
  minutes: 8,
  channels: ["work", "energy"],
  // Free text about your own history, in your own words. It can be handed to
  // a mentor or a friend; it has no business being posted at a stable public
  // URL, and a ceiling is a different thing from a discouraged default.
  maxAudience: "friends",
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form, validate, score, view, instructions,
};
