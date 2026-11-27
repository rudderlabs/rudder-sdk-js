import { batch } from '@preact/signals-core';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { APIEvent } from '@rudderstack/analytics-js-common/types/EventApi';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { LOCAL_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { QueueStatuses } from '@rudderstack/analytics-js-common/constants/QueueStatuses';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import { XhrQueue } from '@rudderstack/analytics-js-plugins/xhrQueue';
import { EventManager } from '../../../src/components/eventManager/EventManager';
import { EventRepository } from '../../../src/components/eventRepository/EventRepository';
import { UserSessionManager } from '../../../src/components/userSessionManager/UserSessionManager';
import { PluginEngine } from '../../../src/services/PluginEngine/PluginEngine';
import { StoreManager } from '../../../src/services/StoreManager/StoreManager';
import { PluginsManager } from '../../../src/components/pluginsManager/PluginsManager';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import { state, resetState } from '../../../src/state';

describe('EventManager', () => {
  class MockErrorHandler implements IErrorHandler {
    onError = jest.fn();
    leaveBreadcrumb = jest.fn();
    httpClient: IHttpClient = defaultHttpClient;
    logger: ILogger = defaultLogger;
  }

  const mockErrorHandler = new MockErrorHandler();
  const pluginEngine = new PluginEngine(defaultLogger);
  const pluginsManager = new PluginsManager(pluginEngine, mockErrorHandler, defaultLogger);
  const storeManager = new StoreManager(pluginsManager, mockErrorHandler, defaultLogger);
  const eventRepository = new EventRepository(
    pluginsManager,
    storeManager,
    defaultHttpClient,
    mockErrorHandler,
    defaultLogger,
  );
  const userSessionManager = new UserSessionManager(
    pluginsManager,
    storeManager,
    defaultHttpClient,
    mockErrorHandler,
    defaultLogger,
  );
  const eventManager = new EventManager(
    eventRepository,
    userSessionManager,
    mockErrorHandler,
    defaultLogger,
  );

  describe('init', () => {
    it('should initialize on init', () => {
      const eventRepositoryInitSpy = jest.spyOn(eventRepository, 'init');
      eventManager.init();
      expect(eventRepositoryInitSpy).toHaveBeenCalled();

      eventRepositoryInitSpy.mockRestore();
    });
  });

  describe('resume', () => {
    it('should resume on resume', () => {
      const eventRepositoryResumeSpy = jest.spyOn(eventRepository, 'resume');
      eventManager.resume();
      expect(eventRepositoryResumeSpy).toHaveBeenCalled();

      eventRepositoryResumeSpy.mockRestore();
    });
  });

  it('forwards the invocation-time context snapshot to event construction', () => {
    const apiEvent = { type: 'track', name: 'Test event' } as APIEvent;
    const customContext = { region: 'EU' };
    const rudderEvent = { type: 'track' } as RudderEvent;
    const refreshSessionSpy = jest.spyOn(userSessionManager, 'refreshSession').mockImplementation();
    const createSpy = jest.spyOn(eventManager.eventFactory, 'create').mockReturnValue(rudderEvent);
    const enqueueSpy = jest.spyOn(eventRepository, 'enqueue').mockReturnValue(true);

    eventManager.addEvent(apiEvent, customContext);

    expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(apiEvent, customContext);
    expect(enqueueSpy).toHaveBeenCalledWith(rudderEvent, undefined);

    refreshSessionSpy.mockRestore();
    createSpy.mockRestore();
    enqueueSpy.mockRestore();
  });

  describe('sessionStart queue-acceptance lifecycle', () => {
    const createLocalStorageEntries = () => ({
      userId: { type: LOCAL_STORAGE, key: COOKIE_KEYS.userId },
      userTraits: { type: LOCAL_STORAGE, key: COOKIE_KEYS.userTraits },
      anonymousId: { type: LOCAL_STORAGE, key: COOKIE_KEYS.anonymousId },
      groupId: { type: LOCAL_STORAGE, key: COOKIE_KEYS.groupId },
      groupTraits: { type: LOCAL_STORAGE, key: COOKIE_KEYS.groupTraits },
      initialReferrer: { type: LOCAL_STORAGE, key: COOKIE_KEYS.initialReferrer },
      initialReferringDomain: { type: LOCAL_STORAGE, key: COOKIE_KEYS.initialReferringDomain },
      sessionInfo: { type: LOCAL_STORAGE, key: COOKIE_KEYS.sessionInfo },
      authToken: { type: LOCAL_STORAGE, key: COOKIE_KEYS.authToken },
    });

    const createSessionHarness = (options?: {
      autoTrack?: boolean;
      timeout?: number;
      cutOff?: { enabled: boolean; duration: number };
      lifecycleStatus?: string;
      dpEnqueueImpl?: (event: RudderEvent) => boolean;
      destEnqueueImpl?: (event: RudderEvent) => void;
    }) => {
      const dpEvents: RudderEvent[] = [];
      const destEvents: RudderEvent[] = [];
      const localErrorHandler = new MockErrorHandler();
      const localPluginEngine = new PluginEngine(defaultLogger);
      const localPluginsManager = new PluginsManager(
        localPluginEngine,
        localErrorHandler,
        defaultLogger,
      );

      const dpQueuePlugin: ExtensionPlugin = {
        name: 'TestDataplaneQueue',
        dataplaneEventsQueue: {
          init: () => ({
            scheduleTimeoutActive: false,
            start: jest.fn(),
            clear: jest.fn(),
          }),
          enqueue: (_state: any, _queue: any, event: RudderEvent) => {
            dpEvents.push(event);
            return options?.dpEnqueueImpl ? options.dpEnqueueImpl(event) : true;
          },
        },
      };

      const destQueuePlugin: ExtensionPlugin = {
        name: 'TestDestinationsQueue',
        destinationsEventsQueue: {
          init: () => ({
            scheduleTimeoutActive: false,
            start: jest.fn(),
            clear: jest.fn(),
          }),
          enqueue: (_state: any, _queue: any, event: RudderEvent) => {
            destEvents.push(event);
            options?.destEnqueueImpl?.(event);
          },
        },
      };

      localPluginsManager.register([dpQueuePlugin, destQueuePlugin]);

      const localStoreManager = new StoreManager(
        localPluginsManager,
        localErrorHandler,
        defaultLogger,
      );

      batch(() => {
        resetState();
        state.loadOptions.value.storage = {
          type: LOCAL_STORAGE,
        };
        state.loadOptions.value.sessions = {
          autoTrack: options?.autoTrack ?? true,
          timeout: options?.timeout ?? 30 * 60 * 1000,
          cutOff: options?.cutOff ?? { enabled: false },
        };
        state.lifecycle.status.value = options?.lifecycleStatus ?? 'readyExecuted';
        state.lifecycle.writeKey.value = 'test-write-key';
        state.lifecycle.activeDataplaneUrl.value = 'https://dataplane.example.com';
      });

      localStoreManager.init();
      state.storage.entries.value = createLocalStorageEntries();
      const localUserSessionManager = new UserSessionManager(
        localPluginsManager,
        localStoreManager,
        defaultHttpClient,
        localErrorHandler,
        defaultLogger,
      );
      localUserSessionManager.init();

      const localEventRepository = new EventRepository(
        localPluginsManager,
        localStoreManager,
        defaultHttpClient,
        localErrorHandler,
        defaultLogger,
      );
      localEventRepository.init();

      const localEventManager = new EventManager(
        localEventRepository,
        localUserSessionManager,
        localErrorHandler,
        defaultLogger,
      );

      return {
        dpEvents,
        destEvents,
        storeManager: localStoreManager,
        userSessionManager: localUserSessionManager,
        eventRepository: localEventRepository,
        eventManager: localEventManager,
      };
    };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
      window.localStorage.clear();
    });

    afterEach(() => {
      jest.useRealTimers();
      window.localStorage.clear();
      batch(() => {
        resetState();
      });
    });

    it('keeps sessionStart pending when the first event is rejected, sets it on the first accepted event, and omits it afterwards', () => {
      let attempt = 0;
      const { dpEvents, destEvents, eventManager: em } = createSessionHarness({
        dpEnqueueImpl: () => {
          attempt += 1;
          return attempt > 1;
        },
      });

      em.addEvent({ type: 'track', name: 'Event A' } as APIEvent, {});
      em.addEvent({ type: 'track', name: 'Event B' } as APIEvent, {});
      em.addEvent({ type: 'track', name: 'Event C' } as APIEvent, {});

      expect(dpEvents).toHaveLength(3);
      expect(destEvents).toHaveLength(3);
      expect(dpEvents[0].context.sessionId).toBeDefined();
      expect(dpEvents[0].context.sessionStart).toBe(true);
      // Partial acceptance: destination queue received Event A, while data-plane queue rejected it.
      expect(destEvents[0].context.sessionStart).toBe(true);

      // Event B is the first event accepted by the data-plane queue and must carry sessionStart.
      expect(dpEvents[1].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[1].context.sessionStart).toBe(true);

      // Event C must keep the same sessionId and omit sessionStart.
      expect(dpEvents[2].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[2].context.sessionStart).toBeUndefined();
    });

    it('clears sessionStart before invoking the event callback so synchronous follow-up events do not duplicate it', () => {
      const { dpEvents, eventManager: em } = createSessionHarness();

      em.addEvent(
        {
          type: 'track',
          name: 'Event A',
          callback: () => {
            em.addEvent({ type: 'track', name: 'Event B (from callback)' } as APIEvent, {});
          },
        } as APIEvent,
        {},
      );

      expect(dpEvents).toHaveLength(2);
      expect(dpEvents[0].context.sessionStart).toBe(true);
      expect(dpEvents[1].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[1].context.sessionStart).toBeUndefined();
    });

    it('emits sessionStart again after automatic session timeout expiry', () => {
      const { dpEvents, eventManager: em } = createSessionHarness({
        timeout: 60 * 1000,
      });

      em.addEvent({ type: 'track', name: 'Initial' } as APIEvent, {});
      expect(dpEvents[0].context.sessionStart).toBe(true);

      // Activity before timeout does not emit sessionStart again.
      jest.advanceTimersByTime(30 * 1000);
      em.addEvent({ type: 'track', name: 'Active' } as APIEvent, {});
      expect(dpEvents[1].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[1].context.sessionStart).toBeUndefined();

      // Advance past inactivity timeout.
      jest.advanceTimersByTime(61 * 1000);
      em.addEvent({ type: 'track', name: 'After timeout' } as APIEvent, {});
      em.addEvent({ type: 'track', name: 'Second after timeout' } as APIEvent, {});
      expect(dpEvents[2].context.sessionId).not.toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[2].context.sessionStart).toBe(true);
      expect(dpEvents[3].context.sessionId).toBe(dpEvents[2].context.sessionId);
      expect(dpEvents[3].context.sessionStart).toBeUndefined();
    });

    it('emits sessionStart again after automatic session cut-off expiry', () => {
      const { dpEvents, eventManager: em } = createSessionHarness({
        timeout: 60 * 1000,
        cutOff: { enabled: true, duration: 2 * 60 * 1000 },
      });

      em.addEvent({ type: 'track', name: 'Initial' } as APIEvent, {});
      expect(dpEvents[0].context.sessionStart).toBe(true);

      // Keep renewing within timeout until the cut-off duration is exceeded.
      jest.advanceTimersByTime(50 * 1000);
      em.addEvent({ type: 'track', name: 'Renew 1' } as APIEvent, {});
      expect(dpEvents[1].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[1].context.sessionStart).toBeUndefined();

      jest.advanceTimersByTime(50 * 1000);
      em.addEvent({ type: 'track', name: 'Renew 2' } as APIEvent, {});
      expect(dpEvents[2].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[2].context.sessionStart).toBeUndefined();

      jest.advanceTimersByTime(30 * 1000);
      em.addEvent({ type: 'track', name: 'After cut-off' } as APIEvent, {});
      em.addEvent({ type: 'track', name: 'Second after cut-off' } as APIEvent, {});
      expect(dpEvents[3].context.sessionId).not.toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[3].context.sessionStart).toBe(true);
      expect(dpEvents[4].context.sessionId).toBe(dpEvents[3].context.sessionId);
      expect(dpEvents[4].context.sessionStart).toBeUndefined();
    });

    it('handles manual startSession and endSession boundaries without consuming the marker early', () => {
      const { dpEvents, userSessionManager: usm, eventManager: em } = createSessionHarness({
        autoTrack: false,
      });

      usm.start(1700000000000);
      // Multiple refreshes before an event must not consume the marker.
      usm.refreshSession();
      usm.refreshSession();

      em.addEvent({ type: 'track', name: 'Manual 1' } as APIEvent, {});
      em.addEvent({ type: 'track', name: 'Manual 2' } as APIEvent, {});

      expect(dpEvents[0].context.sessionId).toBe(1700000000000);
      expect(dpEvents[0].context.sessionStart).toBe(true);
      expect(dpEvents[1].context.sessionId).toBe(1700000000000);
      expect(dpEvents[1].context.sessionStart).toBeUndefined();

      usm.end();
      em.addEvent({ type: 'track', name: 'After end' } as APIEvent, {});
      expect(dpEvents[2].context.sessionId).toBeUndefined();
      expect(dpEvents[2].context.sessionStart).toBeUndefined();
    });

    it('handles reset preserving the session versus replacing the session', () => {
      const { dpEvents, userSessionManager: usm, eventManager: em } = createSessionHarness();

      // Preserving session before acceptance keeps the marker pending.
      usm.reset({ entries: { sessionInfo: false } });
      em.addEvent({ type: 'track', name: 'First accepted' } as APIEvent, {});
      expect(dpEvents[0].context.sessionStart).toBe(true);

      // Preserving session after acceptance does not re-emit sessionStart.
      jest.advanceTimersByTime(1000);
      usm.reset({ entries: { sessionInfo: false } });
      em.addEvent({ type: 'track', name: 'After preserved reset' } as APIEvent, {});
      expect(dpEvents[1].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[1].context.sessionStart).toBeUndefined();

      // Replacing session emits sessionStart on the first accepted event of the new session.
      jest.advanceTimersByTime(1000);
      usm.reset();
      em.addEvent({ type: 'track', name: 'After replaced reset' } as APIEvent, {});
      em.addEvent({ type: 'track', name: 'Second in new session' } as APIEvent, {});

      expect(dpEvents[2].context.sessionId).not.toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[2].context.sessionStart).toBe(true);
      expect(dpEvents[3].context.sessionId).toBe(dpEvents[2].context.sessionId);
      expect(dpEvents[3].context.sessionStart).toBeUndefined();
    });

    it('handles buffered preload replay when the first buffered event is rejected', () => {
      let attempt = 0;
      const { dpEvents, eventManager: em } = createSessionHarness({
        lifecycleStatus: 'loaded',
        dpEnqueueImpl: () => {
          attempt += 1;
          return attempt > 1;
        },
      });

      batch(() => {
        em.addEvent({ type: 'track', name: 'Buffered A' } as APIEvent, {});
        em.addEvent({ type: 'track', name: 'Buffered B' } as APIEvent, {});
        em.addEvent({ type: 'track', name: 'Buffered C' } as APIEvent, {});
      });

      expect(dpEvents).toHaveLength(3);
      expect(dpEvents[0].context.sessionStart).toBe(true);
      expect(dpEvents[1].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[1].context.sessionStart).toBe(true);
      expect(dpEvents[2].context.sessionId).toBe(dpEvents[0].context.sessionId);
      expect(dpEvents[2].context.sessionStart).toBeUndefined();
    });

    it('preserves pending sessionStart across a reload before acceptance and omits it across a reload after acceptance', () => {
      // First load: session starts, first event is rejected, then page reloads.
      const firstLoad = createSessionHarness({
        dpEnqueueImpl: () => false,
      });
      firstLoad.eventManager.addEvent({ type: 'track', name: 'Rejected before reload' } as APIEvent, {});
      const initialSessionId = firstLoad.dpEvents[0].context.sessionId;
      expect(firstLoad.dpEvents[0].context.sessionStart).toBe(true);

      // Second load (reload before acceptance): first accepted event carries sessionStart.
      jest.advanceTimersByTime(5000);
      const secondLoad = createSessionHarness();
      secondLoad.eventManager.addEvent({ type: 'track', name: 'Accepted after reload' } as APIEvent, {});
      expect(secondLoad.dpEvents[0].context.sessionId).toBe(initialSessionId);
      expect(secondLoad.dpEvents[0].context.sessionStart).toBe(true);

      // Third load (reload after acceptance): next event omits sessionStart.
      jest.advanceTimersByTime(5000);
      const thirdLoad = createSessionHarness();
      thirdLoad.eventManager.addEvent({ type: 'track', name: 'After accepted reload' } as APIEvent, {});
      expect(thirdLoad.dpEvents[0].context.sessionId).toBe(initialSessionId);
      expect(thirdLoad.dpEvents[0].context.sessionStart).toBeUndefined();
    });

    it('does not emit a second sessionStart marker after upgrading with a legacy stored sessionStart true', () => {
      const legacySessionId = 1767225600000;
      const legacyStore = new StoreManager(
        new PluginsManager(new PluginEngine(defaultLogger), new MockErrorHandler(), defaultLogger),
        new MockErrorHandler(),
        defaultLogger,
      );
      batch(() => {
        resetState();
        state.loadOptions.value.storage = {
          type: LOCAL_STORAGE,
        };
      });
      legacyStore.init();
      state.storage.entries.value = createLocalStorageEntries();
      legacyStore.getStore('clientDataInLocalStorage')?.set(COOKIE_KEYS.sessionInfo, {
        id: legacySessionId,
        autoTrack: true,
        timeout: 30 * 60 * 1000,
        expiresAt: Date.now() + 30 * 60 * 1000,
        sessionStart: true,
      });

      const upgraded = createSessionHarness();
      upgraded.eventManager.addEvent({ type: 'track', name: 'Post-upgrade event' } as APIEvent, {});

      expect(upgraded.dpEvents[0].context.sessionId).toBe(legacySessionId);
      expect(upgraded.dpEvents[0].context.sessionStart).toBeUndefined();
    });

    it('recovers sessionStart end-to-end with XhrQueue when queue storage write fails on the first event', () => {
      const localErrorHandler = new MockErrorHandler();
      const localPluginEngine = new PluginEngine(defaultLogger);
      const localPluginsManager = new PluginsManager(
        localPluginEngine,
        localErrorHandler,
        defaultLogger,
      );
      localPluginsManager.register([XhrQueue()]);

      const localStoreManager = new StoreManager(
        localPluginsManager,
        localErrorHandler,
        defaultLogger,
      );

      batch(() => {
        resetState();
        state.loadOptions.value.storage = {
          type: LOCAL_STORAGE,
        };
        state.loadOptions.value.sessions = {
          autoTrack: true,
          timeout: 30 * 60 * 1000,
          cutOff: { enabled: false },
        };
        state.lifecycle.status.value = 'readyExecuted';
        state.lifecycle.writeKey.value = 'test-write-key';
        state.lifecycle.activeDataplaneUrl.value = 'https://dataplane.example.com';
        // Keep queue paused so we can inspect queued events directly in storage.
        state.consents.preConsent.value = {
          enabled: true,
          events: { delivery: 'buffer' },
          storage: { strategy: 'session' },
        };
      });

      localStoreManager.init();
      state.storage.entries.value = createLocalStorageEntries();
      const localUserSessionManager = new UserSessionManager(
        localPluginsManager,
        localStoreManager,
        defaultHttpClient,
        localErrorHandler,
        defaultLogger,
      );
      localUserSessionManager.init();

      const localEventRepository = new EventRepository(
        localPluginsManager,
        localStoreManager,
        defaultHttpClient,
        localErrorHandler,
        defaultLogger,
      );
      localEventRepository.init();

      const localEventManager = new EventManager(
        localEventRepository,
        localUserSessionManager,
        localErrorHandler,
        defaultLogger,
      );

      const dpQueueStore = localEventRepository.dataplaneEventsQueue.store;
      const originalSetItem = dpQueueStore.engine.setItem.bind(dpQueueStore.engine);
      let failFirstQueueWrite = true;
      const setItemSpy = jest
        .spyOn(dpQueueStore.engine, 'setItem')
        .mockImplementation((key: string, value: any) => {
          if (failFirstQueueWrite && key.endsWith(`.${QueueStatuses.QUEUE}`)) {
            failFirstQueueWrite = false;
            throw new Error('NS_ERROR_STORAGE_BUSY');
          }
          return originalSetItem(key, value);
        });

      localEventManager.addEvent({ type: 'track', name: 'Event A' } as APIEvent, {});
      localEventManager.addEvent({ type: 'track', name: 'Event B' } as APIEvent, {});
      localEventManager.addEvent({ type: 'track', name: 'Event C' } as APIEvent, {});

      setItemSpy.mockRestore();

      const queuedItems = localEventRepository.dataplaneEventsQueue.getStorageEntry(
        QueueStatuses.QUEUE,
      );
      expect(queuedItems).toHaveLength(2);
      expect(queuedItems[0].item.event.event).toBe('Event B');
      expect(queuedItems[0].item.event.context.sessionStart).toBe(true);
      expect(queuedItems[1].item.event.event).toBe('Event C');
      expect(queuedItems[1].item.event.context.sessionId).toBe(
        queuedItems[0].item.event.context.sessionId,
      );
      expect(queuedItems[1].item.event.context.sessionStart).toBeUndefined();

      localEventRepository.dataplaneEventsQueue.stop();
    });
  });
});
