import type { Nullable } from '../types/Nullable';
import { isNullOrUndefined, isString } from './checks';

// TODO: see if bundle size is bumped up if we use ramda trim instead of custom
const trim = (value: string): string => value.replace(/^\s+|\s+$/gm, '');

const removeDoubleSpaces = (value: string): string => value.replace(/ {2,}/g, ' ');

const removeLeadingPeriod = (value: string): string => value.replace(/^\.+/, '');

/**
 * A function to convert values to string
 * @param val input value
 * @returns stringified value
 */
const tryStringify = (val?: any): Nullable<string> | undefined => {
  let retVal = val;
  if (!isString(val) && !isNullOrUndefined(val)) {
    try {
      retVal = JSON.stringify(val);
    } catch {
      retVal = null;
    }
  }
  return retVal;
};

// The following text encoding and decoding is done before base64 encoding to prevent
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem

/**
 * Converts a base64 encoded string to bytes array
 * @param base64Str base64 encoded string
 * @returns bytes array
 */
const base64ToBytes = (base64Str: string): Uint8Array => {
  const binString = (globalThis as typeof window).atob(base64Str);
  const bytes = binString.split('').map(char => char.charCodeAt(0));
  return new Uint8Array(bytes);
};

/**
 * Converts a bytes array to base64 encoded string
 * @param bytes bytes array to be converted to base64
 * @returns base64 encoded string
 */
const bytesToBase64 = (bytes: Uint8Array): string => {
  const binString = Array.from(bytes, x => String.fromCodePoint(x)).join('');
  return (globalThis as typeof window).btoa(binString);
};

/**
 * Encodes a string to base64 even with unicode characters
 * @param value input string
 * @returns base64 encoded string
 */
const toBase64 = (value: string): string => bytesToBase64(new TextEncoder().encode(value));

/**
 * Decodes a base64 encoded string
 * @param value base64 encoded string
 * @returns decoded string
 */
const fromBase64 = (value: string): string => new TextDecoder().decode(base64ToBytes(value));

export { trim, removeDoubleSpaces, tryStringify, toBase64, fromBase64, removeLeadingPeriod };
