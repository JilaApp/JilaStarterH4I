import ms from "ms";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

/**
 * Converts bytes to megabytes with 2 decimal precision
 * @param bytes - File size in bytes
 * @returns File size in MB, rounded to 2 decimal places
 */
export const formatFileSize = (bytes: number): number => {
  return Math.round((bytes / 1_000_000) * 100) / 100;
};
