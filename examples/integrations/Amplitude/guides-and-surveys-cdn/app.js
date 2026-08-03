const params = new URLSearchParams(window.location.search);
const AMPLITUDE_API_KEY = params.get('apiKey');
const RUDDERSTACK_CDN_URL = 'https://cdn.rudderlabs.com/v3/modern/rsa.min.js';
const ENGAGEMENT_CDN_URL = `https://cdn.amplitude.com/script/${AMPLITUDE_API_KEY}.engagement.js`;
const TEST_WRITE_KEY = 'amplitude-guides-surveys-cdn-test';
const TEST_DATA_PLANE_URL = 'https://example.invalid';

const writeKey = params.get('writeKey') || TEST_WRITE_KEY;
const dataPlaneUrl = params.get('dataPlaneUrl') || TEST_DATA_PLANE_URL;
const useControlPlane = params.has('writeKey') && params.has('dataPlaneUrl');

const report = {
  apiKey: AMPLITUDE_API_KEY,
  checks: [],
  identityBeforePlugin: null,
  identityAfterPlugin: null,
  mode: useControlPlane ? 'control-plane' : 'local-source-config',
  resources: [],
};

let finishTest;
window.__AMPLITUDE_GUIDES_SURVEYS_TEST__ = new Promise(resolve => {
  finishTest = resolve;
});

const addCheck = (description, passed, details) => {
  const check = { description, passed, details };
  report.checks.push(check);

  const element = document.createElement('li');
  element.className = `check ${passed ? 'passed' : 'failed'}`;
  element.textContent = details ? `${description}: ${details}` : description;
  document.querySelector('#checks').append(element);
};

const loadScript = (src, attributes = {}) =>
  new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript?.dataset.loaded === 'true') {
      resolve(existingScript);
      return;
    }

    const script = existingScript || document.createElement('script');
    Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
    script.src = src;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve(script);
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));

    if (!existingScript) {
      document.head.append(script);
    }
  });

const getIdentity = () => ({
  deviceId: window.amplitude?.getDeviceId?.(),
  sessionId: window.amplitude?.getSessionId?.(),
  userId: window.amplitude?.getUserId?.(),
});

const getLocalSourceConfig = () => ({
  source: {
    id: 'amplitude-guides-surveys-test-source',
    name: 'Amplitude Guides and Surveys CDN test',
    writeKey: TEST_WRITE_KEY,
    enabled: true,
    workspaceId: 'local-test-workspace',
    config: {
      statsCollection: {
        errors: { enabled: false },
        metrics: { enabled: false },
      },
    },
    destinations: [
      {
        id: 'amplitude-guides-surveys-test-destination',
        name: 'Amplitude Guides and Surveys test',
        enabled: true,
        config: {
          apiKey: AMPLITUDE_API_KEY,
          sdkVersion: 2,
          preferAnonymousIdForDeviceId: false,
          residencyServer: 'standard',
          attribution: false,
          eventUploadThreshold: 1,
          eventUploadPeriodMillis: 1000,
          trackAllPages: false,
          trackCategorizedPages: false,
          trackNamedPages: false,
        },
        destinationDefinitionId: 'amplitude-device-mode-test',
        destinationDefinition: {
          name: 'AM',
          displayName: 'Amplitude',
        },
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
      },
    ],
  },
});

const awaitAmplitudeAdd = async result => {
  if (result?.promise) {
    await result.promise;
  } else if (typeof result?.then === 'function') {
    await result;
  }
};

const runReadyChecks = async () => {
  try {
    addCheck(
      'RudderStack loaded from the production CDN',
      Boolean(document.querySelector(`script[src="${RUDDERSTACK_CDN_URL}"]`)),
      RUDDERSTACK_CDN_URL,
    );

    const amplitudeV2Script = [...document.scripts].find(script =>
      script.src.includes('analytics-browser-2.'),
    );
    addCheck(
      'RudderStack device mode loaded Amplitude Browser SDK v2',
      Boolean(amplitudeV2Script && window.amplitude?.add),
      amplitudeV2Script?.src || 'Amplitude Browser SDK v2 was not found',
    );

    report.identityBeforePlugin = getIdentity();
    addCheck(
      'Amplitude initialized a native device ID',
      Boolean(report.identityBeforePlugin.deviceId),
      report.identityBeforePlugin.deviceId || 'No device ID',
    );

    await loadScript(ENGAGEMENT_CDN_URL);
    addCheck(
      'Amplitude Engagement bundle loaded after RudderStack became ready',
      Boolean(window.engagement?.plugin),
      ENGAGEMENT_CDN_URL,
    );

    const addResult = window.amplitude.add(window.engagement.plugin());
    await awaitAmplitudeAdd(addResult);
    addCheck(
      'Engagement plugin registered through amplitude.add()',
      Boolean(window.engagement?.gs && window.engagement?.rc),
      window.engagement?.gs ? 'Guides & Surveys API is available' : 'Guides & Surveys API missing',
    );
    const liveContent = window.engagement?.gs?.list?.();
    addCheck(
      'Guides & Surveys runtime responds to content queries',
      Array.isArray(liveContent),
      Array.isArray(liveContent) ? `${liveContent.length} live item(s)` : 'No content response',
    );

    report.identityAfterPlugin = getIdentity();
    addCheck(
      'Plugin registration preserved the Amplitude device ID',
      report.identityBeforePlugin.deviceId === report.identityAfterPlugin.deviceId,
      report.identityAfterPlugin.deviceId || 'No device ID after registration',
    );
    addCheck(
      'Plugin registration preserved the Amplitude user ID',
      report.identityBeforePlugin.userId === report.identityAfterPlugin.userId,
      String(report.identityAfterPlugin.userId),
    );
    addCheck(
      'Plugin registration preserved the Amplitude session ID',
      report.identityBeforePlugin.sessionId === report.identityAfterPlugin.sessionId,
      String(report.identityAfterPlugin.sessionId),
    );

    const amplitudeAnalyticsScripts = [...document.scripts].filter(script =>
      script.src.includes('analytics-browser-'),
    );
    addCheck(
      'Only one Amplitude Analytics SDK instance was loaded',
      amplitudeAnalyticsScripts.length === 1,
      `${amplitudeAnalyticsScripts.length} analytics script(s)`,
    );

    report.resources = performance
      .getEntriesByType('resource')
      .map(entry => entry.name)
      .filter(url => url.includes('amplitude.com') || url.includes('rudderlabs.com'));
  } catch (error) {
    report.error = error instanceof Error ? error.message : String(error);
    addCheck('The ready callback completed without errors', false, report.error);
  } finally {
    const passed = report.checks.every(check => check.passed);
    const status = document.querySelector('#overall-status');
    status.className = `status ${passed ? 'passed' : 'failed'}`;
    status.textContent = passed ? 'All checks passed' : 'One or more checks failed';
    document.querySelector('#identity').textContent = JSON.stringify(
      {
        beforePlugin: report.identityBeforePlugin,
        afterPlugin: report.identityAfterPlugin,
      },
      null,
      2,
    );
    finishTest(report);
  }
};

const start = async () => {
  document.querySelector('#api-key').textContent = AMPLITUDE_API_KEY || 'Missing apiKey parameter';
  document.querySelector('#test-mode').textContent = useControlPlane
    ? 'Real RudderStack source configuration'
    : 'Local Amplitude v2 source configuration';

  try {
    if (!AMPLITUDE_API_KEY) {
      throw new Error('Add ?apiKey=YOUR_AMPLITUDE_API_KEY to the page URL');
    }

    await loadScript(RUDDERSTACK_CDN_URL, {
      'data-loader': 'RS_JS_SDK',
      'data-rsa-write-key': writeKey,
    });

    const loadOptions = {
      logLevel: 'DEBUG',
    };
    if (!useControlPlane) {
      loadOptions.getSourceConfig = getLocalSourceConfig;
    }

    window.rudderanalytics.ready(runReadyChecks);
    window.rudderanalytics.load(writeKey, dataPlaneUrl, loadOptions);
  } catch (error) {
    report.error = error instanceof Error ? error.message : String(error);
    addCheck('Test page initialized', false, report.error);
    document.querySelector('#overall-status').className = 'status failed';
    document.querySelector('#overall-status').textContent = 'Initialization failed';
    finishTest(report);
  }
};

start();
