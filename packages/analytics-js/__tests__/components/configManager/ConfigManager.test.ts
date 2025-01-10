import { effect, signal } from '@preact/signals-core';
import { http, HttpResponse } from 'msw';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { ConfigManager } from '../../../src/components/configManager';
import { state, resetState } from '../../../src/state';
import { getSDKUrl } from '../../../src/components/configManager/util/commonUtil';
import { server } from '../../../__fixtures__/msw.server';
import { dummySourceConfigResponse } from '../../../__fixtures__/fixtures';
import type {
  ConfigResponseDestinationItem,
  SourceConfigResponse,
} from '../../../src/components/configManager/types';

jest.mock('../../../src/services/Logger', () => {
  const originalModule = jest.requireActual('../../../src/services/Logger');

  return {
    __esModule: true,
    ...originalModule,
    defaultLogger: {
      error: jest.fn((): void => {}),
      warn: jest.fn((): void => {}),
      setMinLogLevel: jest.fn((): void => {}),
    },
  };
});

jest.mock('../../../src/services/ErrorHandler', () => {
  const originalModule = jest.requireActual('../../../src/services/ErrorHandler');

  return {
    __esModule: true,
    ...originalModule,
    defaultErrorHandler: {
      onError: jest.fn((): void => {}),
    },
  };
});

jest.mock('../../../src/components/configManager/util/commonUtil.ts', () => {
  const originalModule = jest.requireActual(
    '../../../src/components/configManager/util/commonUtil.ts',
  );

  return {
    __esModule: true,
    ...originalModule,
    getSDKUrl: jest.fn(),
  };
});

describe('ConfigManager', () => {
  let configManagerInstance: ConfigManager;
  const sampleWriteKey = '2LoR1TbVG2bcISXvy7DamldfkgO';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const sampleDestSDKUrl = 'https://www.sample.url/integrations';
  const sampleConfigUrl = 'https://dummy.dataplane.host.com';
  const sampleScriptURL = 'https://www.dummy.url/fromScript/v3/rsa.min.js';
  const lockIntegrationsVersion = false;
  const lockPluginsVersion = false;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    configManagerInstance = new ConfigManager(
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
    resetState();
  });

  afterAll(() => {
    server.close();
  });

  it('should update lifecycle state with proper values', () => {
    getSDKUrl.mockImplementation(() => sampleScriptURL);

    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.destSDKBaseURL = sampleDestSDKUrl;
    state.loadOptions.value.logLevel = 'DEBUG';
    state.loadOptions.value.configUrl = sampleConfigUrl;
    state.loadOptions.value.lockIntegrationsVersion = lockIntegrationsVersion;
    state.loadOptions.value.lockPluginsVersion = lockPluginsVersion;

    const expectedConfigUrl = `${sampleConfigUrl}/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__&build=modern&writeKey=${sampleWriteKey}&lockIntegrationsVersion=${lockIntegrationsVersion}&lockPluginsVersion=${lockPluginsVersion}`;
    configManagerInstance.getConfig = jest.fn();

    configManagerInstance.init();

    expect(state.lifecycle.logLevel.value).toBe('DEBUG');
    expect(state.lifecycle.integrationsCDNPath.value).toBe(sampleDestSDKUrl);
    expect(state.lifecycle.sourceConfigUrl.value).toBe(expectedConfigUrl);
    expect(configManagerInstance.getConfig).toHaveBeenCalled();
  });
  it('should fetch configurations using sourceConfig endpoint', done => {
    state.lifecycle.sourceConfigUrl.value = `${sampleConfigUrl}/sourceConfigClone/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__&build=modern&writeKey=${sampleWriteKey}&lockIntegrationsVersion=${lockIntegrationsVersion}&lockPluginsVersion=${lockPluginsVersion}`;
    configManagerInstance.processConfig = jest.fn();

    const counter = signal(0);
    server.use(
      http.get(`${sampleConfigUrl}/sourceConfigClone`, () => {
        counter.value = 1;
        return new HttpResponse(JSON.stringify(dummySourceConfigResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
      }),
    );

    configManagerInstance.getConfig();

    effect(() => {
      if (counter.value === 1) {
        try {
          expect(counter.value).toEqual(1);
          done();
        } catch (error) {
          done(error);
        }
      }
    });
  });

  it('should fetch configurations from getSourceConfig load option if present', () => {
    state.loadOptions.value.getSourceConfig = () => dummySourceConfigResponse;
    configManagerInstance.processConfig = jest.fn();

    configManagerInstance.getConfig();

    expect(configManagerInstance.processConfig).toHaveBeenCalled();
  });

  it('should log an error if getSourceConfig load option is not a function', () => {
    // @ts-expect-error Testing invalid input
    state.loadOptions.value.getSourceConfig = dummySourceConfigResponse;
    configManagerInstance.processConfig = jest.fn();

    configManagerInstance.getConfig();

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'ConfigManager:: The "getSourceConfig" load API option must be a function that returns valid source configuration data.',
    );
  });

  it('should update source, destination, lifecycle and reporting state with proper values', () => {
    const expectedSourceState = {
      id: dummySourceConfigResponse.source.id,
      config: dummySourceConfigResponse.source.config,
      workspaceId: dummySourceConfigResponse.source.workspaceId,
      name: dummySourceConfigResponse.source.name,
    };
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;

    configManagerInstance.processConfig(dummySourceConfigResponse);

    expect(state.source.value).toStrictEqual(expectedSourceState);
    expect(state.lifecycle.status.value).toBe('configured');
    expect(state.reporting.isErrorReportingEnabled.value).toBe(
      dummySourceConfigResponse.source.config.statsCollection.errors.enabled,
    );
    expect(state.reporting.isMetricsReportingEnabled.value).toBe(
      dummySourceConfigResponse.source.config.statsCollection.metrics.enabled,
    );
  });

  it('should call the onError method of errorHandler for undefined sourceConfig response', () => {
    configManagerInstance.processConfig();

    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error('Failed to fetch the source config'),
      'ConfigManager',
      undefined,
    );
  });

  it('should handle error if the source config response is not parsable', () => {
    configManagerInstance.processConfig('{"key": "value"');

    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new SyntaxError("Expected ',' or '}' after property value in JSON at position 15"),
      'ConfigManager',
      'Unable to process/parse source configuration response',
    );
  });

  it('should handle error if the source config response is not valid', () => {
    configManagerInstance.processConfig({ key: 'value' });

    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error('Unable to process/parse source configuration response'),
      'ConfigManager',
      undefined,
    );
  });

  it('should log error and abort if source is disabled', () => {
    state.lifecycle.status.value = 'browserCapabilitiesReady';

    const sourceConfigResponse = {
      source: {
        id: 'someid',
        config: {},
        destinations: [] as ConfigResponseDestinationItem[],
        enabled: false,
      },
    } as SourceConfigResponse;
    configManagerInstance.processConfig(sourceConfigResponse);

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'The source is disabled. Please enable the source in the dashboard to send events.',
    );

    // No change in the life cycle status
    expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');
  });

  it('should not call the onError method of errorHandler for correct sourceConfig response in string format', () => {
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    configManagerInstance.processConfig(JSON.stringify(dummySourceConfigResponse));

    expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
  });

  it('should call the onError method of errorHandler for wrong sourceConfig response in string format', () => {
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    configManagerInstance.processConfig(JSON.stringify({ key: 'value' }));

    expect(defaultErrorHandler.onError).toHaveBeenCalled();
  });

  it('should fetch the source config and process the response', done => {
    state.lifecycle.sourceConfigUrl.value = `${sampleConfigUrl}/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__&build=modern&writeKey=${sampleWriteKey}&lockIntegrationsVersion=${lockIntegrationsVersion}&lockPluginsVersion=${lockPluginsVersion}`;
    configManagerInstance.processConfig = jest.fn();
    configManagerInstance.getConfig();
    setTimeout(() => {
      expect(configManagerInstance.processConfig).toHaveBeenCalled();
      done();
    }, 2000);
  });

  it('should set the data server URL in state if server side cookies feature is enabled', () => {
    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.useServerSideCookies = true;
    state.loadOptions.value.dataServiceEndpoint = '/my/own/endpoint/';
    state.loadOptions.value.configUrl = sampleConfigUrl;

    configManagerInstance.getConfig = jest.fn();

    configManagerInstance.init();

    expect(state.serverCookies.dataServiceUrl.value).toBe('https://test-host.com/my/own/endpoint');
  });

  it('should set the data server URL in state with default endpoint if server side cookies feature is enabled and dataServiceEndpoint is not provided', () => {
    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.useServerSideCookies = true;
    state.loadOptions.value.configUrl = sampleConfigUrl;

    configManagerInstance.getConfig = jest.fn();

    configManagerInstance.init();

    expect(state.serverCookies.dataServiceUrl.value).toBe('https://test-host.com/rsaRequest');
  });

  it('should disable server side cookies feature if provided endpoint is invalid', () => {
    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.useServerSideCookies = true;
    // it'll result in an invalid URL when combined with the top-level domain of the site
    state.loadOptions.value.dataServiceEndpoint = '?asdf?xyz';
    state.loadOptions.value.configUrl = sampleConfigUrl;

    configManagerInstance.getConfig = jest.fn();

    configManagerInstance.init();

    expect(state.serverCookies.dataServiceUrl.value).toBeUndefined();
    expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(false);
  });

  it('should log an error and exit if the provided integrations CDN URL is invalid', () => {
    state.loadOptions.value.destSDKBaseURL = 'invalid-url';
    const getConfigSpy = jest.spyOn(configManagerInstance, 'getConfig');

    configManagerInstance.init();

    expect(defaultLogger.error).toHaveBeenCalledWith(
      'ConfigManager:: The base URL "invalid-url" for integrations is not valid.',
    );
    expect(getConfigSpy).not.toHaveBeenCalled();
  });

  it('should not determine plugins CDN path if __BUNDLE_ALL_PLUGINS__ is true', () => {
    state.loadOptions.value.destSDKBaseURL = sampleDestSDKUrl;

    // @ts-expect-error Testing global variable
    // eslint-disable-next-line no-underscore-dangle
    global.window.__BUNDLE_ALL_PLUGINS__ = true;

    configManagerInstance.init();

    expect(state.lifecycle.pluginsCDNPath.value).toBeUndefined();

    // @ts-expect-error Testing global variable
    // eslint-disable-next-line no-underscore-dangle
    global.window.__BUNDLE_ALL_PLUGINS__ = false;
  });

  it('should log an error and exit if the provided plugins CDN URL is invalid', () => {
    state.loadOptions.value.destSDKBaseURL = sampleDestSDKUrl;
    state.loadOptions.value.pluginsSDKBaseURL = 'invalid-url';
    const getConfigSpy = jest.spyOn(configManagerInstance, 'getConfig');

    configManagerInstance.init();

    expect(defaultLogger.error).toHaveBeenCalledWith(
      'ConfigManager:: The base URL "invalid-url" for plugins is not valid.',
    );
    expect(getConfigSpy).not.toHaveBeenCalled();
  });

  it('should log an error if getSourceConfig load option is not a function', () => {
    // @ts-expect-error Testing for invalid input
    state.loadOptions.value.getSourceConfig = 'dummySourceConfigResponse';

    configManagerInstance.getConfig();

    expect(defaultLogger.error).toHaveBeenCalledWith(
      'ConfigManager:: The "getSourceConfig" load API option must be a function that returns valid source configuration data.',
    );
  });

  it('should fetch configuration from getSourceConfig load option even when it returns a promise', done => {
    state.loadOptions.value.getSourceConfig = () => Promise.resolve(dummySourceConfigResponse);

    configManagerInstance.getConfig();

    effect(() => {
      if (state.lifecycle.status.value === 'configured') {
        done();
      }
    });
  });

  it('should handle promise rejection errors from getSourceConfig function', done => {
    // @ts-expect-error Testing invalid input
    state.loadOptions.value.getSourceConfig = () => Promise.reject(new Error('Some error'));

    configManagerInstance.onError = jest.fn();

    configManagerInstance.getConfig();

    setTimeout(() => {
      expect(configManagerInstance.onError).toHaveBeenCalled();
      done();
    }, 1);
  });
});
