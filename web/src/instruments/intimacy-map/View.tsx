"use client";

import { useRef, useState } from "react";
import { Verdict, Note } from "@/components/result/scorecard";
import { Button } from "@/components/ui/button";
import { Card, Label, PlateHead, Prose } from "@/components/ui/primitives";
import type { T } from "@/core/types";
import { SECTIONS, type Section } from "./acts";
import { asText, bandsFor, type MapResult } from "./spec";

/**
 * One person's own answers, grouped and handed back to them.
 *
 * A client component, and the only instrument view that is one: the copy
 * button is the whole reason. Nothing on this page is fetched, stored or sent
 * anywhere — the text the button copies is composed in `spec.ts` from the same
 * grouping the cards below are drawn from, so what is on screen and what lands
 * on the clipboard cannot drift apart.
 */

function SectionCard({ result, t, section }: { result: MapResult; t: T; section: Section }) {
  const rows = bandsFor(result, section);
  if (!rows.length) return null;
  return (
    <Card>
      <Label>{t(`section.${section}`)}</Label>
      {rows.map(({ band, ids }) => (
        <Prose key={band} className="mt-2 text-[0.95rem]">
          <strong className="font-normal text-brass">{t(`band.${band}`)}</strong> —{" "}
          {ids.map((id) => t(`act.${id}`)).join(", ")}
        </Prose>
      ))}
    </Card>
  );
}

/**
 * The copy button, and nothing that writes anything.
 *
 * There is deliberately no equivalent on the comparison — see the note in
 * `spec.ts`. The textarea is the fallback for a browser that refuses the
 * clipboard: the reader can still select and copy by hand.
 */
function TakeItWithYou({ text, t }: { text: string; t: T }) {
  const box = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(t("view.copied"));
    } catch {
      box.current?.select();
      setMessage(t("view.selectAndCopy"));
    }
  };

  return (
    <section className="my-8">
      <PlateHead title={t("view.takeHeading")} note={t("view.takeNote")} />
      <Card>
        <Button variant="primary" onClick={() => void copy()}>
          {t("view.copy")}
        </Button>
        <textarea
          ref={box}
          readOnly
          rows={10}
          value={text}
          className="mt-4 block w-full resize-y rounded-sm border border-rule bg-panel-2 p-4 text-sm leading-relaxed text-ink"
        />
        <p className="mt-3 text-sm text-verdigris" role="status">
          {message}
        </p>
      </Card>
    </section>
  );
}

export function View({ result, t }: { result: MapResult; t: T }) {
  const { lean } = result;
  const said = result.answered > 0;

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={t(said ? `lean.${lean.side}.title` : "lean.none.title")}
        body={t(said ? `lean.${lean.side}.body` : "lean.none.body")}
      />

      {said && lean.side !== "unknown" ? (
        <Card>
          <Prose>{t("view.leanNumbers", { a: lean.a, b: lean.b })}</Prose>
          <Prose className="mt-2 text-muted">{t("view.leanNote")}</Prose>
        </Card>
      ) : null}

      <div className="my-8 grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <SectionCard key={section} result={result} t={t} section={section} />
        ))}
      </div>

      <TakeItWithYou text={asText(result, t)} t={t} />

      <Note tone="warn">{t("view.goneNote")}</Note>
      <Note>{t("view.limitsNote")}</Note>
    </>
  );
}
