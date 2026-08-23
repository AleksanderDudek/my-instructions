import type { Answers, Field, FieldsForm, InstructionCard, InstrumentSpec, T } from "@/core/types";
import {
  ASSUME,
  AXES,
  CERTAINTY,
  IDENTITIES,
  LEVELS,
  TARGETS,
  depth,
  oneOf,
  type Assume,
  type Certainty,
  type Identity,
  type Level,
} from "./axes";

/**
 * Nothing here is scored against anything.
 *
 * The four-step answers are read back as they were given, and the only derived
 * facts are counts and comparisons of the person's own answers — never a
 * verdict, never a category. Which is the point: the National Academies
 * concluded in 2022 that no attraction measure has been validated for
 * assigning an identity, so this one assigns none.
 */

export type AttractionResult = {
  v: number;
  axes: Record<string, Level>;
  sexualBreadth: number;
  romanticBreadth: number;
  sexualLow: boolean;
  romanticLow: boolean;
  divergent: boolean;
  behaviour: string[];
  identity: Identity;
  ownWord: string;
  certainty: Certainty;
  assume: Assume;
};

export function form(t: T): FieldsForm {
  return {
    kind: "fields",
    fields: [
      ...AXES.map(
        (axis): Field => ({
          id: axis.id,
          kind: "select",
          value: "none",
          label: t(`axis.${axis.kind}.${axis.target}`),
          options: LEVELS.map((value) => ({ value, label: t(`level.${value}`) })),
        }),
      ),
      {
        id: "behaviour",
        kind: "multi",
        label: t("field.behaviour.label"),
        max: 3,
        options: ["none", "men", "women"].map((value) => ({ value, label: t(`behaviour.${value}`) })),
      },
      {
        id: "identity",
        kind: "select",
        value: "ratherNotSay",
        label: t("field.identity.label"),
        options: IDENTITIES.map((value) => ({ value, label: t(`identity.${value}`) })),
      },
      {
        id: "ownWord",
        kind: "text",
        label: t("field.ownWord.label"),
        placeholder: t("field.ownWord.placeholder"),
        optional: true,
      },
      {
        id: "certainty",
        kind: "select",
        value: "settled",
        label: t("field.certainty.label"),
        options: CERTAINTY.map((value) => ({ value, label: t(`certainty.${value}`) })),
      },
      {
        id: "assume",
        kind: "select",
        value: "nothing",
        label: t("field.assume.label"),
        options: ASSUME.map((value) => ({ value, label: t(`assume.${value}`) })),
      },
    ],
    note: t("form.note"),
  };
}

export function score(answers: Answers): AttractionResult {
  const axes: Record<string, Level> = {};
  for (const axis of AXES) axes[axis.id] = oneOf(LEVELS, answers[axis.id], "none");

  const sexual = TARGETS.map((target) => depth(axes[`s.${target}`]));
  const romantic = TARGETS.map((target) => depth(axes[`r.${target}`]));

  const drawn = (list: number[]) => list.filter((n) => n > 0).length;

  // Whether the sexual and romantic patterns point in different directions.
  // This is the one derived fact worth reporting, because it is exactly what a
  // single-axis instrument makes invisible, and it is a description of two
  // answer sets rather than a claim about a person.
  const divergent = TARGETS.some((_, i) => Math.abs(sexual[i] - romantic[i]) >= 2);

  return {
    v: 1,
    axes,
    sexualBreadth: drawn(sexual),
    romanticBreadth: drawn(romantic),
    sexualLow: sexual.every((n) => n === 0),
    romanticLow: romantic.every((n) => n === 0),
    divergent,
    behaviour: Array.isArray(answers.behaviour) ? answers.behaviour : [],
    identity: oneOf(IDENTITIES, answers.identity, "ratherNotSay"),
    ownWord: String(answers.ownWord ?? "").trim().slice(0, 40),
    certainty: oneOf(CERTAINTY, answers.certainty, "settled"),
    assume: oneOf(ASSUME, answers.assume, "nothing"),
  };
}

/**
 * One card, and it is about what not to assume rather than about what someone
 * is. Disclosure is the highest-risk thing in this domain and a sheet is a
 * document that gets handed over; a card saying "here is my orientation" would
 * make the app the author of somebody's coming out. A card saying "do not
 * assume my partner is a man" is the person's own request, and it is the thing
 * a colleague or friend can actually act on.
 */
export function instructions(result: AttractionResult, t: T): InstructionCard[] {
  return [
    {
      channel: "communication",
      title: t("instructions.assumeTitle"),
      body: t(`assume.${result.assume}.ask`),
    },
  ];
}

export const spec: InstrumentSpec<AttractionResult> = {
  id: "attraction",
  version: 1,
  family: "profiler",
  glyph: "◈",
  minutes: 3,
  channels: ["communication"],
  tier: "free",

  sensitive: true,
  maxAudience: "friends",

  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form,
  score,
  instructions,
};

export default spec;
