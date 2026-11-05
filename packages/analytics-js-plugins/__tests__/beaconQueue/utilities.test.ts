import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
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

  it.each([
    ['/a-b_c~d/e.f', 'https://events.example.com/rs/a-b_c~d/e.f?writeKey=test-key'],
    ['/a:b@c!', 'https://events.example.com/rs/a:b@c!?writeKey=test-key'],
    ['/%41', 'https://events.example.com/rs/%41?writeKey=test-key'],
    [
      'https://evil.example.com/batch',
      'https://events.example.com/rs/https:/evil.example.com/batch?writeKey=test-key',
    ],
  ])('accepts %s as a path under the data plane URL', (deliveryPath, expected) => {
    expect(getDeliveryUrl('https://events.example.com/rs', 'test-key', deliveryPath)).toBe(
      expected,
    );
  });

  it('warns when a provided path is rejected', () => {
    const logger = { warn: jest.fn() } as unknown as ILogger;
    getDeliveryUrl('https://events.example.com/rs', 'test-key', '../batch', logger);
    expect(logger.warn).toHaveBeenCalledWith(
      'BeaconQueuePlugin:: The beacon queue delivery path "../batch" is invalid. It must be a URL path without a query, a fragment, or "." and ".." segments. Using the default path "/beacon/v1/batch".',
    );
  });

  it('warns without stringifying a null-prototype object', () => {
    const logger = { warn: jest.fn() } as unknown as ILogger;
    const deliveryPath = Object.create(null) as string;
    expect(getDeliveryUrl('https://events.example.com', 'test-key', deliveryPath, logger)).toBe(
      'https://events.example.com/beacon/v1/batch?writeKey=test-key',
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('delivery path "[non-string value]" is invalid'),
    );
  });

  it.each([undefined, null, '/rs/batch'])('does not warn for path %p', deliveryPath => {
    const logger = { warn: jest.fn() } as unknown as ILogger;
    getDeliveryUrl('https://events.example.com', 'test-key', deliveryPath as string, logger);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it.each([
    undefined,
    null,
    '',
    '  \t\n',
    42,
    false,
    {},
    [],
    '///',
    '/batch?x=1',
    '/batch#x',
    '../batch',
    './batch',
    '/rs/../batch',
    '%2e%2e/batch',
    '..\\batch',
    '/a b',
  ])('falls back to the default for invalid path %p', deliveryPath => {
    expect(
      getDeliveryUrl('https://events.example.com/rs', 'test-key', deliveryPath as string),
    ).toBe('https://events.example.com/rs/beacon/v1/batch?writeKey=test-key');
  });

  it.each(['\\', '/\\', '\\\\evil.example.com'])(
    'falls back to the default for %p on a root data plane URL',
    deliveryPath => {
      expect(getDeliveryUrl('https://events.example.com', 'test-key', deliveryPath)).toBe(
        'https://events.example.com/beacon/v1/batch?writeKey=test-key',
      );
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
});
