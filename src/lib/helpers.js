import { jsPDF } from "jspdf";
import { prospectLogo } from "../assets/export";
import axiosinstance from "../axios";

// All the helper functions should must be there.
// The functions that you're using multiple times must be there.
// e.g. formatDateToMMDDYYYY, formatEpochToMMDDYYYY, etc.
export const formatDate = (date) => {
  if (!date) return "--------";

  const d = new Date(date);

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

export const formatAthleteForCSV = (athlete) => {
  return {
    // Basic
    ID: athlete._id,
    Name: athlete.basicInfo?.name,
    // Email: athlete.basicInfo?.email,
    Phone: athlete.basicInfo?.phone,
    Hometown: athlete.basicInfo?.hometown,
    DOB: new Date(athlete.basicInfo?.dob).toLocaleDateString(),
    Position: athlete.basicInfo?.position,
    Height: athlete.basicInfo?.height,
    Weight: athlete.basicInfo?.weight,
    Team: athlete.basicInfo?.team,
    Status: athlete.basicInfo?.status,
    Active: athlete.isActive ? "Yes" : "No",

    // Family
    "Mother Name": athlete.family?.motherName,
    "Mother DOB": athlete.family?.motherDob
      ? new Date(athlete.family.motherDob).toLocaleDateString()
      : "",
    "Mother Occupation": athlete.family?.motherOccupation,
    "Mother Contact": athlete.family?.motherContact,
    "Father Name": athlete.family?.fatherName,
    "Father DOB": athlete.family?.fatherDob
      ? new Date(athlete.family.fatherDob).toLocaleDateString()
      : "",
    "Father Occupation": athlete.family?.fatherOccupation,
    "Father Contact": athlete.family?.fatherContact,
    "Key Influences": athlete.family?.keyInfluences,

    Siblings: athlete.family?.siblings
      ?.map((s) => `${s.name} (${s.type})`)
      .join(" | "),

    // Athlete Section
    "Other Sports": athlete.athlete?.otherSports,
    Activities: athlete.athlete?.activities,
    "Coach Evaluation": athlete.athlete?.coachEvaluation,
    "Football PI Score": athlete.athlete?.footballPiScore,
    "Football Description": athlete.athlete?.footballDescription,
    "Personal PI Score": athlete.athlete?.personalPiScore,
    "Personal Description": athlete.athlete?.personalDescription,
    "Other Info": athlete.athlete?.otherInfo,

    // Overview
    Strengths: athlete.overview?.strengths?.join(" | "),
    Weaknesses: athlete.overview?.weaknesses?.join(" | "),

    // Stats
    // Touches: athlete.stats?.touches,
    // "Successful Passes": athlete.stats?.successfulPasses,
    // "Pass Accuracy": athlete.stats?.passAccuracy,
    // "Tackles Completed": athlete.stats?.tacklesCompleted,
    // Carries: athlete.stats?.carries,
    // Tries: athlete.stats?.tries,

    // Education
    // Education: athlete.education
    //   ?.map(
    //     (e) =>
    //       `${e.name} (${e.field}) ${new Date(e.startYear).getFullYear()}-${new Date(e.endYear).getFullYear()}`,
    //   )
    //   .join(" | "),

    // Achievements
    // Achievements: athlete.achievements
    //   ?.map((a) => `${a.title} - ${a.description}`)
    //   .join(" | "),

    // Media
    // "Media URLs": athlete.media?.join(" | "),

    // Interest Stats
    // "Interest Total": athlete.intrestStats?.total,
    // "Interest Pending": athlete.intrestStats?.pending,
    // "Interest Updated": athlete.intrestStats?.updated,
  };
};

export const formatAthleteForPDF = (athlete) => {
  return {
    basicInfo: {
      id: athlete._id,
      name: athlete.basicInfo?.name || "N/A",
      position: athlete.basicInfo?.position || "N/A",
      gradYear: athlete.basicInfo?.gradYear || "N/A",
      height: athlete.basicInfo?.height || "N/A",
      weight: athlete.basicInfo?.weight || "N/A",
      status: athlete.basicInfo?.status || "N/A",
      email: athlete.basicInfo?.email || "N/A",
      phone: athlete.basicInfo?.phone || "N/A",
      hometown: athlete.basicInfo?.hometown || "N/A",
      dob: formatDate(athlete.basicInfo?.dob) || "N/A",
      schoolName: athlete.basicInfo?.schoolName || "N/A",
      state: athlete.basicInfo?.state || "N/A",
      committedCollege: athlete.basicInfo?.committedCollege?.name || "N/A",
    },
    family: {
      motherName: athlete.family?.motherName || "N/A",
      motherOccupation: athlete.family?.motherOccupation || "N/A",
      motherDob: formatDate(athlete.family?.motherDob) || "N/A",
      motherContact: athlete.family?.motherContact || "N/A",
      fatherName: athlete.family?.fatherName || "N/A",
      fatherOccupation: athlete.family?.fatherOccupation || "N/A",
      fatherDob: formatDate(athlete.family?.fatherDob) || "N/A",
      fatherContact: athlete.family?.fatherContact || "N/A",
      keyInfluences: athlete.family?.keyInfluences || "N/A",
    },
    athletic: {
      otherSports: athlete.athlete?.otherSports || "N/A",
      activities: athlete.athlete?.activities || "N/A",
      coachEvaluation: athlete.athlete?.coachEvaluation || "N/A",
      footballPiScore: athlete.athlete?.footballPiScore || "N/A",
      footballDescription: athlete.athlete?.footballDescription || "N/A",
      personalPiScore: athlete.athlete?.personalPiScore || "N/A",
      personalDescription: athlete.athlete?.personalDescription || "N/A",
      otherInfo: athlete.athlete?.otherInfo || "N/A",
    },
    overview: {
      strengths: athlete.overview?.strengths?.join(", ") || "N/A",
      weaknesses: athlete.overview?.weaknesses?.join(", ") || "N/A",
    },
  };
};

// ============================================================
// generateAthletePDF.js
// Exportable PDF utility for Prospect Intel athlete profiles.
//
// Usage in your component:
//   import { generateAthletePDF } from "./generateAthletePDF";
//   ...
//   <button onClick={() => generateAthletePDF(athleteDetail, formatDate)}>
//     Download PDF
//   </button>
//
// Requires: jsPDF  →  npm install jspdf
// ============================================================

export const generateAthletePDF = async (athleteDetail, formatDate) => {
  console.log("🚀 ~ generateAthletePDF ~ athleteDetail:", athleteDetail);
  if (!athleteDetail) return;

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const PW = doc.internal.pageSize.getWidth(); // 612
  const PH = doc.internal.pageSize.getHeight(); // 792
  const M = 24; // outer margin

  // ── Colour palette ──────────────────────────────────────────
  const NAVY = [10, 36, 99];
  const WHITE = [255, 255, 255];
  const LGRAY = [245, 245, 245];
  const MGRAY = [200, 200, 200];
  const BLACK = [30, 30, 30];
  const CYAN = [0, 174, 239];

  // ── Utility: safe string ────────────────────────────────────
  const val = (v) =>
    v !== undefined && v !== null && v !== "" ? String(v) : "N/A";

  // ── Drawing primitives ──────────────────────────────────────
  const fillRect = (x, y, w, h, rgb) => {
    doc.setFillColor(...rgb);
    doc.rect(x, y, w, h, "F");
  };

  const strokeRect = (x, y, w, h, rgb, lw = 0.5) => {
    doc.setDrawColor(...rgb);
    doc.setLineWidth(lw);
    doc.rect(x, y, w, h, "S");
  };

  // ── Fixed-row table ─────────────────────────────────────────
  // Each row has a fixed height (no text wrapping). Good for short values.
  const drawTable = (x, y, w, title, rows, labelColW = 110) => {
    const rowH = 18;
    const titleH = 22;
    const padding = 6;
    const totalH = titleH + rows.length * rowH;

    strokeRect(x, y, w, totalH, MGRAY, 0.5);
    fillRect(x, y, w, titleH, WHITE);
    doc.setDrawColor(...MGRAY);
    doc.setLineWidth(0.5);
    doc.line(x, y + titleH, x + w, y + titleH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(title, x + padding, y + titleH - 6);

    rows.forEach((row, i) => {
      const ry = y + titleH + i * rowH;
      if (i % 2 === 1) fillRect(x, ry, w, rowH, LGRAY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text(val(row.label), x + padding, ry + rowH - 5);

      doc.setTextColor(...BLACK);
      const valueW = w - labelColW - padding * 2;
      const lines = doc.splitTextToSize(val(row.value), valueW);
      doc.text(lines[0] || "N/A", x + labelColW + padding, ry + rowH - 5);

      doc.setDrawColor(...MGRAY);
      doc.line(x, ry + rowH, x + w, ry + rowH);
    });

    return y + totalH;
  };

  // ── Auto-expanding table ────────────────────────────────────
  // Row height grows to fit wrapped text. Good for long descriptions.
  const drawExpandingTable = (x, y, w, title, rows, labelColW = 110) => {
    const minRowH = 18;
    const titleH = 22;
    const padding = 6;
    const fontSize = 8.5;
    const valueColW = w - labelColW - padding * 2;

    doc.setFontSize(fontSize);
    const rowHeights = rows.map((row) => {
      const lines = doc.splitTextToSize(val(row.value), valueColW);
      return Math.max(minRowH, lines.length * 11 + 6);
    });

    const totalH = titleH + rowHeights.reduce((a, b) => a + b, 0);

    strokeRect(x, y, w, totalH, MGRAY, 0.5);
    fillRect(x, y, w, titleH, WHITE);
    doc.setDrawColor(...MGRAY);
    doc.line(x, y + titleH, x + w, y + titleH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(title, x + padding, y + titleH - 6);

    let ry = y + titleH;
    rows.forEach((row, i) => {
      const rh = rowHeights[i];
      if (i % 2 === 1) fillRect(x, ry, w, rh, LGRAY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(80, 80, 80);
      doc.text(val(row.label), x + padding, ry + 12);

      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(val(row.value), valueColW);
      doc.text(lines, x + labelColW + padding, ry + 12);

      doc.setDrawColor(...MGRAY);
      doc.line(x, ry + rh, x + w, ry + rh);
      ry += rh;
    });

    return y + totalH;
  };

  // ── GPA highlight bar ───────────────────────────────────────
  const drawGPABar = (x, y, w, gpaValue) => {
    const barH = 26;
    strokeRect(x, y, w, barH, MGRAY, 0.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text("GPA", x + 6, y + 17);

    doc.setFontSize(14);
    doc.setTextColor(...NAVY);
    doc.text(val(gpaValue), x + w - 6, y + 17, { align: "right" });

    return y + barH;
  };

  // ────────────────────────────────────────────────────────────
  // 1. HEADER BAR
  // ────────────────────────────────────────────────────────────
  const HEADER_H = 36;
  fillRect(0, 0, PW, HEADER_H, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...WHITE);
  doc.text("PROSPECT INTEL PLAYER PROFILE", PW / 2, HEADER_H / 2 + 5, {
    align: "center",
  });

  // ────────────────────────────────────────────────────────────
  // 2. TOP SECTION  (photo + logo  |  Athlete Profile table)
  // ────────────────────────────────────────────────────────────
  const TOP_Y = HEADER_H + 12;
  const PHOTO_W = 120;
  const PHOTO_H = 140;

  // --- Athlete photo ---
  const athleteImage = athleteDetail?.basicInfo?.image;

  if (athleteImage) {
    try {
      const response = await axiosinstance.post("/user/buffer/s3", {
        s3Url: athleteImage,
      });

      // ✅ Correctly access the nested buffer array: response.data.data.data
      const bufferArray = response?.data?.data?.data;

      if (!bufferArray || !bufferArray.length)
        throw new Error("Invalid buffer");

      // Convert to base64 (chunked to avoid call stack overflow)
      const uint8Array = new Uint8Array(bufferArray);
      let binary = "";
      const chunkSize = 0x8000;

      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
      }

      const base64 = `data:image/jpeg;base64,${btoa(binary)}`;

      strokeRect(M, TOP_Y, PHOTO_W, PHOTO_H, MGRAY, 1);
      doc.addImage(base64, "JPEG", M, TOP_Y, PHOTO_W, PHOTO_H);
    } catch (error) {
      console.error("Image load failed:", error);

      // Fallback placeholder
      strokeRect(M, TOP_Y, PHOTO_W, PHOTO_H, MGRAY, 1);
      fillRect(M, TOP_Y, PHOTO_W, PHOTO_H, [230, 230, 230]);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Athlete Photo Not Provided",
        M + PHOTO_W / 2,
        TOP_Y + PHOTO_H / 2,
        { align: "center" },
      );
    }
  } else {
    // No image — show placeholder box
    strokeRect(M, TOP_Y, PHOTO_W, PHOTO_H, MGRAY, 1);
    fillRect(M, TOP_Y, PHOTO_W, PHOTO_H, [230, 230, 230]);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Athlete Photo", M + PHOTO_W / 2, TOP_Y + PHOTO_H / 2, {
      align: "center",
    });
  }
  // To embed a real photo (base64):
  // const photoData = athleteDetail?.basicInfo?.photoBase64;
  // if (photoData) doc.addImage(photoData, "JPEG", M, TOP_Y, PHOTO_W, PHOTO_H);

  // --- PI Shield logo ---
  const LOGO_X = M + PHOTO_W + 10;
  const LOGO_Y = TOP_Y + 10;

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const logoBase64 = await getBase64FromUrl(prospectLogo);
  doc.addImage(logoBase64, "PNG", LOGO_X, LOGO_Y, 90, 90);

  // --- Athlete Profile table (top right) ---
  const RIGHT_X = PW / 2 + 4;
  const RIGHT_W = PW - RIGHT_X - M;

  const siblings = athleteDetail?.family?.siblings;

  const formattedSiblings =
    siblings && siblings.length > 0
      ? siblings
          .map((s) => {
            const name = s.name || "Unknown";
            const type = s.type || "";
            const dob = s.dob ? ` (DOB: ${formatDate(s.dob)})` : "";
            return `${type}: ${name}${dob}`;
          })
          .join(", ")
      : "N/A";

  const athleteProfileRows = [
    { label: "Name", value: athleteDetail?.basicInfo?.name },
    { label: "HS", value: athleteDetail?.basicInfo?.schoolName },
    { label: "State", value: athleteDetail?.basicInfo?.state },
    { label: "Grad Year", value: athleteDetail?.basicInfo?.gradYear },
    { label: "Position", value: athleteDetail?.basicInfo?.position },
    { label: "Ht", value: athleteDetail?.basicInfo?.height },
    { label: "Wt", value: athleteDetail?.basicInfo?.weight },
  ];
  drawTable(RIGHT_X, TOP_Y, RIGHT_W, "Athlete Profile", athleteProfileRows, 80);

  // ────────────────────────────────────────────────────────────
  // 3. BOTTOM SECTION
  //    Left  → Family Background
  //    Right → GPA bar  +  Athletic Background
  // ────────────────────────────────────────────────────────────
  const BOT_Y = TOP_Y + PHOTO_H + 20;
  const LEFT_W = PW / 2 - M - 8;
  const BRIGHT_X = PW / 2 + 4;
  const BRIGHT_W = PW - BRIGHT_X - M;

  // --- Family Background (bottom left) ---
  const familyRows = [
    { label: "Mom", value: athleteDetail?.family?.motherName },
    {
      label: "Mom's Occupation",
      value: athleteDetail?.family?.motherOccupation,
    },
    {
      label: "Mom's contact info",
      value: athleteDetail?.family?.motherContact,
    },
    {
      label: "Mom's information",
      value: athleteDetail?.family?.motherDob
        ? `DOB- ${formatDate(athleteDetail.family.motherDob)}`
        : "N/A",
    },
    { label: "Dad", value: athleteDetail?.family?.fatherName },
    {
      label: "Dad's Occupation",
      value: athleteDetail?.family?.fatherOccupation,
    },
    {
      label: "Dad's contact info",
      value: athleteDetail?.family?.fatherContact,
    },
    { label: "Siblings", value: formattedSiblings },
    { label: "Key Influences", value: athleteDetail?.family?.keyInfluences },
    {
      label: "Other info",
      value:
        athleteDetail?.family?.otherInfo || athleteDetail?.athlete?.otherInfo,
    },
  ];
  drawExpandingTable(M, BOT_Y, LEFT_W, "Family Background", familyRows, 110);

  // --- GPA bar (bottom right, above Athletic Background) ---
  const gpaValue = athleteDetail?.basicInfo?.gpa || athleteDetail?.athlete?.gpa;
  const afterGPA = drawGPABar(BRIGHT_X, BOT_Y, BRIGHT_W, gpaValue) + 10;

  // --- Athletic Background (bottom right, below GPA) ---
  const athleticRows = [
    { label: "Other sports", value: athleteDetail?.athlete?.otherSports },
    { label: "Other activities", value: athleteDetail?.athlete?.activities },
    {
      label: "Comments from other coaches",
      value: athleteDetail?.athlete?.coachEvaluation,
    },
  ];
  drawExpandingTable(
    BRIGHT_X,
    afterGPA,
    BRIGHT_W,
    "Athletic Background",
    athleticRows,
    130,
  );

  // ────────────────────────────────────────────────────────────
  // 4. FOOTER
  // ────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, M, PH - 12);
  doc.text("PROSPECT INTEL — CONFIDENTIAL", PW - M, PH - 12, {
    align: "right",
  });

  // ────────────────────────────────────────────────────────────
  // PAGE 2 — Overview & Grading Scale
  // ────────────────────────────────────────────────────────────
  doc.addPage();
  let p2Y = M;

  // ── Grade helpers ───────────────────────────────────────────
  const normalizeGrade = (score) => {
    if (!score) return null;

    const grade = String(score).trim().toUpperCase();

    // ✅ Extract only first letter (A, B, C, D, F)
    return grade.charAt(0);
  };

  const gradeDescriptions = {
    A: "Elite. Has outstanding character with no clear character flaws. Will clearly stand out among his teammates. Strong positive influence. He will likely overcome potential deficiencies due to this outstanding component.",
    B: "Good. Displays solid overall character characteristics. Teammates and coaches will notice his positive traits during normal interactions with this player. Could overcome potential deficiencies in some areas.",
    C: "Adequate/Blend In. Not necessarily a negative, but unlikely to be a positive. Average in all characteristics for the most part. This prospect possesses characteristics to survive and get by. He will not add or subtract to the culture.",
    D: "Has a character deficiency. He may display negative character in flashes. May not be fatal character but will likely limit his ability to perform and develop. Teammates and coaches will notice deficiencies.",
    F: "Fatal characteristics. Will likely fail at the next level and likely to be a distraction to his teammates and coaches.",
  };

  const gradeColors = {
    A: [0, 0, 0], // black
    B: [29, 184, 99], // green
    C: [181, 181, 181], // gray
    D: [249, 201, 51], // yellow
    F: [255, 58, 58], // red
  };

  const gradeLabels = {
    A: "Elite",
    B: "Good",
    C: "Adequate / Blend In",
    D: "Character Deficiency",
    F: "Fatal Characteristics",
  };

  const getGradeColor = (score) =>
    gradeColors[normalizeGrade(score)] || [181, 181, 181];

  // ── Helper: wrapped text block, returns new y ───────────────
  const textBlock = (text, x, y, maxW, size, color, style = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text || ""), maxW);
    doc.text(lines, x, y);
    return y + lines.length * (size * 1.35);
  };

  // ════════════════════════════════════════════════════════════
  // SECTION 1 — OVERVIEW
  // ════════════════════════════════════════════════════════════

  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...BLACK);
  doc.text("Overview", PW / 2, p2Y + 14, { align: "center" });
  p2Y += 30;

  const OV_W = (PW - M * 2 - 10) / 2; // each panel width
  const OV_RX = M + OV_W + 10; // right panel x
  const OV_PAD = 10;

  // Measure both lists to get panel height
  const strengths = athleteDetail?.overview?.strengths || [];
  const weaknesses = athleteDetail?.overview?.weaknesses || [];
  const listItemH = 16;
  const OV_H = Math.max(strengths.length, weaknesses.length) * listItemH + 50;

  // Left panel — STRENGTH
  strokeRect(M, p2Y, OV_W, OV_H, MGRAY, 0.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BLACK);
  doc.text("STRENGTH", M + OV_W / 2, p2Y + 18, { align: "center" });
  doc.setDrawColor(...MGRAY);
  doc.line(M, p2Y + 24, M + OV_W, p2Y + 24);

  if (strengths.length > 0) {
    strengths.forEach((item, i) => {
      const iy = p2Y + 38 + i * listItemH;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235); // blue bullet ✦
      doc.text("✦", M + OV_PAD, iy);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(item, OV_W - OV_PAD * 2 - 12);
      doc.text(lines, M + OV_PAD + 12, iy);
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(150, 150, 150);
    doc.text("No strengths listed.", M + OV_PAD, p2Y + 38);
  }

  // Right panel — WEAKNESS
  strokeRect(OV_RX, p2Y, OV_W, OV_H, MGRAY, 0.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BLACK);
  doc.text("WEAKNESS", OV_RX + OV_W / 2, p2Y + 18, { align: "center" });
  doc.setDrawColor(...MGRAY);
  doc.line(OV_RX, p2Y + 24, OV_RX + OV_W, p2Y + 24);

  if (weaknesses.length > 0) {
    weaknesses.forEach((item, i) => {
      const iy = p2Y + 38 + i * listItemH;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(239, 68, 68); // red bullet ✚
      doc.text("✚", OV_RX + OV_PAD, iy);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(item, OV_W - OV_PAD * 2 - 12);
      doc.text(lines, OV_RX + OV_PAD + 12, iy);
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(150, 150, 150);
    doc.text("No weaknesses listed.", OV_RX + OV_PAD, p2Y + 38);
  }

  p2Y += OV_H + 30;

  // ════════════════════════════════════════════════════════════
  // SECTION 2 — GRADING SCALE
  // ════════════════════════════════════════════════════════════

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...BLACK);
  doc.text("Grading Scale", PW / 2, p2Y + 14, { align: "center" });
  p2Y += 30;

  const footballScore = athleteDetail?.athlete?.footballPiScore;
  const personalScore = athleteDetail?.athlete?.personalPiScore;

  const CARD_W = (PW - M * 2 - 10) / 2;
  const CARD_H = 110;
  const BADGE_SIZE = 32;
  const C_PAD = 12;

  // ── Draw a grading card (Football / Personal) ───────────────
  const drawGradeCard = (x, y, w, h, score, title) => {
    const bgColor = getGradeColor(score);
    const grade = normalizeGrade(score);
    const isDark = grade === "D"; // yellow card → black text
    const textClr = isDark ? BLACK : WHITE;

    // Background
    fillRect(x, y, w, h, bgColor);
    strokeRect(x, y, w, h, bgColor, 0);

    // Badge (nested squares like the UI)
    const bx = x + w / 2 - BADGE_SIZE / 2;
    const by = y + C_PAD;
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1.5);
    doc.rect(bx, by, BADGE_SIZE, BADGE_SIZE, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...textClr);
    doc.text(grade || "?", x + w / 2, by + BADGE_SIZE / 2 + 5, {
      align: "center",
    });

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...textClr);
    doc.text(title, x + w / 2, y + C_PAD + BADGE_SIZE + 16, {
      align: "center",
    });

    // Description

    const desc =
      gradeDescriptions[grade] ||
      (title === "Football Character"
        ? athleteDetail?.athlete?.footballDescription
        : athleteDetail?.athlete?.personalDescription) ||
      "";

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textClr);
    const descLines = doc.splitTextToSize(desc, w - C_PAD * 2);
    doc.text(descLines, x + w / 2, y + C_PAD + BADGE_SIZE + 30, {
      align: "center",
    });
  };

  drawGradeCard(M, p2Y, CARD_W, CARD_H, footballScore, "Football Character");
  drawGradeCard(
    M + CARD_W + 10,
    p2Y,
    CARD_W,
    CARD_H,
    personalScore,
    "Personal Character",
  );

  p2Y += CARD_H + 20;

  // ── Grade reference scale (5 tiles: A B C D F) ─────────────
  const grades = ["A", "B", "C", "D", "F"];
  const tileCount = grades.length;
  const TILE_GAP = 6;
  const TILE_W = (PW - M * 2 - TILE_GAP * (tileCount - 1)) / tileCount;
  const TILE_H = 130;

  grades.forEach((grade, idx) => {
    const tx = M + idx * (TILE_W + TILE_GAP);
    const ty = p2Y;
    const bgClr = gradeColors[grade];
    const isDark = grade === "D";
    const txtClr = isDark ? BLACK : WHITE;

    // Tile background
    fillRect(tx, ty, TILE_W, TILE_H, bgClr);

    // Badge
    const bx = tx + TILE_W / 2 - 14;
    const by = ty + 8;
    doc.setDrawColor(...WHITE);
    doc.setLineWidth(1);
    doc.rect(bx, by, 28, 28, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...txtClr);
    doc.text(grade, tx + TILE_W / 2, by + 20, { align: "center" });

    // Grade label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...txtClr);
    doc.text(gradeLabels[grade], tx + TILE_W / 2, ty + 46, { align: "center" });

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...txtClr);
    const dLines = doc.splitTextToSize(gradeDescriptions[grade], TILE_W - 8);
    doc.text(dLines, tx + TILE_W / 2, ty + 58, { align: "center" });
  });

  p2Y += TILE_H + 20;

  // ── Page 2 footer ───────────────────────────────────────────
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, M, PH - 12);
  doc.text("PROSPECT INTEL — CONFIDENTIAL", PW - M, PH - 12, {
    align: "right",
  });

  // ── Save ────────────────────────────────────────────────────
  doc.save(`${athleteDetail?.basicInfo?.name || "Athlete_Profile"}.pdf`);
};
