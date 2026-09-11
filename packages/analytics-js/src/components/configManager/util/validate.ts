import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { isDefined, isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  SUPPORTED_STORAGE_TYPES,
  type StorageOpts,
  type StorageType,
} from '@rudderstack/analytics-js-common/types/Storage';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  STORAGE_TYPE_VALIDATION_WARNING,
  UNSUPPORTED_STORAGE_ENTRY_TYPE_WARNING,
} from '../../../constants/logMessages';

const isValidSourceConfig = (res: any): boolean =>
  isObjectLiteralAndNotNull(res) &&
  isObjectLiteralAndNotNull(res.source) &&
  !isNullOrUndefined(res.source.id) &&
  isObjectLiteralAndNotNull(res.source.config) &&
  Array.isArray(res.source.destinations);

const isValidStorageType = (storageType?: StorageType): boolean =>
  typeof storageType === 'string' && SUPPORTED_STORAGE_TYPES.includes(storageType);

/**
 * Warns about the unsupported storage types in the storage options. It only reports them, as the
 * applicable default depends on the consent phase and is determined at resolution time.
 * @param storageOpts Storage options from the load API options or the consent API options
 * @param context Logger context
 * @param logger Logger instance
 */
const validateStorageOptions = (
  storageOpts: StorageOpts | undefined,
  context: string,
  logger?: ILogger,
): void => {
  if (!isObjectLiteralAndNotNull(storageOpts)) {
    return;
  }

  const { type, entries } = storageOpts;
  if (isDefined(type) && !isValidStorageType(type)) {
    logger?.warn(STORAGE_TYPE_VALIDATION_WARNING(context, type));
  }

  if (entries) {
    Object.entries(entries).forEach(([entryKey, entryOpts]) => {
      const entryType = entryOpts?.type;
      if (isDefined(entryType) && !isValidStorageType(entryType)) {
        logger?.warn(UNSUPPORTED_STORAGE_ENTRY_TYPE_WARNING(context, entryKey, entryType));
      }
    });
  }
};

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

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const getDataServiceUrl = (endpoint: string, useExactDomain: boolean, topHost: string) => {
  // An absolute URL carries its own host, so it is used as the final request URL as it is
  if (ABSOLUTE_URL_REGEX.test(endpoint)) {
    return endpoint;
  }

  // An unknown top host (ex: IP address hosts) leaves the current origin as the only usable host
  const url =
    useExactDomain || !topHost ? window.location.origin : `${window.location.protocol}//${topHost}`;
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${url}/${formattedEndpoint}`;
};

/**
 * Determines whether the data service can set cookies that the current webpage is able to read.
 * A host outside the webpage's domain can only set cookies for its own domain.
 */
const isWebpageDataServiceHost = (
  dataServiceHostname: string,
  webpageTopDomain: string,
  hostOnlyCookies: boolean,
): boolean => {
  // Host-only cookies can be read back only by the exact host that set them
  if (hostOnlyCookies || !webpageTopDomain) {
    return dataServiceHostname === globalThis.location.hostname;
  }

  return (
    dataServiceHostname === webpageTopDomain || dataServiceHostname.endsWith(`.${webpageTopDomain}`)
  );
};

const isWebpageTopLevelDomain = (providedDomain: string): boolean => {
  const { topDomain } = getTopDomain(window.location.href);
  return topDomain === providedDomain;
};

export {
  isValidSourceConfig,
  isValidStorageType,
  validateStorageOptions,
  getDataServiceUrl,
  isWebpageDataServiceHost,
  isWebpageTopLevelDomain,
};
