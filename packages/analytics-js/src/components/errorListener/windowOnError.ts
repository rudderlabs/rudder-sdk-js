import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { state } from '../../state';
import type { ErrorMetaData, JqueryErrorEvent } from './types';

const attachOnError = (pluginsManager: IPluginsManager, logger?: ILogger) => {
  const prevOnError = (globalThis as any).onerror;

  function onerror(
    messageOrEvent: string | Event | JqueryErrorEvent | unknown,
    url: string,
    lineNo: number,
    charNo: number,
    error: Error,
  ) {
    // Ignore errors with no info due to CORS settings
    if (
      lineNo === 0 &&
      typeof messageOrEvent === 'string' &&
      /Script error\.?/.test(messageOrEvent)
    ) {
      logger?.warn('Ignoring cross-domain or eval script error.');
    } else {
      // any error sent to window.onerror is unhandled and has severity=error
      const errorState = {
        severity: 'error',
        unhandled: true,
        severityReason: { type: 'unhandledException' },
      };

      let errorEvent;
      const metaData: ErrorMetaData = { url, lineNo, charNo };
      // window.onerror can be called in a number of ways. This big if-else is how we
      // figure out which arguments were supplied, and what kind of values it received.

      if (error) {
        // if the last parameter (error) was supplied, this is a modern browser's
        // way of saying "this value was thrown and not caught"
        errorEvent = error;
      } else if (
        // This complex case detects "error" events that are typically synthesised
        // by jquery's trigger method (although can be created in other ways). In
        // order to detect this:
        // - the first argument (message) must exist and be an object (most likely it's a jQuery event)
        // - the second argument (url) must either not exist or be something other than a string (if it
        //    exists and is not a string, it'll be the extraParameters argument from jQuery's trigger()
        //    function)
        // - the third, fourth and fifth arguments must not exist (lineNo, charNo and error)
        typeof messageOrEvent === 'object' &&
        messageOrEvent !== null &&
        (!url || typeof url !== 'string') &&
        !lineNo &&
        !charNo &&
        !error
      ) {
        const event = messageOrEvent as JqueryErrorEvent;
        // The jQuery event may have a "type" property, if so use it as part of the error message
        const name = event.type ? `Event: ${event.type}` : 'Error';
        // attempt to find a message from one of the conventional properties, but
        // default to empty string (the event will fill it with a placeholder)
        const message = event.message || event.detail || '';

        errorEvent = { name, message };
        metaData.originalError = messageOrEvent;
      } else {
        // Lastly, if there was no "error" parameter this event was probably from an old
        // browser that doesn't support that. Instead we need to generate a stacktrace.
        errorEvent = messageOrEvent;
      }
      if (!state.reporting.isErrorReportingEnabled.value) {
        // just log the error
        logger?.error(errorEvent);
      } else if (!state.reporting.isErrorReportingPluginLoaded.value) {
        // buffer the error
        // errorBuffer.push([errorEvent, errorState, metaData]);
      } else {
        // send it to plugin
      }
    }
    // @ts-expect-error avoid error on this
    // eslint-disable-next-line prefer-rest-params
    if (typeof prevOnError === 'function') prevOnError.apply(this, arguments);
  }

  (globalThis as any).onerror = onerror;
};

export { attachOnError };
