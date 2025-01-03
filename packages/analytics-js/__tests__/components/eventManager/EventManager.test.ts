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

describe('EventManager', () => {
  class MockErrorHandler implements IErrorHandler {
    onError = jest.fn();
    leaveBreadcrumb = jest.fn();
    notifyError = jest.fn();
    init = jest.fn();
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

  describe('addEvent', () => {
    it('should raise error if the event data is invalid', () => {
      eventManager.addEvent({
        // @ts-ignore
        type: 'test',
        event: 'test',
        properties: {
          test: 'test',
        },
      });

      expect(mockErrorHandler.onError).toHaveBeenCalledWith(
        new Error('Failed to generate the event object.'),
        'EventManager',
        undefined,
      );
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
});
