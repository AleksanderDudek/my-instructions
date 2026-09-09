import { Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { SHAPES, type StrengthEvidenceResult } from "./spec";

const names = (list: readonly string[], t: T) => list.map((s) => t(`shape.${s}.label`)).join(", ");

/** One column of the three-way sort. The middle one is the point of the page. */
function Sorted({
  label, heading, body,
}: { label: string; heading: string; body: string }) {
  return (
    <div className="flex flex-col gap-2 border-l-2 border-brass bg-panel p-5">
      <span className="label-caps">{label}</span>
      <h5 className="font-display text-base font-semibold">{heading}</h5>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

export function View({ result, t }: { result: StrengthEvidenceResult; t: T }) {
  const lead =
    result.backed[0] ?? result.repeated[0] ?? result.evidenced[0] ?? result.claimed[0] ?? SHAPES[0];

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={
          result.backed.length
            ? t("view.title", { count: result.backed.length, names: names(result.backed, t) })
            : t("view.titleNone")
        }
        body={result.backed.length ? t("view.body", { lead: t(`shape.${lead}.label`) }) : t("view.bodyNone")}
      />

      <section className="mt-9">
        <h4 className="mb-4 flex flex-wrap items-baseline gap-3 font-display text-lg">
          {t("view.sortHeading")}
          <span className="label-caps">{t("view.sortNote")}</span>
        </h4>
        <div className="grid gap-4 lg:grid-cols-3">
          <Sorted
            label={t("view.backedLabel")}
            heading={result.backed.length ? names(result.backed, t) : t("view.backedNone")}
            body={t(result.backed.length ? "view.backedBody" : "view.backedNoneBody")}
          />
          <Sorted
            label={t("view.unbackedLabel")}
            heading={result.unbacked.length ? names(result.unbacked, t) : t("view.unbackedNone")}
            body={t(result.unbacked.length ? "view.unbackedBody" : "view.unbackedNoneBody")}
          />
          <Sorted
            label={t("view.unclaimedLabel")}
            heading={result.unclaimed.length ? names(result.unclaimed, t) : t("view.unclaimedNone")}
            body={t(result.unclaimed.length ? "view.unclaimedBody" : "view.unclaimedNoneBody")}
          />
        </div>
      </section>

      <section className="mt-9">
        <h4 className="mb-4 flex flex-wrap items-baseline gap-3 font-display text-lg">
          {t("view.episodesHeading")}
          <span className="label-caps">{t("view.episodesNote")}</span>
        </h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.episodes.map((e) => (
            <div key={e.id} className="flex flex-col gap-2 border-l-2 border-rule bg-panel p-5">
              <span className="label-caps">
                {t(`shape.${e.shape}.label`)} · {t(`share.${e.share}`)}
              </span>
              <h5 className="font-display text-base font-semibold">{e.what || t("view.episodeUnnamed")}</h5>
              <p className="text-sm leading-relaxed text-muted">{e.did || t("view.episodeNoAction")}</p>
            </div>
          ))}
        </div>
      </section>

      <Facts
        pairs={[
          [t("view.fact.episodes"), t("view.episodesValue", { count: result.filled })],
          [
            t("view.fact.repeated"),
            result.repeated.length
              ? t("view.repeatedValue", { names: names(result.repeated, t) })
              : t("view.repeatedNone"),
          ],
          [t("view.fact.claimed"), result.claimed.length ? names(result.claimed, t) : t("view.claimedNone")],
        ]}
      />

      {result.thin ? <Note>{t("view.thinNote")}</Note> : null}
      <Note>{t("view.notAMeasureNote")}</Note>
      <Note tone="warn">{t("view.notForHiringNote")}</Note>
    </>
  );
}
