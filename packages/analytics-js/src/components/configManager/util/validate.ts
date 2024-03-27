import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { isNullOrUndefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  SUPPORTED_STORAGE_TYPES,
  type StorageType,
} from '@rudderstack/analytics-js-common/types/Storage';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  WRITE_KEY_VALIDATION_ERROR,
  DATA_PLANE_URL_VALIDATION_ERROR,
  COOKIE_SERVER_URL_INVALID_ERROR,
} from '../../../constants/logMessages';
import { isValidUrl } from '../../utilities/url';

const validateWriteKey = (writeKey?: string) => {
  if (!isString(writeKey) || (writeKey as string).trim().length === 0) {
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

const isValidStorageType = (storageType?: StorageType): boolean =>
  typeof storageType === 'string' && SUPPORTED_STORAGE_TYPES.includes(storageType);

const validateAndReturnCookieServerUrl = (
  useServerSideCookies?: boolean,
  cookieServerUrl?: string,
  logger?: ILogger,
) => {
  if (useServerSideCookies && cookieServerUrl) {
    if (isValidUrl(cookieServerUrl)) {
      return cookieServerUrl;
    }
    logger?.error(COOKIE_SERVER_URL_INVALID_ERROR('cookieServerUrl'));
  }
  return 'invalid';
};

export {
  validateLoadArgs,
  isValidSourceConfig,
  isValidStorageType,
  validateWriteKey,
  validateDataPlaneUrl,
  validateAndReturnCookieServerUrl,
};
