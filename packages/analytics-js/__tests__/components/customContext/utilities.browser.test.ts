import { Logger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { prepareCustomContextUpdate } from '../../../src/components/customContext';

describe('custom context browser utilities', () => {
  it('accepts plain objects created with a different realm prototype', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const foreignObjectPrototype = iframe.contentWindow!.Object.prototype;
    const crossRealmContext = Object.assign(Object.create(foreignObjectPrototype), {
      region: 'EU',
    });

    try {
      expect(prepareCustomContextUpdate(crossRealmContext, new Logger())).toEqual({
        region: 'EU',
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
        new Logger(),
      )!;

      expect(result).toEqual({
        occurredAt: new Date('2026-07-29T00:00:00.000Z'),
        milestones: [new Date('2026-07-29T00:00:00.000Z')],
      });
      expect(result.occurredAt).not.toBe(crossRealmDate);
      expect(result.milestones).not.toContain(crossRealmDate);
    } finally {
      iframe.remove();
    }
  });
});
