/**
 * The keys the profiles island needs, written down once.
 *
 * A client component cannot be handed `t`, so it is handed finished strings —
 * the shape every island in this app uses. What that costs is a list, and the
 * list is here rather than inline in the page so that the component and its
 * copy can be read against each other without opening a third file.
 *
 * A missing key renders as itself, which is loud enough to catch in review and
 * quiet enough to ship, so `test/i18n/parity.test.ts` is what actually holds
 * this: every key below exists in all four tables or the build fails.
 */
export const PROFILE_COPY_KEYS = [
  "profiles.heading",
  "profiles.note",
  "profiles.empty",
  "profiles.add.public",
  "profiles.add.team",
  "profiles.add.partner",
  "profiles.preset.public",
  "profiles.preset.team",
  "profiles.preset.partner",
  "profiles.chosen",
  "profiles.live",
  "profiles.edit",
  "profiles.close",
  "profiles.nameLabel",
  "profiles.elements",
  "profiles.capped",
  "profiles.expiry",
  "profiles.expiryNever",
  "profiles.expiryDays",
  "profiles.send",
  "profiles.copy",
  "profiles.copied",
  "profiles.copyFailed",
  "profiles.share",
  "profiles.shareFailed",
  "profiles.shareTitle",
  "profiles.shareText",
  "profiles.publish",
  "profiles.publishing",
  "profiles.publishedOnce",
  "profiles.publishFailed",
  "profiles.revoke",
  "profiles.revokeConfirm",
  "profiles.revoked",
  "profiles.revokeFailed",
  "profiles.revokeLimit",
  "profiles.delete",
  "profiles.dropped",
  "profiles.staleRemote",
  "profiles.noEndpoint",
  "reach.whatsapp",
  "reach.telegram",
  "reach.sms",
  "reach.email",
  "reach.linkedin",
  "reach.x",
  // Audience names are the shell's own and are reused rather than restated:
  // a profile calling `friends` something different from the table above it
  // would read as two different settings.
  "audience.partner",
  "audience.friends",
  "audience.public",
] as const;
