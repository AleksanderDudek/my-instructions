import { test } from "node:test";
import assert from "node:assert/strict";
import { toMinutes, toClock, duration, midSleep, bandFor, chronotype } from "../../src/instruments/chronotype/compute.js";

/**
 * Sleep arithmetic, which is mostly arithmetic about midnight.
 */

test("clock times convert both ways and refuse nonsense", () => {
  assert.equal(toMinutes("23:30"), 1410);
  assert.equal(toMinutes("00:00"), 0);
  assert.equal(toMinutes("7:05"), 425);
  assert.equal(toMinutes("24:00"), null);
  assert.equal(toMinutes("12:60"), null);
  assert.equal(toMinutes(""), null);
  assert.equal(toClock(1410), "23:30");
  assert.equal(toClock(0), "00:00");
  assert.equal(toClock(1500), "01:00", "past midnight should wrap");
});

test("a sleep that crosses midnight has a positive length", () => {
  assert.equal(duration(toMinutes("23:30"), toMinutes("07:30")), 480);
  assert.equal(duration(toMinutes("01:00"), toMinutes("09:00")), 480);
  assert.equal(duration(toMinutes("22:00"), toMinutes("06:00")), 480);
});

test("mid-sleep lands in the small hours, not in the afternoon", () => {
  assert.equal(toClock(midSleep(toMinutes("23:00"), toMinutes("07:00"))), "03:00");
  assert.equal(toClock(midSleep(toMinutes("01:00"), toMinutes("09:00"))), "05:00");
});

test("the seven bands run early to late and cover the clock", () => {
  assert.equal(bandFor(toMinutes("01:00")), "extremeEarly");
  assert.equal(bandFor(toMinutes("03:00")), "early");
  assert.equal(bandFor(toMinutes("04:00")), "slightlyEarly");
  assert.equal(bandFor(toMinutes("05:00")), "intermediate");
  assert.equal(bandFor(toMinutes("06:00")), "slightlyLate");
  assert.equal(bandFor(toMinutes("07:00")), "late");
  assert.equal(bandFor(toMinutes("09:00")), "extremeLate");
});

test("someone who sleeps identically either way has no jetlag and no correction", () => {
  const r = chronotype({ workBed: "23:00", workWake: "07:00", freeBed: "23:00", freeWake: "07:00", workDays: 5 });
  assert.equal(r.socialJetlag, 0);
  assert.equal(r.debt, 0);
  assert.equal(r.msfsc, r.msf, "nothing to correct for");
  assert.equal(toClock(r.msfsc), "03:00");
});

test("lying in on free days shows up as sleep debt and shifts the corrected mid-point earlier", () => {
  // Seven hours on a work night against ten when free. Note that the jetlag
  // is the distance between the two *mid-points* (02:30 against 05:00), not
  // the difference in length — a later bedtime and a much later wake move the
  // middle by less than either end.
  const r = chronotype({ workBed: "23:00", workWake: "06:00", freeBed: "00:00", freeWake: "10:00", workDays: 5 });
  assert.equal(r.sleepWork, 420);
  assert.equal(r.sleepFree, 600);
  assert.equal(r.debt, 180, "three hours of sleep repaid on a free night");
  assert.equal(r.socialJetlag, 150, "two and a half hours between the mid-points");
  assert.ok(r.msfsc < r.msf, "the correction should pull the mid-point earlier");
});

test("an alarm on free days means there is no debt to correct for", () => {
  const args = { workBed: "23:00", workWake: "06:00", freeBed: "00:00", freeWake: "10:00", workDays: 5 };
  const free = chronotype(args);
  const alarmed = chronotype({ ...args, alarmOnFreeDays: true });
  assert.ok(alarmed.msfsc > free.msfsc, "an alarm suppresses the correction");
  assert.equal(alarmed.msfsc, alarmed.msf);
});

test("social jetlag takes the shorter way round the clock", () => {
  // Mid-sleep 23:30 against 00:30 is one hour apart, not twenty-three.
  const r = chronotype({ workBed: "19:30", workWake: "03:30", freeBed: "20:30", freeWake: "04:30", workDays: 5 });
  assert.equal(r.socialJetlag, 60);
});

test("a missing time gives no reading rather than a wrong one", () => {
  assert.equal(chronotype({ workBed: "23:00", workWake: "", freeBed: "00:00", freeWake: "10:00" }), null);
});

test("working every day and working none are both handled", () => {
  const none = chronotype({ workBed: "23:00", workWake: "06:00", freeBed: "01:00", freeWake: "10:00", workDays: 0 });
  const all = chronotype({ workBed: "23:00", workWake: "06:00", freeBed: "01:00", freeWake: "10:00", workDays: 7 });
  assert.equal(none.sleepWeek, none.sleepFree, "with no work days the week is all free days");
  assert.equal(all.sleepWeek, all.sleepWork, "with seven work days the week is all work days");
});
