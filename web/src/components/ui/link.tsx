import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * A Link that does not prefetch what cannot exist.
 *
 * Next prefetches the React payload for every link in the viewport. In a
 * static export those payloads are never generated, so each link produces a
 * 404 the moment it scrolls into view — six of them on the catalogue page
 * alone. Next recovers by falling back to a full navigation, so nothing
 * visibly breaks, which is exactly why it is worth fixing: the cost is
 * invisible waste and a console full of red for every visitor.
 *
 * The flag comes from `next.config.ts`, so a server deployment keeps
 * prefetching and the same source serves both.
 */
const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={STATIC ? false : props.prefetch} {...props} />;
}
