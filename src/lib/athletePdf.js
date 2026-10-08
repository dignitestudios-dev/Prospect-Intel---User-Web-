/* eslint-disable no-irregular-whitespace, no-control-regex -- the text cleaner deliberately matches odd whitespace and non-Latin-1 characters */
// ============================================================
// Athlete profile report (jsPDF)
//
//   generateAthletePDF(athleteDetail, formatDate)
//
// A formal, single-column report: running header, identity block,
// profile summary, character assessment, athletic background, family,
// strengths and weaknesses, and the grading scale. Every block of text
// flows across pages, so very long entries never overflow or get cut.
// A diagonal confidential watermark sits behind every page.
// ============================================================
import { jsPDF } from "jspdf";
import { prospectLogo } from "../assets/export";
import axiosinstance from "../axios";
import { GRADE_SCALE, parseGrade } from "../ui/grades";

/* ------------------------------ palette ------------------------------ */
const NAVY = [11, 29, 51];
const ACCENT = [10, 124, 194];
const PANEL = [246, 248, 251];
const INK = [17, 24, 39];
const BODY = [55, 65, 81];
const MUTED = [107, 114, 128];
const RULE = [209, 213, 219];
const HAIR = [229, 231, 235];
const GOOD = [4, 120, 87];
const BAD = [185, 28, 28];

// Grade colours (text / outline)
const GRADE_RGB = {
  A: [4, 120, 87],
  B: [77, 124, 15],
  C: [180, 83, 9],
  D: [194, 65, 12],
  F: [185, 28, 28],
  NA: [107, 114, 128],
};

/* ------------------------------ text utils ------------------------------ */
// Built-in PDF fonts are Latin-1 only: normalise anything outside it.
const clean = (str) =>
  String(str)
    .replace(/[‐-―−⁃]/g, "-")
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/…/g, "...")
    .replace(/[  -   　]/g, " ")
    .replace(/[•‣⁄]/g, "-")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/<\/?[a-z][\s\S]*?>/gi, "")
    .replace(/[^\x00-\xFF\n]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();

const empty = (v) => v === undefined || v === null || String(v).trim() === "";
const show = (v, fallback = "Not provided") => (empty(v) ? fallback : clean(v) || fallback);

const phone = (p) => {
  if (empty(p)) return "";
  const digits = String(p).replace(/\D/g, "");
  const n = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : String(p);
};

/* ------------------------------ image utils ------------------------------ */
// The athlete photo is stored on S3; the API hands it back as bytes so the
// browser isn't blocked by cross-origin rules.
const loadAthletePhoto = async (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const response = await axiosinstance.post("/user/buffer/s3", { s3Url: imageUrl });
    const bytes = response?.data?.data?.data;
    if (!bytes || !bytes.length) return null;
    const arr = new Uint8Array(bytes);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < arr.length; i += chunk) binary += String.fromCharCode(...arr.subarray(i, i + chunk));
    const isPng = arr[0] === 0x89 && arr[1] === 0x50;
    return { data: `data:image/${isPng ? "png" : "jpeg"};base64,${btoa(binary)}`, type: isPng ? "PNG" : "JPEG" };
  } catch {
    return null;
  }
};

const loadLogo = async () => {
  try {
    const res = await fetch(prospectLogo);
    const blob = await res.blob();
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return data;
  } catch {
    return null;
  }
};

/* =============================== generator =============================== */
export const generateAthletePDF = async (athleteDetail, formatDate = (d) => String(d)) => {
  if (!athleteDetail) return;

  const b = athleteDetail.basicInfo || {};
  const a = athleteDetail.athlete || {};
  const fam = athleteDetail.family || {};
  const ov = athleteDetail.overview || {};

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const PW = doc.internal.pageSize.getWidth(); // 612
  const PH = doc.internal.pageSize.getHeight(); // 792
  const MX = 54; // left/right margin
  const CW = PW - MX * 2;
  const TOP = 74; // first content line on every page
  const BOTTOM = PH - 62; // last content line on every page

  // ---- primitives ----
  const font = (style = "normal", size = 10) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };
  const ink = (rgb) => doc.setTextColor(...rgb);
  const rule = (x1, y1, x2, rgb = RULE, w = 0.6) => {
    doc.setDrawColor(...rgb);
    doc.setLineWidth(w);
    doc.line(x1, y1, x2, y1);
  };
  const lead = (size) => size * 1.55;
  const wrap = (text, w, size, style = "normal") => {
    font(style, size);
    return doc.splitTextToSize(clean(text), w);
  };

  let y = TOP;
  let logoData = await loadLogo();

  // ---- page furniture ----
  const LOGO = 38;
  const drawRunningHeader = () => {
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", MX - 2, 6, LOGO, LOGO);
      } catch {
        logoData = null;
      }
    }
    if (!logoData) {
      ink(NAVY);
      font("bold", 9);
      doc.text("PROSPECT INTEL", MX, 34, { charSpace: 1.8 });
    }
    rule(MX, 48, PW - MX, NAVY, 1.1);
  };

  const newPage = () => {
    doc.addPage();
    drawRunningHeader();
    y = TOP;
  };

  /** Start a new page if fewer than `h` points remain. */
  const ensure = (h) => {
    if (y + h > BOTTOM) newPage();
  };

  const gap = (h) => {
    y += h;
  };

  /** Text that flows line by line across pages. */
  const flow = (text, x, w, { size = 9.5, style = "normal", rgb = BODY } = {}) => {
    const ls = wrap(text, w, size, style);
    const lh = lead(size);
    ls.forEach((l) => {
      ensure(lh);
      font(style, size);
      ink(rgb);
      doc.text(l, x, y + size);
      y += lh;
    });
  };

  const section = (title, keepWith = 60) => {
    ensure(34 + keepWith);
    gap(10);
    ink(NAVY);
    font("bold", 9.5);
    doc.text(title.toUpperCase(), MX, y + 9, { charSpace: 1.3 });
    y += 16;
    rule(MX, y, PW - MX, HAIR, 0.8);
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(2);
    doc.line(MX, y, MX + 30, y);
    y += 14;
  };

  /** Label on the left, value flowing on the right. */
  const row = (label, value, { labelW = 128, rgb = INK, size = 9.5, hair = true } = {}) => {
    const vw = CW - labelW;
    const ls = wrap(value, vw, size);
    const lh = lead(size);
    ensure(lh * Math.min(2, ls.length) + 4);
    ink(MUTED);
    font("bold", 8);
    doc.text(clean(label).toUpperCase(), MX, y + size - 0.5, { charSpace: 0.6 });
    ls.forEach((l) => {
      ensure(lh);
      font("normal", size);
      ink(rgb);
      doc.text(l, MX + labelW, y + size);
      y += lh;
    });
    y += 5;
    if (hair) {
      rule(MX, y - 2, PW - MX, HAIR, 0.5);
      y += 5;
    }
  };

  const gradeBox = (x, top, size, letterKey, grade) => {
    const g = parseGrade(grade);
    const rgb = GRADE_RGB[g.base || "NA"];
    doc.setDrawColor(...rgb);
    doc.setLineWidth(1.2);
    doc.roundedRect(x, top, size, size, 3, 3, "S");
    ink(rgb);
    const label = g.base ? `${g.base}${g.modifier === "-" ? "-" : g.modifier}` : "-";
    font("bold", size * 0.5);
    const lw = doc.getTextWidth(label);
    doc.text(label, x + (size - lw) / 2, top + size * 0.66);
  };

  // ============================================================
  // Identity block
  // ============================================================
  drawRunningHeader();

  const photo = await loadAthletePhoto(b.image);
  const PHW = 84;
  const PHH = 104;
  const PAD = 16;
  const PHX = MX + PAD + 4;
  const PHY = y + PAD;
  doc.setFillColor(...PANEL);
  doc.roundedRect(MX, y, CW, PHH + PAD * 2, 5, 5, "F");
  doc.setFillColor(...ACCENT);
  doc.roundedRect(MX, y + 14, 3.5, PHH + PAD * 2 - 28, 1.75, 1.75, "F");
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.8);
  if (photo) {
    try {
      const props = doc.getImageProperties(photo.data);
      const scale = Math.max(PHW / props.width, PHH / props.height);
      const w = props.width * scale;
      const h = props.height * scale;
      doc.saveGraphicsState();
      doc.roundedRect(PHX, PHY, PHW, PHH, 3, 3, null);
      doc.clip();
      doc.discardPath();
      doc.addImage(photo.data, photo.type, PHX + (PHW - w) / 2, PHY + (PHH - h) / 2, w, h);
      doc.restoreGraphicsState();
    } catch {
      try {
        doc.addImage(photo.data, photo.type, PHX, PHY, PHW, PHH);
      } catch {
        /* keep the outline only */
      }
    }
    doc.roundedRect(PHX, PHY, PHW, PHH, 3, 3, "S");
  } else {
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(PHX, PHY, PHW, PHH, 3, 3, "FD");
    const initials = clean(b.name || "")
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("");
    ink(MUTED);
    font("bold", 26);
    doc.text(initials || "-", PHX + PHW / 2, PHY + PHH / 2 + 9, { align: "center" });
  }

  const TX = PHX + PHW + 22;
  const TW = PW - MX - PAD - TX;
  const name = show(b.name, "Unnamed athlete");
  const nameSize = name.length > 44 ? 15 : name.length > 30 ? 18 : 23;
  ink(NAVY);
  font("bold", nameSize);
  const nameLines = doc.splitTextToSize(name, TW).slice(0, 3);
  nameLines.forEach((l, i) => doc.text(l, TX, PHY + nameSize - 2 + i * (nameSize + 3)));
  let iy = PHY + nameSize - 2 + (nameLines.length - 1) * (nameSize + 3) + 20;

  const meta = [b.position, b.gradYear && `Class of ${b.gradYear}`].filter(Boolean).map(clean).join("   |   ");
  if (meta) {
    ink(INK);
    font("bold", 10.5);
    doc.text(meta, TX, iy);
    iy += 16;
  }
  const school = [b.schoolName, b.state].filter(Boolean).map(clean).join(", ");
  ink(BODY);
  font("normal", 10);
  doc.splitTextToSize(school || "School not provided", TW)
    .slice(0, 2)
    .forEach((l) => {
      doc.text(l, TX, iy);
      iy += 14;
    });

  const tags = (Array.isArray(b.status) ? b.status : []).filter(Boolean).map(clean);
  if (tags.length && iy < PHY + PHH - 6) {
    ink(MUTED);
    font("bold", 7.5);
    doc.text("STATUS", TX, iy + 6, { charSpace: 0.8 });
    ink(BODY);
    font("normal", 9);
    const tl = doc.splitTextToSize(tags.join("   /   "), TW - 46).slice(0, 2);
    tl.forEach((l, i) => doc.text(l, TX + 46, iy + 6 + i * 12));
  }
  y = PHY + PHH + PAD + 16;

  // ============================================================
  // Profile summary (3 x 2 grid)
  // ============================================================
  const summary = [
    ["Height", show(b.height, "-")],
    ["Weight", empty(b.weight) ? "-" : `${clean(b.weight)} lb`],
    ["GPA", show(b.gpa, "-")],
    ["Class", show(b.gradYear, "-")],
    ["State", show(b.state, "-")],
    ["Committed college", show(b.committedCollege?.name, "None yet")],
  ];
  const cols = 3;
  const cw = CW / cols;
  const cellH = 46;
  doc.setFillColor(...PANEL);
  doc.roundedRect(MX, y, CW, cellH * 2, 5, 5, "F");
  doc.setDrawColor(...HAIR);
  doc.setLineWidth(0.8);
  doc.line(MX + 14, y + cellH, PW - MX - 14, y + cellH);
  for (let c = 1; c < cols; c++) doc.line(MX + c * cw, y + 10, MX + c * cw, y + cellH * 2 - 10);
  summary.forEach(([k, v], i) => {
    const cx = MX + (i % cols) * cw + 16;
    const cy = y + Math.floor(i / cols) * cellH + 2;
    ink(MUTED);
    font("bold", 7.5);
    doc.text(k.toUpperCase(), cx, cy + 17, { charSpace: 0.7 });
    ink(INK);
    font("bold", 11.5);
    doc.text(doc.splitTextToSize(v, cw - 32)[0], cx, cy + 33);
  });
  const sumRows = Math.ceil(summary.length / cols);
  y += sumRows * cellH + 12;

  // ============================================================
  // Character assessment
  // ============================================================
  section("Character assessment", 90);
  [
    { title: "Football character", grade: a.footballPiScore, desc: a.footballDescription },
    { title: "Personal character", grade: a.personalPiScore, desc: a.personalDescription },
  ].forEach((it, idx) => {
    const g = parseGrade(it.grade);
    const text =
      it.desc && String(it.desc).trim()
        ? it.desc
        : g.base
          ? "No written assessment has been added for this grade."
          : "This area has not been graded yet.";
    ensure(78);
    const top = y;
    gradeBox(MX, top, 46, g.base, it.grade);
    const order = ["A", "B", "C", "D", "F"];
    order.forEach((letter, k) => {
      const on = g.base === letter;
      doc.setFillColor(...(on ? GRADE_RGB[letter] : [226, 229, 234]));
      doc.roundedRect(MX + k * 9.5, top + 54, 8, 3, 1.2, 1.2, "F");
    });
    ink(MUTED);
    font("normal", 7.5);
    const pi = g.base ? "PI SCORE" : "NOT GRADED";
    doc.text(pi, MX + 23 - doc.getTextWidth(pi) / 2, top + 69, { charSpace: 0.4 });

    const TXX = MX + 70;
    const TWW = CW - 70;
    ink(INK);
    font("bold", 11);
    doc.text(`${it.title}${g.base ? "  |  " + clean(g.name) : ""}`, TXX, top + 11);
    y = top + 20;
    flow(text, TXX, TWW, { size: 9.5, rgb: BODY });
    if (g.base) {
      gap(2);
      flow(`What a ${g.base} means: ${g.meaning}`, TXX, TWW, { size: 8.5, style: "italic", rgb: MUTED });
    }
    y = Math.max(y, top + 76) + 6;
    if (idx === 0) {
      rule(MX, y - 2, PW - MX, HAIR, 0.5);
      y += 10;
    }
  });

  // ============================================================
  // Athletic background
  // ============================================================
  section("Athletic background", 70);
  [
    ["Other sports", a.otherSports],
    ["Activities", a.activities],
    ["Coach evaluation", a.coachEvaluation],
    ["Other information", a.otherInfo],
  ].forEach(([k, v], i, arr) => row(k, show(v), { hair: i < arr.length - 1 }));

  // ============================================================
  // Family
  // ============================================================
  section("Family", 70);
  const parent = (nm, occ, contact, dob) =>
    [
      show(nm),
      `Occupation: ${show(occ)}  |  Contact: ${empty(contact) ? "Not provided" : phone(contact)}  |  Date of birth: ${empty(dob) ? "Not provided" : clean(formatDate(dob))}`,
    ].join("\n");
  row("Mother", parent(fam.motherName, fam.motherOccupation, fam.motherContact, fam.motherDob));
  row("Father", parent(fam.fatherName, fam.fatherOccupation, fam.fatherContact, fam.fatherDob));
  const sibs = Array.isArray(fam.siblings) ? fam.siblings : [];
  row(
    "Siblings",
    sibs.length
      ? sibs
          .map((s) => `${show(s?.name)} (${show(s?.type, "Sibling")}${s?.dob ? ", born " + clean(formatDate(s.dob)) : ""})`)
          .join("\n")
      : "No siblings listed.",
  );
  row("Key influences", show(fam.keyInfluences), { hair: false });

  // ============================================================
  // Strengths and weaknesses
  // ============================================================
  section("Strengths and weaknesses", 70);
  const bullets = (label, items, rgb, mark) => {
    ensure(40);
    ink(INK);
    font("bold", 10);
    doc.text(label, MX, y + 10);
    y += 18;
    const list = Array.isArray(items) && items.length ? items : ["Nothing has been added yet."];
    list.forEach((t) => {
      const ls = wrap(t, CW - 22, 9.5);
      ensure(lead(9.5));
      ink(rgb);
      font("bold", 10);
      doc.text(mark, MX + 4, y + 9.5);
      ls.forEach((l) => {
        ensure(lead(9.5));
        ink(BODY);
        font("normal", 9.5);
        doc.text(l, MX + 22, y + 9.5);
        y += lead(9.5);
      });
      y += 2;
    });
  };
  bullets("Strengths", ov.strengths, GOOD, "+");
  gap(8);
  bullets("Weaknesses", ov.weaknesses, BAD, "-");

  // ============================================================
  // Grading scale
  // ============================================================
  section("Character grading scale", 90);
  GRADE_SCALE.forEach((g, i) => {
    const ls = wrap(g.meaning, CW - 44, 8.5);
    const h = Math.max(30, 16 + ls.length * lead(8.5));
    ensure(h + 6);
    gradeBox(MX, y, 28, g.letter, g.letter);
    ink(INK);
    font("bold", 10);
    doc.text(clean(g.name), MX + 44, y + 10);
    ink(MUTED);
    font("normal", 8.5);
    ls.forEach((l, j) => doc.text(l, MX + 44, y + 22 + j * lead(8.5)));
    y += h + 4;
    if (i < GRADE_SCALE.length - 1) {
      rule(MX, y, PW - MX, HAIR, 0.5);
      y += 8;
    }
  });
  gap(6);
  flow("Plus (+) and minus (-) refine a grade within its letter.", MX, CW, { size: 8, rgb: MUTED });

  // ============================================================
  // Watermark and footer on every page
  // ============================================================
  const pages = doc.internal.getNumberOfPages();
  const theta = 38;
  const rad = (theta * Math.PI) / 180;
  const cx = PW / 2;
  const cy = PH / 2 + 10;
  const placeRotated = (text, size, charSpace, offset) => {
    font("bold", size);
    const w = doc.getTextWidth(text) + charSpace * (text.length - 1);
    const px = cx + Math.sin(rad) * offset - (Math.cos(rad) * w) / 2;
    const py = cy + Math.cos(rad) * offset + (Math.sin(rad) * w) / 2;
    doc.text(text, px, py, { angle: theta, charSpace });
  };

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);

    // watermark
    doc.saveGraphicsState();
    try {
      doc.setGState(new doc.GState({ opacity: 0.065 }));
    } catch {
      /* very old viewers: draw very light instead */
    }
    ink(NAVY);
    placeRotated("PROSPECT INTEL", 62, 3, -6);
    placeRotated("CONFIDENTIAL", 24, 9, 46);
    doc.restoreGraphicsState();

    // footer
    rule(MX, PH - 46, PW - MX, RULE, 0.6);
    ink(MUTED);
    font("bold", 8);
    doc.text("CONFIDENTIAL", MX, PH - 27, { charSpace: 1 });
    font("normal", 8);
    doc.text(`Page ${i} of ${pages}`, PW - MX, PH - 27, { align: "right" });
  }

  const fileBase = clean(b.name || "Athlete").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_") || "Athlete";
  doc.save(`${fileBase}_Profile.pdf`);
};
