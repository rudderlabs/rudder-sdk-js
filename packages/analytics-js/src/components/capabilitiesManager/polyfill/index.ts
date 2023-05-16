const REQUIRED_POLYFILL_LIST: string[] = [
  'URLSearchParams',
  'URL',
  'MutationObserver',
  'Array.from',
  'Array.prototype.find',
  'Array.prototype.includes',
  'Promise',
  'String.prototype.endsWith',
  'String.prototype.includes',
  'String.prototype.startsWith',
  'Object.entries',
  'Object.values',
  'Element.prototype.dataset',
  'String.prototype.replaceAll',
];

const POLYFILL_URL = `https://polyfill.io/v3/polyfill.min.js?features=${REQUIRED_POLYFILL_LIST.join(
  '%2C',
)}`;

const POLYFILL_LOAD_TIMEOUT = 10 * 1000; // 10 seconds

export { POLYFILL_URL, POLYFILL_LOAD_TIMEOUT };
