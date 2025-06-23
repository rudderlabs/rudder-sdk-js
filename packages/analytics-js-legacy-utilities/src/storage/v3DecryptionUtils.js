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
 * Decodes a base64 encoded string
 * @param value base64 encoded string
 * @returns decoded string
 */
const fromBase64 = value => new TextDecoder().decode(base64ToBytes(value));

export { fromBase64 };
