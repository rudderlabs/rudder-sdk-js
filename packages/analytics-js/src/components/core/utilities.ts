const dispatchSDKEvent = (event: string): void => {
  const customEvent = new CustomEvent(event, {
    detail: { analyticsInstance: (globalThis as typeof window).rudderanalytics },
    bubbles: true,
    cancelable: true,
    composed: true,
  });

  (globalThis as typeof window).document.dispatchEvent(customEvent);
};

export { dispatchSDKEvent };
