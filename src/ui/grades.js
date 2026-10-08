// Character grades (PI Score): one source of truth for colour, name and meaning.
// Muted tint + coloured text keeps a table of grades calm to scan.

export const GRADE_SCALE = [
  {
    letter: "A",
    hex: "#059669",
    base: 95,
    name: "Elite",
    tone: "bg-emerald-50 text-emerald-800 ring-emerald-600/25",
    dot: "bg-emerald-600",
    meaning:
      "Outstanding character with no clear flaws. Stands out among teammates and is a strong positive influence. Likely to overcome deficiencies elsewhere because of this component.",
  },
  {
    letter: "B",
    hex: "#65A30D",
    base: 82,
    name: "Good",
    tone: "bg-lime-50 text-lime-800 ring-lime-600/25",
    dot: "bg-lime-600",
    meaning:
      "Solid overall character. Teammates and coaches notice the positive traits in normal interactions, and he could overcome deficiencies in some areas.",
  },
  {
    letter: "C",
    hex: "#D97706",
    base: 68,
    name: "Adequate",
    tone: "bg-amber-50 text-amber-800 ring-amber-600/25",
    dot: "bg-amber-500",
    meaning:
      "Not necessarily a negative, but unlikely to be a positive. Average in most characteristics and has what it takes to get by. He neither adds to nor subtracts from the culture. This is the bulk of prospects.",
  },
  {
    letter: "D",
    hex: "#EA580C",
    base: 52,
    name: "Character deficiency",
    tone: "bg-orange-50 text-orange-800 ring-orange-600/25",
    dot: "bg-orange-500",
    meaning:
      "Has a character deficiency and may show negative character in flashes. Not necessarily fatal, but likely to limit his ability to perform and develop. Teammates and coaches will notice it.",
  },
  {
    letter: "F",
    hex: "#DC2626",
    base: 30,
    name: "Fatal characteristics",
    tone: "bg-red-50 text-red-800 ring-red-600/25",
    dot: "bg-red-600",
    meaning:
      "Fatal characteristics. Likely to fail at the next level and to be a distraction to teammates and coaches.",
  },
];

const NA = {
  letter: "N/A",
  hex: "#94A3B8",
  base: 0,
  name: "Not graded",
  tone: "bg-ink-100 text-ink-500 ring-ink-300/60",
  dot: "bg-ink-300",
  meaning: "",
};

/** "A+" -> { base: "A", modifier: "+", ...scale entry }. Unknown values return the N/A entry. */
export const parseGrade = (value) => {
  if (!value || typeof value !== "string") return { ...NA, base: "", modifier: "" };
  const trimmed = value.trim();
  const base = trimmed.charAt(0).toUpperCase();
  const modifier = trimmed.slice(1).replace("−", "-");
  const entry = GRADE_SCALE.find((g) => g.letter === base);
  if (!entry) return { ...NA, base: "", modifier: "" };
  return { ...entry, base, modifier: modifier === "+" || modifier === "-" ? modifier : "" };
};

export const GRADE_FILTER_OPTIONS = [...GRADE_SCALE.map((g) => g.letter), "N/A"];

/** 0 to 100 for a grade, nudged by + / - (A+ is highest). Not graded = 0. */
export const gradeScore = (value) => {
  const p = parseGrade(value);
  if (!p.base) return 0;
  const entry = GRADE_SCALE.find((s) => s.letter === p.base);
  const nudge = p.modifier === "+" ? 4 : p.modifier === "-" ? -4 : 0;
  return Math.max(4, Math.min(100, entry.base + nudge));
};
