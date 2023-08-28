import { batch } from '@preact/signals-core';
import { EventRepository } from '@rudderstack/analytics-js/components/eventRepository';
import { state } from '@rudderstack/analytics-js/state';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager';

describe('EventRepository', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  const defaultStoreManager = new StoreManager(defaultPluginsManager);

  beforeEach(() => {
    batch(() => {
      state.lifecycle.writeKey.value = 'testWriteKey';
      state.lifecycle.activeDataplaneUrl.value = 'testDataPlaneUrl';
      state.loadOptions.value = {
        queueOptions: {
          maxItems: 1,
          flushInterval: 1,
          maxRetry: 1,
          backoffFactor: 1,
        },
        destinationsQueueOptions: {
          maxItems: 1,
        },
      };
    });
  });

  it('should invoke appropriate plugins start on init', () => {
    const eventRepository = new EventRepository(defaultPluginsManager, defaultStoreManager);
    const spy = jest.spyOn(defaultPluginsManager, 'invokeSingle');
    eventRepository.init();

    expect(spy).nthCalledWith(
      1,
      'dataplaneEventsQueue.init',
      state,
      expect.objectContaining({}),
      defaultStoreManager,
      undefined,
      undefined,
    );
    expect(spy).nthCalledWith(
      2,
      'destinationsEventsQueue.init',
      state,
      defaultPluginsManager,
      defaultStoreManager,
      undefined,
      undefined,
    );
    spy.mockRestore();
  });
});
