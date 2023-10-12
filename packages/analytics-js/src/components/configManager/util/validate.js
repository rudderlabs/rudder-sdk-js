import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { isNullOrUndefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { SUPPORTED_STORAGE_TYPES } from '@rudderstack/analytics-js-common/types/Storage';
import {
  WRITE_KEY_VALIDATION_ERROR,
  DATA_PLANE_URL_VALIDATION_ERROR,
} from '../../../constants/logMessages';
import { isValidUrl } from '../../utilities/url';
const validateWriteKey = writeKey => {
  if (!isString(writeKey) || writeKey.trim().length === 0) {
    throw new Error(WRITE_KEY_VALIDATION_ERROR(writeKey));
  }
};
const validateDataPlaneUrl = dataPlaneUrl => {
  if (dataPlaneUrl && !isValidUrl(dataPlaneUrl)) {
    throw new Error(DATA_PLANE_URL_VALIDATION_ERROR(dataPlaneUrl));
  }
};
const validateLoadArgs = (writeKey, dataPlaneUrl) => {
  validateWriteKey(writeKey);
  validateDataPlaneUrl(dataPlaneUrl);
};
const isValidSourceConfig = res =>
  isObjectLiteralAndNotNull(res) &&
  isObjectLiteralAndNotNull(res.source) &&
  !isNullOrUndefined(res.source.id) &&
  isObjectLiteralAndNotNull(res.source.config) &&
  Array.isArray(res.source.destinations);
const isValidStorageType = storageType =>
  typeof storageType === 'string' && SUPPORTED_STORAGE_TYPES.includes(storageType);
export {
  validateLoadArgs,
  isValidSourceConfig,
  isValidStorageType,
  validateWriteKey,
  validateDataPlaneUrl,
};
