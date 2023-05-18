// TODO: see if bundle size is bumped up if we use ramda trim instead of custom
const trim = (value: string): string => value.replace(/^\s+|\s+$/gm, '');

const removeDoubleSpaces = (value: string): string => value.replace(/ {2,}/g, ' ');

/**
 * A function to convert values to string
 * @param val input value
 * @returns stringified value
 */
const tryStringify = (val: any) => {
  let retVal = val;
  if (typeof val !== 'string' && typeof val !== 'undefined' && val !== null) {
    try {
      retVal = JSON.stringify(val);
    } catch (e) {
      retVal = null;
    }
  }
  return retVal;
};

const toBase64 = (value: string): string => Buffer.from(value).toString('base64');

export { trim, removeDoubleSpaces, tryStringify, toBase64 };
