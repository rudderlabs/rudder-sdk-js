jest.setTimeout(60000);

const documentHTML = '<!doctype html><html><head></head><body><div id="root"></div></body></html>';

global.window.document.body.innerHTML = documentHTML;
global.window.innerWidth = 1680;
global.window.innerHeight = 1024;
global.window.__BUNDLE_ALL_PLUGINS__ = false;
