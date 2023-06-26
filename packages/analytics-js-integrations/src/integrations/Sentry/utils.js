/* eslint-disable no-param-reassign */
/* eslint-disable object-shorthand */
/* eslint-disable import/no-relative-packages */
import logger from '../../../../analytics-v1.1/src/utils/logUtil';
import { LOAD_ORIGIN } from '../../../../analytics-v1.1/src/utils/ScriptLoader';
import { isDefinedAndNotNullAndNotEmpty } from '../../utils/commonUtils';

const convertObjectToArray = (objectInput, propertyName) => {
  return objectInput
    .map(objectItem => objectItem[propertyName])
    .filter(e => isDefinedAndNotNullAndNotEmpty(e));
};

const SentryScriptLoader = (id, src, integrity) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement('script');
  js.src = src;
  js.integrity = integrity;
  js.crossOrigin = 'anonymous';
  js.type = 'text/javascript';
  js.id = id;
  js.setAttribute('data-loader', LOAD_ORIGIN);
  const e = document.getElementsByTagName('script')[0];
  logger.debug('==parent script==', e);
  logger.debug('==adding script==', js);
  e.parentNode.insertBefore(js, e);
};

const sentryInit = (
  allowUrls,
  denyUrls,
  ignoreErrors,
  includePathsArray,
  customVersionProperty,
  release,
  DSN,
  debugMode,
  environment,
  serverName,
) => {
  const formattedAllowUrls = convertObjectToArray(allowUrls, 'allowUrls');
  const formattedDenyUrls = convertObjectToArray(denyUrls, 'denyUrls');
  const formattedIgnoreErrors = convertObjectToArray(ignoreErrors, 'ignoreErrors');
  const formattedIncludePaths = convertObjectToArray(includePathsArray, 'includePaths');

  const customRelease = customVersionProperty ? window[customVersionProperty] : null;

  const sentryConfig = {
    dsn: DSN,
    debug: debugMode,
    environment: environment || null,
    release: customRelease || release || null,
    serverName: serverName || null,
    allowUrls: formattedAllowUrls,
    denyUrls: formattedDenyUrls,
    ignoreErrors: formattedIgnoreErrors,
  };

  let includePaths = [];

  if (formattedIncludePaths.length > 0) {
    // eslint-disable-next-line func-names
    includePaths = formattedIncludePaths.map(function (path) {
      let regex;
      try {
        regex = new RegExp(path);
      } catch (e) {
        // ignored
      }
      return regex;
    });
  }

  if (includePaths.length > 0) {
    sentryConfig.integrations = [];
    sentryConfig.integrations.push(
      new window.Sentry.Integrations.RewriteFrames({
        iteratee: function (frame) {
          // eslint-disable-next-line no-restricted-syntax
          for (const path of includePaths) {
            try {
              if (frame.filename.match(path)) {
                frame.in_app = true;
                return frame;
              }
            } catch (e) {
              // ignored
            }
          }
          frame.in_app = false;
          return frame;
        },
      }),
    );
  }
  return sentryConfig;
};

export { SentryScriptLoader, convertObjectToArray, sentryInit };
