const onPageLeave = (callback: (...args: unknown[]) => void) => {
  // To ensure the callback is only called once even if more than one events
  // are fired at once.
  let pageLeft = false;

  function handleOnLeave() {
    if (pageLeft) {
      return;
    }

    pageLeft = true;

    callback();
  }

  // Catches the unloading of the page (e.g., closing the tab or navigating away).
  // Includes user actions like clicking a link, entering a new URL,
  // refreshing the page, or closing the browser tab
  // Note that 'pagehide' is not supported in IE.
  // So, this is a fallback.
  (globalThis as typeof window).addEventListener('beforeunload', handleOnLeave);

  // Catches the page being hidden, including scenarios like closing the tab.
  document.addEventListener('pagehide', handleOnLeave);

  // Catches visibility changes, such as switching tabs or minimizing the browser.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleOnLeave();
    } else {
      pageLeft = false;
    }
  });
};

export { onPageLeave };
