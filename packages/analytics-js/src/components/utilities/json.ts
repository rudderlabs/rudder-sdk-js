/**
 * Utility method for excluding null values in JSON
 * @param {*} key key in the object
 * @param {*} value value in the object
 * @returns
 */
const replaceNullValues = (key: string, value: any) => value ?? undefined;

export { replaceNullValues };
