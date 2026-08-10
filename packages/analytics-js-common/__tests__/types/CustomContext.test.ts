import type { CustomContext, InputCustomContext } from '../../src/types/CustomContext';
import type { IRudderAnalytics } from '../../src/types/IRudderAnalytics';
import type { LoadOptions } from '../../src/types/LoadOptions';

describe('CustomContext public types', () => {
  it('supports the approved load, runtime update, and snapshot surfaces', () => {
    const capturedAt = new Date('2026-07-28T00:00:00.000Z');
    const update: InputCustomContext = {
      region: 'EU',
      capturedAt,
      account: {
        plan: undefined,
        seats: 5,
      },
    };
    const loadOptions: Partial<LoadOptions> = { context: update };
    const snapshot: CustomContext = {
      region: 'EU',
      capturedAt,
      account: { seats: 5 },
    };

    const exercisePublicApi = (analytics: IRudderAnalytics) => {
      analytics.setCustomContext(update);
      const current: CustomContext = analytics.getCustomContext();
      analytics.clearCustomContext();
      return current;
    };

    expect(loadOptions.context).toBe(update);
    expect(snapshot.capturedAt).toBe(capturedAt);
    expect(exercisePublicApi).toEqual(expect.any(Function));
  });

  it('rejects unsupported public values at compile time', () => {
    const invalidUpdates: InputCustomContext[] = [
      // @ts-expect-error Map is not a supported custom context value
      { invalid: new Map([['key', 'value']]) },
      // @ts-expect-error functions are not supported custom context values
      { invalid: () => 'value' },
    ];

    expect(invalidUpdates).toHaveLength(2);
  });
});
