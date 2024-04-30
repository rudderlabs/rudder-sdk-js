// The following text encoding and decoding is done before base64 encoding to prevent
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem

/**
 * Converts a base64 encoded string to bytes array
 * @param base64Str base64 encoded string
 * @returns bytes array
 */
const base64ToBytes = base64Str => {
  const binString = globalThis.atob(base64Str);
  const bytes = binString.split('').map(char => char.charCodeAt(0));
  return new Uint8Array(bytes);
};

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
const toBase64 = value => bytesToBase64(new TextEncoder().encode(value));

/**
 * Decodes a base64 encoded string
 * @param value base64 encoded string
 * @returns decoded string
 */
const fromBase64 = value => new TextDecoder().decode(base64ToBytes(value));

export { toBase64, fromBase64 };
