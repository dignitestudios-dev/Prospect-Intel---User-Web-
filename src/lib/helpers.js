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
