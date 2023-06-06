import {
  INITIALIZED_CHECK_TIMEOUT,
  LOAD_CHECK_POLL_INTERVAL,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/constants';
import { ClientIntegration, ILogger } from '../types/common';

const isIntegrationSDKEvaluated = (pluginName: string, modName: string, logger?: ILogger) => {
  try {
    const scriptIsEvaluated = Boolean(
      pluginName &&
        modName &&
        (window as any)[pluginName] &&
        (window as any)[pluginName][modName] &&
        (window as any)[pluginName][modName].prototype &&
        typeof (window as any)[pluginName][modName].prototype.constructor !== 'undefined',
    );

    return scriptIsEvaluated;
  } catch (e) {
    logger?.error(e);
    return false;
  }
};

const pause = (time: number) =>
  new Promise(resolve => {
    window.setTimeout(resolve, time);
  });

const createIntegrationInstance = (
  modName: string,
  pluginName: string,
  intg: ClientIntegration,
  integrationInstance: any,
) => {
  // TODO: why we pass all analytics instance here? used in browser.constructor of each integration ????
  // TODO: create the correct values from te state instead of dummy hardcoded ones
  // TODO: should we just pass the write key and then get the instance from global object?
  return new integrationInstance[modName](
    intg.config,
    {
      loadIntegration: true,
      userId: undefined,
      anonymousId: '123456',
      logLevel: 'error',
      userTraits: undefined,
      loadOnlyIntegrations: {
        VWO: {
          loadIntegration: true,
        },
      },
      groupId: undefined,
      groupTraits: undefined,
      methodToCallbackMapping: {
        syncPixel: false,
      },
      uSession: {
        sessionInfo: {
          id: 123456,
        },
      },
      emit: () => {},
    },
    intg.destinationInfo,
  );
};

const isInitialized = (instance: any, time = 0) =>
  new Promise(resolve => {
    if (instance.isLoaded()) {
      console.log('instance.isLoaded', instance);
      resolve(this);
    } else if (time >= INITIALIZED_CHECK_TIMEOUT) {
      throw Error('instance.init timeout expired');
    } else {
      pause(LOAD_CHECK_POLL_INTERVAL)
        .then(() =>
          isInitialized(instance, time + LOAD_CHECK_POLL_INTERVAL)
            .then(resolve)
            .catch(() => {}),
        )
        .catch(() => {});
    }
  });

export { isIntegrationSDKEvaluated, pause, createIntegrationInstance, isInitialized };
