import { html, join } from "../../core/html.js";
import { barsHTML, factsHTML, verdictHTML } from "../../ui/components/scorecard.js";

/**
 * Attraction, behaviour and identity — kept apart, because they are.
 *
 * The field settled this decades ago and consumer products keep re-merging it.
 * Of women reporting any same-gender sexuality in Laumann's 1994 survey, 88%
 * reported attraction, 41% reported behaviour and 16% reported a lesbian or
 * gay identity. Those are three overlapping populations, not three views of
 * one. Every serious survey — NSFG, Natsal, NHIS, the ONS census — asks them
 * separately, and an instrument that infers identity from attraction is
 * generating measurement error and calling it insight.
 *
 * The intensity axes are *independent*, following Storms (1980) rather than
 * Kinsey's single line. Two axes is Storms' own form: attraction to men and
 * attraction to women asked separately rather than traded off against each
 * other. A single bipolar line cannot represent low attraction at all — it
 * puts "drawn strongly to both" and "drawn to neither" in the same place,
 * because one is the midpoint of a sum and the other the midpoint of an
 * absence. Two independent axes put them at opposite corners, which is the
 * whole reason to use them and the reason four outcomes fall out of two
 * questions rather than being asked for directly.
 *
 * And nothing here assigns anybody anything. The Kinsey Institute states that
 * no official Kinsey scale test exists; AVEN states that no test determines
 * whether a person is asexual; the National Academies concluded in 2022 that
 * no attraction measure has been validated for assigning an identity. This
 * arranges what you said. It does not know what you are.
 */

const LEVELS = ["none", "little", "some", "strong"];
const TARGETS = ["men", "women"];

/** Sexual and romantic attraction are asked separately, per the split model. */
const AXES = [
  ...TARGETS.map((target) => ({ id: `s.${target}`, kind: "sexual", target })),
  ...TARGETS.map((target) => ({ id: `r.${target}`, kind: "romantic", target })),
];

const IDENTITIES = ["straight", "gay", "lesbian", "bi", "ace", "ownWord", "ratherNotSay"];

const CERTAINTY = ["settled", "working", "noLabel"];
const ASSUME = ["partnerGender", "identityFromPartner", "nothing"];

function form(t) {
  return {
    kind: "fields",
    fields: [
      ...AXES.map((axis) => ({
        id: axis.id, kind: "select", value: "none",
        label: t(`axis.${axis.kind}.${axis.target}`),
        options: LEVELS.map((value) => ({ value, label: t(`level.${value}`) })),
      })),
      {
        id: "behaviour", kind: "multi", label: t("field.behaviour.label"), max: 3,
        options: ["none", "men", "women"].map((value) => ({ value, label: t(`behaviour.${value}`) })),
      },
      {
        id: "identity", kind: "select", value: "ratherNotSay", label: t("field.identity.label"),
        options: IDENTITIES.map((value) => ({ value, label: t(`identity.${value}`) })),
      },
      { id: "ownWord", kind: "text", label: t("field.ownWord.label"), placeholder: t("field.ownWord.placeholder"), optional: true },
      {
        id: "certainty", kind: "select", value: "settled", label: t("field.certainty.label"),
        options: CERTAINTY.map((value) => ({ value, label: t(`certainty.${value}`) })),
      },
      {
        id: "assume", kind: "select", value: "nothing", label: t("field.assume.label"),
        options: ASSUME.map((value) => ({ value, label: t(`assume.${value}`) })),
      },
    ],
    note: t("form.note"),
  };
}

const depth = (value) => Math.max(0, LEVELS.indexOf(value));

function score(answers) {
  const axes = {};
  for (const axis of AXES) axes[axis.id] = LEVELS.includes(answers[axis.id]) ? answers[axis.id] : "none";

  const sexual = TARGETS.map((target) => depth(axes[`s.${target}`]));
  const romantic = TARGETS.map((target) => depth(axes[`r.${target}`]));

  const drawn = (list) => list.filter((n) => n > 0).length;

  // Whether the sexual and romantic patterns point in different directions.
  // This is the one derived fact worth reporting, because it is exactly what a
  // single-axis instrument makes invisible, and it is a description of two
  // answer sets rather than a claim about a person.
  const divergent = TARGETS.some((target, i) => Math.abs(sexual[i] - romantic[i]) >= 2);

  return {
    v: 1,
    axes,
    sexualBreadth: drawn(sexual),
    romanticBreadth: drawn(romantic),
    sexualLow: sexual.every((n) => n === 0),
    romanticLow: romantic.every((n) => n === 0),
    divergent,
    behaviour: Array.isArray(answers.behaviour) ? answers.behaviour : [],
    identity: IDENTITIES.includes(answers.identity) ? answers.identity : "ratherNotSay",
    ownWord: String(answers.ownWord ?? "").trim().slice(0, 40),
    certainty: CERTAINTY.includes(answers.certainty) ? answers.certainty : "settled",
    assume: ASSUME.includes(answers.assume) ? answers.assume : "nothing",
  };
}

const barsFor = (result, kind, t) =>
  TARGETS.map((target) => ({
    key: `${kind}.${target}`,
    label: t(`axis.${kind}.${target}`),
    // The bars want 1..100; the answers are four steps. Rendered as quarters
    // so nobody mistakes a four-point answer for a measurement.
    score: Math.max(1, depth(result.axes[`${kind === "sexual" ? "s" : "r"}.${target}`]) * 33),
    blurb: t(`level.${result.axes[`${kind === "sexual" ? "s" : "r"}.${target}`]}`),
  }));

function view(result, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: result.ownWord || t(`identity.${result.identity}`),
      body: t(`view.certainty.${result.certainty}`),
    })}

    <section class="sub-plate">
      <h4>${t("view.sexualHeading")} <span class="label">${t("view.axisNote")}</span></h4>
      ${barsHTML(barsFor(result, "sexual", t))}
    </section>

    <section class="sub-plate">
      <h4>${t("view.romanticHeading")} <span class="label">${t("view.axisNote")}</span></h4>
      ${barsHTML(barsFor(result, "romantic", t))}
    </section>

    ${factsHTML([
      [t("view.fact.behaviour"), result.behaviour.length
        ? result.behaviour.map((value) => t(`behaviour.${value}`)).join(", ")
        : t("view.behaviourUnanswered")],
      [t("view.fact.assume"), t(`assume.${result.assume}.long`)],
    ])}

    ${result.divergent ? html`<div class="note prose"><p>${t("view.divergentNote")}</p></div>` : ""}
    ${result.sexualLow || result.romanticLow ? html`<div class="note prose"><p>${t("view.lowNote")}</p></div>` : ""}
    <div class="note prose"><p>${t("view.threeThingsNote")}</p></div>
    <div class="note prose"><p>${t("view.noLabelNote")}</p></div>`;
}

/**
 * One card, and it is about what not to assume rather than about what someone
 * is. Disclosure is the highest-risk thing in this domain and a sheet is a
 * document that gets handed over; a card saying "here is my orientation" would
 * make the app the author of somebody's coming out. A card saying "do not
 * assume my partner is a man" is the person's own request, and it is the thing
 * a colleague or friend can actually act on.
 */
function instructions(result, t) {
  return [{
    channel: "communication",
    title: t("instructions.assumeTitle"),
    body: t(`assume.${result.assume}.ask`),
  }];
}

export { LEVELS, TARGETS, AXES, IDENTITIES, depth };

export default {
  id: "attraction",
  version: 1,
  family: "profiler",
  glyph: "◈",
  minutes: 3,
  channels: ["communication"],

  sensitive: true,
  maxAudience: "friends",

  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form, score, view, instructions,
};
