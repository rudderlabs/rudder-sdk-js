const isDatasetAvailable = (): boolean => {
  const testElement = document.createElement('div');
  testElement.setAttribute('data-a-b', 'c');
  return testElement.dataset ? testElement.dataset.aB === 'c' : false;
};

// This checks go hand to hand with the REQUIRED_POLYFILL_LIST
const isLegacyJSEngine = (): boolean =>
  !String.prototype.endsWith ||
  !String.prototype.startsWith ||
  !String.prototype.includes ||
  !Array.prototype.find ||
  !Array.prototype.includes ||
  !Promise ||
  !Object.entries ||
  !Object.values ||
  !String.prototype.replaceAll ||
  !isDatasetAvailable() ||
  !Array.from ||
  typeof MutationObserver === 'undefined' ||
  !window.URLSearchParams ||
  !window.URL;

export { isDatasetAvailable, isLegacyJSEngine };
