import { defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { ConfigManager } from '@rudderstack/analytics-js/components/configManager';
import { state } from '@rudderstack/analytics-js/state';
import { getSDKUrl } from '@rudderstack/analytics-js/components/configManager/util/commonUtil';
import { rest } from 'msw';
import { DEST_SDK_BASE_URL } from '@rudderstack/analytics-js/constants/urls';
import { batch, effect, signal } from '@preact/signals-core';
import { getSourceConfigURL } from '@rudderstack/analytics-js/components/utilities/loadOptions';
import { LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
import { server } from '../../../__fixtures__/msw.server';
import { dummySourceConfigResponse } from '../../../__fixtures__/fixtures';

jest.mock('../../../src/services/Logger', () => {
  const originalModule = jest.requireActual('../../../src/services/Logger');

  return {
    __esModule: true,
    ...originalModule,
    defaultLogger: {
      error: jest.fn((): void => {}),
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
  const errorMsg = 'Unable to load the SDK due to invalid write key: " "';
  const sampleWriteKey = '2LoR1TbVG2bcISXvy7DamldfkgO';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const sampleDestSDKUrl = 'https://www.sample.url/integrations';
  const sampleConfigUrl = 'https://dummy.dataplane.host.com';
  const sampleScriptURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.min.js';
  const lockIntegrationsVersion = false;

  const resetState = () => {
    batch(() => {
      state.lifecycle.writeKey.value = undefined;
      state.lifecycle.dataPlaneUrl.value = undefined;
      state.loadOptions.value.lockIntegrationsVersion = false;
      state.loadOptions.value.destSDKBaseURL = DEST_SDK_BASE_URL;
      state.loadOptions.value.logLevel = LogLevel.Error;
      state.loadOptions.value.configUrl = getSourceConfigURL();
    });
  };

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
    }).toThrow('Unable to load the SDK due to invalid data plane URL: " "');
  });

  it('should update lifecycle state with proper values', () => {
    getSDKUrl.mockImplementation(() => sampleScriptURL);

    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.lockIntegrationsVersion = false;
    state.loadOptions.value.destSDKBaseURL = sampleDestSDKUrl;
    state.loadOptions.value.logLevel = LogLevel.Debug;
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
      rest.get(`${sampleConfigUrl}/sourceConfigClone`, (req, res, ctx) => {
        counter.value = 1;
        return res(ctx.status(200), ctx.json(dummySourceConfigResponse));
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
    effect(() => {
      expect(configManagerInstance.processConfig).toHaveBeenCalled();
      done();
    });
  });
});
