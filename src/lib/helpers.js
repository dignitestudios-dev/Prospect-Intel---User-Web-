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
    Email: athlete.basicInfo?.email,
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
    Touches: athlete.stats?.touches,
    "Successful Passes": athlete.stats?.successfulPasses,
    "Pass Accuracy": athlete.stats?.passAccuracy,
    "Tackles Completed": athlete.stats?.tacklesCompleted,
    Carries: athlete.stats?.carries,
    Tries: athlete.stats?.tries,

    // Education
    Education: athlete.education
      ?.map(
        (e) =>
          `${e.name} (${e.field}) ${new Date(e.startYear).getFullYear()}-${new Date(e.endYear).getFullYear()}`,
      )
      .join(" | "),

    // Achievements
    Achievements: athlete.achievements
      ?.map((a) => `${a.title} - ${a.description}`)
      .join(" | "),

    // Media
    "Media URLs": athlete.media?.join(" | "),

    // Interest Stats
    "Interest Total": athlete.intrestStats?.total,
    "Interest Pending": athlete.intrestStats?.pending,
    "Interest Updated": athlete.intrestStats?.updated,
  };
};
