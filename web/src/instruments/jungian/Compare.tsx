import { Verdict } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import type { FunctionKey } from "./items";
import { compare, type JungianResult } from "./spec";

/** One person's half of the exchange: what they lead with, and where they fail. */
function Side({
  title,
  dominant,
  inferior,
  t,
}: {
  title: string;
  dominant: FunctionKey;
  inferior: FunctionKey;
  t: T;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-caps">{title}</span>
      <p className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">{t(`fn.${dominant}.ask`)}</p>
      <p className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">
        {t("compare.worstAt", { fn: t(`fn.${inferior}.label`), grip: t(`fn.${inferior}.inferior`) })}
      </p>
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
  a: JungianResult;
  b: JungianResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { shared, bodyKey } = compare(a, b);
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { a: a.code, b: b.code })}
        body={t(bodyKey, {
          nameA,
          nameB,
          shared: shared.map((fn) => t(`fn.${fn}.label`)).join(", "),
          blind: t(`fn.${a.inferior}.label`),
        })}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <Side title={t("compare.leadsWith", { name: nameA })} dominant={a.dominant} inferior={a.inferior} t={t} />
        <Side title={t("compare.leadsWith", { name: nameB })} dominant={b.dominant} inferior={b.inferior} t={t} />
      </div>
    </>
  );
}
