import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { isNullOrUndefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  SUPPORTED_STORAGE_TYPES,
  type StorageType,
} from '@rudderstack/analytics-js-common/types/Storage';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import {
  WRITE_KEY_VALIDATION_ERROR,
  DATA_PLANE_URL_VALIDATION_ERROR,
} from '../../../constants/logMessages';

const validateWriteKey = (writeKey?: string) => {
  if (!isString(writeKey) || (writeKey as string).trim().length === 0) {
    throw new Error(WRITE_KEY_VALIDATION_ERROR(writeKey));
  }
};

const validateDataPlaneUrl = (dataPlaneUrl?: string) => {
  if (!isValidURL(dataPlaneUrl)) {
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

const getTopDomain = (url: string) => {
  // Create a URL object
  const urlObj = new URL(url);

  // Extract the host and protocol
  const { host, protocol } = urlObj;

  // Split the host into parts
  const parts: string[] = host.split('.');
  let topDomain;
  // Handle different cases, especially for co.uk or similar TLDs
  if (parts.length > 2) {
    // Join the last two parts for the top-level domain
    topDomain = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  } else {
    // If only two parts or less, return as it is
    topDomain = host;
  }
  return { topDomain, protocol };
};

const getTopDomainUrl = (url: string) => {
  const { topDomain, protocol } = getTopDomain(url);
  return `${protocol}//${topDomain}`;
};

const getDataServiceUrl = (endpoint: string, useExactDomain: boolean) => {
  const url = useExactDomain ? window.location.origin : getTopDomainUrl(window.location.href);
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${url}/${formattedEndpoint}`;
};

const isWebpageTopLevelDomain = (providedDomain: string): boolean => {
  const { topDomain } = getTopDomain(window.location.href);
  return topDomain === providedDomain;
};

export {
  validateLoadArgs,
  isValidSourceConfig,
  isValidStorageType,
  validateWriteKey,
  validateDataPlaneUrl,
  getTopDomainUrl,
  getDataServiceUrl,
  isWebpageTopLevelDomain,
};
