const isAdBlockedElement = (element: HTMLScriptElement): boolean => element.id === 'ad-block';

/**
 * Utility method to handle script load errors that are ad blocked
 */
const handleScriptLoadAdBlocked = (
  errorMessage: string,
  element: HTMLScriptElement,
  analyticsInstance?: any,
): string => {
  // SDK triggered ad-blocker script
  if (isAdBlockedElement(element)) {
    // Track ad blocked page in analytics
    analyticsInstance?.page(
      'RudderJS-Initiated',
      'ad-block page request',
      { path: '/ad-blocked', title: errorMessage },
      analyticsInstance?.sendAdblockPageOptions,
    );

    // No need to proceed further for Ad-block errors
    return '';
  }

  return errorMessage;
};

export { isAdBlockedElement, handleScriptLoadAdBlocked };
