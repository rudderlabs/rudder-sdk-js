/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable object-shorthand */
import { DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/Sentry/constants';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import Logger from '../../utils/logger';
import { isDefinedAndNotNullAndNotEmpty } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

const convertObjectToArray = (objectInput, propertyName) =>
  objectInput
    .map(objectItem => objectItem[propertyName])
    .filter(e => isDefinedAndNotNullAndNotEmpty(e));

const SentryScriptLoader = (id, src, integrity) => {
  logger.info(`In script loader - ${id}`);
  const js = document.createElement('script');
  js.src = src;
  js.integrity = integrity;
  js.crossOrigin = 'anonymous';
  js.type = 'text/javascript';
  js.id = id;
  js.setAttribute('data-loader', LOAD_ORIGIN);
  const e = document.getElementsByTagName('script')[0];
  logger.info('==parent script==', e);
  logger.info('==adding script==', js);
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

  if (formattedIncludePaths.length > 0) {
    sentryConfig.integrations = [
      new window.Sentry.Integrations.RewriteFrames({
        iteratee(frame) {
          for (const path of formattedIncludePaths) {
            try {
              if (frame.filename.match(new RegExp(path))) {
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
    ];
  }
  return sentryConfig;
};

export { SentryScriptLoader, convertObjectToArray, sentryInit };
