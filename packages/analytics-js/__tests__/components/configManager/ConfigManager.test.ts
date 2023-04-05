import { defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { ConfigManager } from '@rudderstack/analytics-js/components/configManager';
import { state } from '@rudderstack/analytics-js/state';
import { getSDKUrlInfo } from '@rudderstack/analytics-js/components/configManager/util/commonUtil';
import { server } from '../../../__mocks__/msw.server';
import { rest } from 'msw';
import { dummySourceConfigResponse } from '../../../__mocks__/fixtures';

jest.mock('../../../src/services/Logger', () => {
  const originalModule = jest.requireActual('../../../src/services/Logger');

  return {
    __esModule: true,
    ...originalModule,
    defaultLogger: {
      error: jest.fn((): void => {}),
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
    getSDKUrlInfo: jest.fn(),
  };
});

describe('ConfigManager', () => {
  let configManagerInstance: ConfigManager;
  const errorMsg = 'Unable to load the SDK due to invalid writeKey';
  const errorMsgSourceConfigResponse = 'Unable to fetch source config';
  const sampleWriteKey = '2LoR1TbVG2bcISXvy7DamldfkgO';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const sampleDestSDKUrl = 'https://www.sample.url/integrations';
  const sampleConfigUrl = 'https://dummy.dataplane.host.com';
  const sampleScriptURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.min.js';

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
  });

  afterAll(() => {
    server.close();
  });

  it('should throw an error for invalid writeKey', () => {
    state.lifecycle.writeKey.value = 'INVALID-WRITE-KEY';
    try {
      configManagerInstance.init();
    } catch (e) {
      expect(e.message).toBe(errorMsg);
    }
  });
  it('should throw error for invalid data plane url', () => {
    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = ' ';

    try {
      configManagerInstance.init();
    } catch (e) {
      expect(e.message).toBe('Unable to load the SDK due to invalid dataPlaneUrl');
    }
  });
  it('should update lifecycle state with proper values', () => {
    getSDKUrlInfo.mockImplementation(() => ({ sdkURL: sampleScriptURL, isStaging: false }));

    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.lockIntegrationsVersion = false;
    state.loadOptions.value.destSDKBaseURL = sampleDestSDKUrl;
    state.loadOptions.value.logLevel = 'DEBUG';
    state.loadOptions.value.configUrl = sampleConfigUrl;
    const expectedConfigUrl = `${sampleConfigUrl}/sourceConfig/?p=process.module_type&v=process.package_version&writeKey=${sampleWriteKey}`;

    configManagerInstance.init();

    expect(state.lifecycle.logLevel.value).toBe('DEBUG');
    expect(state.lifecycle.integrationsCDNPath.value).toBe(sampleDestSDKUrl);
    expect(state.lifecycle.sourceConfigUrl.value).toBe(expectedConfigUrl);
    expect(state.lifecycle.isStaging.value).toBe(false);
  });
  it('should fetch configurations using sourceConfig endpoint', () => {
    getSDKUrlInfo.mockImplementation(() => ({ sdkURL: sampleScriptURL, isStaging: false }));

    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.configUrl = sampleConfigUrl;

    let counter = 0;
    server.use(
      rest.get(`${sampleConfigUrl}/sourceConfig*`, (req, res, ctx) => {
        counter += 1;
        return res(ctx.status(200), ctx.json(dummySourceConfigResponse));
      }),
    );

    configManagerInstance.init();

    setTimeout(() => {
      expect(counter).toBe(1);
    }, 1);
  });

  it('should not fetch configurations using sourceConfig endpoint if getSourceConfig load option is present', () => {
    getSDKUrlInfo.mockImplementation(() => ({ sdkURL: sampleScriptURL, isStaging: false }));

    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.getSourceConfig = () => dummySourceConfigResponse;

    let counter = 0;
    server.use(
      rest.get(`${sampleConfigUrl}/sourceConfig*`, (req, res, ctx) => {
        counter += 1;
        return res(ctx.status(200), ctx.json(dummySourceConfigResponse));
      }),
    );

    configManagerInstance.init();

    setTimeout(() => {
      expect(counter).toBe(0);
    }, 1);
  });
  it('should update source, destination,lifecycle and reporting state with proper values', () => {
    getSDKUrlInfo.mockImplementation(() => ({ sdkURL: sampleScriptURL, isStaging: false }));

    const expectedSourceState = {
      id: dummySourceConfigResponse.source.id,
      config: dummySourceConfigResponse.source.config,
    };

    state.lifecycle.writeKey.value = sampleWriteKey;
    state.lifecycle.dataPlaneUrl.value = sampleDataPlaneUrl;
    state.loadOptions.value.configUrl = sampleConfigUrl;

    configManagerInstance.init();

    setTimeout(() => {
      expect(state.source.value).toBe(expectedSourceState);
      //   expect(state.destination.value).toBe(sampleDestSDKUrl);
      expect(state.lifecycle.activeDataplaneUrl.value).toBe(sampleDataPlaneUrl);
      expect(state.lifecycle.status.value).toBe('configured');
      expect(state.reporting.isErrorReportingEnabled.value).toBe(
        dummySourceConfigResponse.source.config.statsCollection.errorReports.enabled,
      );
      expect(state.reporting.isMetricsReportingEnabled.value).toBe(
        dummySourceConfigResponse.source.config.statsCollection.metrics.enabled,
      );
    }, 1);
  });
  it('should throw an error for undefined sourceConfig response', () => {
    try {
      configManagerInstance.processResponse(undefined);
    } catch (e) {
      expect(e.message).toBe(errorMsgSourceConfigResponse);
    }
  });
  it('should throw an error for sourceConfig response in string format', () => {
    try {
      configManagerInstance.processResponse(JSON.stringify(dummySourceConfigResponse));
    } catch (e) {
      expect(e.message).toBe(errorMsgSourceConfigResponse);
    }
  });
  it('should fetch the sourceConfig and call the callback with the response ', () => {
    state.lifecycle.sourceConfigUrl.value = `${sampleConfigUrl}/sourceConfig/?p=process.module_type&v=process.package_version&writeKey=${sampleWriteKey}`;
    configManagerInstance.processResponse = jest.fn();
    configManagerInstance.fetchSourceConfig();
    setTimeout(() => {
      expect(configManagerInstance.processResponse).toHaveBeenCalled();
    }, 1);
  });
});
