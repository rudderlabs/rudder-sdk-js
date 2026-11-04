import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
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

  it('accepts unreserved characters in segments', () => {
    expect(getDeliveryUrl('https://events.example.com', 'test-key', '/a-b_c~d/e.f')).toBe(
      'https://events.example.com/a-b_c~d/e.f?writeKey=test-key',
    );
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
    '/...',
    '%2e%2e/batch',
    '..\\batch',
    '/a b',
    'https://evil.example.com/batch',
  ])('falls back to the default for invalid path %p', deliveryPath => {
    expect(
      getDeliveryUrl('https://events.example.com/rs', 'test-key', deliveryPath as string),
    ).toBe('https://events.example.com/rs/beacon/v1/batch?writeKey=test-key');
  });
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

  it('warns when a provided path is rejected', () => {
    const logger = { warn: jest.fn() } as unknown as ILogger;
    getNormalizedBeaconQueueOptions({ deliveryPath: '../batch' }, logger);
    expect(logger.warn).toHaveBeenCalledWith(
      'BeaconQueuePlugin:: The beacon queue delivery path "../batch" is invalid. A path may only contain letters, digits, "-", "_", "~", "." and "/", and no "." or ".." segments. Using the default path "/beacon/v1/batch".',
    );
  });

  it.each([undefined, '/rs/batch'])('does not warn for path %p', deliveryPath => {
    const logger = { warn: jest.fn() } as unknown as ILogger;
    getNormalizedBeaconQueueOptions({ deliveryPath }, logger);
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
