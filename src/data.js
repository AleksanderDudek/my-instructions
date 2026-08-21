/**
 * Static tables. Nothing here computes; it only remembers.
 */
/* ══ Chinese New Year, 1900–2050 ══════════════════════════════════
   The animal turns at Chinese New Year, not 1 January. Each entry is
   month digit + two day digits, e.g. "123" = 23 Jan.                */
const CNY = ("131 219 208 129 216 204 125 213 202 122 210 130 218 206 126 214 203 123 211 201 " +
 "220 208 128 216 205 124 213 202 123 210 130 217 206 126 214 204 124 211 131 219 " +
 "208 127 215 205 125 213 202 122 210 129 217 206 127 214 203 124 212 131 218 208 " +
 "128 215 205 125 213 202 121 209 130 217 206 127 215 203 123 211 131 218 207 128 " +
 "216 205 125 213 202 220 209 129 217 206 127 215 204 123 210 131 219 207 128 216 " +
 "205 124 212 201 122 209 129 218 207 126 214 203 123 210 131 219 208 128 216 205 " +
 "125 212 201 122 210 129 217 206 126 213 203 123 211 131 219 208 128 215 204 124 " +
 "212 201 122 210 130 217 206 126 214 202 123").split(/\s+/);

const ANIMALS = [
  ["Rat","🐀","Quick, thrifty, alert to opportunity — and to exits."],
  ["Ox","🐂","Steady to the point of immovable. Finishes what it starts."],
  ["Tiger","🐅","Daring, sudden, allergic to being managed."],
  ["Rabbit","🐇","Tactful and self-protective; wins by not fighting."],
  ["Dragon","🐉","Large presence, large appetite, low tolerance for small talk."],
  ["Snake","🐍","Watches, calculates, then moves once."],
  ["Horse","🐎","Motion as a personality. Candid, restless, warm."],
  ["Goat","🐐","Gentle and aesthetic; stubborn under the softness."],
  ["Monkey","🐒","Inventive, quick-witted, faintly untrustworthy with rules."],
  ["Rooster","🐓","Precise, forthright, keeps a mental ledger."],
  ["Dog","🐕","Loyal, principled, worries on other people's behalf."],
  ["Pig","🐖","Generous and unguarded; enjoys things properly."]];
const ELEMENTS = ["Metal","Metal","Water","Water","Wood","Wood","Fire","Fire","Earth","Earth"];
/* four triangles of affinity + the six harmonies */
const TRIAD = [[0,4,8],[1,5,9],[2,6,10],[3,7,11]];
const HARMONY = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];

const WEST = {
  Aries:["♈\uFE0E","Fire","Starts things. Impatient with the second half."],
  Taurus:["♉\uFE0E","Earth","Slow, sensual, immovable once settled."],
  Gemini:["♊\uFE0E","Air","Two minds, both talking. Curious and quicksilver."],
  Cancer:["♋\uFE0E","Water","Protective, tidal, keeps everything that mattered."],
  Leo:["♌\uFE0E","Fire","Generous and theatrical; needs to be seen doing it."],
  Virgo:["♍\uFE0E","Earth","Notices the flaw, then fixes it. Service as devotion."],
  Libra:["♎\uFE0E","Air","Weighs, charms, delays. Allergic to ugliness."],
  Scorpio:["♏\uFE0E","Water","All or nothing, and it remembers."],
  Sagittarius:["♐\uFE0E","Fire","Honest to a fault, gone by morning."],
  Capricorn:["♑\uFE0E","Earth","Plays the long game and expects to win it."],
  Aquarius:["♒\uFE0E","Air","Attached to the idea more than the crowd."],
  Pisces:["♓\uFE0E","Water","Porous, imaginative, hard to pin to a place."]};
const CUTS = [[1,19,"Capricorn"],[2,18,"Aquarius"],[3,20,"Pisces"],[4,19,"Aries"],[5,20,"Taurus"],
  [6,20,"Gemini"],[7,22,"Cancer"],[8,22,"Leo"],[9,22,"Virgo"],[10,22,"Libra"],[11,21,"Scorpio"],[12,21,"Sagittarius"]];

const NUM = {
  1:["The Initiator","Will, self-start, the appetite to go first — and the solitude that comes with it."],
  2:["The Mirror","Pairing, diplomacy, fine-grained sensitivity. Strong in twos, thin when alone."],
  3:["The Voice","Expression, play, charm. Scatters energy as fast as it makes it."],
  4:["The Foundation","Structure, labour, patience. Reliable; can calcify."],
  5:["The Turn","Movement, appetite, freedom. Bores easily, learns fast."],
  6:["The Keeper","Care, home, beauty, duty. Loves by taking responsibility."],
  7:["The Well","Analysis and retreat. Needs solitude to think, then doubts the answer."],
  8:["The Forge","Power, money, consequence. Comfortable with weight and control."],
  9:["The Horizon","Completion, compassion, release. Ends things so they can end well."],
  11:["The Channel","A 2 held at high voltage — intuition, nerves, signal."],
  22:["The Builder","A 4 at scale — turns a vision into something with foundations."],
  33:["The Teacher","A 6 without limit — care extended past the household."]};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/* Numerological affinities, symmetric by construction. */
const FRIENDLY = {1:[1,2,3,5,6,9],2:[1,2,4,6,8,9],3:[1,3,5,6,7,9],4:[2,4,6,7,8],5:[1,3,5,7,9],
  6:[1,2,3,4,6,8,9],7:[3,4,5,7,9],8:[2,4,6,8],9:[1,2,3,5,6,7,9]};
const ELEM_PAIR = {"Fire|Air":20,"Earth|Water":20,"Fire|Earth":14,"Air|Water":14,"Fire|Water":9,"Earth|Air":9};

export { CNY, ANIMALS, ELEMENTS, TRIAD, HARMONY, WEST, CUTS, NUM, MONTHS, DAYS, FRIENDLY, ELEM_PAIR };
