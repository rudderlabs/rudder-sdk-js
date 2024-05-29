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
  const errorMsg =
    'The write key " " is invalid. It must be a non-empty string. Please check that the write key is correct and try again.';
  const sampleWriteKey = '2LoR1TbVG2bcISXvy7DamldfkgO';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const sampleDestSDKUrl = 'https://www.sample.url/integrations';
  const sampleConfigUrl = 'https://dummy.dataplane.host.com';
  const sampleScriptURL = 'https://www.dummy.url/fromScript/v3/rsa.min.js';
  const lockIntegrationsVersion = false;

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

  it('should throw an error for invalid writeKey', () => {
    state.lifecycle.writeKey.value = ' ';
    expect(() => {
      configManagerInstance.init();
    }).toThrow(errorMsg);
  });

  it('should throw error for invalid data plane url', () => {
    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = ' ';
    expect(() => {
      configManagerInstance.init();
    }).toThrow(
      'The data plane URL " " is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.',
    );
  });

  it('should update lifecycle state with proper values', () => {
    getSDKUrl.mockImplementation(() => sampleScriptURL);

    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.lockIntegrationsVersion = false;
    state.loadOptions.value.destSDKBaseURL = sampleDestSDKUrl;
    state.loadOptions.value.logLevel = 'DEBUG';
    state.loadOptions.value.configUrl = sampleConfigUrl;
    state.loadOptions.value.lockIntegrationsVersion = lockIntegrationsVersion;
    const expectedConfigUrl = `${sampleConfigUrl}/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__&build=modern&writeKey=${sampleWriteKey}&lockIntegrationsVersion=${lockIntegrationsVersion}`;
    configManagerInstance.getConfig = jest.fn();

    configManagerInstance.init();

    expect(state.lifecycle.logLevel.value).toBe('DEBUG');
    expect(state.lifecycle.integrationsCDNPath.value).toBe(sampleDestSDKUrl);
    expect(state.lifecycle.sourceConfigUrl.value).toBe(expectedConfigUrl);
    expect(configManagerInstance.getConfig).toHaveBeenCalled();
  });
  it('should fetch configurations using sourceConfig endpoint', done => {
    state.lifecycle.sourceConfigUrl.value = `${sampleConfigUrl}/sourceConfigClone/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__&build=modern&writeKey=${sampleWriteKey}&lockIntegrationsVersion=${lockIntegrationsVersion}`;
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

  it('should update source, destination, lifecycle and reporting state with proper values', () => {
    const expectedSourceState = {
      id: dummySourceConfigResponse.source.id,
      config: dummySourceConfigResponse.source.config,
      workspaceId: dummySourceConfigResponse.source.workspaceId,
    };
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;

    configManagerInstance.processConfig(dummySourceConfigResponse);

    expect(state.source.value).toStrictEqual(expectedSourceState);
    expect(state.lifecycle.activeDataplaneUrl.value).toBe(sampleDataPlaneUrl);
    expect(state.lifecycle.status.value).toBe('configured');
    expect(state.reporting.isErrorReportingEnabled.value).toBe(
      dummySourceConfigResponse.source.config.statsCollection.errors.enabled,
    );
    expect(state.reporting.isMetricsReportingEnabled.value).toBe(
      dummySourceConfigResponse.source.config.statsCollection.metrics.enabled,
    );
  });

  it('should call the onError method of errorHandler for undefined sourceConfig response', () => {
    configManagerInstance.processConfig(undefined);

    expect(defaultErrorHandler.onError).toHaveBeenCalled();
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
    state.lifecycle.sourceConfigUrl.value = `${sampleConfigUrl}/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__&build=modern&writeKey=${sampleWriteKey}&lockIntegrationsVersion=${lockIntegrationsVersion}`;
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

    expect(state.serverCookies.dataServiceUrl.value).toBe('http://test-host.com/my/own/endpoint');
  });

  it('should set the data server URL in state with default endpoint if server side cookies feature is enabled and dataServiceEndpoint is not provided', () => {
    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.useServerSideCookies = true;
    state.loadOptions.value.configUrl = sampleConfigUrl;

    configManagerInstance.getConfig = jest.fn();

    configManagerInstance.init();

    expect(state.serverCookies.dataServiceUrl.value).toBe('http://test-host.com/rsaRequest');
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
});
