import { Facts, Note, Verdict } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { hours, toClock } from "./compute";
import type { ChronotypeResult } from "./spec";

/**
 * Minutes go in, clock times and hours come out.
 *
 * Every number on this page was computed without knowing what language it
 * would be read in — `03:40` is formatted here, from a stored 220, so the same
 * reading says the same thing in Warsaw and in Madrid.
 */
export function View({ result, t }: { result: ChronotypeResult; t: T }) {
  if (result.incomplete) {
    return <p className="max-w-[62ch] leading-relaxed text-muted">{t("view.incomplete")}</p>;
  }

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={t(`band.${result.band}.label`)}
        body={t("view.body", { blurb: t(`band.${result.band}.blurb`), mid: toClock(result.msfsc) })}
      />
      <Facts
        pairs={[
          [
            t("view.fact.midSleep"),
            t("view.midSleepValue", { corrected: toClock(result.msfsc), raw: toClock(result.msf) }),
          ],
          [t("view.fact.jetlag"), t("view.jetlagValue", { hours: hours(result.socialJetlag) })],
          [
            t("view.fact.weekSleep"),
            t("view.weekSleepValue", {
              hours: hours(result.sleepWeek),
              work: hours(result.sleepWork),
              free: hours(result.sleepFree),
            }),
          ],
          [
            t("view.fact.debt"),
            result.debt ? t("view.debtValue", { hours: hours(result.debt) }) : t("view.debtNone"),
          ],
          [
            t("view.fact.window"),
            t("view.windowValue", { from: toClock(result.msfsc - 60), to: toClock(result.msfsc + 4 * 60) }),
          ],
        ]}
      />
      {result.severeJetlag ? (
        <Note tone="warn">{t("view.jetlagNote", { hours: hours(result.socialJetlag) })}</Note>
      ) : null}
      {result.shortSleep ? (
        <Note tone="warn">{t("view.shortSleepNote", { hours: hours(result.sleepWeek) })}</Note>
      ) : null}
      <Note>{t("view.methodNote")}</Note>
    </>
  );
}
