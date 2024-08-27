const onPageLeave = (callback: (isAccessible: boolean) => void) => {
  // To ensure the callback is only called once even if more than one events
  // are fired at once.
  let pageLeft = false;
  let isAccessible = false;

  function handleOnLeave() {
    if (pageLeft) {
      return;
    }

    pageLeft = true;

    callback(isAccessible);
  }

  // Catches the unloading of the page (e.g., closing the tab or navigating away).
  // Includes user actions like clicking a link, entering a new URL,
  // refreshing the page, or closing the browser tab
  // Note that 'pagehide' is not supported in IE.
  // So, this is a fallback.
  (globalThis as typeof window).addEventListener('beforeunload', function () {
    isAccessible = false;
    handleOnLeave();
  });

  (globalThis as typeof window).addEventListener('blur', function () {
    isAccessible = true;
    handleOnLeave();
  });

  (globalThis as typeof window).addEventListener('focus', function () {
    pageLeft = false;
  });

  // Catches the page being hidden, including scenarios like closing the tab.
  document.addEventListener('pagehide', function () {
    isAccessible = document.visibilityState === 'hidden';
    handleOnLeave();
  });

  // Catches visibility changes, such as switching tabs or minimizing the browser.
  document.addEventListener('visibilitychange', () => {
    isAccessible = true;
    if (document.visibilityState === 'hidden') {
      handleOnLeave();
    } else {
      pageLeft = false;
    }
  });
};

export { onPageLeave };
