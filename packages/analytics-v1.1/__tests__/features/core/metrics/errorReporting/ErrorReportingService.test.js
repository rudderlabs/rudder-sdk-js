import { logger } from '@rudderstack/analytics-js-common/utilsV1/logUtil';
import { ErrorReportingService } from '../../../../../src/features/core/metrics/errorReporting/ErrorReportingService';

const errorReportingService = new ErrorReportingService(logger);
const DEFAULT_ERROR_REPORT_PROVIDER = 'rs-bugsnag';
const sourceId = 'random-source-id';

describe('Error reporting service Test suite', () => {
  test('Should print error message and return if source config or sourceId is not provided in init call', () => {
    const outcome = errorReportingService.init();
    expect(outcome).toBe(undefined);
  });
  test('Should not initialize provider if not enabled from source config in init call', () => {
    errorReportingService.init({ statsCollection: { errors: { enabled: false } } }, sourceId);
    expect(errorReportingService.isEnabled).toEqual(false);
  });
  test('Should initialize provider if enabled from source config in init call', async () => {
    errorReportingService.init({ statsCollection: { errors: { enabled: true } } }, sourceId);
    expect(errorReportingService.isEnabled).toEqual(true);
  });
  test('Should initialize default provider if enabled from source config but provider name is not there', async () => {
    window.bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));
    errorReportingService.exposeToGlobal = jest.fn();
    errorReportingService.onClientReady = jest.fn(() => errorReportingService.exposeToGlobal());
    errorReportingService.init({ statsCollection: { errors: { enabled: true } } }, sourceId);
    expect(errorReportingService.providerName).toEqual(DEFAULT_ERROR_REPORT_PROVIDER);
    expect(errorReportingService.onClientReady).toHaveBeenCalledTimes(1);
    expect(errorReportingService.exposeToGlobal).toHaveBeenCalledTimes(1);
  });
  test('Should not initialize provider if provider from source config does not match with SDK supported list', async () => {
    window.bugsnag = undefined;
    errorReportingService.init(
      { statsCollection: { errors: { enabled: true, provider: 'test' } } },
      sourceId,
    );
    expect(errorReportingService.provider.client).toEqual(undefined);
    expect(errorReportingService.onClientReady).toHaveBeenCalledTimes(0);
  });
  test('Should not initialize provider if the enabled flag is missing from the source config (default state is to not load)', async () => {
    window.bugsnag = undefined;
    errorReportingService.init({ statsCollection: { errors: { provider: 'test' } } }, sourceId);
    expect(errorReportingService.provider.client).toEqual(undefined);
    expect(errorReportingService.onClientReady).toHaveBeenCalledTimes(0);
  });
  test('Should not initialize provider if the error collection enabled flag is not a boolean', async () => {
    window.bugsnag = undefined;
    errorReportingService.init(
      { statsCollection: { errors: { enabled: 'true', provider: 'test' } } },
      sourceId,
    );
    expect(errorReportingService.provider.client).toEqual(undefined);
    expect(errorReportingService.onClientReady).toHaveBeenCalledTimes(0);
  });
});

describe('Bugsnag Test suite', () => {
  test('Should not initialize bugsnag if version > 6 of bugsnag is present in window scope', async () => {
    window.bugsnag = { _client: { _notifier: { version: '7.0.0' } } };
    errorReportingService.init({ statsCollection: { errors: { enabled: true } } }, sourceId);
    expect(errorReportingService.provider.client).toEqual(undefined);
  });
  test('Should not initialize bugsnag if version <6 of bugsnag is present in window scope', async () => {
    window.bugsnag = jest.fn(() => ({ notifier: { version: '4.0.0' } }));
    errorReportingService.init({ statsCollection: { errors: { enabled: true } } }, sourceId);
    expect(errorReportingService.provider.client).toEqual(undefined);
  });
  test('Should initialize bugsnag if version 6 of bugsnag is present in window scope', async () => {
    window.bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));
    errorReportingService.init({ statsCollection: { errors: { enabled: true } } }, sourceId);
    expect(errorReportingService.provider.client).not.toBe(undefined);
  });
  test('Should initialize Bugsnag if provider from source config matches with SDK supported list', async () => {
    window.bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));
    errorReportingService.init(
      { statsCollection: { errors: { enabled: true, provider: 'rs-bugsnag' } } },
      sourceId,
    );
    expect(errorReportingService.provider.client).not.toEqual(undefined);
  });
});
