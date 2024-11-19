import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';

const dispatchSDKEvent = (event: string): void => {
  const customEvent = new CustomEvent(event, {
    detail: { analyticsInstance: (globalThis as typeof window).rudderanalytics },
    bubbles: true,
    cancelable: true,
    composed: true,
  });

  (globalThis as typeof window).document.dispatchEvent(customEvent);
};

const isWriteKeyValid = (writeKey: string) => isString(writeKey) && writeKey.trim().length > 0;

const isDataPlaneUrlValid = (dataPlaneUrl: string) => isValidURL(dataPlaneUrl);

export { dispatchSDKEvent, isWriteKeyValid, isDataPlaneUrlValid };
