/**
 * @description This is utility function for decoding from base 64 to utf8
 * @version v1.0.0
 */

/**
 * @param {string} str base64
 * @returns {string} utf8
 */
function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(''),
  );
}

/**
 * @param {string} value
 * @return {string}
 */
function decode(data = '') {
  data = data.endsWith('..') ? data.substr(0, data.length - 2) : data;
  return b64DecodeUnicode(data);
}

export default decode;
