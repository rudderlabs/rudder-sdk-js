import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { prepareCustomContextUpdate } from '../../../src/components/customContext';

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

describe('custom context browser utilities', () => {
  it('accepts plain objects created with a different realm prototype', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const foreignObjectPrototype = iframe.contentWindow!.Object.prototype;
    const crossRealmContext = Object.assign(Object.create(foreignObjectPrototype), {
      region: 'EU',
    });

    try {
      expect(prepareCustomContextUpdate(crossRealmContext, new MockLogger())).toEqual({
        context: { region: 'EU' },
        deletionPaths: [],
      });
    } finally {
      iframe.remove();
    }
  });

  it('accepts valid dates created in a different realm', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const crossRealmDate = new iframe.contentWindow!.Date('2026-07-29T00:00:00.000Z');

    try {
      const result = prepareCustomContextUpdate(
        {
          occurredAt: crossRealmDate,
          milestones: [crossRealmDate],
        },
        new MockLogger(),
      )!;

      expect(result.context).toEqual({
        occurredAt: new Date('2026-07-29T00:00:00.000Z'),
        milestones: [new Date('2026-07-29T00:00:00.000Z')],
      });
      expect(result.context.occurredAt).not.toBe(crossRealmDate);
      expect(result.context.milestones).not.toContain(crossRealmDate);
    } finally {
      iframe.remove();
    }
  });
});
