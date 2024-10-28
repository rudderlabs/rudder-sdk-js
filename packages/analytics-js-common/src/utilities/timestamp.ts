const getFormattedTimestamp = (date: Date): string => date.toISOString();

/**
 * To get the current timestamp in ISO string format
 * @returns ISO formatted timestamp string
 */
const getCurrentTimeFormatted = (): string => getFormattedTimestamp(new Date());

export { getCurrentTimeFormatted, getFormattedTimestamp };
