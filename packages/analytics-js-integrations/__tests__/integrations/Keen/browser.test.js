import Keen from '../../../src/integrations/Keen/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import {
  VENDOR_SDK_PIN_SUPPORT,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_FLOATING_URL,
} from '../../../src/integrations/Keen/constants';

jest.mock('@rudderstack/analytics-js-legacy-utilities/ScriptLoader', () => ({
  ScriptLoader: jest.fn(),
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  delete window.KeenTracking;
});

test('Keen uses the selected vendor artifact', () => {
  for (const loadOnlyIntegrations of [
    undefined,
    {},
    { All: { vendorSdkVersionPolicy: 'pinned' } },
    { All: { vendorSdkVersionPolicy: 'strict' }, Keen: {} },
  ]) {
    new Keen({ projectID: 'project-1', writeKey: 'write-key' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'keen-integration',
      'https://cdn.jsdelivr.net/npm/keen-tracking@4.5.2/dist/keen-tracking.min.js',
      {
        integrity: 'sha384-Dd7Qck+inqhWjAcIYexF1G0yv4CXpo/3yTw5Y+sYZWTO4cyW1/xH3/4qCeHHyNLs',
        crossOrigin: 'anonymous',
      },
    );
  }
  for (const loadOnlyIntegrations of [
    { All: { vendorSdkVersionPolicy: 'floating' } },
    { All: { vendorSdkVersionPolicy: 'strict' }, Keen: { vendorSdkVersionPolicy: 'floating' } },
  ]) {
    new Keen({ apiKey: 'key' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'keen-integration',
      'https://cdn.jsdelivr.net/npm/keen-tracking@4',
      {},
    );
  }
  expect(VENDOR_SDK_PIN_SUPPORT).toBe('full');
  expect(new URL(VENDOR_SDK_PINNED_URL).hostname).toBe(new URL(VENDOR_SDK_FLOATING_URL).hostname);
});

test('Keen retains initialization and event/addon contracts', () => {
  window.KeenTracking = jest
    .fn()
    .mockImplementation(() => ({ extendEvents: jest.fn(), recordEvent: jest.fn() }));
  const keen = new Keen({ projectID: 'project-1', writeKey: 'write-key', ipAddon: true }, {});
  keen.init();
  jest.advanceTimersByTime(1000);
  expect(window.KeenTracking).toHaveBeenCalledWith({
    projectId: 'project-1',
    writeKey: 'write-key',
  });
  expect(keen.isReady()).toBe(true);
  keen.track({ message: { event: 'Clicked', properties: { plan: 'pro' } } });
  expect(keen.client.recordEvent).toHaveBeenCalledWith(
    'Clicked',
    expect.objectContaining({
      plan: 'pro',
      ip_address: '${keen.ip}',
      keen: {
        addons: [{ name: 'keen:ip_to_geo', input: { ip: 'ip_address' }, output: 'ip_geo_info' }],
      },
    }),
  );
  keen.identify({ message: { userId: 'user-1', context: { traits: { plan: 'pro' } } } });
  expect(keen.client.extendEvents).toHaveBeenCalledWith(
    expect.objectContaining({ user: { userId: 'user-1', traits: { plan: 'pro' } } }),
  );
  keen.page({ message: { name: 'Home', properties: {} } });
  expect(keen.client.recordEvent).toHaveBeenLastCalledWith('Viewed Home page', expect.any(Object));
  expect(jest.getTimerCount()).toBe(0);
});
