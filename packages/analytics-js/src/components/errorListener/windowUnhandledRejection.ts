import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { state } from '../../state';
import type { ErrorState } from './types';

const attachUnhandledRejection = (pluginsManager: IPluginsManager, logger?: ILogger) => {
  const listener = (evt: any) => {
    let error = evt.reason;
    let isBluebird = false;

    // accessing properties on evt.detail can throw errors (see #394)
    try {
      if (evt.detail && evt.detail.reason) {
        error = evt.detail.reason;
        isBluebird = true;
      }
    } catch (e) {
      // ignore
    }

    const errorEvent = error;

    const errorState: ErrorState = {
      severity: 'error',
      unhandled: true,
      severityReason: { type: 'unhandledPromiseRejection' },
    };

    if (isBluebird) {
      errorState.isBluebird = true;
    }

    if (!state.reporting.isErrorReportingEnabled) {
      // just log the error
      logger?.error(errorEvent);
    } else if (!state.reporting.errorReportingProviderPluginName) {
      // buffer the error
      // errorBuffer.push([errorEvent, errorState]);
    } else {
      // send it to plugin
    }
  };
  if ('addEventListener' in window) {
    window.addEventListener('unhandledrejection', listener);
  } else {
    // window.onunhandledrejection = (reason, promise) => {
    //   listener({ detail: { reason, promise } });
    // };
  }
};

export { attachUnhandledRejection };
