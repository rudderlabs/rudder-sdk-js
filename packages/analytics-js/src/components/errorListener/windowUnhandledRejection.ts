import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { state } from '../../state';
import type { ErrorMetaData } from './types';

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

    const errorState = {
      severity: 'error',
      unhandled: true,
      severityReason: { type: 'unhandledPromiseRejection' },
    };
    const metaData: ErrorMetaData = {};

    if (isBluebird) {
      metaData.isBluebird = true;
    }

    if (!state.reporting.isErrorReportingEnabled.value) {
      // just log the error
      logger?.error(errorEvent);
    } else if (!state.reporting.isErrorReportingPluginLoaded.value) {
      // buffer the error
      // errorBuffer.push([errorEvent, errorState,metaData ]);
    } else {
      // send it to plugin
    }
  };
  if ('addEventListener' in (globalThis as any)) {
    (globalThis as any).addEventListener('unhandledrejection', listener);
  } else {
    (globalThis as any).onunhandledrejection = (reason: any) => {
      listener({ detail: { reason } });
    };
  }
};

export { attachUnhandledRejection };
