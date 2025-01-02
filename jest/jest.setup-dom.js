jest.setTimeout(60000);

const documentHTML = '<!doctype html><html><head></head><body><div id="root"></div></body></html>';

global.window.document.body.innerHTML = documentHTML;
global.window.innerWidth = 1680;
global.window.innerHeight = 1024;
global.window.__BUNDLE_ALL_PLUGINS__ = false;
global.window.__IS_LEGACY_BUILD__ = false;
global.window.__IS_DYNAMIC_CUSTOM_BUNDLE__ = false;

// Only define the mock if it's not already defined (e.g., in a real browser)
if (typeof PromiseRejectionEvent === 'undefined') {
  // Mock class (very minimal)
  class PromiseRejectionEvent extends Event {
    constructor(type, eventInitDict) {
      super(type, eventInitDict);
      this.promise = eventInitDict?.promise;
      this.reason = eventInitDict?.reason;
    }
  }

  // Attach it to the global object so tests can use it.
  global.PromiseRejectionEvent = PromiseRejectionEvent;
  // If you rely on "window" instead:
  // global.window.PromiseRejectionEvent = PromiseRejectionEvent;
}

// TODO: remove once we use globalThis in analytics v1.1 too
// Setup mocking for window.navigator
const defaultUserAgent = window.navigator.userAgent;
const defaultLanguage = window.navigator.language;

Object.defineProperty(
  window.navigator,
  'userAgent',
  (value => ({
    get() {
      return value || defaultUserAgent;
    },
    set(v) {
      value = v;
    },
  }))(window.navigator.userAgent),
);

Object.defineProperty(
  window.navigator,
  'brave',
  (value => ({
    get() {
      return value;
    },
    set(v) {
      value = v;
    },
  }))(window.navigator.brave),
);

Object.defineProperty(
  window.navigator,
  'language',
  (value => ({
    get() {
      return value || defaultLanguage;
    },
    set(v) {
      value = v;
    },
  }))(window.navigator.language),
);
