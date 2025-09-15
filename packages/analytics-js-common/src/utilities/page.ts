import { isIE11 } from './detect';

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

    // Reset pageLeft on the next tick
    // to ensure callback executes for other listeners
    // when closing an inactive browser tab.
    setTimeout(() => {
      pageLeft = false;
    }, 0);
  }

  // Catches the unloading of the page (e.g., closing the tab or navigating away).
  // Includes user actions like clicking a link, entering a new URL,
  // refreshing the page, or closing the browser tab
  // Note that 'pagehide' is not supported in IE.
  // Registering this event conditionally for IE11 also because
  // it affects bfcache optimization on modern browsers otherwise.
  if (isIE11()) {
    (globalThis as typeof window).addEventListener('beforeunload', () => {
      isAccessible = false;
      handleOnLeave();
    });
  }

  // This is important for iOS Safari browser as it does not
  // fire the regular pagehide and visibilitychange events
  // when user goes to tablist view and closes the tab.
  (globalThis as typeof window).addEventListener('blur', () => {
    isAccessible = true;
    handleOnLeave();
  });

  (globalThis as typeof window).addEventListener('focus', () => {
    pageLeft = false;
  });

  // Catches the page being hidden, including scenarios like closing the tab.
  document.addEventListener('pagehide', () => {
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
