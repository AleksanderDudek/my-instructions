import { Verdict } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type LoveResult, type Exchange } from "./spec";

function Needs({ title, needs, t }: { title: string; needs: Exchange[]; t: T }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-caps">{title}</span>
      {needs.slice(0, 2).map((g) => (
        <p key={g.key} className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">
          <strong className="font-normal text-brass">{t(`lang.${g.key}.label`)}</strong> — {t(`lang.${g.key}.ask`)}
        </p>
      ))}
    </div>
  );
}

export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: LoveResult;
  b: LoveResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { aNeeds, bNeeds, overlap, fit } = compare(a, b);
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={
          overlap
            ? t("compare.sameTitle")
            : t("compare.mixedTitle", { a: t(`lang.${a.primary.key}.label`), b: t(`lang.${b.primary.key}.label`) })
        }
        score={fit}
        body={overlap ? t("compare.sameBody") : t("compare.mixedBody")}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <Needs title={t("compare.aNeeds", { a: nameA, b: nameB })} needs={aNeeds} t={t} />
        <Needs title={t("compare.aNeeds", { a: nameB, b: nameA })} needs={bNeeds} t={t} />
      </div>
    </>
  );
}
