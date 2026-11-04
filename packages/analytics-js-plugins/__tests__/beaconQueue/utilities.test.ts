import type { BeaconQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { getDeliveryUrl, getNormalizedBeaconQueueOptions } from '../../src/beaconQueue/utilities';

describe('getDeliveryUrl', () => {
  it.each([
    ['https://events.example.com', 'https://events.example.com/beacon/v1/batch?writeKey=test-key'],
    ['https://events.example.com/', 'https://events.example.com/beacon/v1/batch?writeKey=test-key'],
    [
      'https://events.example.com/rs',
      'https://events.example.com/rs/beacon/v1/batch?writeKey=test-key',
    ],
  ])('preserves the default URL for %s', (dataplaneUrl, expected) => {
    expect(getDeliveryUrl(dataplaneUrl, 'test-key')).toBe(expected);
  });

  it.each([
    [
      'https://events.example.com',
      '/rs/batch',
      'https://events.example.com/rs/batch?writeKey=test-key',
    ],
    [
      'https://events.example.com/rs',
      '/batch',
      'https://events.example.com/rs/batch?writeKey=test-key',
    ],
    [
      'https://events.example.com/rs///',
      '//batch///',
      'https://events.example.com/rs/batch/?writeKey=test-key',
    ],
    [
      'https://events.example.com',
      'rs/batch',
      'https://events.example.com/rs/batch?writeKey=test-key',
    ],
  ])('joins %s with %s', (dataplaneUrl, deliveryPath, expected) => {
    expect(getDeliveryUrl(dataplaneUrl, 'test-key', deliveryPath)).toBe(expected);
  });

  it.each([undefined, null, '', '  \t\n', 42, false, {}, []])(
    'falls back to the default for invalid path %p',
    deliveryPath => {
      expect(
        getDeliveryUrl('https://events.example.com/rs', 'test-key', deliveryPath as string),
      ).toBe('https://events.example.com/rs/beacon/v1/batch?writeKey=test-key');
    },
  );
});

describe('getNormalizedBeaconQueueOptions', () => {
  it('defaults the delivery path', () => {
    expect(getNormalizedBeaconQueueOptions({}).deliveryPath).toBe('/beacon/v1/batch');
  });

  it('preserves a custom path and other queue options', () => {
    const options = { deliveryPath: '/rs/batch', maxItems: 3, flushQueueInterval: 500 };
    expect(getNormalizedBeaconQueueOptions(options)).toEqual(options);
  });

  it.each([undefined, null, '', '  \t\n', 42, false, {}, []])(
    'defaults invalid path %p without mutating the input',
    deliveryPath => {
      const options = { deliveryPath } as BeaconQueueOpts;
      expect(getNormalizedBeaconQueueOptions(options).deliveryPath).toBe('/beacon/v1/batch');
      expect(options.deliveryPath).toBe(deliveryPath);
    },
  );
});
