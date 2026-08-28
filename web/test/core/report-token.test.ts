import { describe, expect, test } from "vitest";
import { tokenFrom, REPORT_KEY } from "@/core/report";

/**
 * Where the token rides, and why one character of URL is a privacy boundary.
 *
 * A query string is sent to the server on every request; a fragment never
 * leaves the browser. For a link whose entire payload *is* that string, the
 * distinction decides whether a report is private or published — and not
 * mainly through the host's access log. Every messenger worth sending a link
 * through fetches it to draw a preview card, so a `?d=` link hands the token
 * to WhatsApp, Messenger, Signal, Slack, Discord or Apple before the person it
 * was sent to has touched anything.
 *
 * This shipped as a query parameter. These tests are the record that it does
 * not any more, and that the links already in other people's messages still
 * open — punishing a reader for our mistake would be the wrong repair.
 */
describe("tokenFrom", () => {
  test("prefers the fragment, and says it did not come from the query", () => {
    expect(tokenFrom(`#${REPORT_KEY}=abc`, "")).toEqual({ token: "abc", fromQuery: false });
  });

  test("still reads a link made before the fragment, and flags it", () => {
    expect(tokenFrom("", `?${REPORT_KEY}=abc`)).toEqual({ token: "abc", fromQuery: true });
  });

  test("a fragment wins over a query carrying something else", () => {
    // Not a contrivance: a legacy link opened, rewritten to the fragment by the
    // page, then reloaded, has both. The fragment is the one this build wrote.
    expect(tokenFrom(`#${REPORT_KEY}=new`, `?${REPORT_KEY}=old`)).toEqual({ token: "new", fromQuery: false });
  });

  test("no token anywhere is a token of null rather than an empty string", () => {
    // The page branches on `!token` to say "this link carries nothing", and an
    // empty string would take that branch while claiming a token was found.
    expect(tokenFrom("", "")).toEqual({ token: null, fromQuery: false });
    expect(tokenFrom("#", "?")).toEqual({ token: null, fromQuery: false });
  });

  test("survives the leading marks being present or absent", () => {
    // `location.hash` carries its `#` and `location.search` its `?`, but a
    // caller holding a substring may not, and a token silently missed reads to
    // the receiver as a broken link rather than as a bug here.
    expect(tokenFrom(`${REPORT_KEY}=abc`, "").token).toBe("abc");
    expect(tokenFrom("", `${REPORT_KEY}=abc`).token).toBe("abc");
  });

  test("ignores other parameters sharing the fragment", () => {
    expect(tokenFrom(`#who=b&${REPORT_KEY}=abc`, "").token).toBe("abc");
  });

  test("round-trips a real token's alphabet unchanged", () => {
    // Tokens are base64url — `-` and `_` are payload, not punctuation, and a
    // decoder that normalised them would corrupt every link that contained one.
    const packed = "eyJ2IjoyfQ-_AZaz09";
    expect(tokenFrom(`#${REPORT_KEY}=${packed}`, "").token).toBe(packed);
  });
});
