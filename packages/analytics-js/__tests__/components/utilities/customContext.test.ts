import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CONTEXT_RESERVED_ELEMENTS } from '../../../src/components/eventManager/constants';
import { normalizeCustomContextUpdate } from '../../../src/components/utilities/customContext';

class MockLogger implements ILogger {
  warn = jest.fn();
  log = jest.fn();
  error = jest.fn();
  info = jest.fn();
  debug = jest.fn();
  minLogLevel = 0;
  scope = 'test scope';
  setMinLogLevel = jest.fn();
  setScope = jest.fn();
  logProvider = console;
}

describe('custom context utilities', () => {
  let logger: MockLogger;

  beforeEach(() => {
    logger = new MockLogger();
  });

  it('extracts top-level and nested deletion markers while retaining empty parents', () => {
    const result = normalizeCustomContextUpdate(
      {
        region: null,
        account: {
          plan: undefined,
          seats: 5,
          preferences: {
            locale: null,
          },
        },
      },
      logger,
    );

    expect(result).toEqual({
      isValid: true,
      context: {
        account: {
          seats: 5,
          preferences: {},
        },
      },
      deletionPaths: [['region'], ['account', 'plan'], ['account', 'preferences', 'locale']],
    });
  });

  it('accepts JSON-shaped values and preserves the existing array-by-index input shape', () => {
    const result = normalizeCustomContextUpdate(
      {
        experiment: 'checkout',
        enabled: true,
        allocation: 0.5,
        variants: ['control', { name: 'treatment', weights: [1, 2] }],
      },
      logger,
    );

    expect(result).toEqual({
      isValid: true,
      context: {
        experiment: 'checkout',
        enabled: true,
        allocation: 0.5,
        variants: ['control', { name: 'treatment', weights: [1, 2] }],
      },
      deletionPaths: [],
    });
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['an array', []],
    ['a function', () => undefined],
    ['a date', new Date('2026-07-21T00:00:00.000Z')],
  ])('rejects %s as the top-level update', (_, input) => {
    expect(normalizeCustomContextUpdate(input, logger)).toEqual({ isValid: false });
    expect(logger.warn).toHaveBeenCalledWith(
      'CustomContext:: The custom context update is invalid. Use a plain object containing only JSON-shaped values.',
    );
  });

  it.each([
    ['a function', () => undefined],
    ['a symbol', Symbol('secret')],
    ['a date', new Date('2026-07-21T00:00:00.000Z')],
    ['a map', new Map([['key', 'value']])],
    ['a set', new Set(['value'])],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])('rejects an update containing %s atomically', (_, invalidValue) => {
    const result = normalizeCustomContextUpdate(
      {
        removeMe: null,
        valid: 'value',
        invalid: invalidValue,
      },
      logger,
    );

    expect(result).toEqual({ isValid: false });
    expect(logger.warn).toHaveBeenCalledWith(
      'CustomContext:: The custom context update is invalid. Use a plain object containing only JSON-shaped values.',
    );
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
  ])('rejects %s entries inside arrays instead of treating them as deletions', (_, marker) => {
    const result = normalizeCustomContextUpdate(
      {
        variants: ['control', marker, 'treatment'],
      },
      logger,
    );

    expect(result).toEqual({ isValid: false });
  });

  it('sanitizes BigInt and circular references using the existing SDK behavior', () => {
    const circularContext: Record<string, unknown> = {
      id: BigInt(123),
    };
    circularContext.self = circularContext;

    const result = normalizeCustomContextUpdate(circularContext, logger);

    expect(result).toEqual({
      isValid: true,
      context: {
        id: '[BigInt]',
        self: '[Circular Reference]',
      },
      deletionPaths: [],
    });
    expect(logger.warn).toHaveBeenCalledTimes(2);
  });

  it('drops attempted reserved keys and emits warnings without their values', () => {
    const secretValue = 'must-not-appear-in-the-warning';
    const result = normalizeCustomContextUpdate(
      {
        library: secretValue,
        screen: null,
        app: {
          library: 'nested-values-are-not-top-level-reserved-keys',
        },
      },
      logger,
    );

    expect(result).toEqual({
      isValid: true,
      context: {
        app: {
          library: 'nested-values-are-not-top-level-reserved-keys',
        },
      },
      deletionPaths: [],
    });
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenNthCalledWith(
      1,
      `CustomContext:: The "library" property defined under "custom context" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (${CONTEXT_RESERVED_ELEMENTS}).`,
    );
    expect(logger.warn).toHaveBeenNthCalledWith(
      2,
      `CustomContext:: The "screen" property defined under "custom context" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (${CONTEXT_RESERVED_ELEMENTS}).`,
    );
    expect(logger.warn.mock.calls.flat().join(' ')).not.toContain(secretValue);
  });

  it('returns an owned snapshot of retained values and deletion paths', () => {
    const input = {
      account: {
        seats: 5,
        plan: null,
      },
      variants: [{ name: 'control' }],
    };

    const result = normalizeCustomContextUpdate(input, logger);
    expect(result.isValid).toBe(true);

    input.account.seats = 10;
    input.variants[0]!.name = 'treatment';

    expect(result).toEqual({
      isValid: true,
      context: {
        account: {
          seats: 5,
        },
        variants: [{ name: 'control' }],
      },
      deletionPaths: [['account', 'plan']],
    });
  });
});
