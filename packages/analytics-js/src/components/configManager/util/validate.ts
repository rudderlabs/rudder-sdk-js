import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js/components/utilities/object';
import { isNullOrUndefined } from '@rudderstack/analytics-js/components/utilities/checks';
import { isValidUrl } from '../../utilities/url';

const validateWriteKey = (writeKey?: string) => {
  if (!writeKey || writeKey.trim().length === 0) {
    throw Error(`Unable to load the SDK due to invalid write key: "${writeKey}"`);
  }
};

const validateDataPlaneUrl = (dataPlaneUrl?: string) => {
  if (dataPlaneUrl && !isValidUrl(dataPlaneUrl)) {
    throw Error(`Unable to load the SDK due to invalid data plane URL: "${dataPlaneUrl}"`);
  }
};

const validateLoadArgs = (writeKey?: string, dataPlaneUrl?: string) => {
  validateWriteKey(writeKey);
  validateDataPlaneUrl(dataPlaneUrl);
};

const isValidSourceConfig = (res: any): boolean =>
  isObjectLiteralAndNotNull(res) &&
  isObjectLiteralAndNotNull(res.source) &&
  !isNullOrUndefined(res.source.id) &&
  isObjectLiteralAndNotNull(res.source.config) &&
  Array.isArray(res.source.destinations);

export { validateLoadArgs, isValidSourceConfig };
