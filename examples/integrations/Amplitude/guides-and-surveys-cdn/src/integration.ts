const RUDDERSTACK_CDN_URL = 'https://cdn.rudderlabs.com/v3/modern/rsa.min.js';

type EventCallback = () => void;

interface RudderAnalytics {
  load: (
    writeKey: string,
    dataPlaneUrl: string,
    options?: { configUrl?: string; onLoaded?: EventCallback },
  ) => void;
  page: (
    category: string,
    name: string,
    properties?: Record<string, unknown>,
    callback?: EventCallback,
  ) => void;
  ready: (callback: EventCallback) => void;
  track: (name: string, properties?: Record<string, unknown>, callback?: EventCallback) => void;
}

interface AmplitudeAddResult {
  promise?: Promise<unknown>;
  then?: (resolve: () => void, reject: (reason: unknown) => void) => void;
}

interface AmplitudeAnalytics {
  add: (plugin: unknown) => AmplitudeAddResult | undefined;
  getDeviceId: () => string | undefined;
  getSessionId: () => number | undefined;
  getUserId: () => string | undefined;
}

interface EngagementRuntime {
  gs?: { list?: () => unknown[] };
  plugin: () => unknown;
  rc?: unknown;
}

declare global {
  interface Window {
    amplitude?: AmplitudeAnalytics;
    engagement?: EngagementRuntime;
    rudderanalytics?: RudderAnalytics;
  }
}

export type IntegrationStep = 'amplitude' | 'engagement' | 'rudderstack';
export type StepStatus = 'error' | 'loading' | 'ready' | 'waiting';

export interface IntegrationConfig {
  amplitudeApiKey: string;
  configUrl?: string;
  dataPlaneUrl: string;
  writeKey: string;
}

export interface IdentitySnapshot {
  deviceId?: string;
  sessionId?: number;
  userId?: string;
}

export interface IntegrationResult {
  analytics: RudderAnalytics;
  contentCount: number;
  identityAfterPlugin: IdentitySnapshot;
  identityBeforePlugin: IdentitySnapshot;
  identityPreserved: boolean;
  sdkVersion: string;
}

export type StatusReporter = (step: IntegrationStep, status: StepStatus, detail: string) => void;

const loadScript = (src: string, attributes: Record<string, string> = {}): Promise<void> =>
  new Promise((resolve, reject) => {
    const absoluteSrc = new URL(src, window.location.href).href;
    const existing = [...document.scripts].find(script => script.src === absoluteSrc);

    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = existing ?? document.createElement('script');
    Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
    script.async = true;
    script.src = src;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true },
    );
    script.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), {
      once: true,
    });

    if (!existing) {
      document.head.append(script);
    }
  });

const runInReadyCallback = <Result>(
  analytics: RudderAnalytics,
  callback: () => Promise<Result>,
  timeoutMs = 20_000,
): Promise<Result> =>
  new Promise((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error('RudderStack did not become ready within 20 seconds.')),
      timeoutMs,
    );

    analytics.ready(() => {
      window.clearTimeout(timeout);
      void callback().then(resolve, reject);
    });
  });

const getIdentity = (amplitude: AmplitudeAnalytics): IdentitySnapshot => ({
  deviceId: amplitude.getDeviceId(),
  sessionId: amplitude.getSessionId(),
  userId: amplitude.getUserId(),
});

const waitForAmplitudeIdentity = async (
  amplitude: AmplitudeAnalytics,
  timeoutMs = 5_000,
): Promise<void> => {
  const startedAt = Date.now();

  while (!amplitude.getDeviceId() || amplitude.getSessionId() === undefined) {
    if (Date.now() - startedAt >= timeoutMs) {
      throw new Error('Amplitude Browser SDK v2 did not initialize its native identity.');
    }
    await new Promise(resolve => window.setTimeout(resolve, 100));
  }
};

const awaitPluginRegistration = async (result: AmplitudeAddResult | undefined): Promise<void> => {
  if (result?.promise) {
    await result.promise;
    return;
  }

  if (typeof result?.then === 'function') {
    await new Promise<void>((resolve, reject) => result.then?.(resolve, reject));
  }
};

const findAmplitudeVersion = (): string => {
  const source = [...document.scripts]
    .map(script => script.src)
    .find(src => src.includes('analytics-browser-2.'));
  const match = source?.match(/analytics-browser-(\d+\.\d+\.\d+)/);
  return match?.[1] ?? 'Browser SDK v2';
};

export const initializeGuidesAndSurveys = async (
  config: IntegrationConfig,
  report: StatusReporter,
): Promise<IntegrationResult> => {
  report('rudderstack', 'loading', 'Loading the production v3 CDN bundle');
  await loadScript(RUDDERSTACK_CDN_URL, {
    'data-loader': 'RS_JS_SDK',
    'data-rsa-write-key': config.writeKey,
  });

  const analytics = window.rudderanalytics;
  if (!analytics) {
    throw new Error('The RudderStack CDN loaded without exposing window.rudderanalytics.');
  }

  const ready = runInReadyCallback(analytics, async () => {
    report('rudderstack', 'ready', 'Device-mode destinations are ready');

    const amplitude = window.amplitude;
    if (!amplitude?.add) {
      report('amplitude', 'error', 'Amplitude Browser SDK v2 was not found');
      throw new Error(
        'Amplitude Browser SDK v2 is unavailable. Check the destination connection mode and SDK version.',
      );
    }

    const sdkVersion = findAmplitudeVersion();
    try {
      await waitForAmplitudeIdentity(amplitude);
    } catch (error) {
      report('amplitude', 'error', 'Amplitude identity initialization timed out');
      throw error;
    }
    report('amplitude', 'ready', `${sdkVersion} is sharing the default Amplitude instance`);
    const identityBeforePlugin = getIdentity(amplitude);

    report('engagement', 'loading', 'Loading the project-specific Engagement bundle');
    try {
      await loadScript(`https://cdn.amplitude.com/script/${config.amplitudeApiKey}.engagement.js`);
    } catch (error) {
      report('engagement', 'error', 'The project-specific Engagement bundle failed to load');
      throw error;
    }

    const engagement = window.engagement;
    if (!engagement?.plugin) {
      report('engagement', 'error', 'The Engagement plugin API was not found');
      throw new Error('The Engagement bundle loaded without exposing window.engagement.plugin().');
    }

    await awaitPluginRegistration(amplitude.add(engagement.plugin()));
    const content = engagement.gs?.list?.();
    const identityAfterPlugin = getIdentity(amplitude);
    const identityPreserved =
      identityBeforePlugin.deviceId === identityAfterPlugin.deviceId &&
      identityBeforePlugin.sessionId === identityAfterPlugin.sessionId &&
      identityBeforePlugin.userId === identityAfterPlugin.userId;

    report(
      'engagement',
      'ready',
      `${Array.isArray(content) ? content.length : 0} targeted guide or survey item(s) available`,
    );

    return {
      analytics,
      contentCount: Array.isArray(content) ? content.length : 0,
      identityAfterPlugin,
      identityBeforePlugin,
      identityPreserved,
      sdkVersion,
    };
  });

  analytics.load(config.writeKey, config.dataPlaneUrl, {
    ...(config.configUrl ? { configUrl: config.configUrl } : {}),
  });
  return ready;
};
