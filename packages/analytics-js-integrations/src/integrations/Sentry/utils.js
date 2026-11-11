import { DISPLAY_NAME } from './constants';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';
import Logger from '../../utils/logger';
import { isDefinedAndNotNullAndNotEmpty } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

const convertObjectToArray = (propertyName, objectInput = []) =>
  objectInput
    .map(objectItem => objectItem[propertyName])
    .filter(e => isDefinedAndNotNullAndNotEmpty(e));

const SENTRY_SCRIPT_LOAD_TIMEOUT_IN_MS = 60000;

const isExpectedSentryScript = (scriptElement, src, integrity, isScriptReady) => {
  const loadStatus = scriptElement?.dataset.rudderSentryLoadStatus;
  const loadStartedAt = Number(scriptElement?.dataset.rudderSentryLoadStartedAt);
  const isStillLoading =
    loadStatus === 'loading' && Date.now() - loadStartedAt < SENTRY_SCRIPT_LOAD_TIMEOUT_IN_MS;

  return !!(
    scriptElement?.src === src &&
    scriptElement?.integrity === integrity &&
    (isStillLoading || (loadStatus === 'loaded' && isScriptReady()))
  );
};

const removeSentryScript = script => {
  // IE11 does not provide Element.remove().
  script?.parentNode?.removeChild(script); // NOSONAR
};

const SentryScriptLoader = (id, src, integrity, isScriptReady, insertAfterScriptId) => {
  const existingScript = document.getElementById(id);
  if (isExpectedSentryScript(existingScript, src, integrity, isScriptReady)) {
    return false;
  }

  removeSentryScript(existingScript);

  logger.info(`In script loader - ${id}`);
  const js = document.createElement('script');
  js.src = src;
  js.integrity = integrity;
  js.crossOrigin = 'anonymous';
  js.async = false;
  js.type = 'text/javascript';
  js.id = id;
  js.dataset.loader = LOAD_ORIGIN;
  js.dataset.rudderSentryLoadStatus = 'loading';
  js.dataset.rudderSentryLoadStartedAt = Date.now().toString();
  js.onload = () => {
    js.dataset.rudderSentryLoadStatus = 'loaded';
  };
  js.onerror = () => {
    js.dataset.rudderSentryLoadStatus = 'failed';
    logger.error(`Failed to load script - ${id}`);
  };
  const e = document.getElementsByTagName('script')[0];
  const precedingScript = insertAfterScriptId && document.getElementById(insertAfterScriptId);
  logger.info('==parent script==', e);
  logger.info('==adding script==', js);
  if (precedingScript) {
    precedingScript.parentNode.insertBefore(js, precedingScript.nextSibling);
  } else {
    e.parentNode.insertBefore(js, e);
  }
  return true;
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
  const formattedAllowUrls = convertObjectToArray('allowUrls', allowUrls);
  const formattedDenyUrls = convertObjectToArray('denyUrls', denyUrls);
  const formattedIgnoreErrors = convertObjectToArray('ignoreErrors', ignoreErrors);
  const formattedIncludePaths = convertObjectToArray('includePaths', includePathsArray);

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
    sentryConfig.integrations = [window.Sentry.rewriteFramesIntegration(rewriteFramesOptions)];
  }
  return sentryConfig;
};

export { SentryScriptLoader, convertObjectToArray, removeSentryScript, sentryInit };
