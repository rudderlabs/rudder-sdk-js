import { signal } from '@preact/signals-core';
import type { CustomContextState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { CustomContext } from '@rudderstack/analytics-js-common/types/CustomContext';
import { CustomContextStore } from '../../../src/components/customContext';

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

describe('CustomContextStore', () => {
  let logger: MockLogger;
  let store: CustomContextStore;
  let contextState: CustomContextState;

  beforeEach(() => {
    logger = new MockLogger();
    contextState = signal<CustomContext>({});
    store = new CustomContextStore(contextState, logger);
  });

  const setContext = (context: unknown): void => {
    store.set(context);
  };

  it('starts empty', () => {
    expect(store.get()).toEqual({});
  });

  it('deep merges repeated updates using the existing array-by-index contract', () => {
    setContext({
      account: { plan: 'pro', seats: 5 },
      variants: [{ name: 'control', weight: 50 }, 'legacy', 'retained'],
    });
    setContext({
      account: { plan: 'enterprise' },
      variants: [{ name: 'treatment' }, 'current'],
    });

    expect(store.get()).toEqual({
      account: { plan: 'enterprise', seats: 5 },
      variants: [{ name: 'treatment', weight: 50 }, 'current', 'retained'],
    });
  });

  it('treats an empty array update as a no-op for an existing array', () => {
    setContext({ tags: ['a', 'b', 'c'] });
    setContext({ tags: [] });

    expect(store.get()).toEqual({ tags: ['a', 'b', 'c'] });
  });

  it('deletes a complete array through its enclosing object property', () => {
    setContext({ tags: ['a', 'b', 'c'], region: 'EU' });
    setContext({ tags: null });

    expect(store.get()).toEqual({ region: 'EU' });
  });

  it('deletes top-level and nested paths while retaining an existing empty parent', () => {
    setContext({
      region: 'EU',
      account: { plan: 'pro', seats: 5 },
    });
    setContext({
      region: null,
      account: { plan: undefined, seats: null },
    });

    expect(store.get()).toEqual({ account: {} });
  });

  it('retains an empty parent when deleting a missing nested path', () => {
    setContext({ missing: { nested: null } });

    expect(store.get()).toEqual({ missing: {} });
  });

  it('applies deletion markers with user supplied values in one update', () => {
    const value = new Map([['key', 'value']]);
    setContext({ region: 'EU', account: { plan: 'pro' } });
    setContext({ region: null, value });

    expect(store.get()).toEqual({ account: { plan: 'pro' }, value });
  });

  it('does not apply object property cleanup to array entries', () => {
    setContext({
      variants: ['control', null, undefined, { removeMe: null }],
    });

    expect(store.get()).toStrictEqual({
      variants: ['control', null, undefined, { removeMe: null }],
    });
  });

  it('owns input values and returns deep defensive snapshots', () => {
    const input = {
      account: { plan: 'pro' },
      variants: [{ name: 'control' }],
    };
    setContext(input);

    input.account.plan = 'enterprise';
    input.variants[0]!.name = 'treatment';

    const firstSnapshot = store.get();
    (firstSnapshot.account as Record<string, unknown>).plan = 'free';
    (firstSnapshot.variants as Array<Record<string, unknown>>)[0]!.name = 'mutated';

    expect(store.get()).toEqual({
      account: { plan: 'pro' },
      variants: [{ name: 'control' }],
    });
  });

  it('owns date inputs and returns defensive date snapshots', () => {
    const inputDate = new Date('2026-07-21T00:00:00.000Z');
    setContext({ capturedAt: inputDate });
    inputDate.setUTCFullYear(2030);

    const firstSnapshot = store.get();
    const firstSnapshotDate = firstSnapshot.capturedAt as Date;
    firstSnapshotDate.setUTCFullYear(2031);

    const storedDate = store.get().capturedAt as Date;
    expect(storedDate).toEqual(new Date('2026-07-21T00:00:00.000Z'));
    expect(storedDate).not.toBe(inputDate);
    expect(storedDate).not.toBe(firstSnapshotDate);
  });

  it('clears the complete snapshot without retaining previous references', () => {
    setContext({ account: { plan: 'pro' } });
    const previousSnapshot = store.get();

    store.clear();
    (previousSnapshot.account as Record<string, unknown>).plan = 'mutated';

    expect(store.get()).toEqual({});
  });

  it('uses the provided state slice as the storage boundary', () => {
    const otherStore = new CustomContextStore(contextState, new MockLogger());
    setContext({ region: 'EU' });

    expect(contextState.value).toEqual({ region: 'EU' });
    expect(store.get()).toEqual({ region: 'EU' });
    expect(otherStore.get()).toEqual({ region: 'EU' });
  });
});
