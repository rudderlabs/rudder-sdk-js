import { clone } from 'ramda';
import {
  isObjectLiteralAndNotNull,
  mergeDeepRight,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js-common/utilities/object';
import { removeDuplicateSlashes } from '@rudderstack/analytics-js-common/utilities/url';
import type {
  LoadOptions,
  UaChTrackLevel,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { StorageOpts, CookieSameSite } from '@rudderstack/analytics-js-common/types/Storage';
import { isDefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { INVALID_CONFIG_URL_WARNING } from '../../constants/logMessages';
import { APP_VERSION, MODULE_TYPE } from '../../constants/app';
import { defaultOptionalPluginsList } from '../pluginsManager/defaultPluginsList';
import { BUILD_TYPE, DEFAULT_CONFIG_BE_URL } from '../../constants/urls';
import { isNumber } from './number';
import { removeTrailingSlashes } from './url';

const normalizeLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  // TODO: Maybe add warnings for invalid values
  const normalizedLoadOpts = clone(loadOptions);

  if (!isString(normalizedLoadOpts.setCookieDomain)) {
    delete normalizedLoadOpts.setCookieDomain;
  }

  const cookieSameSiteValues = ['Strict', 'Lax', 'None'];
  if (!cookieSameSiteValues.includes(normalizedLoadOpts.sameSiteCookie as CookieSameSite)) {
    delete normalizedLoadOpts.sameSiteCookie;
  }

  normalizedLoadOpts.secureCookie = normalizedLoadOpts.secureCookie === true;

  const uaChTrackLevels = ['none', 'default', 'full'];
  if (!uaChTrackLevels.includes(normalizedLoadOpts.uaChTrackLevel as UaChTrackLevel)) {
    delete normalizedLoadOpts.uaChTrackLevel;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.integrations)) {
    delete normalizedLoadOpts.integrations;
  }

  normalizedLoadOpts.plugins = normalizedLoadOpts.plugins ?? defaultOptionalPluginsList;

  normalizedLoadOpts.useGlobalIntegrationsConfigInEvents =
    normalizedLoadOpts.useGlobalIntegrationsConfigInEvents === true;

  normalizedLoadOpts.bufferDataPlaneEventsUntilReady =
    normalizedLoadOpts.bufferDataPlaneEventsUntilReady === true;

  normalizedLoadOpts.sendAdblockPage = normalizedLoadOpts.sendAdblockPage === true;

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.sendAdblockPageOptions)) {
    delete normalizedLoadOpts.sendAdblockPageOptions;
  }

  if (!isDefined(normalizedLoadOpts.loadIntegration)) {
    delete normalizedLoadOpts.loadIntegration;
  } else {
    normalizedLoadOpts.loadIntegration = normalizedLoadOpts.loadIntegration === true;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.storage)) {
    delete normalizedLoadOpts.storage;
  } else {
    normalizedLoadOpts.storage = removeUndefinedAndNullValues(normalizedLoadOpts.storage);
    (normalizedLoadOpts.storage as StorageOpts).migrate =
      normalizedLoadOpts.storage?.migrate === true;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.beaconQueueOptions)) {
    delete normalizedLoadOpts.beaconQueueOptions;
  } else {
    normalizedLoadOpts.beaconQueueOptions = removeUndefinedAndNullValues(
      normalizedLoadOpts.beaconQueueOptions,
    );
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.destinationsQueueOptions)) {
    delete normalizedLoadOpts.destinationsQueueOptions;
  } else {
    normalizedLoadOpts.destinationsQueueOptions = removeUndefinedAndNullValues(
      normalizedLoadOpts.destinationsQueueOptions,
    );
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.queueOptions)) {
    delete normalizedLoadOpts.queueOptions;
  } else {
    normalizedLoadOpts.queueOptions = removeUndefinedAndNullValues(normalizedLoadOpts.queueOptions);
  }

  normalizedLoadOpts.lockIntegrationsVersion = normalizedLoadOpts.lockIntegrationsVersion === true;

  if (!isNumber(normalizedLoadOpts.dataPlaneEventsBufferTimeout)) {
    delete normalizedLoadOpts.dataPlaneEventsBufferTimeout;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.storage?.cookie)) {
    delete normalizedLoadOpts.storage?.cookie;
  } else {
    (normalizedLoadOpts.storage as StorageOpts).cookie = removeUndefinedAndNullValues(
      normalizedLoadOpts.storage?.cookie,
    );
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.preConsent)) {
    delete normalizedLoadOpts.preConsent;
  } else {
    normalizedLoadOpts.preConsent = removeUndefinedAndNullValues(normalizedLoadOpts.preConsent);
  }

  const mergedLoadOptions: LoadOptions = mergeDeepRight(loadOptionsFromState, normalizedLoadOpts);

  return mergedLoadOptions;
};

const getSourceConfigURL = (
  configUrl: string | undefined,
  writeKey: string,
  lockIntegrationsVersion: boolean,
  logger?: ILogger,
): string => {
  const defSearchParams = new URLSearchParams({
    p: MODULE_TYPE,
    v: APP_VERSION,
    build: BUILD_TYPE,
    writeKey,
    lockIntegrationsVersion: lockIntegrationsVersion.toString(),
  });

  let origin = DEFAULT_CONFIG_BE_URL;
  let searchParams = defSearchParams;
  let pathname = '/sourceConfig/';
  let hash = '';
  // Ideally, this check is not required but URL polyfill
  // doesn't seem to throw errors for empty URLs
  // TODO: Need to improve this check to find out if the URL is valid or not
  if (configUrl) {
    try {
      const configUrlInstance = new URL(configUrl);
      if (
        !(removeTrailingSlashes(configUrlInstance.pathname) as string).endsWith('/sourceConfig')
      ) {
        configUrlInstance.pathname = `${
          removeTrailingSlashes(configUrlInstance.pathname) as string
        }/sourceConfig/`;
      }
      configUrlInstance.pathname = removeDuplicateSlashes(configUrlInstance.pathname);

      defSearchParams.forEach((value, key) => {
        if (configUrlInstance.searchParams.get(key) === null) {
          configUrlInstance.searchParams.set(key, value);
        }
      });

      origin = configUrlInstance.origin;
      pathname = configUrlInstance.pathname;
      searchParams = configUrlInstance.searchParams;
      hash = configUrlInstance.hash;
    } catch (err) {
      logger?.warn(INVALID_CONFIG_URL_WARNING(CONFIG_MANAGER, configUrl));
    }
  }

  return `${origin}${pathname}?${searchParams}${hash}`;
};

export { normalizeLoadOptions, getSourceConfigURL };
