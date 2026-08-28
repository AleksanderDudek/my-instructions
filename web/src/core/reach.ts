/**
 * Getting a link to a person, through whatever they actually use.
 *
 * Every target here is a plain URL or a browser API. There is no share SDK from
 * any platform, and that is a deliberate exclusion rather than an omission: a
 * Facebook or X share button is a third-party script that observes the page it
 * sits on, and an app whose whole argument is that it has no analytics cannot
 * ship one. An intent URL does the same job, costs one anchor tag, and tells
 * nobody anything until the reader clicks it.
 *
 * Nothing in this module knows what a report contains. It takes a URL and some
 * words and hands them to the operating system.
 */

export type ShareTarget = {
  id: string;
  /** Where clicking goes. `null` means the target has no web fallback. */
  href: string;
  /** Opening in a new tab is right for a web app and wrong for a scheme. */
  external: boolean;
};

/**
 * The system share sheet, where there is one.
 *
 * `navigator.share` is the best target by a distance on a phone: it lists
 * exactly the apps that person has installed, in their own order, and the app
 * they pick never learns the link came from here. It is also the only one that
 * covers WhatsApp, Messenger, Signal, SMS and mail without a line of code each.
 *
 * It is thin on desktop, which is why the intent list below still exists.
 */
export const canShareNatively = (): boolean =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

export type ShareText = { title: string; text: string; url: string };

/**
 * Returns false when the reader dismissed the sheet, throws only on a real
 * failure.
 *
 * A cancelled share is an `AbortError`, and treating it as an error is how a
 * page ends up showing "sharing failed" to somebody who simply changed their
 * mind. It is the single most common mistake made with this API.
 */
export async function shareNatively(payload: ShareText): Promise<boolean> {
  try {
    await navigator.share(payload);
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return false;
    throw err;
  }
}

/**
 * The targets offered when there is no share sheet, or beside it on a desktop.
 *
 * Ordered by how people actually send something personal to one person, not by
 * audience size: a message first, mail second, a post last. The public ones are
 * still here because a public profile is a thing somebody may well want to
 * post — but a list that opened with X would be suggesting the wrong thing for
 * the commonest case, which is one person telling one other person.
 */
export function targetsFor({ url, title, text }: ShareText): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const both = encodeURIComponent(`${text} ${url}`);

  return [
    // wa.me is WhatsApp's own documented redirector and needs no SDK. It opens
    // the app where one is installed and the web client where one is not.
    { id: "whatsapp", href: `https://wa.me/?text=${both}`, external: true },
    { id: "telegram", href: `https://t.me/share/url?url=${u}&text=${t}`, external: true },
    // A scheme rather than a site: the OS decides which app answers, and no
    // third party sees the link on the way.
    { id: "sms", href: `sms:?&body=${both}`, external: false },
    { id: "email", href: `mailto:?subject=${encodeURIComponent(title)}&body=${both}`, external: false },
    { id: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, external: true },
    { id: "x", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, external: true },
  ];
}

/**
 * What a link preview will show, and what it will not.
 *
 * Worth being explicit about because it is the thing people assume wrongly in
 * both directions. Every messenger fetches a pasted URL to draw a card, so the
 * *path* is seen by that company. The fragment is not sent, so anything after
 * `#` is not — which is why the token lives there and why a preview can never
 * quote somebody's answers.
 *
 * Returns the part of a URL that a crawler will see.
 */
export const crawlerSees = (url: string): string => url.split("#")[0];

/**
 * A copy that works when the clipboard API is refused.
 *
 * `navigator.clipboard` needs a secure context and a user gesture, and it
 * throws in enough real situations — an iframe without permission, a browser
 * with the permission denied, an insecure origin during local testing — that a
 * page relying on it alone will silently fail to copy for somebody. The
 * fallback is the old `execCommand` route, which is deprecated and still works
 * everywhere.
 */
export async function copyLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    try {
      const field = document.createElement("textarea");
      field.value = url;
      // Off-screen rather than hidden: a `display: none` element cannot be
      // selected, and the copy silently does nothing.
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "-1000px";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(field);
      return ok;
    } catch {
      return false;
    }
  }
}
