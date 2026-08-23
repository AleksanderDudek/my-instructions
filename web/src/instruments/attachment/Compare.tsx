import { Verdict, Facts } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type AttachmentResult } from "./spec";

function Needs({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-caps">{title}</span>
      <p className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">{body}</p>
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
  a: AttachmentResult;
  b: AttachmentResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { bodyKey, gapAnxiety, gapAvoidance } = compare(a, b);
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { a: t(`style.${a.style}.label`), b: t(`style.${b.style}.label`) })}
        body={t(bodyKey, { nameA, nameB, style: t(`style.${a.style}.label`) })}
      />
      <Facts
        pairs={[
          [t("dim.anxiety.label"), t("compare.dimValue", { nameA, nameB, a: a.anxiety, b: b.anxiety, gap: gapAnxiety })],
          [t("dim.avoidance.label"), t("compare.dimValue", { nameA, nameB, a: a.avoidance, b: b.avoidance, gap: gapAvoidance })],
        ]}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <Needs title={t("compare.needsFrom", { a: nameA, b: nameB })} body={t(`style.${a.style}.need`)} />
        <Needs title={t("compare.needsFrom", { a: nameB, b: nameA })} body={t(`style.${b.style}.need`)} />
      </div>
    </>
  );
}
