import { jsPDF } from "jspdf";
import { prospectLogo } from "../assets/export";
import axiosinstance from "../axios";

// All the helper functions should must be there.
// The functions that you're using multiple times must be there.
// e.g. formatDateToMMDDYYYY, formatEpochToMMDDYYYY, etc.
export const formatDate = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "N/A";

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
  if (!athleteDetail) return;

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const PW = doc.internal.pageSize.getWidth(); // 612
  const PH = doc.internal.pageSize.getHeight(); // 792
  const M = 24; // outer margin
  const FOOTER_H = 20; // reserved at page bottom

  // ── Colour palette ──────────────────────────────────────────
  const NAVY = [10, 36, 99];
  const WHITE = [255, 255, 255];
  const LGRAY = [245, 245, 245];
  const MGRAY = [200, 200, 200];
  const BLACK = [30, 30, 30];
  const CYAN = [0, 174, 239];

  // ── Safe string ─────────────────────────────────────────────
  const val = (v) =>
    v !== undefined && v !== null && v !== "" ? String(v) : "N/A";

  // ── Drawing primitives ───────────────────────────────────────
  const fillRect = (x, y, w, h, rgb) => {
    doc.setFillColor(...rgb);
    doc.rect(x, y, w, h, "F");
  };
  const strokeRect = (x, y, w, h, rgb, lw = 0.5) => {
    doc.setDrawColor(...rgb);
    doc.setLineWidth(lw);
    doc.rect(x, y, w, h, "S");
  };

  // ── Page header (repeated on every page) ─────────────────────
  const HEADER_H = 36;
  const addPageHeader = () => {
    fillRect(0, 0, PW, HEADER_H, NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...WHITE);
    doc.text("PROSPECT INTEL PLAYER PROFILE", PW / 2, HEADER_H / 2 + 5, {
      align: "center",
    });
  };

  // ── Footer ───────────────────────────────────────────────────
  const addPageFooter = () => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, M, PH - 10);
    doc.text("PROSPECT INTEL — CONFIDENTIAL", PW - M, PH - 10, {
      align: "right",
    });
  };

  // ── Overflow guard ───────────────────────────────────────────
  // Call BEFORE drawing any block. If block won't fit, flush footer,
  // add a new page, draw the header, and return the reset cursor Y.
  const ensureSpace = (currentY, neededH) => {
    if (currentY + neededH > PH - FOOTER_H - M) {
      addPageFooter();
      doc.addPage();
      addPageHeader();
      return HEADER_H + 12;
    }
    return currentY;
  };

  // ── Fixed-row table (short values) ──────────────────────────
  const calcTableH = (rows) => 22 + rows.length * 18;

  const drawTable = (x, y, w, title, rows, labelColW = 110) => {
    const rowH = 18;
    const titleH = 22;
    const pad = 6;
    const totalH = titleH + rows.length * rowH;

    strokeRect(x, y, w, totalH, MGRAY, 0.5);
    fillRect(x, y, w, titleH, WHITE);
    doc.setDrawColor(...MGRAY);
    doc.setLineWidth(0.5);
    doc.line(x, y + titleH, x + w, y + titleH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(title, x + pad, y + titleH - 6);

    rows.forEach((row, i) => {
      const ry = y + titleH + i * rowH;
      if (i % 2 === 1) fillRect(x, ry, w, rowH, LGRAY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text(val(row.label), x + pad, ry + rowH - 5);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(
        val(row.value),
        w - labelColW - pad * 2,
      );
      doc.text(lines[0] || "N/A", x + labelColW + pad, ry + rowH - 5);
      doc.setDrawColor(...MGRAY);
      doc.line(x, ry + rowH, x + w, ry + rowH);
    });

    return y + totalH;
  };

  // ── Auto-expanding table (wrapping values) ───────────────────
  const calcExpandingTableH = (w, rows, labelColW = 110) => {
    const pad = 6;
    const valueColW = w - labelColW - pad * 2;
    const rowHeights = rows.map((row) => {
      const lines = doc.splitTextToSize(val(row.value), valueColW);
      return Math.max(18, lines.length * 11 + 6);
    });
    return 22 + rowHeights.reduce((a, b) => a + b, 0);
  };

  const drawExpandingTable = (x, y, w, title, rows, labelColW = 110) => {
    const titleH = 22;
    const pad = 6;
    const fontSize = 8.5;
    const valueColW = w - labelColW - pad * 2;

    doc.setFontSize(fontSize);
    const rowHeights = rows.map((row) => {
      const lines = doc.splitTextToSize(val(row.value), valueColW);
      return Math.max(18, lines.length * 11 + 6);
    });
    const totalH = titleH + rowHeights.reduce((a, b) => a + b, 0);

    strokeRect(x, y, w, totalH, MGRAY, 0.5);
    fillRect(x, y, w, titleH, WHITE);
    doc.setDrawColor(...MGRAY);
    doc.line(x, y + titleH, x + w, y + titleH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(title, x + pad, y + titleH - 6);

    let ry = y + titleH;
    rows.forEach((row, i) => {
      const rh = rowHeights[i];
      if (i % 2 === 1) fillRect(x, ry, w, rh, LGRAY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(80, 80, 80);
      doc.text(val(row.label), x + pad, ry + 12);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(val(row.value), valueColW);
      doc.text(lines, x + labelColW + pad, ry + 12);
      doc.setDrawColor(...MGRAY);
      doc.line(x, ry + rh, x + w, ry + rh);
      ry += rh;
    });

    return y + totalH;
  };

  // ── GPA bar ──────────────────────────────────────────────────
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

  const calcKeyInfluenceH = (w, value) => {
    const pad = 8;
    const titleH = 22;
    const bodyW = w - pad * 2;
    doc.setFontSize(8.5);
    const lines = doc.splitTextToSize(val(value), bodyW);
    const bodyH = Math.max(18, lines.length * 11 + 12);
    return titleH + bodyH;
  };

  // const drawKeyInfluence = (x, y, w, value) => {
  //   const pad = 8;
  //   const titleH = 22;
  //   const fontSize = 8.5;
  //   const bodyW = w - pad * 2;

  //   doc.setFontSize(fontSize);
  //   const lines = doc.splitTextToSize(val(value), bodyW);
  //   const bodyH = Math.max(18, lines.length * 11 + 12);
  //   const totalH = titleH + bodyH;

  //   // ── Outer border ──
  //   strokeRect(x, y, w, totalH, MGRAY, 0.5);

  //   // ── Title row ──
  //   fillRect(x, y, w, titleH, WHITE);
  //   doc.setDrawColor(...MGRAY);
  //   doc.line(x, y + titleH, x + w, y + titleH);
  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(11);
  //   doc.setTextColor(...BLACK);
  //   doc.text("Key Influences", x + pad, y + titleH - 6);

  //   // ── Body text ──
  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(fontSize);
  //   doc.setTextColor(80, 80, 80);
  //   doc.text(lines, x + pad, y + titleH + 11);

  //   return y + totalH;
  // };

  // ════════════════════════════════════════════════════════════
  // PAGE 1
  // ════════════════════════════════════════════════════════════
  addPageHeader();

  // ── Top section: photo + logo  |  Athlete Profile ────────────
  const TOP_Y = HEADER_H + 12;
  const PHOTO_W = 120;
  const PHOTO_H = 140;

  // Athlete photo
  const athleteImage = athleteDetail?.basicInfo?.image;
  if (athleteImage) {
    try {
      const response = await axiosinstance.post("/user/buffer/s3", {
        s3Url: athleteImage,
      });
      const bufferArray = response?.data?.data?.data;
      if (!bufferArray || !bufferArray.length)
        throw new Error("Invalid buffer");

      const uint8Array = new Uint8Array(bufferArray);
      let binary = "";
      const chunkSize = 0x8000;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        binary += String.fromCharCode(...uint8Array.subarray(i, i + chunkSize));
      }
      const base64 = `data:image/jpeg;base64,${btoa(binary)}`;
      strokeRect(M, TOP_Y, PHOTO_W, PHOTO_H, MGRAY, 1);
      doc.addImage(base64, "JPEG", M, TOP_Y, PHOTO_W, PHOTO_H);
    } catch {
      strokeRect(M, TOP_Y, PHOTO_W, PHOTO_H, MGRAY, 1);
      fillRect(M, TOP_Y, PHOTO_W, PHOTO_H, [230, 230, 230]);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Athlete Photo Not Provided",
        M + PHOTO_W / 2,
        TOP_Y + PHOTO_H / 2,
        {
          align: "center",
        },
      );
    }
  } else {
    strokeRect(M, TOP_Y, PHOTO_W, PHOTO_H, MGRAY, 1);
    fillRect(M, TOP_Y, PHOTO_W, PHOTO_H, [230, 230, 230]);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Athlete Photo", M + PHOTO_W / 2, TOP_Y + PHOTO_H / 2, {
      align: "center",
    });
  }

  // PI logo
  try {
    const getBase64FromUrl = async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
    const logoBase64 = await getBase64FromUrl(prospectLogo);
    doc.addImage(logoBase64, "PNG", M + PHOTO_W + 10, TOP_Y + 10, 90, 90);
  } catch {
    // silent — logo is cosmetic
  }

  // Athlete Profile table (top right)
  const RIGHT_X = PW / 2 + 4;
  const RIGHT_W = PW - RIGHT_X - M;

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

  // ── Siblings formatting ───────────────────────────────────────
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

  // ── Row data ─────────────────────────────────────────────────
  const LEFT_W = PW / 2 - M - 8;
  const BRIGHT_X = PW / 2 + 4;
  const BRIGHT_W = PW - BRIGHT_X - M;

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
    // {
    //   label: "Other info",
    //   value:
    //     athleteDetail?.family?.otherInfo || athleteDetail?.athlete?.otherInfo,
    // },
  ];

  const athleticRows = [
    { label: "Other sports", value: athleteDetail?.athlete?.otherSports },
    { label: "Other activities", value: athleteDetail?.athlete?.activities },
    {
      label: "Comments from other coaches",
      value: athleteDetail?.athlete?.coachEvaluation,
    },
  ];

  const gpaValue = athleteDetail?.basicInfo?.gpa || athleteDetail?.athlete?.gpa;
  // const keyInfluenceValue = athleteDetail?.family?.keyInfluences || "N/A";

  // Pre-calculate column heights so we advance Y past the TALLER column
  const familyH = calcExpandingTableH(LEFT_W, familyRows, 110);
  const athleticH = calcExpandingTableH(BRIGHT_W, athleticRows, 130);
  const GPA_BAR_H = 36; // bar + gap
  const rightColH = GPA_BAR_H + athleticH;
  const twoColH = Math.max(familyH, rightColH);

  // Ensure the two-column block fits; page-break if needed
  let currentY = TOP_Y + PHOTO_H + 20;
  currentY = ensureSpace(currentY, twoColH);

  // Draw both columns at the same Y
  drawExpandingTable(M, currentY, LEFT_W, "Family Background", familyRows, 110);
  const afterGPA = drawGPABar(BRIGHT_X, currentY, BRIGHT_W, gpaValue) + 10;

  // const afterCGPA =
  //   drawKeyInfluence(BRIGHT_X, afterGPA, BRIGHT_W, keyInfluenceValue) + 10;

  drawExpandingTable(
    BRIGHT_X,
    afterGPA,
    // afterCGPA,
    BRIGHT_W,
    "Athletic Background",
    athleticRows,
    130,
  );

  // drawExpandingTable(
  //   BRIGHT_X,
  //   afterGPA,
  //   // afterCGPA,
  //   BRIGHT_W,
  //   "Athletic Background",
  //   athleticRows,
  //   130,
  // );

  // Advance past the taller column
  currentY += twoColH + 16;

  // ── Football & Personal Character (side by side) ──────────────
  // ── Character Table with PI Score Badge ─────────────────────
  const getPiScoreColors = (score) => {
    const grade = score?.charAt(0)?.toUpperCase();
    if (grade === "A") return { bg: [19, 18, 18], text: [255, 255, 255] };
    if (grade === "B") return { bg: [29, 184, 99], text: [255, 255, 255] };
    if (grade === "C") return { bg: [144, 144, 144], text: [255, 255, 255] };
    if (grade === "D") return { bg: [249, 201, 51], text: [255, 255, 255] };
    if (grade === "F") return { bg: [255, 58, 58], text: [255, 255, 255] };
    return { bg: [156, 163, 175], text: [255, 255, 255] }; // gray-400 fallback
  };

  const calcCharTableH = (w, rows) => {
    const pad = 6;
    const fontSize = 8.5;
    doc.setFontSize(fontSize);
    const bodyW = w - pad * 2;
    const rowHeights = rows.map((row) => {
      const lines = doc.splitTextToSize(val(row.value), bodyW);
      return Math.max(18, lines.length * 11 + 12);
    });
    return 26 + rowHeights.reduce((a, b) => a + b, 0);
  };

  const drawCharTable = (x, y, w, title, rows) => {
    const titleH = 26;
    const pad = 8;
    const fontSize = 8.5;

    doc.setFontSize(fontSize);
    const bodyW = w - pad * 2;

    const rowHeights = rows.map((row) => {
      const lines = doc.splitTextToSize(val(row.value), bodyW);
      return Math.max(18, lines.length * 11 + 12);
    });
    const totalH = titleH + rowHeights.reduce((a, b) => a + b, 0);

    // ── Outer border ──
    strokeRect(x, y, w, totalH, MGRAY, 0.5);

    // ── Title row background ──
    fillRect(x, y, w, titleH, WHITE);
    doc.setDrawColor(...MGRAY);
    doc.line(x, y + titleH, x + w, y + titleH);

    // ── Title text ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(title, x + pad, y + titleH - 7);

    // ── PI Score badge (flex-end, vertically centered in title row) ──
    const piScore = rows[0]?.piValue;
    if (piScore) {
      const colors = getPiScoreColors(piScore);

      const badgePadX = 6;
      const badgePadY = 3;
      const labelText = "PI Score";
      const scoreText = String(piScore);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      const labelW = doc.getTextWidth(labelText);

      doc.setFontSize(11);
      const scoreW = doc.getTextWidth(scoreText);

      const innerGap = 5;
      const badgeW = badgePadX * 2 + labelW + innerGap + scoreW;
      const badgeH = 18;
      const badgeX = x + w - badgeW - pad;
      const badgeY = y + (titleH - badgeH) / 2;

      // Badge background
      doc.setFillColor(...colors.bg);
      doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 3, 3, "F");

      // "PI Score" small label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...colors.text);
      doc.text(labelText, badgeX + badgePadX, badgeY + badgeH - 5);

      // Score value larger
      doc.setFontSize(11);
      doc.text(
        scoreText,
        badgeX + badgePadX + labelW + innerGap,
        badgeY + badgeH - 4,
      );
    }

    // ── Body rows ──
    let ry = y + titleH;
    rows.forEach((row, i) => {
      const rh = rowHeights[i];
      if (i % 2 === 1) fillRect(x, ry, w, rh, LGRAY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(80, 80, 80);

      const lines = doc.splitTextToSize(val(row.value), bodyW);
      doc.text(lines, x + pad, ry + 12);

      doc.setDrawColor(...MGRAY);
      doc.line(x, ry + rh, x + w, ry + rh);
      ry += rh;
    });

    return y + totalH;
  };

  // ── Football & Personal Character (side by side) ──────────────
  const charW = (PW - M * 2 - 10) / 2;

  const footballRows = [
    {
      label: "Football Character",
      value: athleteDetail?.athlete?.footballDescription,
      piValue: athleteDetail?.athlete?.footballPiScore,
    },
  ];
  const personalRows = [
    {
      label: "Personal Character",
      value: athleteDetail?.athlete?.personalDescription,
      piValue: athleteDetail?.athlete?.personalPiScore,
    },
  ];

  // Use new calc function for accurate height
  const charBlockH = Math.max(
    calcCharTableH(charW, footballRows),
    calcCharTableH(charW, personalRows),
  );

  currentY = ensureSpace(currentY, charBlockH);

  // Use new draw function
  drawCharTable(M, currentY, charW, "Football Character", footballRows);
  drawCharTable(
    M + charW + 10,
    currentY,
    charW,
    "Personal Character",
    personalRows,
  );

  currentY += charBlockH + 16;

  // ── Other Relevant Information ────────────────────────────────
  const otherRows = [
    {
      label: "Other Relevant Information",
      value: athleteDetail?.athlete?.otherInfo,
    },
  ];
  const otherH = calcExpandingTableH(PW - M * 2, otherRows, 120);

  currentY = ensureSpace(currentY, otherH);
  drawExpandingTable(
    M,
    currentY,
    PW - M * 2,
    "Other Relevant Information",
    otherRows,
    120,
  );

  // Page 1 footer
  addPageFooter();

  // ════════════════════════════════════════════════════════════
  // PAGE 2 — Overview & Grading Scale
  // ════════════════════════════════════════════════════════════
  doc.addPage();
  addPageHeader();
  let p2Y = HEADER_H + 20;

  // ── Grade helpers ────────────────────────────────────────────
  const normalizeGrade = (score) => {
    if (!score) return null;
    return String(score).trim().toUpperCase().charAt(0);
  };

  const gradeDescriptions = {
    A: "Elite. Has outstanding character with no clear character flaws. Will clearly stand out among his teammates. Strong positive influence. He will likely overcome potential deficiencies due to this outstanding component.",
    B: "Good. Displays solid overall character characteristics. Teammates and coaches will notice his positive traits during normal interactions with this player. Could overcome potential deficiencies in some areas.",
    C: "Adequate/Blend In. Not necessarily a negative, but unlikely to be a positive. Average in all characteristics for the most part. This prospect possesses characteristics to survive and get by. He will not add or subtract to the culture.",
    D: "Has a character deficiency. He may display negative character in flashes. May not be fatal character but will likely limit his ability to perform and develop. Teammates and coaches will notice deficiencies.",
    F: "Fatal characteristics. Will likely fail at the next level and likely to be a distraction to his teammates and coaches.",
  };

  const gradeColors = {
    A: [0, 0, 0],
    B: [29, 184, 99],
    C: [181, 181, 181],
    D: [249, 201, 51],
    F: [255, 58, 58],
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

  // ── Overview ─────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...BLACK);
  doc.text("Overview", PW / 2, p2Y + 14, { align: "center" });
  p2Y += 30;

  const OV_W = (PW - M * 2 - 10) / 2;
  const OV_RX = M + OV_W + 10;
  const OV_PAD = 10;

  const strengths = athleteDetail?.overview?.strengths || [];
  const weaknesses = athleteDetail?.overview?.weaknesses || [];
  const listItemH = 16;

  // Accurately measure panel height including wrapped items
  doc.setFontSize(8.5);
  const measureListH = (items) =>
    items.reduce(
      (total, item) => {
        const lines = doc.splitTextToSize(item, OV_W - OV_PAD * 2 - 12);
        return total + Math.max(listItemH, lines.length * 11 + 4);
      },
      50, // header + top padding
    );

  const OV_H = Math.max(
    strengths.length > 0 ? measureListH(strengths) : 66,
    weaknesses.length > 0 ? measureListH(weaknesses) : 66,
  );

  p2Y = ensureSpace(p2Y, OV_H);

  // Strength panel
  strokeRect(M, p2Y, OV_W, OV_H, MGRAY, 0.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BLACK);
  doc.text("STRENGTH", M + OV_W / 2, p2Y + 18, { align: "center" });
  doc.setDrawColor(...MGRAY);
  doc.line(M, p2Y + 24, M + OV_W, p2Y + 24);

  if (strengths.length > 0) {
    let sy = p2Y + 38;
    strengths.forEach((item) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text("✚", M + OV_PAD, sy);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(item, OV_W - OV_PAD * 2 - 12);
      doc.text(lines, M + OV_PAD + 12, sy);
      sy += Math.max(listItemH, lines.length * 11 + 4);
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(150, 150, 150);
    doc.text("No strengths listed.", M + OV_PAD, p2Y + 38);
  }

  // Weakness panel
  strokeRect(OV_RX, p2Y, OV_W, OV_H, MGRAY, 0.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BLACK);
  doc.text("WEAKNESS", OV_RX + OV_W / 2, p2Y + 18, { align: "center" });
  doc.setDrawColor(...MGRAY);
  doc.line(OV_RX, p2Y + 24, OV_RX + OV_W, p2Y + 24);

  if (weaknesses.length > 0) {
    let wy = p2Y + 38;
    weaknesses.forEach((item) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(239, 68, 68);
      doc.text("✚", OV_RX + OV_PAD, wy);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(item, OV_W - OV_PAD * 2 - 12);
      doc.text(lines, OV_RX + OV_PAD + 12, wy);
      wy += Math.max(listItemH, lines.length * 11 + 4);
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(150, 150, 150);
    doc.text("No weaknesses listed.", OV_RX + OV_PAD, p2Y + 38);
  }

  p2Y += OV_H + 30;

  // ── Grading Scale ────────────────────────────────────────────
  p2Y = ensureSpace(p2Y, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...BLACK);
  doc.text("Grading Scale", PW / 2, p2Y + 14, { align: "center" });
  p2Y += 30;

  const footballScore = athleteDetail?.athlete?.footballPiScore;
  const personalScore = athleteDetail?.athlete?.personalPiScore;
  const CARD_W = (PW - M * 2 - 10) / 2;
  const CARD_H = 120;
  const BADGE_SZ = 32;
  const C_PAD = 12;

  p2Y = ensureSpace(p2Y, CARD_H);

  const drawGradeCard = (x, y, w, h, score, title) => {
    const bgColor = getGradeColor(score);
    const grade = normalizeGrade(score);
    const isDark = grade === "D";
    const textClr = isDark ? BLACK : WHITE;

    fillRect(x, y, w, h, bgColor);

    const bx = x + w / 2 - BADGE_SZ / 2;
    const by = y + C_PAD;
    doc.setDrawColor(...WHITE);
    doc.setLineWidth(1.5);
    doc.rect(bx, by, BADGE_SZ, BADGE_SZ, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...textClr);
    doc.text(grade || "?", x + w / 2, by + BADGE_SZ / 2 + 6, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...textClr);
    doc.text(title, x + w / 2, y + C_PAD + BADGE_SZ + 18, { align: "center" });

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
    doc.text(descLines, x + w / 2, y + C_PAD + BADGE_SZ + 32, {
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

  // ── Reference tiles A–F ──────────────────────────────────────
  const grades = ["A", "B", "C", "D", "F"];
  const TILE_GAP = 6;
  const TILE_W = (PW - M * 2 - TILE_GAP * (grades.length - 1)) / grades.length;
  const TILE_H = 140;

  p2Y = ensureSpace(p2Y, TILE_H);

  grades.forEach((grade, idx) => {
    const tx = M + idx * (TILE_W + TILE_GAP);
    const ty = p2Y;
    const bgClr = gradeColors[grade];
    const isDark = grade === "D";
    const txtClr = isDark ? BLACK : WHITE;

    fillRect(tx, ty, TILE_W, TILE_H, bgClr);

    const bx = tx + TILE_W / 2 - 14;
    const by = ty + 8;
    doc.setDrawColor(...WHITE);
    doc.setLineWidth(1);
    doc.rect(bx, by, 28, 28, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...txtClr);
    doc.text(grade, tx + TILE_W / 2, by + 20, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...txtClr);
    doc.text(gradeLabels[grade], tx + TILE_W / 2, ty + 48, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...txtClr);
    const dLines = doc.splitTextToSize(gradeDescriptions[grade], TILE_W - 8);
    doc.text(dLines, tx + TILE_W / 2, ty + 60, { align: "center" });
  });

  // Page 2 footer
  addPageFooter();

  // ── Save ─────────────────────────────────────────────────────
  doc.save(`${athleteDetail?.basicInfo?.name || "Athlete_Profile"}.pdf`);
};
