"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Checkbox } from "radix-ui";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { useStore } from "@/components/shell/store-provider";
import {
  PRESETS,
  PRESET_AUDIENCE,
  allowedFor,
  pruneToCeiling,
  runElement,
  seedElements,
  sharingFor,
  type Preset,
  type ProfileSpec,
  type ShareProfile,
} from "@/core/profiles";
import { reportLink } from "@/core/report";
import { canShareNatively, copyLink, shareNatively, targetsFor } from "@/core/reach";
import { encryptToken, publish, publishEndpoint, publishedLink, revoke } from "@/core/publish";
import type { InstrumentModule } from "@/core/registry";
import type { Audience, Locale, Run } from "@/core/types";

/**
 * Named selections, and the one control in this app that has to work.
 *
 * The rest of the sharing page answers "who may see this?" as a standing
 * setting. This answers a different question — "what am I handing to this
 * person, today, and how do I take it back?" — and the second half of that is
 * why the component exists at all.
 *
 * Two things are load-bearing in the markup rather than in the copy.
 *
 * An element an instrument's ceiling forbids is **shown, disabled, and
 * labelled** rather than hidden. Hiding it would leave a reader wondering
 * whether they had forgotten to take a test; showing it says the app declined,
 * which is a fact about the instrument they are entitled to know.
 *
 * Revoke is destructive and irreversible, so it confirms — and its copy states
 * the limit rather than implying it away: a person who already opened the link
 * has read it, and nothing here reaches into their memory.
 */

export type ProfilesCopy = Record<string, string>;

type Props = {
  locale: Locale;
  copy: ProfilesCopy;
  /** Resolved instrument titles, so this component needs no translator. */
  titleOf: Record<string, string>;
  runs: Run[];
  instruments: Map<string, InstrumentModule>;
  identity: { displayName: string; pronouns: string; note: string };
};

const NEVER = 0;
const EXPIRY_CHOICES = [NEVER, 7, 30, 90, 365];

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

/**
 * A capability does not change, so there is nothing to subscribe to. React
 * still wants a subscribe function, and one that unsubscribes nothing is the
 * honest implementation rather than a stub.
 */
const subscribeToNothing = () => () => {};
const readFalse = () => false;

export function Profiles({ locale, copy, titleOf, runs, instruments, identity }: Props) {
  const store = useStore();
  const [profiles, setProfiles] = useState<ShareProfile[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [said, setSaid] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState<string | null>(null);

  const endpoint = publishEndpoint();
  /**
   * One clock reading for the whole visit.
   *
   * `encodeReport` stamps an expiry from a `now`, and calling `Date.now()`
   * while rendering makes the render impure — a link that quietly differs
   * between two paints of the same screen. Reading it once, lazily, also says
   * the truer thing about what the expiry counts from: the moment this page was
   * opened to send something, rather than whichever repaint happened last.
   */
  const [openedAt] = useState(() => Date.now());

  const specs = useMemo<ProfileSpec[]>(
    () =>
      runs
        .map((run) => instruments.get(run.instrumentId)?.spec)
        .filter((spec): spec is NonNullable<typeof spec> => Boolean(spec))
        .map((spec) => ({
          id: spec.id,
          sensitive: spec.sensitive,
          maxAudience: spec.maxAudience,
          channels: spec.channels,
        })),
    [runs, instruments],
  );

  const reload = useCallback(async () => setProfiles(await store.shareProfiles()), [store]);

  useEffect(() => {
    let live = true;
    void (async () => {
      const found = await store.shareProfiles();
      if (live) setProfiles(found);
    })();
    return () => {
      live = false;
    };
  }, [store]);

  const say = (id: string, message: string) => setSaid((prev) => ({ ...prev, [id]: message }));

  const create = async (preset: Preset) => {
    const now = new Date().toISOString();
    const profile: ShareProfile = {
      id: newId(),
      name: copy[`profiles.preset.${preset}`] ?? preset,
      audience: PRESET_AUDIENCE[preset],
      elements: seedElements(preset, specs),
      expiresInDays: preset === "public" ? null : 90,
      createdAt: now,
      updatedAt: now,
    };
    await store.saveShareProfile(profile);
    await reload();
    setOpen(profile.id);
  };

  const update = async (profile: ShareProfile, patch: Partial<ShareProfile>) => {
    const next = { ...profile, ...patch };
    // Lowering the audience can strip elements the new ceiling forbids. The
    // removals are reported rather than applied in silence: a selection that
    // quietly shrinks is how somebody comes to believe they shared something
    // they did not.
    if (patch.audience && patch.audience !== profile.audience) {
      const { kept, dropped } = pruneToCeiling(next.elements, patch.audience, (id) =>
        specs.find((s) => s.id === id) ?? null,
      );
      next.elements = kept;
      if (dropped.length) {
        say(profile.id, copy["profiles.dropped"]?.replace("{count}", String(dropped.length)) ?? "");
      }
    }
    // Anything already published describes a link other people hold, and it is
    // not what is on screen any more. Say so rather than letting an edited
    // profile imply the sent link changed with it.
    if (next.remote) say(profile.id, copy["profiles.staleRemote"] ?? "");
    await store.saveShareProfile(next);
    await reload();
  };

  const toggle = async (profile: ShareProfile, element: string) => {
    const has = profile.elements.includes(element);
    await update(profile, {
      elements: has ? profile.elements.filter((e) => e !== element) : [...profile.elements, element],
    });
  };

  const localLink = (profile: ShareProfile) =>
    reportLink(locale, {
      registry: { get: (id: string) => instruments.get(id) ?? null },
      profile: identity,
      runs: runs.map((r) => ({
        instrumentId: r.instrumentId,
        instrumentVersion: r.instrumentVersion,
        answers: r.answers,
      })),
      sharing: sharingFor(profile) as Record<string, Audience>,
      audience: profile.audience,
      expiresInDays: profile.expiresInDays,
      now: openedAt,
    });

  const liveLink = (profile: ShareProfile, key?: string) =>
    profile.remote && key
      ? publishedLink(`${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${locale}/p/`, profile.remote.id, key)
      : localLink(profile);

  const doPublish = async (profile: ShareProfile) => {
    if (!endpoint) return;
    setBusy(profile.id);
    try {
      const { body, key } = await encryptToken(localLink(profile).split("#")[1] ?? "");
      const handle = await publish(endpoint, body, profile.expiresInDays);
      await store.saveShareProfile({ ...profile, remote: { ...handle, publishedAt: new Date().toISOString() } });
      await reload();
      // The key is shown once and never stored: keeping it would put the thing
      // that decrypts the record next to the record's own id, in the one place
      // an attacker with this device already looks.
      say(profile.id, copy["profiles.publishedOnce"] ?? "");
      await copyLink(liveLink({ ...profile, remote: { ...handle, publishedAt: "" } }, key));
    } catch {
      say(profile.id, copy["profiles.publishFailed"] ?? "");
    } finally {
      setBusy(null);
    }
  };

  const doRevoke = async (profile: ShareProfile) => {
    if (!endpoint || !profile.remote) return;
    setBusy(profile.id);
    try {
      const gone = await revoke(endpoint, profile.remote.id, profile.remote.manageToken);
      if (gone) {
        await store.saveShareProfile({ ...profile, remote: undefined });
        await reload();
        say(profile.id, copy["profiles.revoked"] ?? "");
      } else {
        say(profile.id, copy["profiles.revokeFailed"] ?? "");
      }
    } finally {
      setBusy(null);
      setConfirming(null);
    }
  };

  if (!profiles) return null;

  return (
    <Plate>
      <PlateHead title={copy["profiles.heading"]} note={copy["profiles.note"]} />

      {profiles.length === 0 ? (
        <p className="mb-6 max-w-[62ch] text-sm leading-relaxed text-muted">{copy["profiles.empty"]}</p>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button key={preset} onClick={() => void create(preset)}>
            {copy[`profiles.add.${preset}`]}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {profiles.map((profile) => {
          const isOpen = open === profile.id;
          return (
            <section key={profile.id} className="rounded-sm border border-rule bg-panel-2 p-5" data-profile={profile.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h4 className="text-base">{profile.name}</h4>
                  <p className="label-caps mt-1">
                    {copy[`audience.${profile.audience}`]} · {copy["profiles.chosen"]?.replace("{count}", String(profile.elements.length))}
                    {profile.remote ? ` · ${copy["profiles.live"]}` : ""}
                  </p>
                </div>
                <Button onClick={() => setOpen(isOpen ? null : profile.id)}>
                  {isOpen ? copy["profiles.close"] : copy["profiles.edit"]}
                </Button>
              </div>

              {said[profile.id] ? (
                <p role="status" className="mt-3 border-l-2 border-brass pl-4 text-sm leading-relaxed text-ink/90">
                  {said[profile.id]}
                </p>
              ) : null}

              {isOpen ? (
                <div className="mt-5 border-t border-rule pt-5">
                  <label className="label-caps mb-2 block" htmlFor={`name-${profile.id}`}>
                    {copy["profiles.nameLabel"]}
                  </label>
                  <input
                    id={`name-${profile.id}`}
                    value={profile.name}
                    onChange={(e) => void update(profile, { name: e.target.value })}
                    className="mb-6 w-full rounded-sm border border-rule bg-panel px-4 py-3 text-ink"
                    autoComplete="off"
                  />

                  <fieldset className="mb-6">
                    <legend className="label-caps mb-3">{copy["profiles.elements"]}</legend>
                    <div className="grid gap-2">
                      {specs.map((spec) => {
                        const element = runElement(spec.id);
                        const permitted = allowedFor(spec, profile.audience);
                        const on = profile.elements.includes(element);
                        return (
                          <Checkbox.Root
                            key={element}
                            checked={on}
                            aria-disabled={!permitted || undefined}
                            onCheckedChange={() => permitted && void toggle(profile, element)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-sm border px-4 py-3 text-left transition-colors",
                              on ? "border-brass bg-brass/10 text-ink" : "border-rule bg-panel text-ink/80",
                              !permitted && "opacity-50",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "grid size-4 shrink-0 place-items-center rounded-[2px] border text-[10px] leading-none",
                                on ? "border-brass bg-brass/20 text-brass" : "border-muted text-transparent",
                              )}
                            >
                              ✓
                            </span>
                            <span>{titleOf[spec.id] ?? spec.id}</span>
                            {/* Shown rather than hidden: the app declined, and
                                that is a fact about the instrument the reader
                                is entitled to see. */}
                            {!permitted ? <span className="ml-auto text-xs text-muted">{copy["profiles.capped"]}</span> : null}
                          </Checkbox.Root>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="mb-6">
                    <legend className="label-caps mb-3">{copy["profiles.expiry"]}</legend>
                    <div className="flex flex-wrap gap-2">
                      {EXPIRY_CHOICES.map((days) => {
                        const on = (profile.expiresInDays ?? NEVER) === days;
                        return (
                          <button
                            key={days}
                            type="button"
                            onClick={() => void update(profile, { expiresInDays: days === NEVER ? null : days })}
                            className={cn(
                              "num rounded-sm border px-4 py-2 text-sm",
                              on ? "border-brass bg-brass/10 text-brass-hi" : "border-rule bg-panel text-ink/80",
                            )}
                          >
                            {days === NEVER
                              ? copy["profiles.expiryNever"]
                              : copy["profiles.expiryDays"]?.replace("{days}", String(days))}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <Reach
                    copy={copy}
                    url={liveLink(profile)}
                    name={profile.name}
                    onSaid={(message) => say(profile.id, message)}
                  />

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-rule pt-5">
                    {endpoint ? (
                      profile.remote ? (
                        confirming === profile.id ? (
                          <Button variant="primary" disabled={busy === profile.id} onClick={() => void doRevoke(profile)}>
                            {copy["profiles.revokeConfirm"]}
                          </Button>
                        ) : (
                          <Button onClick={() => setConfirming(profile.id)}>{copy["profiles.revoke"]}</Button>
                        )
                      ) : (
                        <Button variant="primary" disabled={busy === profile.id} onClick={() => void doPublish(profile)}>
                          {busy === profile.id ? copy["profiles.publishing"] : copy["profiles.publish"]}
                        </Button>
                      )
                    ) : (
                      <p className="max-w-[52ch] text-sm leading-relaxed text-muted">{copy["profiles.noEndpoint"]}</p>
                    )}

                    <Button
                      onClick={async () => {
                        await store.deleteShareProfile(profile.id);
                        await reload();
                      }}
                    >
                      {copy["profiles.delete"]}
                    </Button>
                  </div>

                  {endpoint && profile.remote ? (
                    <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{copy["profiles.revokeLimit"]}</p>
                  ) : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </Plate>
  );
}

/**
 * Where a link goes, and through what.
 *
 * The system sheet first where there is one: on a phone it lists the apps that
 * person actually has, in their own order, and none of them learns where the
 * link came from. Everything else is a plain anchor — no platform SDK, because
 * every one of those is a third-party script watching a page about somebody's
 * marriage.
 */
function Reach({
  copy,
  url,
  name,
  onSaid,
}: {
  copy: ProfilesCopy;
  url: string;
  name: string;
  onSaid: (message: string) => void;
}) {
  /**
   * Whether this browser has a share sheet, read as a capability rather than
   * copied into state.
   *
   * `navigator` does not exist while this renders on the server, so the server
   * snapshot is `false` and the button appears after hydration. Going through
   * an effect and `setState` instead would be a render, then a second render,
   * to learn something that never changes — the cascade the lint names.
   */
  const native = useSyncExternalStore(subscribeToNothing, canShareNatively, readFalse);

  const text = copy["profiles.shareText"] ?? "";
  const title = copy["profiles.shareTitle"]?.replace("{name}", name) ?? name;
  const targets = targetsFor({ url, title, text });

  return (
    <div className="border-t border-rule pt-5">
      <span className="label-caps mb-3 block">{copy["profiles.send"]}</span>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={async () => {
            const ok = await copyLink(url);
            onSaid(ok ? (copy["profiles.copied"] ?? "") : (copy["profiles.copyFailed"] ?? ""));
          }}
        >
          {copy["profiles.copy"]}
        </Button>

        {native ? (
          <Button
            onClick={async () => {
              // A dismissed sheet is not a failure, and saying so would tell
              // somebody sharing broke when they simply changed their mind.
              try {
                await shareNatively({ title, text, url });
              } catch {
                onSaid(copy["profiles.shareFailed"] ?? "");
              }
            }}
          >
            {copy["profiles.share"]}
          </Button>
        ) : null}

        {targets.map((target) => (
          <a
            key={target.id}
            href={target.href}
            {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="rounded-sm border border-rule bg-panel px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/80 hover:border-brass/50"
          >
            {copy[`reach.${target.id}`] ?? target.id}
          </a>
        ))}
      </div>
    </div>
  );
}
