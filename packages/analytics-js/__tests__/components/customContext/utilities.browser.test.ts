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
});
