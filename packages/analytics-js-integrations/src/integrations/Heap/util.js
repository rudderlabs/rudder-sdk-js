import { isDate } from '../../utils/typeChecks';
import { toIso, isDefinedAndNotNull, flattenJson } from '../../utils/commonUtils';

// Heap accepts only string, boolean and number

const processHeapProperties = propertiesJson => {
  // flatten the json
  const propertiesJsonFlattened = flattenJson(propertiesJson);
  const processedProperties = {};
  Object.keys(propertiesJsonFlattened).forEach(key => {
    const value = propertiesJsonFlattened[key];
    if (isDefinedAndNotNull(value)) {
      // check if date. Then convert to iso.
      if (isDate(value)) {
        processedProperties[key] = toIso(value);
      } else {
        processedProperties[key] = value;
      }
    }
  });
  return processedProperties;
};
export default processHeapProperties;
