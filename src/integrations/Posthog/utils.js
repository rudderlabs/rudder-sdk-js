/**
 * Returns xhrHeaders object
 * @param {*} config
 * @returns
 */
const getXhrHeaders = (config) => {
  const xhrHeaders = {};
  if (config.xhrHeaders && config.xhrHeaders.length > 0) {
    config.xhrHeaders.forEach((header) => {
      if (header?.key?.trim() !== '' && header?.value?.trim() !== '') {
        xhrHeaders[header.key] = header.value;
      }
    });
  }

  return xhrHeaders;
};

/**
 * Returns propertyBlackList array
 * @param {*} config
 * @returns
 */
const getPropertyBlackList = (config) => {
  const propertyBlackList = [];
  if (config.propertyBlackList && config.propertyBlackList.length > 0) {
    config.propertyBlackList.forEach((element) => {
      if (element?.property?.trim() !== '') {
        propertyBlackList.push(element.property);
      }
    });
  }
  return propertyBlackList;
};

export { getXhrHeaders, getPropertyBlackList };
