/**
 * To get the current timestamp in ISO string format
 * @returns ISO formatted timestamp string
 */
export function getCurrentTimeFormatted(): string {
  const curDateTime = new Date().toISOString();
  return curDateTime;
};
