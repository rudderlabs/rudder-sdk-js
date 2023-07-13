import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  WRITE_KEY_VALIDATION_ERROR,
  DATA_PLANE_URL_VALIDATION_ERROR,
} from '@rudderstack/analytics-js/constants/logMessages';
import { isValidUrl } from '../../utilities/url';

const validateWriteKey = (writeKey?: string) => {
  if (!writeKey || writeKey.trim().length === 0) {
    throw new Error(WRITE_KEY_VALIDATION_ERROR(writeKey));
  }
};

const validateDataPlaneUrl = (dataPlaneUrl?: string) => {
  if (dataPlaneUrl && !isValidUrl(dataPlaneUrl)) {
    throw new Error(DATA_PLANE_URL_VALIDATION_ERROR(dataPlaneUrl));
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
