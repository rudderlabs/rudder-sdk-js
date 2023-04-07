const isDatasetAvailable = (): boolean => {
  const testElement = document.createElement('div');
  testElement.setAttribute('data-a-b', 'c');
  return testElement.dataset ? testElement.dataset.aB === 'c' : false;
};

const isLegacyJSEngine = (): boolean =>
  !String.prototype.endsWith ||
  !String.prototype.startsWith ||
  !String.prototype.includes ||
  !String.prototype.replaceAll ||
  !Array.prototype.find ||
  !Array.prototype.includes ||
  !Object.entries ||
  !Object.values ||
  !Promise ||
  !isDatasetAvailable();

export { isDatasetAvailable, isLegacyJSEngine };
