/**
 * Character strengths — the IPIP-VIA-R (Bluemke, Partsch, Saucier & Lechner),
 * public domain: ninety-six items, four a strength, two keyed forward and two
 * reverse, as IPIP publishes them at https://ipip.ori.org/IPIP-VIA-R_Key.html.
 *
 * The twenty-four strengths keep the keys this folder has always used; the
 * IPIP scale codes are noted beside each so the source can be checked. Ids
 * are the questionnaire positions in the authors' Table 7, which is also
 * where the German items come from. Eighteen of the ninety-six also form the
 * three core-strength scales of Partsch, Olaru & Lechner (2024) — positivity,
 * dependability, mastery — which `CORE_ITEMS` names for a second scoring pass
 * over the same answers.
 */

export type StrengthKey =
  | "creativity" | "curiosity" | "judgment" | "learning" | "perspective"
  | "bravery" | "perseverance" | "honesty" | "zest"
  | "love" | "kindness" | "social"
  | "teamwork" | "fairness" | "leadership"
  | "forgiveness" | "humility" | "prudence" | "regulation"
  | "beauty" | "gratitude" | "hope" | "humor" | "spirituality";

export type VirtueKey = "wisdom" | "courage" | "humanity" | "justice" | "temperance" | "transcendence";

/** The classification's own grouping, in its own order. */
export const VIRTUES: Record<VirtueKey, StrengthKey[]> = {
  wisdom: ["creativity", "curiosity", "judgment", "learning", "perspective"],
  courage: ["bravery", "perseverance", "honesty", "zest"],
  humanity: ["love", "kindness", "social"],
  justice: ["teamwork", "fairness", "leadership"],
  temperance: ["forgiveness", "humility", "prudence", "regulation"],
  transcendence: ["beauty", "gratitude", "hope", "humor", "spirituality"],
};

export const ORDER = Object.values(VIRTUES).flat();

export type CoreKey = "positivity" | "dependability" | "mastery";
export const CORE_ORDER: CoreKey[] = ["positivity", "dependability", "mastery"];

const row = (pos: number, scale: StrengthKey, reverse = false) => ({ id: `v${pos}`, kind: "likert" as const, scale, reverse });

/** Position, strength (IPIP code), key — Table 7 order. */
export const ITEMS = [
  row(1, "creativity", true), // ORI
  row(2, "bravery"), // VAL
  row(3, "love", true), // CAP
  row(4, "beauty", true), // APP
  row(5, "forgiveness"), // FOR
  row(6, "teamwork", true), // CIT
  row(7, "curiosity", true), // CUR
  row(8, "perseverance"), // IND
  row(9, "kindness", true), // KIN
  row(10, "gratitude"), // GRA
  row(11, "humility", true), // MOD
  row(12, "fairness"), // EQU
  row(13, "judgment", true), // JUD
  row(14, "social", true), // SOC
  row(15, "honesty"), // INT
  row(16, "leadership", true), // LEA
  row(17, "learning", true), // LOV
  row(18, "zest"), // ZES
  row(19, "humor", true), // HUM
  row(20, "regulation"), // SEL
  row(21, "hope", true), // HOP
  row(22, "perspective", true), // PER
  row(23, "prudence"), // PRU
  row(24, "spirituality"), // SPI
  row(25, "creativity"), // ORI
  row(26, "bravery", true), // VAL
  row(27, "love"), // CAP
  row(28, "beauty"), // APP
  row(29, "forgiveness", true), // FOR
  row(30, "teamwork"), // CIT
  row(31, "curiosity"), // CUR
  row(32, "perseverance", true), // IND
  row(33, "kindness"), // KIN
  row(34, "gratitude"), // GRA
  row(35, "humility"), // MOD
  row(36, "fairness", true), // EQU
  row(37, "judgment", true), // JUD
  row(38, "social", true), // SOC
  row(39, "honesty"), // INT
  row(40, "leadership"), // LEA
  row(41, "learning", true), // LOV
  row(42, "zest", true), // ZES
  row(43, "humor"), // HUM
  row(44, "regulation"), // SEL
  row(45, "hope"), // HOP
  row(46, "perspective"), // PER
  row(47, "prudence", true), // PRU
  row(48, "spirituality", true), // SPI
  row(49, "creativity"), // ORI
  row(50, "bravery"), // VAL
  row(51, "love"), // CAP
  row(52, "beauty", true), // APP
  row(53, "forgiveness"), // FOR
  row(54, "teamwork"), // CIT
  row(55, "curiosity"), // CUR
  row(56, "perseverance"), // IND
  row(57, "kindness"), // KIN
  row(58, "gratitude", true), // GRA
  row(59, "humility", true), // MOD
  row(60, "fairness"), // EQU
  row(61, "judgment"), // JUD
  row(62, "social"), // SOC
  row(63, "honesty", true), // INT
  row(64, "leadership", true), // LEA
  row(65, "learning"), // LOV
  row(66, "zest"), // ZES
  row(67, "humor", true), // HUM
  row(68, "regulation", true), // SEL
  row(69, "hope"), // HOP
  row(70, "perspective", true), // PER
  row(71, "prudence", true), // PRU
  row(72, "spirituality"), // SPI
  row(73, "creativity", true), // ORI
  row(74, "bravery", true), // VAL
  row(75, "love", true), // CAP
  row(76, "beauty"), // APP
  row(77, "forgiveness", true), // FOR
  row(78, "teamwork", true), // CIT
  row(79, "curiosity", true), // CUR
  row(80, "perseverance", true), // IND
  row(81, "kindness", true), // KIN
  row(82, "gratitude", true), // GRA
  row(83, "humility"), // MOD
  row(84, "fairness", true), // EQU
  row(85, "judgment"), // JUD
  row(86, "social"), // SOC
  row(87, "honesty", true), // INT
  row(88, "leadership"), // LEA
  row(89, "learning"), // LOV
  row(90, "zest", true), // ZES
  row(91, "humor"), // HUM
  row(92, "regulation", true), // SEL
  row(93, "hope", true), // HOP
  row(94, "perspective"), // PER
  row(95, "prudence"), // PRU
  row(96, "spirituality", true), // SPI
];

const core = (pos: number, scale: CoreKey, reverse = false) => ({ id: `v${pos}`, kind: "likert" as const, scale, reverse });

/** The same answers, read a second time as three core strengths. */
export const CORE_ITEMS = [
  core(9, "dependability", true),
  core(16, "mastery", true),
  core(26, "mastery", true),
  core(27, "positivity"),
  core(36, "dependability", true),
  core(38, "mastery", true),
  core(46, "mastery"),
  core(49, "mastery"),
  core(60, "dependability"),
  core(63, "dependability", true),
  core(66, "positivity"),
  core(69, "positivity"),
  core(75, "positivity", true),
  core(77, "positivity", true),
  core(82, "positivity", true),
  core(83, "dependability"),
  core(85, "mastery"),
  core(95, "dependability"),
];
