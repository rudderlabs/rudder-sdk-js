import { EventRepository } from '@rudderstack/analytics-js/components/eventRepository';
import { defaultPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { state } from '@rudderstack/analytics-js/state';
import { batch } from '@preact/signals-core';

describe('EventRepository', () => {
  beforeEach(() => {
    batch(() => {
      state.lifecycle.writeKey.value = 'testWriteKey';
      state.lifecycle.activeDataplaneUrl.value = 'testDataPlaneUrl';
      state.loadOptions.value = {
        queueOptions: {
          flushAt: 1,
          flushInterval: 1,
          maxRetry: 1,
          backoffFactor: 1,
        },
        destinationsQueueOptions: {
          flushAt: 1,
        },
      };
    });
  });

  it('should invoke appropriate plugins start on init', () => {
    const eventRepository = new EventRepository(defaultPluginsManager);
    const spy = jest.spyOn(defaultPluginsManager, 'invokeSingle');
    eventRepository.init();
    expect(spy).nthCalledWith(1, 'dataplaneEventsQueue.init', state, undefined, undefined);
    expect(spy).nthCalledWith(2, 'destinationsEventsQueue.init', state, undefined, undefined);
    spy.mockRestore();
  });
});
