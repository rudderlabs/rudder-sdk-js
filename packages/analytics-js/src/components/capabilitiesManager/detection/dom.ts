import { isFunction, isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';

const isDatasetAvailable = (): boolean => {
  const testElement = document.createElement('div');
  testElement.setAttribute('data-a-b', 'c');
  return testElement.dataset ? testElement.dataset.aB === 'c' : false;
};

const legacyJSEngineRequiredPolyfills: Record<string, () => boolean> = {
  URLSearchParams: () => !globalThis.URLSearchParams,
  URL: () => !isFunction(globalThis.URL),
  MutationObserver: () => isUndefined(MutationObserver),
  Promise: () => isUndefined(Promise),
  'Number.isNaN': () => !Number.isNaN,
  'Number.isInteger': () => !Number.isInteger,
  'Array.from': () => !Array.from,
  'Array.prototype.find': () => !Array.prototype.find,
  'Array.prototype.includes': () => !Array.prototype.includes,
  'String.prototype.endsWith': () => !String.prototype.endsWith,
  'String.prototype.startsWith': () => !String.prototype.startsWith,
  'String.prototype.includes': () => !String.prototype.includes,
  'Object.entries': () => !Object.entries,
  'Object.values': () => !Object.values,
  'Object.assign': () => typeof Object.assign !== 'function',
  'Element.prototype.dataset': () => !isDatasetAvailable(),
  'String.prototype.replaceAll': () => !String.prototype.replaceAll,
  TextEncoder: () => isUndefined(TextEncoder),
  TextDecoder: () => isUndefined(TextDecoder),
  'String.fromCodePoint': () => !String.fromCodePoint,
  requestAnimationFrame: () => !isFunction(globalThis.requestAnimationFrame),
  cancelAnimationFrame: () => !isFunction(globalThis.cancelAnimationFrame),
  CustomEvent: () => !isFunction(globalThis.CustomEvent),
  'navigator.sendBeacon': () => !isFunction(navigator.sendBeacon),
};

const isLegacyJSEngine = (): boolean => {
  const requiredCapabilitiesList = Object.keys(legacyJSEngineRequiredPolyfills);
  let needsPolyfill = false;

  /* eslint-disable-next-line unicorn/no-for-loop */
  for (let i = 0; i < requiredCapabilitiesList.length; i++) {
    const isCapabilityMissing =
      legacyJSEngineRequiredPolyfills[requiredCapabilitiesList[i] as string];

    if (isFunction(isCapabilityMissing) && isCapabilityMissing()) {
      needsPolyfill = true;
      break;
    }
  }

  return needsPolyfill;
};

export { isDatasetAvailable, legacyJSEngineRequiredPolyfills, isLegacyJSEngine };
