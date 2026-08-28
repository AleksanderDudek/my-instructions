import { describe, expect, test } from "vitest";
import { PAGE_SIZE, byNewest, dateLabel, fold, paginate, search, validateFit, view, type Fit } from "@/core/fits";

/**
 * The list behaviour, where the bugs of a list actually live.
 *
 * Not in the rendering — in the arithmetic between a query, an order and a
 * page number, which is where "my search found nothing" and "the page went
 * blank" both come from. All of it is pure, so all of it is checkable without
 * a browser.
 */

const fit = (over: Partial<Fit> = {}): Fit => ({
  id: over.id ?? "x",
  name: "",
  day: 8,
  month: 1,
  year: 1993,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...over,
});

const many = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    fit({
      id: `f${i}`,
      name: `Person ${i}`,
      // Ascending time, so index 0 is the oldest and should sort last.
      createdAt: `2026-01-${String((i % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
    }),
  );

describe("folding", () => {
  test("ignores case and diacritics", () => {
    // An app shipping in Polish, Spanish and German where "Muller" cannot find
    // "Müller" reads as a broken search rather than a strict one.
    expect(fold("Müller")).toBe(fold("muller"));
    expect(fold("Zośka")).toBe(fold("ZOSKA"));
    expect(fold("Núñez")).toBe(fold("nunez"));
  });
});

describe("search", () => {
  const rows = [
    fit({ id: "a", name: "Ada", day: 3, month: 7, year: 1966 }),
    fit({ id: "b", name: "Zośka", day: 11, month: 11, year: 2011 }),
    fit({ id: "c", name: "", day: 29, month: 2, year: 2000 }),
  ];

  test("an empty query is every row, not no rows", () => {
    expect(search(rows, "").map((r) => r.id)).toEqual(["a", "b", "c"]);
    expect(search(rows, "   ").map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  test("matches a name without its diacritics", () => {
    expect(search(rows, "zoska").map((r) => r.id)).toEqual(["b"]);
  });

  test("matches the date as it is written on the row", () => {
    // The row is labelled `3.7.1966`, so that is what a reader will type. A
    // search over some other spelling of the date would find nothing and look
    // broken.
    expect(search(rows, "3.7.1966").map((r) => r.id)).toEqual(["a"]);
    expect(search(rows, "2000").map((r) => r.id)).toEqual(["c"]);
  });

  test("a row with no name is still findable by its date", () => {
    expect(search(rows, "29.2").map((r) => r.id)).toEqual(["c"]);
  });

  test("does not mutate what it was given", () => {
    const before = rows.map((r) => r.id);
    search(rows, "ada");
    expect(rows.map((r) => r.id)).toEqual(before);
  });
});

describe("order", () => {
  test("newest first — the one just added is the one being looked at", () => {
    const rows = [
      fit({ id: "old", createdAt: "2026-01-01T00:00:00.000Z" }),
      fit({ id: "new", createdAt: "2026-06-01T00:00:00.000Z" }),
    ];
    expect(byNewest(rows).map((r) => r.id)).toEqual(["new", "old"]);
  });

  test("sorts a copy", () => {
    const rows = [fit({ id: "a", createdAt: "2026-01-01T00:00:00.000Z" }), fit({ id: "b", createdAt: "2026-06-01T00:00:00.000Z" })];
    byNewest(rows);
    expect(rows.map((r) => r.id)).toEqual(["a", "b"]);
  });
});

describe("pagination", () => {
  test("cuts at ten", () => {
    const paged = paginate(many(25), 0);
    expect(PAGE_SIZE).toBe(10);
    expect(paged.rows).toHaveLength(10);
    expect(paged.pages).toBe(3);
    expect(paged.total).toBe(25);
  });

  test("the last page is the remainder rather than a short page of blanks", () => {
    expect(paginate(many(25), 2).rows).toHaveLength(5);
  });

  test("an empty list is one page, not zero", () => {
    // Zero pages makes "page 1 of 0" and a Next button that is somehow enabled.
    const paged = paginate([], 0);
    expect(paged.pages).toBe(1);
    expect(paged.rows).toEqual([]);
  });

  test("a page number past the end is clamped rather than trusted", () => {
    // The scenario: delete the last row of page four. The reader is standing on
    // a page that no longer exists, and an empty screen with no way back is the
    // failure. They land on the last real page instead.
    const paged = paginate(many(25), 9);
    expect(paged.page).toBe(2);
    expect(paged.rows).toHaveLength(5);
  });

  test("a negative or nonsense page is page one", () => {
    expect(paginate(many(25), -3).page).toBe(0);
    expect(paginate(many(25), Number.NaN).page).toBe(0);
  });
});

describe("the whole read", () => {
  test("searches before it pages, so a match on page two is still found", () => {
    // The bug this pins: cutting to ten first and searching the cut would make
    // a name on page three unfindable, which reads as a search that does not
    // work rather than as an ordering mistake.
    const rows = [...many(24), fit({ id: "needle", name: "Grandmother", createdAt: "2020-01-01T00:00:00.000Z" })];
    const found = view(rows, "grandmother", 0);
    expect(found.rows.map((r) => r.id)).toEqual(["needle"]);
    expect(found.total).toBe(1);
    expect(found.pages).toBe(1);
  });

  test("paging a filtered list counts the filtered list", () => {
    const rows = many(40).map((r, i) => ({ ...r, name: i < 15 ? `Keep ${i}` : `Drop ${i}` }));
    const found = view(rows, "keep", 0);
    expect(found.total).toBe(15);
    expect(found.pages).toBe(2);
    expect(found.rows).toHaveLength(10);
  });

  test("holds three hundred without the read becoming the slow part", () => {
    const rows = many(300);
    const started = performance.now();
    const found = view(rows, "person 2", 0);
    // Not a benchmark — a floor. If this ever takes a noticeable fraction of a
    // second, the search stopped being a string compare per record and started
    // computing something, which is the mistake this module exists to avoid.
    expect(performance.now() - started).toBeLessThan(50);
    expect(found.rows).toHaveLength(10);
  });
});

describe("what may reach storage", () => {
  test("a month or day outside the calendar is refused", () => {
    expect(() => validateFit(fit({ month: 13 }))).toThrow(/month/);
    expect(() => validateFit(fit({ day: 0 }))).toThrow(/day/);
  });

  test("a fractional part is refused before it can render as one", () => {
    expect(() => validateFit(fit({ year: 1993.5 }))).toThrow(/whole number/);
  });

  test("31 September is left to the instrument's own validator", () => {
    // Deliberately allowed here: whether a date exists in a given month is the
    // instrument's business, and duplicating that rule is how two answers to
    // one question start to disagree.
    expect(() => validateFit(fit({ day: 31, month: 9 }))).not.toThrow();
  });
});

test("the row label is what the search matches", () => {
  // Pinned together because they are one decision: change the label and the
  // search must change with it, or a reader types what they can see and finds
  // nothing.
  const row = fit({ day: 3, month: 7, year: 1966 });
  expect(dateLabel(row)).toBe("3.7.1966");
  expect(search([row], dateLabel(row))).toHaveLength(1);
});
