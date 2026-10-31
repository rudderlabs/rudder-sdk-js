import { LOAD_ORIGIN } from './constants';

const defaultAsyncState = true;

/**
 * Script loader
 * @param {String} id                               Id of the script
 * @param {String} src                              URL of the script
 * @param {Object} options                          Object containing different configuration
 * @param {Boolean} options.async                   Determines script will be loaded asynchronously or not
 * @param {Boolean} options.isNonNativeSDK          Determines whether the script that will be loaded is one of RS's own
 * @param {Boolean} options.skipDatasetAttributes   Determines whether to add or skip dataset attribute
 * @param {String} options.integrity                Expected script integrity hash
 * @param {String} options.crossOrigin              Script CORS mode; defaults to anonymous with integrity
 */
const ScriptLoader = (id, src, options = {}) => {
  const exists = document.getElementById(id);
  if (exists) {
    // logger.debug("script already loaded");
    return;
  }

  const js = document.createElement('script');
  js.src = src;
  js.async = options.async === undefined ? defaultAsyncState : options.async;
  js.type = 'text/javascript';
  js.id = id;
  if (options.integrity) {
    js.integrity = options.integrity;
  }
  if (options.crossOrigin || options.integrity) {
    js.crossOrigin = options.crossOrigin || 'anonymous';
  }
  // This checking is in place to skip the dataset attribute for some cases(while loading polyfill)
  if (options.skipDatasetAttributes !== true) {
    js.dataset.loader = LOAD_ORIGIN;
    if (options.isNonNativeSDK !== undefined) {
      js.dataset.isnonnativesdk = String(options.isNonNativeSDK);
    }
  }
  const headElmColl = document.getElementsByTagName('head');
  if (headElmColl.length > 0) {
    // logger.debug("==adding script==", js);
    headElmColl[0].insertBefore(js, headElmColl[0].firstChild);
  } else {
    const e = document.getElementsByTagName('script')[0];
    // logger.debug("==parent script==", e);
    // logger.debug("==adding script==", js);
    e.parentNode.insertBefore(js, e);
  }
};

export { ScriptLoader };
