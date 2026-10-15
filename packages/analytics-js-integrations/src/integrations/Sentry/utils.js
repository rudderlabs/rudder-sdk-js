import { DISPLAY_NAME } from './constants';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';
import Logger from '../../utils/logger';
import { isDefinedAndNotNullAndNotEmpty } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

const convertObjectToArray = (objectInput = [], propertyName) =>
  objectInput
    .map(objectItem => objectItem[propertyName])
    .filter(e => isDefinedAndNotNullAndNotEmpty(e));

const SENTRY_SCRIPT_LOAD_TIMEOUT_IN_MS = 60000;

const isExpectedSentryScript = (scriptElement, src, integrity, isScriptReady) => {
  const loadStatus = scriptElement?.getAttribute('data-rudder-sentry-load-status');
  const loadStartedAt = Number(scriptElement?.getAttribute('data-rudder-sentry-load-started-at'));
  const isStillLoading =
    loadStatus === 'loading' && Date.now() - loadStartedAt < SENTRY_SCRIPT_LOAD_TIMEOUT_IN_MS;

  return !!(
    scriptElement?.src === src &&
    scriptElement?.integrity === integrity &&
    (isStillLoading || (loadStatus === 'loaded' && isScriptReady()))
  );
};

const SentryScriptLoader = (id, src, integrity, isScriptReady = () => true) => {
  const existingScript = document.getElementById(id);
  if (isExpectedSentryScript(existingScript, src, integrity, isScriptReady)) {
    return;
  }

  if (existingScript) {
    existingScript.remove();
  }

  logger.info(`In script loader - ${id}`);
  const js = document.createElement('script');
  js.src = src;
  js.integrity = integrity;
  js.crossOrigin = 'anonymous';
  js.async = false;
  js.type = 'text/javascript';
  js.id = id;
  js.setAttribute('data-loader', LOAD_ORIGIN);
  js.setAttribute('data-rudder-sentry-load-status', 'loading');
  js.setAttribute('data-rudder-sentry-load-started-at', Date.now().toString());
  js.onload = () => js.setAttribute('data-rudder-sentry-load-status', 'loaded');
  js.onerror = () => {
    js.setAttribute('data-rudder-sentry-load-status', 'failed');
    logger.error(`Failed to load script - ${id}`);
  };
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
    const rewriteFramesOptions = {
      iteratee(frame) {
        for (const path of formattedIncludePaths) {
          try {
            if (frame.filename?.match(new RegExp(path))) {
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
    };
    const rewriteFramesIntegration = window.Sentry.rewriteFramesIntegration
      ? window.Sentry.rewriteFramesIntegration(rewriteFramesOptions)
      : new window.Sentry.Integrations.RewriteFrames(rewriteFramesOptions);

    sentryConfig.integrations = [rewriteFramesIntegration];
  }
  return sentryConfig;
};

export { SentryScriptLoader, convertObjectToArray, sentryInit };
