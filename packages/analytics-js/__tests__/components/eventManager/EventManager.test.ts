import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { EventManager } from '../../../src/components/eventManager/EventManager';
import { EventRepository } from '../../../src/components/eventRepository/EventRepository';
import { UserSessionManager } from '../../../src/components/userSessionManager/UserSessionManager';
import { PluginEngine } from '../../../src/services/PluginEngine/PluginEngine';
import { StoreManager } from '../../../src/services/StoreManager/StoreManager';
import { PluginsManager } from '../../../src/components/pluginsManager/PluginsManager';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import type { APIEvent } from '@rudderstack/analytics-js-common/types/EventApi';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

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
    const enqueueSpy = jest.spyOn(eventRepository, 'enqueue').mockImplementation();

    eventManager.addEvent(apiEvent, customContext);

    expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(apiEvent, customContext);
    expect(enqueueSpy).toHaveBeenCalledWith(rudderEvent, undefined);
  });
});
