// The following text encoding and decoding is done before base64 encoding to prevent
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem

/**
 * Converts a bytes array to base64 encoded string
 * @param bytes bytes array to be converted to base64
 * @returns base64 encoded string
 */
const bytesToBase64 = bytes => {
  const binString = Array.from(bytes, x => String.fromCodePoint(x)).join('');
  return globalThis.btoa(binString);
};

/**
 * Encodes a string to base64 even with unicode characters
 * @param value input string
 * @returns base64 encoded string
 */
const toBase64 = value => {
  try {
    return bytesToBase64(new TextEncoder().encode(value));
  } catch (err) {
    return '';
  }
};

export { toBase64 };
