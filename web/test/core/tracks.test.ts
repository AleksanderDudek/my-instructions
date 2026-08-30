import { describe, expect, test } from "vitest";
import { TRACKS, TRACK_LIST, progressOf, trackById, unknownSteps } from "@/core/tracks";
import { registry } from "@/instruments";

/**
 * A track is a list of ids, which is the cheapest thing in the app to get
 * wrong and the most annoying to meet: a route that offers a reader a link to
 * an instrument that does not exist.
 */

const known = new Set(registry.ids());

test("every step names an instrument that exists", () => {
  expect(unknownSteps(known)).toEqual([]);
});

test("every track is listed and every listed track is real", () => {
  expect(TRACK_LIST.map((t) => t.id).sort()).toEqual([...TRACKS].sort());
  for (const id of TRACKS) expect(trackById(id), id).not.toBeNull();
  expect(trackById("nonsense")).toBeNull();
});

test("no track repeats an instrument", () => {
  // A repeat reads as a mistake to anybody following the order, and it would
  // make the progress count wrong in a way nobody would think to check.
  for (const track of TRACK_LIST) {
    expect(new Set(track.steps).size, track.id).toBe(track.steps.length);
  }
});

test("no track opens on something the reader has to steel themselves for", () => {
  /**
   * The one rule the orders follow: ascending cost. The first instrument of a
   * track is the one a reader meets before they have decided to trust the app,
   * so it must not be one that asks about their debts or their marriage.
   */
  for (const track of TRACK_LIST) {
    const first = registry.get(track.steps[0]);
    expect(first, track.id).not.toBeNull();
    expect(first!.spec.adult ?? false, `${track.id} opens on an age-gated instrument`).toBe(false);
    expect(first!.spec.sensitive ?? false, `${track.id} opens on a sensitive instrument`).toBe(false);
  }
});

test("nothing age-gated is routed to at all", () => {
  // The two adult instruments are reachable from the catalogue behind their own
  // confirmation. Putting one in a suggested route would be the app deciding
  // somebody is ready for it.
  for (const track of TRACK_LIST) {
    for (const step of track.steps) {
      expect(registry.get(step)!.spec.adult ?? false, `${track.id}/${step}`).toBe(false);
    }
  }
});

test("the tracks that hand something over are the ones with a preset", () => {
  // Stated in the module comment and worth pinning: `self` produces a sheet for
  // its own author and `couple` produces a conversation, so neither ends at a
  // link. The other three do.
  expect(trackById("self")!.preset).toBeUndefined();
  expect(trackById("couple")!.preset).toBeUndefined();
  expect(trackById("dating")!.preset).toBe("partner");
  expect(trackById("work")!.preset).toBe("team");
  expect(trackById("statement")!.preset).toBe("public");
});

test("a statement track stays short enough to read as an introduction", () => {
  // Three, deliberately: a public page assembled from five instruments is a
  // dossier rather than an introduction.
  expect(trackById("statement")!.steps).toHaveLength(3);
});

describe("progress", () => {
  const track = trackById("work")!;

  test("counts what has been taken and points at the first gap", () => {
    const taken = new Set([track.steps[0], track.steps[2]]);
    const { done, total, next } = progressOf(track, taken);
    expect(done).toBe(2);
    expect(total).toBe(track.steps.length);
    // The first *untaken* one in the track's order — not the one after the last
    // taken, which would send somebody who skipped step two back to it forever.
    expect(next).toBe(track.steps[1]);
  });

  test("a finished track has nothing next rather than looping", () => {
    const { done, next } = progressOf(track, new Set(track.steps));
    expect(done).toBe(track.steps.length);
    expect(next).toBeNull();
  });

  test("an empty history starts at the beginning", () => {
    expect(progressOf(track, new Set()).next).toBe(track.steps[0]);
  });

  test("instruments taken outside the track do not inflate it", () => {
    // Somebody who has taken half the catalogue has not thereby finished the
    // work track, and a count that said otherwise would be flattering nonsense.
    const { done } = progressOf(track, new Set(["numerology", "faith", "enneagram"]));
    expect(done).toBe(0);
  });
});
