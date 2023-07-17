import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import logger from '../../utils/logUtil';

function loadNativeSdk(id, src, document) {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement('script');
  js.src = src;
  js.async = 1;
  js.setAttribute('data-loader', LOAD_ORIGIN);
  js.type = 'text/javascript';
  js.id = id;
  const e = document.getElementsByTagName('head')[0];
  logger.debug('==script==', e);
  e.appendChild(js);
}

export { loadNativeSdk };
