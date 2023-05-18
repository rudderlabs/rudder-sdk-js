const isDatasetAvailable = (): boolean => {
  const testElement = document.createElement('div');
  testElement.setAttribute('data-a-b', 'c');
  return testElement.dataset ? testElement.dataset.aB === 'c' : false;
};

const legacyJSEngineRequiredPolyfills: Record<string, () => boolean> = {
  URLSearchParams: () => !window.URLSearchParams,
  URL: () => !window.URL,
  MutationObserver: () => typeof MutationObserver === 'undefined',
  Promise: () => !Promise,
  'Array.from': () => !Array.from,
  'Array.prototype.find': () => !Array.prototype.find,
  'Array.prototype.includes': () => !Array.prototype.includes,
  'String.prototype.endsWith': () => !String.prototype.endsWith,
  'String.prototype.startsWith': () => !String.prototype.startsWith,
  'String.prototype.includes': () => !String.prototype.includes,
  'Object.entries': () => !Object.entries,
  'Object.values': () => !Object.values,
  'Element.prototype.dataset': () => !isDatasetAvailable(),
  'String.prototype.replaceAll': () => !String.prototype.replaceAll,
};

const isLegacyJSEngine = (): boolean => {
  const requiredCapabilitiesList = Object.keys(legacyJSEngineRequiredPolyfills);

  /* eslint-disable-next-line unicorn/no-for-loop */
  for (let i = 0; i < requiredCapabilitiesList.length; i++) {
    const isCapabilityMissing = legacyJSEngineRequiredPolyfills[requiredCapabilitiesList[i]];

    if (isCapabilityMissing()) {
      return true;
    }
  }

  return false;
};

export { isDatasetAvailable, legacyJSEngineRequiredPolyfills, isLegacyJSEngine };
