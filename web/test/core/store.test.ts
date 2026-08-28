import { expect, test } from "vitest";
import { LocalAdapter, makeStore } from "@/core/store";

/**
 * Deleting a result deletes what was written against it.
 *
 * `clearRun` grew a third `del` — the practice — when the playbook arrived,
 * and a deletion is the one operation whose bug is invisible from the page
 * that performs it: the result disappears, the reader believes the thing is
 * gone, and the sentences they typed about it are still on disk under
 * `practice:<id>`, waiting to be printed on the next instruction sheet. The
 * page cannot show that and no other test looked at it, so it is asserted
 * here, against storage, key by key.
 *
 * The second test is about the pair. The delete control on a result page is
 * reachable by either person of a pairwise sitting, and half a comparison left
 * in memory after the other half was deleted is exactly the orphan the
 * ephemeral Map exists to prevent.
 */

/**
 * A Storage double, because the durable path is the one that can leak.
 *
 * `LocalAdapter` falls back to an in-memory Map when it is handed nothing,
 * and testing against that fallback would prove the wrong thing: the fallback
 * forgets everything when the process ends, so every deletion appears to work.
 * The tests below need a backing store that keeps what it is given until it is
 * explicitly removed, which is what a browser does.
 */
const memoryStorage = (): Storage => {
  const cells = new Map<string, string>();
  return {
    get length() {
      return cells.size;
    },
    key: (i: number) => [...cells.keys()][i] ?? null,
    getItem: (k: string) => cells.get(k) ?? null,
    setItem: (k: string, v: string) => void cells.set(k, v),
    removeItem: (k: string) => void cells.delete(k),
    clear: () => cells.clear(),
  };
};

const newStore = () => makeStore(new LocalAdapter(memoryStorage()));

const run = (instrumentId: string) => ({
  instrumentId,
  instrumentVersion: 1,
  answers: { "q.1": 3 },
  result: { band: "secure" },
});

test("clearRun takes the practice with the run", async () => {
  const store = newStore();
  await store.saveRun(run("attachment"));
  await store.savePractice("attachment", {
    ok: ["ok.hour"],
    ownOk: ["Ring my mother back the same week."],
  });
  expect(await store.adapter.get("practice:attachment")).not.toBeNull();

  await store.clearRun("attachment");

  expect(await store.adapter.get("practice:attachment")).toBeNull();
  expect(await store.run("attachment")).toBeNull();
  // The filled shape, not the stored one: an absent key and a practice with
  // nothing in it are the same thing to the sheet, and this is the assertion
  // that the sheet has nothing left to draw.
  expect(await store.practice("attachment")).toEqual({ ok: [], notOk: [], ownOk: [], ownNotOk: [] });
  // Nothing of that instrument survives anywhere in storage. Stated as the
  // whole key list rather than three lookups, so a fourth key added beside the
  // run later and forgotten in `clearRun` fails here instead of shipping.
  expect((await store.adapter.list("")).map(([k]) => k)).toEqual([]);
});

test("clearRun drops both halves of a pair", async () => {
  const store = newStore();
  await store.saveRun(run("intimacy-map"), { session: true });
  await store.saveRun(run("intimacy-map"), { session: true, slot: "b" });

  await store.clearRun("intimacy-map");

  expect(await store.run("intimacy-map")).toBeNull();
  expect(await store.run("intimacy-map", "b")).toBeNull();
});
