import { describe, expect, test } from "vitest";
import {
  PRESET_AUDIENCE,
  allowedFor,
  hasExpired,
  pruneToCeiling,
  runElement,
  seedElements,
  sharingFor,
  validateProfile,
  type ProfileSpec,
  type ShareProfile,
} from "@/core/profiles";
import { encodeReport, decodeReport } from "@/core/report";
import { registry } from "@/instruments";

/**
 * A profile is a selection under a ceiling, and both halves have to hold.
 *
 * The selection is what the reader chose. The ceiling is what an instrument
 * declared about itself and the reader cannot overrule. The tests that matter
 * most here are the ones where those two disagree — because a profile that
 * could quietly widen a ceiling would make every `maxAudience` in the app
 * decorative.
 */

const spec = (id: string, extra: Partial<ProfileSpec> = {}): ProfileSpec => ({
  id,
  channels: ["communication"],
  ...extra,
});

const SPECS: ProfileSpec[] = [
  spec("communication-style", { channels: ["communication", "conflict"] }),
  spec("working-style", { channels: ["work"] }),
  spec("faith", { sensitive: true, maxAudience: "partner", channels: ["communication", "rhythm"] }),
  spec("good-life", { sensitive: true, maxAudience: "partner", channels: ["work", "energy"] }),
  spec("chronotype", { channels: ["rhythm", "energy"] }),
];

const profile = (over: Partial<ShareProfile> = {}): ShareProfile => ({
  id: "p1",
  name: "Team",
  audience: "friends",
  elements: [],
  expiresInDays: null,
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
  ...over,
});

describe("the ceiling", () => {
  test("an instrument capped at partner never reaches a team or the public", () => {
    const faith = SPECS.find((s) => s.id === "faith")!;
    expect(allowedFor(faith, "partner")).toBe(true);
    expect(allowedFor(faith, "friends")).toBe(false);
    expect(allowedFor(faith, "public")).toBe(false);
  });

  test("an uncapped instrument reaches every audience that is not private", () => {
    const comms = SPECS.find((s) => s.id === "communication-style")!;
    expect(allowedFor(comms, "partner")).toBe(true);
    expect(allowedFor(comms, "friends")).toBe(true);
    expect(allowedFor(comms, "public")).toBe(true);
  });

  test("private is nobody, so nothing is allowed for it", () => {
    // `private` is the absence of sharing rather than its narrowest setting.
    for (const s of SPECS) expect(allowedFor(s, "private")).toBe(false);
  });

  test("an unknown instrument is treated as uncapped, and that is the wrong default to rely on", () => {
    // Recorded rather than endorsed: `audiencesFor` defaults a missing ceiling
    // to `public`, so `allowedFor(null, …)` is permissive. Nothing reaches this
    // path with a real element, because `pruneToCeiling` only asks about ids it
    // took from `run.<id>` — but if that ever changes, this is the trapdoor.
    expect(allowedFor(null, "public")).toBe(true);
  });
});

describe("presets seed rather than decide", () => {
  test("public starts from what no instrument called tender", () => {
    const seeded = seedElements("public", SPECS);
    expect(seeded).toContain(runElement("communication-style"));
    expect(seeded).toContain(runElement("chronotype"));
    expect(seeded).not.toContain(runElement("faith"));
    expect(seeded).not.toContain(runElement("good-life"));
  });

  test("team starts from the working channels and nothing else", () => {
    const seeded = seedElements("team", SPECS);
    expect(seeded).toContain(runElement("communication-style"));
    expect(seeded).toContain(runElement("working-style"));
    // Capped at partner, so it could not appear even though it declares `work`.
    expect(seeded).not.toContain(runElement("good-life"));
    // No working channel — `rhythm` and `energy` are not a colleague's business
    // by default, and the reader adds it if they disagree.
    expect(seeded).not.toContain(runElement("chronotype"));
  });

  test("a preset never seeds past its own ceiling", () => {
    for (const preset of ["public", "team", "partner"] as const) {
      const audience = PRESET_AUDIENCE[preset];
      for (const element of seedElements(preset, SPECS)) {
        const id = element.slice("run.".length);
        expect(allowedFor(SPECS.find((s) => s.id === id)!, audience), `${preset}/${element}`).toBe(true);
      }
    }
  });

  test("partner seeds everything the ceilings allow, tender or not", () => {
    // The point of the partner profile: `sensitive` is not a reason to withhold
    // from the one person it was written for, only a reason not to default it
    // wider.
    expect(seedElements("partner", SPECS)).toContain(runElement("faith"));
  });
});

describe("pruning says what it removed", () => {
  test("lowering the audience drops what no longer fits, and names it", () => {
    const specOf = (id: string) => SPECS.find((s) => s.id === id) ?? null;
    const elements = [runElement("communication-style"), runElement("faith"), "profile.name"];

    const { kept, dropped } = pruneToCeiling(elements, "friends", specOf);
    expect(kept).toEqual([runElement("communication-style"), "profile.name"]);
    // Returned rather than silently applied: a selection quietly shrinking is
    // how somebody comes to believe they shared something they did not.
    expect(dropped).toEqual([runElement("faith")]);
  });

  test("an element with no instrument behind it is governed by being chosen", () => {
    const { kept } = pruneToCeiling(["profile.note"], "public", () => null);
    expect(kept).toEqual(["profile.note"]);
  });
});

describe("the sharing map a profile implies", () => {
  test("only selected elements appear, each at the profile's own audience", () => {
    const map = sharingFor(profile({ audience: "friends", elements: ["run.a", "run.b"] }));
    expect(map).toEqual({ "run.a": "friends", "run.b": "friends" });
  });

  test("an empty selection implies an empty map rather than a default", () => {
    expect(sharingFor(profile({ elements: [] }))).toEqual({});
  });
});

describe("the ceiling is enforced again by the encoder, not just by the profile", () => {
  test("a hand-edited profile cannot smuggle a capped instrument into a token", () => {
    // The scenario is somebody editing local storage, or a bug in the page. The
    // profile claims faith is fair game for friends; the encoder consults the
    // instrument, not the profile, and refuses.
    const faith = registry.get("faith");
    expect(faith?.spec.maxAudience, "this test is meaningless if faith stopped being capped").toBe("partner");

    const token = encodeReport({
      registry,
      runs: [{ instrumentId: "faith", instrumentVersion: 1, answers: { god: "open" } }],
      sharing: sharingFor(profile({ audience: "friends", elements: [runElement("faith")] })),
      audience: "friends",
    });

    const decoded = decodeReport(token, registry);
    expect(decoded.runs.map((r) => r.instrumentId)).toEqual([]);
  });

  test("the same profile at the partner audience does carry it", () => {
    const token = encodeReport({
      registry,
      runs: [{ instrumentId: "faith", instrumentVersion: 1, answers: { god: "open" } }],
      sharing: sharingFor(profile({ audience: "partner", elements: [runElement("faith")] })),
      audience: "partner",
    });
    expect(decodeReport(token, registry).runs.map((r) => r.instrumentId)).toEqual(["faith"]);
  });
});

describe("expiry", () => {
  const created = Date.parse("2026-08-01T00:00:00.000Z");

  test("no expiry never expires", () => {
    expect(hasExpired(profile({ expiresInDays: null }), created + 1e12)).toBe(false);
  });

  test("expires after its own number of days, not before", () => {
    const p = profile({ expiresInDays: 7 });
    expect(hasExpired(p, created + 6 * 86400000)).toBe(false);
    expect(hasExpired(p, created + 8 * 86400000)).toBe(true);
  });

  test("an unreadable creation date does not expire everything at once", () => {
    // Failing open is wrong for a permission and right for a timer: a corrupt
    // date should not make a live link look dead, because the reader would
    // republish and hand out a second link while the first still worked.
    expect(hasExpired(profile({ expiresInDays: 1, createdAt: "not a date" }), Date.now())).toBe(false);
  });
});

describe("validation", () => {
  test("a profile for private is refused outright", () => {
    expect(() => validateProfile(profile({ audience: "private" }))).toThrow(/private/);
  });

  test("a nameless profile is refused", () => {
    expect(() => validateProfile(profile({ name: "   " }))).toThrow(/name/);
  });

  test("a duplicated element is refused", () => {
    expect(() => validateProfile(profile({ elements: ["run.a", "run.a"] }))).toThrow(/twice/);
  });

  test("an expiry of zero, a fraction or a negative is refused", () => {
    for (const days of [0, -1, 1.5]) {
      expect(() => validateProfile(profile({ expiresInDays: days })), String(days)).toThrow(/whole number/);
    }
    expect(() => validateProfile(profile({ expiresInDays: 1 }))).not.toThrow();
  });
});
