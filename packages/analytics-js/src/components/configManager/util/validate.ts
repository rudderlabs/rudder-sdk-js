import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { isNullOrUndefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  SUPPORTED_STORAGE_TYPES,
  type StorageType,
} from '@rudderstack/analytics-js-common/types/Storage';
import {
  WRITE_KEY_VALIDATION_ERROR,
  DATA_PLANE_URL_VALIDATION_ERROR,
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

const getTopDomainUrl = (url: string) => {
  // Create a URL object
  const urlObj = new URL(url);

  // Extract the hostname and protocol
  const { hostname, protocol } = urlObj;

  // Split the hostname into parts
  const parts = hostname.split('.');
  let topDomain;
  // Handle different cases, especially for co.uk or similar TLDs
  if (parts.length > 2) {
    // Join the last two parts for the top-level domain
    topDomain = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  } else {
    // If only two parts or less, return as it is
    topDomain = hostname;
  }
  return `${protocol}//${topDomain}`;
};

const getDataServiceUrl = (endpoint: string) => {
  const url = getTopDomainUrl(window.location.href);
  return `${url}/${endpoint}`;
};

export {
  validateLoadArgs,
  isValidSourceConfig,
  isValidStorageType,
  validateWriteKey,
  validateDataPlaneUrl,
  getTopDomainUrl,
  getDataServiceUrl,
};
