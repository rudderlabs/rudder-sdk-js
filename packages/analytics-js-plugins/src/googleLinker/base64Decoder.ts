/**
 * This is utility function for decoding from base 64 to utf8
 *
 * @param {string} str base64
 *
 * @returns {string} utf8
 */
function b64DecodeUnicode(str: string): string {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );
}

/**
 * This is utility function for decoding from base 64 to utf8
 *
 * @param {string} data
 *
 * @return {string}
 */
function decode(data = ''): string {
  const decodedData = data.endsWith('..') ? data.substring(0, data.length - 2) : data;
  return b64DecodeUnicode(decodedData);
}

export { decode };
