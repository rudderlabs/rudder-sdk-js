import { Signal } from '@preact/signals-core';
import { isNull } from './checks';

/**
 * Replaces all the signal objects with their JSON representation
 * @param data Input data object
 * @returns JSON object without any references to Signal objects
 */
const convertSignalsToJSON = (
  data: Record<string, any>,
  excludes: string[] = [],
): Record<string, any> => {
  const retVal: Record<string, any> = data instanceof Signal ? data.toJSON() : data;

  if (!isNull(retVal) && typeof retVal === 'object') {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in retVal) {
      if (Object.prototype.hasOwnProperty.call(retVal, key)) {
        if (excludes.includes(key)) {
          delete retVal[key];
        } else {
          retVal[key] = convertSignalsToJSON(retVal[key], excludes);
        }
      }
    }
  }

  return retVal;
};

export { convertSignalsToJSON };
