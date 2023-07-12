import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js/components/utilities/object';
import { isNullOrUndefined } from '@rudderstack/analytics-js/components/utilities/checks';
import { isValidUrl } from '../../utilities/url';

const validateWriteKey = (writeKey?: string) => {
  if (!writeKey || writeKey.trim().length === 0) {
    throw new Error(
      `The write key "${writeKey}" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.`,
    );
  }
};

const validateDataPlaneUrl = (dataPlaneUrl?: string) => {
  if (dataPlaneUrl && !isValidUrl(dataPlaneUrl)) {
    throw new Error(
      `The data plane URL "${dataPlaneUrl}" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.`,
    );
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
