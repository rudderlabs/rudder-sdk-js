import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';

const isDatasetAvailable = (): boolean => {
  const testElement = globalThis.document.createElement('div');
  testElement.setAttribute('data-a-b', 'c');
  return testElement.dataset ? testElement.dataset.aB === 'c' : false;
};

const legacyJSEngineRequiredPolyfills: Record<string, () => boolean> = {
  // Ideally, we should separate the checks for URL and URLSearchParams but
  // the polyfill service serves them under the same feature name, "URL".
  URL: () => !isFunction(globalThis.URL) || !isFunction(globalThis.URLSearchParams),
  Promise: () => !isFunction(globalThis.Promise),
  'Number.isNaN': () => !isFunction(globalThis.Number.isNaN),
  'Number.isInteger': () => !isFunction(globalThis.Number.isInteger),
  'Array.from': () => !isFunction(globalThis.Array.from),
  'Array.prototype.find': () => !isFunction(globalThis.Array.prototype.find),
  'Array.prototype.includes': () => !isFunction(globalThis.Array.prototype.includes),
  'String.prototype.endsWith': () => !isFunction(globalThis.String.prototype.endsWith),
  'String.prototype.startsWith': () => !isFunction(globalThis.String.prototype.startsWith),
  'String.prototype.includes': () => !isFunction(globalThis.String.prototype.includes),
  'String.prototype.trim': () => !isFunction(globalThis.String.prototype.trim),
  'String.prototype.replaceAll': () => !isFunction(globalThis.String.prototype.replaceAll),
  'String.fromCodePoint': () => !isFunction(globalThis.String.fromCodePoint),
  'Object.entries': () => !isFunction(globalThis.Object.entries),
  'Object.values': () => !isFunction(globalThis.Object.values),
  'Object.assign': () => !isFunction(globalThis.Object.assign),
  'Object.fromEntries': () => !isFunction(globalThis.Object.fromEntries),
  'Element.prototype.dataset': () => !isDatasetAvailable(),
  // Ideally, we should separate the checks for TextEncoder and TextDecoder but
  // the polyfill service serves them under the same feature name, "TextEncoder".
  TextEncoder: () => !isFunction(globalThis.TextEncoder) || !isFunction(globalThis.TextDecoder),
  requestAnimationFrame: () =>
    !isFunction(globalThis.requestAnimationFrame) || !isFunction(globalThis.cancelAnimationFrame),
  CustomEvent: () => !isFunction(globalThis.CustomEvent),
  // Note, the polyfill service serves both ArrayBuffer and Uint8Array under the same feature name, "ArrayBuffer".
  ArrayBuffer: () => !isFunction(globalThis.Uint8Array),
  Set: () => !isFunction(globalThis.Set),
  atob: () => !isFunction(globalThis.atob),
  AbortController: () => !isFunction(globalThis.AbortController),
  fetch: () => !isFunction(globalThis.fetch),
};

const isLegacyJSEngine = (): boolean =>
  Object.values(legacyJSEngineRequiredPolyfills).some(
    detectionFn => isFunction(detectionFn) && detectionFn(),
  );

export { isDatasetAvailable, legacyJSEngineRequiredPolyfills, isLegacyJSEngine };
