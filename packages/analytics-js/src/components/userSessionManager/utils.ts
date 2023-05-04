import { ApiObject } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';

const isValidTraitsValue = (traits?: Nullable<ApiObject>) => {
  return traits !== undefined && traits !== null && Object.keys(traits).length > 0;
};

export { isValidTraitsValue };
