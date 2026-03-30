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