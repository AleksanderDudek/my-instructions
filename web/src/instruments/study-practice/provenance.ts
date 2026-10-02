/**
 * Provenance for study-practice.
 *
 * Checked by test/instruments/provenance.test.ts.
 */
export default {
  construct: {
    name: "Study technique use",
    origin: "Dunlosky, Rawson, Marsh, Nathan and Willingham 2013; Rohrer and Pashler on interleaving",
    public: true,
    note: "The six techniques are named and rated in the published reviews, which are public scholarship rather than an instrument. There is no questionnaire to borrow \u2014 the techniques are behaviours with plain names, so the questions are ours and simply ask how often each is used.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing is measured here — frequency of a named behaviour is reported back
     as given — so there is no construct whose validity could be inherited. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "Nothing is scored. The techniques have published evidence behind them as techniques; this folder makes no claim that asking about them measures anything.",
  },

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1177/1529100612453266
    { authors: "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T.", year: 2013, title: "Improving students' learning with effective learning techniques: Promising directions from cognitive and educational psychology", source: "Psychological Science in the Public Interest, 14(1), 4–58", url: "https://doi.org/10.1177/1529100612453266", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.3102/0013189x10374770 ; ERIC EJ888987
    { authors: "Rohrer, D., & Pashler, H.", year: 2010, title: "Recent research on human learning challenges conventional instructional strategies", source: "Educational Researcher, 39(5), 406–412", url: "https://doi.org/10.3102/0013189X10374770", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1111/j.1539-6053.2009.01038.x
    { authors: "Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R.", year: 2008, title: "Learning styles: Concepts and evidence", source: "Psychological Science in the Public Interest, 9(3), 105–119", url: "https://doi.org/10.1111/j.1539-6053.2009.01038.x", kind: "critique" },
    // checked: Open Library edition OL16420482M (from Talis MARC; London: LSRC, 2004, ISBN 1853389188) plus the report's own title and imprint pages (four authors; 'Published by the Learning and Skills Research Centre'; ISBN 1 85338 918 8; © LSRC 2004)
    { authors: "Coffield, F., Moseley, D., Hall, E., & Ecclestone, K.", year: 2004, title: "Learning styles and pedagogy in post-16 learning: A systematic and critical review", source: "Learning and Skills Research Centre, London", url: "https://openlibrary.org/books/OL16420482M", kind: "critique" },
  ],

  reproduces: [],
  avoided: ["VARK", "Kolb Learning Style Inventory", "Honey and Mumford LSQ"],
};
