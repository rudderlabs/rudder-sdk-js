/* eslint-disable no-use-before-define */
import { handleError } from './errorHandler';
import { LOAD_ORIGIN } from './constants';

const defaultAsyncState = true;

/**
 * Script loader
 * @param {String} id                               Id of the script
 * @param {String} src                              URL of the script
 * @param {Object | undefined} options                          Object containing different configuration
 * @param {Boolean | undefined} options.async                   Determines script will be loaded asynchronously or not
 * @param {Boolean | undefined} options.isNonNativeSDK          Determines whether the script that will be loaded is one of RS's own
 * @param {Boolean | undefined} options.skipDatasetAttributes   Determines whether to add or skip dataset attribute
 */
const ScriptLoader = (id, src, options = {}) => {
  try {
    const exists = document.getElementById(id);
    if (exists) {
      return;
    }

    const js = document.createElement('script');
    js.src = src;
    js.async = options.async ?? defaultAsyncState;
    js.type = 'text/javascript';
    js.id = id;
    // This checking is in place to skip the dataset attribute for some cases(while loading polyfill)
    if (options.skipDatasetAttributes !== true) {
      js.setAttribute('data-loader', LOAD_ORIGIN);
      if (options.isNonNativeSDK !== undefined) {
        js.setAttribute('data-isNonNativeSDK', options.isNonNativeSDK);
      }
    }
    const headElmColl = document.getElementsByTagName('head');
    if (headElmColl.length > 0) {
      headElmColl[0].insertBefore(js, headElmColl[0].firstChild);
    } else {
      const e = document.getElementsByTagName('script')[0];
      e.parentNode.insertBefore(js, e);
    }
  } catch (e) {
    handleError(e);
  }
};

export { ScriptLoader };
