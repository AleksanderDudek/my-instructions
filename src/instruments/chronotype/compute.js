/**
 * Sleep arithmetic.
 *
 * Everything here is minutes since midnight, because sleep crosses midnight
 * and dates do not help. The one rule that makes the rest work: a duration is
 * `(wake - bed + 1440) % 1440`, so a 23:30 bedtime and a 07:30 wake is eight
 * hours rather than minus sixteen.
 *
 * The chronotype itself is the *mid-point of sleep on free days*, not a
 * bedtime — bedtime is a decision, and the middle of your sleep is closer to
 * the clock underneath. Where free-day sleep is longer than work-day sleep,
 * the difference is sleep debt being repaid, and the mid-point is corrected
 * for it. That correction is Roenneberg's; the questions asked to feed it are
 * ours, and the MCTQ itself is not reproduced.
 */

const DAY = 24 * 60;

/** "23:30" -> 1410. Anything unparseable is null rather than NaN. */
function toMinutes(value) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? "").trim());
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** 1410 -> "23:30". Wraps, so 1500 is 01:00 of the next day. */
function toClock(minutes) {
  const m = ((Math.round(minutes) % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Sleep length in minutes, crossing midnight without complaint. */
const duration = (bed, wake) => (wake - bed + DAY) % DAY;

/** Mid-point of a sleep, in minutes since midnight. */
const midSleep = (bed, wake) => (bed + duration(bed, wake) / 2) % DAY;

/**
 * Roenneberg's seven bands, cut on corrected mid-sleep. The boundaries are
 * an hour apart from 02:16 onward; anything past 07:16 is the far end.
 */
const BANDS = [
  { key: "extremeEarly", until: 136 },   // before 02:16
  { key: "early", until: 196 },
  { key: "slightlyEarly", until: 256 },
  { key: "intermediate", until: 316 },
  { key: "slightlyLate", until: 376 },
  { key: "late", until: 436 },
  { key: "extremeLate", until: Infinity },
];

const bandFor = (msfsc) => BANDS.find((b) => msfsc < b.until).key;

/**
 * The whole reading from four clock times and a count of working days.
 *
 * Returns nulls rather than throwing when a time is missing: the form
 * validates, and a half-filled draft still has to render.
 */
function chronotype({ workBed, workWake, freeBed, freeWake, workDays = 5, alarmOnFreeDays = false }) {
  const wb = toMinutes(workBed), ww = toMinutes(workWake);
  const fb = toMinutes(freeBed), fw = toMinutes(freeWake);
  if ([wb, ww, fb, fw].some((v) => v === null)) return null;

  const days = Math.min(7, Math.max(0, Number(workDays) || 0));
  const sleepWork = duration(wb, ww);
  const sleepFree = duration(fb, fw);
  const sleepWeek = (sleepWork * days + sleepFree * (7 - days)) / 7;

  const msw = midSleep(wb, ww);
  const msf = midSleep(fb, fw);

  // The correction only applies when free days are being used to repay debt.
  // Someone who sleeps the same either way, or wakes to an alarm on free days,
  // has no debt to subtract and their raw mid-sleep is already the answer.
  const repaying = sleepFree > sleepWork && !alarmOnFreeDays;
  const msfsc = repaying ? msf - (sleepFree - sleepWeek) / 2 : msf;

  // Social jetlag is the distance between the two mid-points, by the shorter
  // way round the clock — a body kept two hours out of step, five days a week.
  const raw = Math.abs(msf - msw);
  const socialJetlag = Math.min(raw, DAY - raw);

  return {
    sleepWork, sleepFree, sleepWeek: Math.round(sleepWeek),
    msw, msf, msfsc: (msfsc + DAY) % DAY,
    socialJetlag: Math.round(socialJetlag),
    debt: Math.max(0, Math.round(sleepFree - sleepWork)),
    band: bandFor((msfsc + DAY) % DAY),
    alarmOnFreeDays: Boolean(alarmOnFreeDays),
    workDays: days,
  };
}

export { DAY, toMinutes, toClock, duration, midSleep, bandFor, chronotype };
