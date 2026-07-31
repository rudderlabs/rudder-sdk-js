import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  filterReservedCustomContextKeys,
  prepareCustomContextUpdate,
} from '../../../src/components/customContext';

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

  it('copies retained keys without invoking the __proto__ setter', () => {
    const input = JSON.parse('{"__proto__":{"polluted":true},"plan":"pro"}') as Record<
      string,
      unknown
    >;

    const retainedContext = filterReservedCustomContextKeys(input, logger);

    expect(Object.getPrototypeOf(retainedContext)).toBe(Object.prototype);
    expect(Object.hasOwn(retainedContext, '__proto__')).toBe(true);
    expect(retainedContext['__proto__']).toEqual({ polluted: true });
    expect(retainedContext.plan).toBe('pro');
  });

  it('returns retained values and segment-array deletion paths without marker-only branches', () => {
    expect(
      prepareCustomContextUpdate(
        {
          'region.code': null,
          account: {
            plan: undefined,
            seats: 5,
            preferences: { locale: null },
          },
        },
        logger,
      ),
    ).toEqual({
      context: { account: { seats: 5 } },
      deletionPaths: [['region.code'], ['account', 'plan'], ['account', 'preferences', 'locale']],
    });
  });

  it('retains explicitly supplied empty objects while pruning marker-only branches', () => {
    expect(
      prepareCustomContextUpdate(
        {
          empty: {},
          nested: {
            empty: {},
            removeMe: null,
          },
          markerOnly: {
            removeMe: undefined,
          },
        },
        logger,
      ),
    ).toEqual({
      context: {
        empty: {},
        nested: {
          empty: {},
        },
      },
      deletionPaths: [
        ['nested', 'removeMe'],
        ['markerOnly', 'removeMe'],
      ],
    });
  });

  it('accepts JSON-shaped values and preserves arrays for mergeDeepRight', () => {
    expect(
      prepareCustomContextUpdate(
        {
          experiment: 'checkout',
          enabled: true,
          allocation: 0.5,
          variants: ['control', { name: 'treatment', weights: [1, 2] }],
        },
        logger,
      ),
    ).toEqual({
      context: {
        experiment: 'checkout',
        enabled: true,
        allocation: 0.5,
        variants: ['control', { name: 'treatment', weights: [1, 2] }],
      },
      deletionPaths: [],
    });
  });

  it('accepts and defensively clones valid dates at object and array positions', () => {
    const objectDate = new Date('2026-07-21T00:00:00.000Z');
    const arrayDate = new Date('2026-07-22T00:00:00.000Z');
    const result = prepareCustomContextUpdate(
      {
        startedAt: objectDate,
        milestones: [arrayDate],
      },
      logger,
    )!;

    objectDate.setUTCFullYear(2030);
    arrayDate.setUTCFullYear(2030);

    expect(result).toEqual({
      context: {
        startedAt: new Date('2026-07-21T00:00:00.000Z'),
        milestones: [new Date('2026-07-22T00:00:00.000Z')],
      },
      deletionPaths: [],
    });
    expect(result.context.startedAt).not.toBe(objectDate);
    expect(result.context.milestones).not.toContain(arrayDate);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['an array', []],
    ['a function', () => undefined],
    ['a date', new Date('2026-07-21T00:00:00.000Z')],
    ['an object with a custom prototype', Object.create({})],
    ['an object with a null-parent custom prototype', Object.create(Object.create(null))],
    ['an object with a spoofed Object constructor', Object.create({ constructor: Object })],
  ])('rejects %s as the top-level update', (_, input) => {
    expect(prepareCustomContextUpdate(input, logger)).toBeUndefined();
    expect(logger.warn).toHaveBeenCalledWith(
      'CustomContext:: The custom context update is invalid. Use a plain object containing only supported context values.',
    );
  });

  it.each([
    ['a function', () => undefined],
    ['a symbol', Symbol('secret')],
    ['an invalid date', new Date('invalid')],
    ['a map', new Map([['key', 'value']])],
    ['a set', new Set(['value'])],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])('rejects an update containing %s atomically', (_, invalidValue) => {
    expect(
      prepareCustomContextUpdate({ removeMe: null, valid: 'value', invalid: invalidValue }, logger),
    ).toBeUndefined();
  });

  it.each([
    ['a root __proto__ key', JSON.parse('{"__proto__":{"polluted":true}}')],
    [
      'a nested constructor key',
      { account: JSON.parse('{"constructor":{"prototype":{"polluted":true}}}') },
    ],
    ['a prototype key inside an array object', { items: [JSON.parse('{"prototype":{}}')] }],
  ])('rejects an update containing %s', (_, input) => {
    expect(prepareCustomContextUpdate(input, logger)).toBeUndefined();
    expect(logger.warn).toHaveBeenCalledWith(
      'CustomContext:: The custom context update is invalid. Use a plain object containing only supported context values.',
    );
    expect(Object.prototype).not.toHaveProperty('polluted');
  });

  it.each([
    ['a direct null entry', ['control', null]],
    ['a direct undefined entry', ['control', undefined]],
    [
      'a sparse array entry',
      (() => {
        const sparseArray: string[] = [];
        sparseArray[1] = 'treatment';
        return sparseArray;
      })(),
    ],
    ['a null marker inside an array object', [{ removeMe: null }]],
    ['an undefined marker inside an array object', [{ removeMe: undefined }]],
    [
      'a null entry hidden by a custom iterator',
      Object.assign([null], {
        *[Symbol.iterator]() {
          yield 'control';
        },
      }),
    ],
  ])('rejects %s instead of treating it as a deletion scope', (_, variants) => {
    expect(prepareCustomContextUpdate({ variants }, logger)).toBeUndefined();
  });

  it('sanitizes BigInt and circular references using the existing SDK behavior', () => {
    const context: Record<string, unknown> = { id: BigInt(123) };
    context.self = context;

    expect(prepareCustomContextUpdate(context, logger)).toEqual({
      context: { id: '[BigInt]', self: '[Circular Reference]' },
      deletionPaths: [],
    });
    expect(logger.warn).toHaveBeenCalledTimes(2);
  });

  it('does not treat a reused non-circular object as a circular reference', () => {
    const shared = { cohort: 'A' };

    expect(prepareCustomContextUpdate({ first: shared, second: shared }, logger)).toEqual({
      context: { first: { cohort: 'A' }, second: { cohort: 'A' } },
      deletionPaths: [],
    });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('records path-dependent deletions for every use of a shared object', () => {
    const shared = { cohort: 'A', removeMe: null };

    expect(prepareCustomContextUpdate({ first: shared, second: shared }, logger)).toEqual({
      context: { first: { cohort: 'A' }, second: { cohort: 'A' } },
      deletionPaths: [
        ['first', 'removeMe'],
        ['second', 'removeMe'],
      ],
    });
  });

  it('filters reserved root keys before inspecting or sanitizing their values', () => {
    const secretValue = 'must-not-appear-in-the-warning';
    const reservedCircularValue = JSON.parse(
      `{"__proto__":{"polluted":true},"secretValue":"${secretValue}"}`,
    ) as Record<string, unknown>;
    reservedCircularValue.self = reservedCircularValue;

    expect(
      prepareCustomContextUpdate(
        {
          library: new Date('2026-07-21T00:00:00.000Z'),
          screen: reservedCircularValue,
          app: { library: 'nested names remain valid' },
        },
        logger,
      ),
    ).toEqual({
      context: { app: { library: 'nested names remain valid' } },
      deletionPaths: [],
    });
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenNthCalledWith(
      1,
      'CustomContext:: The top-level custom context property "library" is reserved and was ignored.',
    );
    expect(logger.warn.mock.calls.flat().join(' ')).not.toContain(secretValue);
  });

  it('returns defensive retained values and deletion paths', () => {
    const input = {
      account: { seats: 5, plan: null },
      variants: [{ name: 'control' }],
    };
    const result = prepareCustomContextUpdate(input, logger)!;
    const independentResult = prepareCustomContextUpdate(input, logger)!;

    input.account.seats = 10;
    input.variants[0]!.name = 'treatment';
    result.deletionPaths[0]!.push('mutated');

    expect(result.context).toEqual({
      account: { seats: 5 },
      variants: [{ name: 'control' }],
    });
    expect(independentResult.deletionPaths).toEqual([['account', 'plan']]);
  });
});
