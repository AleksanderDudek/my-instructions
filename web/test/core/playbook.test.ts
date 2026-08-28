import { expect, test } from "vitest";
import { resolvePlaybook, isEmptyPlaybook } from "@/core/playbook";
import type { Practice } from "@/core/store";
import type { Playbook } from "@/core/types";

/**
 * What survives a revision, and what quietly does not.
 *
 * The stored practice holds ids for the lines we wrote and text for the lines
 * the reader wrote. That asymmetry is the whole design — ours re-render in
 * today's language, theirs come back verbatim — and its cost is that a stored
 * id can name a suggestion that no longer exists, because the instrument was
 * revised or the reader retook it and scored differently.
 *
 * A stale line is worse than a missing one. It is printed on an instruction
 * sheet, under somebody's name, as a sentence they are asking another person to
 * act on — and they never chose it today. So it is dropped, silently, and this
 * is the test that says so.
 */

const offered: Playbook = {
  ok: [
    { id: "ok.hour", text: "Give me an hour before we finish the conversation." },
    { id: "ok.text", text: "Text me the plan rather than ringing about it." },
    { id: "ok.leave", text: "Leave the party without me if I am still talking." },
  ],
  notOk: [
    { id: "no.silence", text: "Do not go quiet for a day and call it thinking." },
    { id: "no.public", text: "Do not raise it for the first time in front of other people." },
  ],
};

const practice = (patch: Partial<Practice> = {}): Practice => ({
  ok: [],
  notOk: [],
  ownOk: [],
  ownNotOk: [],
  ...patch,
});

test("only the ticked lines come back, in the order the instrument offers them", () => {
  const lines = resolvePlaybook(offered, practice({ ok: ["ok.leave", "ok.hour"] }));
  // Stored in the order they were ticked; rendered in the order they are
  // offered, because the sheet is printed and a document whose lines move
  // between two prints of the same day is a document nobody trusts.
  expect(lines.ok.map((l) => l.id)).toEqual(["ok.hour", "ok.leave"]);
  expect(lines.ok.map((l) => l.text)).toEqual([offered.ok[0].text, offered.ok[2].text]);
});

test("two suggestions sharing an id are one line, not two", () => {
  // The id is the React key on the sheet and the checkbox identity in the
  // editor, so a repeated id renders as a duplicate key and ticking either one
  // ticks both. `contract.test.ts` requires unique ids but samples one answer
  // set, and suggestions are derived from the result — so the collision that
  // ships is the one for the result nobody sampled.
  const twice: Playbook = {
    ok: [
      { id: "dup", text: "Give me an hour before we finish the conversation." },
      { id: "dup", text: "Leave the party without me if I am still talking." },
    ],
    notOk: [],
  };
  const lines = resolvePlaybook(twice, practice({ ok: ["dup"] }));
  expect(lines.ok.map((l) => l.text)).toEqual([twice.ok[0].text]);
});

test("an id the instrument no longer offers is dropped rather than shown", () => {
  const lines = resolvePlaybook(offered, practice({ ok: ["ok.hour", "ok.retired", "ok.text"] }));
  expect(lines.ok.map((l) => l.id)).toEqual(["ok.hour", "ok.text"]);
});

test("the reader's own words come back verbatim, after ours", () => {
  const lines = resolvePlaybook(
    offered,
    practice({ ok: ["ok.text"], ownOk: ["Ring my mother back the same week."] }),
  );
  expect(lines.ok.map((l) => [l.text, l.own])).toEqual([
    [offered.ok[1].text, false],
    ["Ring my mother back the same week.", true],
  ]);
});

test("the two sides never borrow from each other", () => {
  const lines = resolvePlaybook(
    offered,
    practice({ ok: ["no.silence"], notOk: ["ok.hour", "no.public"], ownNotOk: ["Do not tell your sister first."] }),
  );
  // A side only ever sees ids from its own list, so a corrupted or hand-edited
  // record cannot move a "this is fine" line into "this is not".
  expect(lines.ok).toEqual([]);
  expect(lines.notOk.map((l) => l.id)).toEqual(["no.public", "own:notOk:0"]);
});

test("own lines get stable ids, and a blank one is not a line", () => {
  const lines = resolvePlaybook(offered, practice({ ownOk: ["  Say it in the car.  ", "   ", "Not at dinner."] }));
  expect(lines.ok.map((l) => l.text)).toEqual(["Say it in the car.", "Not at dinner."]);
  expect(lines.ok.map((l) => l.id)).toEqual(["own:ok:0", "own:ok:2"]);
});

test("an instrument with no playbook still renders whatever the reader wrote", () => {
  // The suggestions are derived from a result and an instrument may stop
  // offering them entirely. What the reader typed is not ours to withdraw.
  const lines = resolvePlaybook(null, practice({ ownNotOk: ["Do not book anything for a Sunday."] }));
  expect(lines.ok).toEqual([]);
  expect(lines.notOk.map((l) => l.text)).toEqual(["Do not book anything for a Sunday."]);
  expect(isEmptyPlaybook(lines)).toBe(false);
});

test("nothing stored and nothing written means no card at all", () => {
  expect(isEmptyPlaybook(resolvePlaybook(offered, practice()))).toBe(true);
  expect(isEmptyPlaybook(resolvePlaybook(undefined, undefined))).toBe(true);
  expect(isEmptyPlaybook(resolvePlaybook(offered, practice({ ok: ["ok.gone"] })))).toBe(true);
});
