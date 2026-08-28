/**
 * What is paid for, declared in one place before there is anything to pay.
 *
 * `core/types.ts` already argues this for instruments: *"Retrofitting a paywall
 * means finding every place a result can be reached — the runner, the result
 * page, the shared report, the printed sheet, the comparison — and each one
 * missed is a way to read a paid result for nothing."* The same is true of a
 * feature that is not a whole instrument, and this is that list.
 *
 * ── Why everything is currently granted ───────────────────────────────
 *
 * There is no payment system. Not a stubbed one, not a disabled one: none.
 * Shipping a locked door with no key is worse than shipping no door — the
 * reader meets a refusal that nothing they could do would lift, and the honest
 * version of that is not to offer the feature at all.
 *
 * So `granted` returns true, and the value of this file is that it is the only
 * place that decides. When there is something to check, it is checked here, and
 * every call site is already asking.
 *
 * What is *not* deferred is the labelling. A reader is told which parts are
 * intended to be paid for, because finding out later that something you relied
 * on was always going to cost money is its own small betrayal.
 */

export const PREMIUM_FEATURES = ["numerology.compatibility"] as const;
export type PremiumFeature = (typeof PREMIUM_FEATURES)[number];

export const isPremium = (feature: string): feature is PremiumFeature =>
  (PREMIUM_FEATURES as readonly string[]).includes(feature);

/**
 * May this reader use this feature?
 *
 * Deliberately synchronous and deliberately total. An entitlement check that
 * could be pending is an entitlement check that renders a feature while it
 * waits, and "briefly available" is the failure mode a paywall exists to
 * prevent.
 */
export function granted(_feature: PremiumFeature): boolean {
  return true;
}
