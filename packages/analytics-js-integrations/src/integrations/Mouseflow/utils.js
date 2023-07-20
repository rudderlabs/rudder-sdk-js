/* eslint-disable no-underscore-dangle */
import get from 'get-value';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Mouseflow/constants';

/*
 * Here, we are iterating each key-value pair of object 'Obj' and
 * checks if typeof value is string then we pass it as custom variable in mouseflow.
 */
const setCustomVariables = userProperties => {
  if (userProperties && typeof userProperties === 'object') {
    Object.entries(userProperties).forEach(item => {
      const [key, value] = item;
      if (typeof value === 'string' || typeof value === 'number')
        window._mfq.push(['setVariable', key, value]);
    });
  }
};

/*
 * Set custom Variables from integrations Object
 */
const addCustomVariables = message => {
  const customVariables = get(message, `integrations.${NAME}.customVariables`);
  setCustomVariables(customVariables);
};

export { setCustomVariables, addCustomVariables };
