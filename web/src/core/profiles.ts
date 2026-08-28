/**
 * A profile is a named selection, not a level.
 *
 * `Audience` is a ladder — `private → partner → friends → public` — and
 * `atLeast` is an index comparison. That is the right model for a *ceiling* and
 * the wrong one for what people actually share, because the third audience
 * anybody asks for is a team, and a team does not sit anywhere on it.
 *
 * A colleague should see how you want to be corrected and nothing about your
 * faith. A close friend is the other way round. Team is not narrower than
 * friends and it is not wider; it is sideways. Adding a rung for it means
 * picking a position that is wrong in one direction or the other, and then
 * working around the pick forever.
 *
 * So the ladder keeps the job it is good at and nothing else. An instrument's
 * `maxAudience` still caps what may ever be offered, and `encodeReport` checks
 * that ceiling again when it builds a token — a profile cannot smuggle
 * `run.faith` to a team by intent, by a bug, or by somebody editing local
 * storage, because the check does not consult the profile. What the profile
 * adds is the part the ladder cannot express: exactly which elements, chosen
 * one at a time, under a ceiling that is still enforced elsewhere.
 */
import { AUDIENCE_ORDER, atLeast, audiencesFor } from "./audience";
import type { Audience } from "./types";

/** What a profile can be built out of. Same ids the sharing map uses. */
export type ElementId = string;

export type RemoteHandle = {
  /** The published record's id — the path segment of the link. */
  id: string;
  /**
   * What proves the right to withdraw it.
   *
   * It lives here, in the sender's own storage, and nowhere else. That is the
   * price of having no accounts, and it has a consequence worth stating where
   * the reader can see it rather than in a help page: lose the device and you
   * lose the ability to revoke. `store.exportAll` carries these, so a backup is
   * a backup of the ability to take things back.
   */
  manageToken: string;
  publishedAt: string;
};

/**
 * Named `ShareProfile` because `store.profile()` is already taken, by the
 * reader's own identity — their display name, pronouns and opening line. Two
 * different things called Profile in one storage layer is how a call site ends
 * up reading one and writing the other.
 */
export type ShareProfile = {
  id: string;
  /** The reader's own word for it. Never generated from the preset. */
  name: string;
  /** The ceiling this profile was built under. */
  audience: Audience;
  /** Exactly what is in it. Nothing is implied and nothing is inherited. */
  elements: ElementId[];
  expiresInDays: number | null;
  remote?: RemoteHandle;
  createdAt: string;
  updatedAt: string;
};

export const PRESETS = ["public", "team", "partner"] as const;
export type Preset = (typeof PRESETS)[number];

/**
 * The ceiling each preset builds under.
 *
 * `team` sits at `friends` rather than at a rung of its own — see the module
 * comment. The ceiling is what stops a sensitive instrument reaching a
 * colleague; the *selection* is what stops an insensitive one reaching them
 * when the reader would rather it did not.
 */
export const PRESET_AUDIENCE: Record<Preset, Audience> = {
  public: "public",
  team: "friends",
  partner: "partner",
};

/**
 * Channels a team profile starts from.
 *
 * Not a claim about what a colleague is entitled to. It is the cheapest
 * starting point that is wrong in the safe direction: it seeds the three
 * channels a working relationship runs on and leaves everything else off, so a
 * reader adds rather than remembers to remove. A preset that seeded generously
 * would make the common mistake the silent one.
 */
export const TEAM_CHANNELS = ["work", "communication", "conflict"] as const;

/**
 * The reader themselves, as elements.
 *
 * A profile that could only carry test results would arrive at the other end
 * unsigned — a page of readings with nobody's name on it. These are the three
 * things the report layer already knows how to send, and they are elements
 * rather than a special case so that the same one control governs all of it:
 * one list, one set of checkboxes, one answer to "what is in this".
 *
 * Ordered least to most revealing, which is also the order somebody would
 * naturally stop at: a name, then how to address them, then a sentence they
 * wrote about themselves.
 */
export const IDENTITY_ELEMENTS = ["profile.name", "profile.pronouns", "profile.note"] as const;

/**
 * What each preset starts an identity at.
 *
 * A public profile carries a name because that is what makes it a profile
 * rather than an anonymous reading. It does not carry the opening line, which
 * people write for somebody in particular — seeding it into a public link is
 * the kind of default that gets noticed after it has been sent.
 */
const PRESET_IDENTITY: Record<Preset, readonly string[]> = {
  public: ["profile.name"],
  team: ["profile.name", "profile.pronouns"],
  partner: [...IDENTITY_ELEMENTS],
};

/** What a spec has to tell us to be sorted into a preset. */
export type ProfileSpec = {
  id: string;
  sensitive?: boolean;
  maxAudience?: Audience;
  channels: readonly string[];
};

/** The element id an instrument's result is known by, everywhere. */
export const runElement = (instrumentId: string): ElementId => `run.${instrumentId}`;

/**
 * May this element appear in a profile built for this audience?
 *
 * Two different refusals, and they are not the same fact. An instrument whose
 * ceiling is below the audience may *never* appear, whoever asks. An element
 * the reader has not selected simply is not in this profile, and may be in the
 * next one.
 */
export function allowedFor(spec: ProfileSpec | null | undefined, audience: Audience): boolean {
  if (audience === "private") return false;
  return audiencesFor(spec ?? {}).includes(audience);
}

/**
 * Seed a selection. A starting point, and the copy has to say so.
 *
 * The alternative — presets that are simply applied — is the ladder's mistake
 * in a different costume: a rule deciding what a colleague sees, written by
 * somebody who has never met them.
 */
export function seedElements(preset: Preset, specs: readonly ProfileSpec[]): ElementId[] {
  const audience = PRESET_AUDIENCE[preset];
  const usable = specs.filter((spec) => allowedFor(spec, audience));
  const identity = [...PRESET_IDENTITY[preset]];

  if (preset === "team") {
    return identity.concat(
      usable
        .filter((spec) => spec.channels.some((channel) => (TEAM_CHANNELS as readonly string[]).includes(channel)))
        .map((spec) => runElement(spec.id)),
    );
  }

  if (preset === "public") {
    // A public profile starts from what is not tender. `sensitive` was declared
    // instrument by instrument for exactly this question and is more reliable
    // than any list kept here, which would fall out of date the first time an
    // instrument was added by somebody who never read this file.
    return identity.concat(usable.filter((spec) => !spec.sensitive).map((spec) => runElement(spec.id)));
  }

  return identity.concat(usable.map((spec) => runElement(spec.id)));
}

/**
 * Drop anything the ceiling forbids, and say what was dropped.
 *
 * Called when a profile's audience is lowered, and again before publishing. It
 * returns the removals rather than silently applying them because a selection
 * quietly shrinking is how somebody comes to believe they shared something they
 * did not — the opposite failure to the one the ceiling exists to prevent, and
 * just as bad for trust.
 */
export function pruneToCeiling(
  elements: readonly ElementId[],
  audience: Audience,
  specOf: (instrumentId: string) => ProfileSpec | null,
): { kept: ElementId[]; dropped: ElementId[] } {
  const kept: ElementId[] = [];
  const dropped: ElementId[] = [];
  for (const element of elements) {
    const instrumentId = element.startsWith("run.") ? element.slice("run.".length) : null;
    // A non-run element — a display name, a pronoun, an opening line — has no
    // instrument and therefore no ceiling. It is governed by being selected.
    const ok = instrumentId === null ? audience !== "private" : allowedFor(specOf(instrumentId), audience);
    (ok ? kept : dropped).push(element);
  }
  return { kept, dropped };
}

/**
 * The sharing map a profile implies.
 *
 * `encodeReport` reads a `Sharing` map and an audience, so a profile is turned
 * into one rather than teaching the encoder a second way to be asked. Every
 * selected element is marked at the profile's own audience; everything else is
 * absent, which is what makes withheld content absent from the token rather
 * than hidden by the page that renders it.
 */
export function sharingFor(profile: Pick<ShareProfile, "elements" | "audience">): Record<ElementId, Audience> {
  return Object.fromEntries(profile.elements.map((element) => [element, profile.audience]));
}

/** Is this profile's own expiry past? Days, because that is all an expiry needs. */
export function hasExpired(profile: Pick<ShareProfile, "expiresInDays" | "createdAt">, now: number): boolean {
  if (profile.expiresInDays == null) return false;
  const started = Date.parse(profile.createdAt);
  if (!Number.isFinite(started)) return false;
  return now > started + profile.expiresInDays * 86400000;
}

export function validateProfile(profile: ShareProfile): void {
  if (!profile.id) throw new TypeError("a profile needs an id");
  if (!profile.name.trim()) throw new TypeError(`profile "${profile.id}" needs a name`);
  if (!AUDIENCE_ORDER.includes(profile.audience)) {
    throw new TypeError(`profile "${profile.id}": unknown audience "${profile.audience}"`);
  }
  /**
   * A profile for nobody is not a profile.
   *
   * `private` is the absence of sharing rather than its narrowest setting —
   * `atLeast` refuses it against itself for the same reason — so a profile at
   * that audience would build a link containing nothing and read, to whoever
   * opened it, as though the sender had shared and been generous with nothing.
   */
  if (!atLeast(profile.audience, profile.audience)) {
    throw new TypeError(`profile "${profile.id}": "private" is not an audience a profile can be built for`);
  }
  if (profile.expiresInDays != null && (!Number.isInteger(profile.expiresInDays) || profile.expiresInDays < 1)) {
    throw new TypeError(`profile "${profile.id}": an expiry, if set, is a whole number of days above zero`);
  }
  if (new Set(profile.elements).size !== profile.elements.length) {
    throw new TypeError(`profile "${profile.id}": an element appears twice`);
  }
}
