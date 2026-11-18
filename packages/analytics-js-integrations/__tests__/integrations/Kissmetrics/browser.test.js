import Kissmetrics from '../../../src/integrations/Kissmetrics/browser';

describe('Kissmetrics type handling', () => {
  const integration = new Kissmetrics({}, {});

  afterEach(() => {
    delete window.KM;
  });

  it('recognizes the vendor object once loaded', () => {
    expect(integration.isLoaded()).toBe(false);
    window.KM = [];
    expect(integration.isLoaded()).toBe(false);
    window.KM = {};
    expect(integration.isLoaded()).toBe(true);
  });

  it('preserves numeric and boolean values and normalizes dates and nested arrays', () => {
    const flag = Object(false);
    const amount = Object(0);
    const cleaned = integration.clean({
      date: new Date('2024-01-01T00:00:00Z'),
      flag,
      amount,
      nested: { samples: [1, 2] },
      empty: {},
    });

    expect(cleaned).toEqual({ date: 1704067200, flag, amount, 'nested.samples': '1,2' });
    expect(cleaned.flag).toBe(flag);
    expect(cleaned.amount).toBe(amount);
  });

  it('flattens both ordinary nested properties and arrays when safe mode is off', () => {
    expect(integration.clean({ nested: { label: 'example' } })).toEqual({
      'nested.label': 'example',
    });
    expect(integration.flatten({ samples: [1, 2] })).toEqual({
      'samples.0': 1,
      'samples.1': 2,
    });
  });
});
