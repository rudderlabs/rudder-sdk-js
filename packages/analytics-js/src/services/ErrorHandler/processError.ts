import { LOAD_ORIGIN } from '@rudderstack/analytics-js/constants/htmlAttributes';
import { handleScriptLoadAdBlocked } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/adBlockers';
import { serializeError } from 'serialize-error';

export type SDKError = Error | Event | string | unknown;

const processScriptLoadError = (event: Event): string => {
  let errorMessage = '';

  const targetElement = event.target as HTMLElement | null;
  const dataAttributes = targetElement && targetElement.dataset;
  const isScriptElement = targetElement && targetElement.localName === 'script';
  const isRudderSDKScriptElement =
    dataAttributes &&
    (dataAttributes.loader === LOAD_ORIGIN || dataAttributes.isNonNativeSDK === 'true');

  // Discard all the non-script loading onerror Events
  // Discard script errors that are not originated from
  // SDK loading or from native SDKs loading
  if (isScriptElement && isRudderSDKScriptElement) {
    errorMessage = `Failed to load script from ${
      (targetElement as HTMLScriptElement).src
    } with id ${targetElement.id}`;

    // TODO: adblocker detection record here?
    //  better to decouple, if not we need to pass the analytics instance here somehow instead of null
    // Discard Ad-block errors for third party native SDK loading, only track them in analytics
    errorMessage = handleScriptLoadAdBlocked(
      null,
      errorMessage,
      targetElement as HTMLScriptElement,
    );
  }

  return errorMessage;
};

const processError = (error: SDKError) => {
  let errorMessage;

  try {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error instanceof Event) {
      errorMessage = processScriptLoadError(error);
    } else {
      // TODO: JSON.stringify goes into circular dependency if window object exist in firefox, fix this known issue, trying serializeError
      errorMessage = (error as any).message ? (error as any).message : serializeError(error);
    }
  } catch (e) {
    errorMessage = `Unknown error: ${(e as Error).message}`;
  }

  return errorMessage;
};

export { processScriptLoadError, processError };
