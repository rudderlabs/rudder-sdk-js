import * as R from 'ramda';
import { batch } from '@preact/signals-core';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import {
  AppInfo,
  LibraryInfo,
  OSInfo,
  ScreenInfo,
} from '@rudderstack/analytics-js-common/types/EventContext';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { RudderContext, RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { state } from '../../../src/state';
import {
  checkForReservedElements,
  checkForReservedElementsInObject,
  getContextPageProperties,
  getMergedContext,
  processOptions,
  updateTopLevelEventElements,
  getUpdatedPageProperties,
  getEnrichedEvent,
} from '../../../src/components/eventManager/utilities';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { defaultLogger } from '../../../src/services/Logger';

jest.mock('@rudderstack/analytics-js-common/utilities/timestamp', () => ({
  getCurrentTimeFormatted: jest.fn().mockReturnValue('2020-01-01T00:00:00.000Z'),
}));

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

const defaultAnonId = 'default-anon-id';
const defaultIntegrations = { All: false, 'Default Integration': true };
const defaultOriginalTimestamp = 'default-timestamp';

const sampleAnonId = 'sample-anon-id';
const sampleIntegrations = { All: true, 'Sample Integration': true };
const sampleOriginalTimestamp = 'sample-timestamp';

// @ts-ignore
const defaultContext = {
  library: {
    name: 'test',
    version: '1.0',
  },
  locale: 'en-US',
  app: {
    name: 'test',
    version: '1.0',
  },
  campaign: {
    name: 'test',
    source: 'test',
  },
  screen: {
    width: 1920,
    height: 1080,
  },
  'ua-ch': {
    brand: 'test',
    model: 'test',
  },
  userAgent: 'defaultUA',
} as RudderContext;

const resetApplicationState = () => {
  batch(() => {
    state.session.initialReferrer.value = undefined;
    state.session.initialReferringDomain.value = undefined;
  });
};

describe('Event Manager - Utilities', () => {
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

  const mockLogger = new MockLogger();

  const defaultEventType = 'test';
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  describe('getUpdatedPageProperties', () => {
    let pageProperties: ApiObject;
    beforeEach(() => {
      pageProperties = {
        path: '/test',
        referrer: 'https://www.google.com/test',
        search: '?test=true',
        title: 'test page',
        url: 'https://www.rudderlabs.com/test',
        referring_domain: 'www.google.com',
        tab_url: 'https://www.rudderlabs.com/test1',
        initial_referrer: 'https://www.google.com/test1',
        initial_referring_domain: 'www.google.com',
        anonymousId: defaultAnonId,
      } as ApiObject;
    });

    it('should return the input page properties if options is invalid', () => {
      const updatedPageProperties = getUpdatedPageProperties(pageProperties, undefined);

      expect(updatedPageProperties).toEqual(pageProperties);
    });

    it('should return the input page properties if the page properties provided in options is undefined', () => {
      const apiOptions = {
        tempKey: 'tempValue',
      };

      const updatedPageProperties = getUpdatedPageProperties(pageProperties, apiOptions);

      expect(updatedPageProperties).toEqual(pageProperties);
    });

    it('should return the input page properties if the page properties provided in options is not a valid object', () => {
      const apiOptions = {
        page: 'some string',
      };

      const updatedPageProperties = getUpdatedPageProperties(pageProperties, apiOptions);

      expect(updatedPageProperties).toEqual(pageProperties);
    });

    it('should return the input page properties if the all the default page properties are defined', () => {
      // API options are irrelevant if all the default page properties are defined
      const updatedPageProperties = getUpdatedPageProperties(pageProperties, {});

      expect(updatedPageProperties).toEqual(pageProperties);
    });

    it('should return updated page properties if default page properties are overridden via options and input page parameters are not defined', () => {
      const optionsPageProperties = {
        path: '/test2',
        referrer: 'https://www.google.com/test',
        search: '?test=false',
        title: 'test page 2',
        url: 'https://www.rudderlabs.com/test2',
        referring_domain: 'www.google.com',
        tab_url: 'https://www.rudderlabs.com/test2',
        initial_referrer: 'https://www.google.com/test2',
        initial_referring_domain: 'www.google.com',
        anonymousId: defaultAnonId,
      };

      const apiOptions: ApiOptions = {
        page: optionsPageProperties,
      };

      // Reset the page properties
      pageProperties = {} as ApiObject;

      const updatedPageProperties = getUpdatedPageProperties(pageProperties, apiOptions);

      expect(updatedPageProperties).toEqual({
        path: optionsPageProperties.path,
        referrer: optionsPageProperties.referrer,
        search: optionsPageProperties.search,
        title: optionsPageProperties.title,
        url: optionsPageProperties.url,
        referring_domain: optionsPageProperties.referring_domain,
        tab_url: optionsPageProperties.tab_url,
        initial_referrer: optionsPageProperties.initial_referrer,
        initial_referring_domain: optionsPageProperties.initial_referring_domain,
      });
    });

    it('should return updated page properties from state if some page properties are not defined in options and input page parameters are not defined', () => {
      // Set some specific page properties in state
      batch(() => {
        state.session.initialReferrer.value = 'https://www.google.com/test3';
        state.session.initialReferringDomain.value = 'www.google3.com';
      });

      // Reset the page properties
      pageProperties.initial_referrer = undefined;
      pageProperties.initial_referring_domain = undefined;
      pageProperties.tab_url = undefined;
      pageProperties.path = undefined;
      pageProperties.referrer = undefined;

      // Set page properties in options that are not defined in state and input page parameters
      const optionsPageProperties = {
        path: '/test2',
        referrer: 'https://www.google.com/test',
      };

      const apiOptions: ApiOptions = {
        page: optionsPageProperties,
      };

      const updatedPageProperties = getUpdatedPageProperties(pageProperties, apiOptions);

      expect(updatedPageProperties).toEqual({
        path: optionsPageProperties.path,
        referrer: optionsPageProperties.referrer,
        search: pageProperties.search,
        title: pageProperties.title,
        url: pageProperties.url,
        referring_domain: pageProperties.referring_domain,
        tab_url: 'http://www.test-host.com/',
        initial_referrer: state.session.initialReferrer.value,
        initial_referring_domain: state.session.initialReferringDomain.value,
        anonymousId: pageProperties.anonymousId,
      });
    });
  });

  describe('getEnrichedEvent', () => {
    beforeEach(() => {
      resetApplicationState();
    });

    it('should return processed event if the event processor plugin is registered', () => {
      defaultPluginsManager.registerLocalPlugins();
      batch(() => {
        state.session.anonymousUserId.value = 'anon_id';
        state.session.userTraits.value = { test: 'test' };
        state.session.userId.value = 'user_id';
        state.session.sessionInfo.value = { sessionStart: true, id: 1234 } as SessionInfo;
        state.session.groupId.value = 'group_id';
        state.session.groupTraits.value = { test: 'test' };
        state.session.initialReferrer.value = 'https://test.com/page';
        state.session.initialReferringDomain.value = 'https://test.com';

        state.consents.data.value.deniedConsentIds = ['id1', 'id2'];

        state.context['ua-ch'].value = { mobile: true } as UADataValues;
        state.context.app.value = { name: 'test', version: '1.0' } as AppInfo;
        state.context.library.value = { name: 'test', version: '1.0' } as LibraryInfo;
        state.context.locale.value = 'en-US';
        state.context.userAgent.value = 'test';
        state.context.screen.value = { width: 100, height: 100 } as ScreenInfo;
        state.context.os.value = { name: 'test', version: '1.0' } as OSInfo;
      });

      // @ts-ignore
      const event = {
        name: 'test_name',
        category: 'test_category',
        properties: {
          name: 'test_name',
          category: 'test_category',
          path: '/test',
          referrer: 'https://www.google.com/test',
        },
        type: 'page',
      } as RudderEvent;

      const options = {
        anonymousId: 'overridden_anonymous_id',
        userId: 'overridden_user_id',
      } as ApiOptions;

      const pageProps = {
        name: 'test_name',
        category: 'test_category',
        path: '/test',
        referrer: 'https://www.google.com/test',
      };

      const enrichedEvent = getEnrichedEvent(event, options, pageProps);

      expect(enrichedEvent).toEqual({
        type: 'page',
        name: 'test_name',
        category: 'test_category',
        anonymousId: 'overridden_anonymous_id',
        channel: 'web',
        context: {
          sessionStart: true,
          sessionId: 1234,
          app: {
            name: 'test',
            version: '1.0',
          },
          campaign: {},
          library: {
            name: 'test',
            version: '1.0',
          },
          locale: 'en-US',
          os: {
            name: 'test',
            version: '1.0',
          },
          screen: {
            height: 0,
            width: 0,
            density: 1,
            innerHeight: 1024,
            innerWidth: 1680,
          },
          traits: {
            test: 'test',
          },
          'ua-ch': {
            mobile: true,
          },
          userAgent: 'test',
          consentManagement: {
            deniedConsentIds: ['id1', 'id2'],
          },
          page: {
            path: '/test',
            referrer: 'https://www.google.com/test',
            referring_domain: '',
            search: '',
            title: '',
            url: 'http://www.test-host.com/',
            tab_url: 'http://www.test-host.com/',
            initial_referrer: 'https://test.com/page',
            initial_referring_domain: 'https://test.com',
          },
          userId: 'overridden_user_id',
        },
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        properties: {
          name: 'test_name',
          category: 'test_category',
          path: '/test',
          referrer: 'https://www.google.com/test',
        },
        messageId: 'test_uuid',
        integrations: { All: true },
        userId: 'user_id',
        event: null,
      });

      defaultPluginsManager.unregisterLocalPlugins();
    });
  });

  describe('checkForReservedElementsInObject', () => {
    const defaultParentKeyPath = 'traits';

    it('should log a warn message if the object contains reserved elements', () => {
      const obj = {
        anonymousId: sampleAnonId,
        originalTimestamp: sampleOriginalTimestamp,
        nonReservedKey: 123,
        messageId: 'myMsgId',
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn).nthCalledWith(
        1,
        `EventManager:: The "anonymousId" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
      expect(mockLogger.warn).nthCalledWith(
        2,
        `EventManager:: The "originalTimestamp" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
      expect(mockLogger.warn).nthCalledWith(
        3,
        `EventManager:: The "messageId" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
    });

    it('should not log a warn message if the object does not contain reserved elements', () => {
      const obj = {
        nonReservedKey: 123,
        nonReservedKey2: 'sample',
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn message if the logger is not provided', () => {
      const obj = {
        anonymousId: sampleAnonId,
        originalTimestamp: sampleOriginalTimestamp,
        nonReservedKey: 123,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultParentKeyPath);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn message if the object is not provided', () => {
      checkForReservedElementsInObject(undefined, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should log a warn message if the object contains reserved elements but with different case', () => {
      const obj = {
        EVENT: 'test event',
        nonReservedKey: 123,
        originalTimestamp: sampleOriginalTimestamp,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn).nthCalledWith(
        1,
        `EventManager:: The "EVENT" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
      expect(mockLogger.warn).nthCalledWith(
        2,
        `EventManager:: The "originalTimestamp" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
    });
  });

  describe('checkForReservedElements', () => {
    it('should log a warn message if the event (properties, traits, and context traits) contains reserved elements', () => {
      // @ts-ignore
      const rudderEvent = {
        type: defaultEventType,
        properties: {
          anonymousId: sampleAnonId,
          originalTimestamp: sampleOriginalTimestamp,
        },
        traits: {
          originalTimestamp: sampleOriginalTimestamp,
          event: 'test event',
        },
        // @ts-ignore
        context: {
          traits: {
            anonymousId: sampleAnonId,
          },
          locale: 'en-US',
        } as RudderContext,
      } as RudderEvent;

      checkForReservedElements(rudderEvent, mockLogger);

      expect(mockLogger.warn).nthCalledWith(
        1,
        `EventManager:: The "anonymousId" property defined under "properties" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
      expect(mockLogger.warn).nthCalledWith(
        2,
        `EventManager:: The "originalTimestamp" property defined under "properties" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
      expect(mockLogger.warn).nthCalledWith(
        3,
        `EventManager:: The "originalTimestamp" property defined under "traits" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
      expect(mockLogger.warn).nthCalledWith(
        4,
        `EventManager:: The "event" property defined under "traits" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
      expect(mockLogger.warn).nthCalledWith(
        5,
        `EventManager:: The "anonymousId" property defined under "context.traits" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (anonymousId,sentAt,receivedAt,timestamp,originalTimestamp,event,messageId,channel).`,
      );
    });
  });

  describe('processOptions', () => {
    // @ts-ignore
    const rudderEvent: RudderEvent = {
      event: 'test_event',
      properties: {
        someKey: 'someValue',
      },
      anonymousId: defaultAnonId,
      originalTimestamp: defaultOriginalTimestamp,
      context: defaultContext,
    } as RudderEvent;

    it('should update event context with data from options', () => {
      // Set specific contextual data in options to override
      // Both top-level elements and context elements should be updated
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        anonymousId: 'test_anon_id',
        app: {
          name: 'test1',
          isNew: true,
        },
        context: {
          campaign: {
            name: 'test1',
            isNew: true,
          },
          locale: 'en-UK',
        },
      };

      processOptions(rudderEvent, apiOptions);

      expect(rudderEvent).toEqual({
        event: 'test_event',
        properties: {
          someKey: 'someValue',
        },
        anonymousId: 'test_anon_id',
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        context: {
          library: {
            name: 'test',
            version: '1.0',
          },
          locale: 'en-UK',
          app: {
            name: 'test1',
            version: '1.0',
            isNew: true,
          },
          campaign: {
            name: 'test1',
            isNew: true,
            source: 'test',
          },
          newContextKey1: 'newContextValue1',
          screen: {
            width: 1920,
            height: 1080,
          },
          'ua-ch': {
            brand: 'test',
            model: 'test',
          },
          userAgent: 'defaultUA',
        },
      });
    });

    it('should not update event if options is not a valid object', () => {
      // @ts-ignore
      processOptions(rudderEvent, 'test');

      expect(rudderEvent).toEqual(rudderEvent);
    });

    it('should not update event if options is null', () => {
      processOptions(rudderEvent, null);

      expect(rudderEvent).toEqual(rudderEvent);
    });

    it('should not update event if options is undefined', () => {
      processOptions(rudderEvent, undefined);

      expect(rudderEvent).toEqual(rudderEvent);
    });
  });

  describe('getContextPageProperties', () => {
    let pageProperties: ApiObject;
    beforeEach(() => {
      pageProperties = {
        path: '/test',
        referrer: 'https://www.google.com/test',
        search: '?test=true',
        title: 'test page',
        url: 'https://www.rudderlabs.com/test',
        referring_domain: 'www.google.com',
        tab_url: 'https://www.rudderlabs.com/test1',
        initial_referrer: 'https://www.google.com/test1',
        initial_referring_domain: 'www.google.com',
        anonymousId: defaultAnonId,
      } as ApiObject;
    });

    it('should return input page properties if input page properties are valid', () => {
      const contextPageProperties = getContextPageProperties(pageProperties);

      expect(contextPageProperties).toEqual({
        path: pageProperties.path,
        referrer: pageProperties.referrer,
        search: pageProperties.search,
        title: pageProperties.title,
        url: pageProperties.url,
        referring_domain: pageProperties.referring_domain,
        tab_url: pageProperties.tab_url,
        initial_referrer: pageProperties.initial_referrer,
        initial_referring_domain: pageProperties.initial_referring_domain,
      });
    });

    it('should return page properties from state if some input page parameters are not defined', () => {
      // Reset the input page properties
      pageProperties.path = undefined;
      pageProperties.search = undefined;

      const updatedPageProperties = getContextPageProperties(pageProperties);

      expect(updatedPageProperties).toEqual({
        path: '/',
        referrer: pageProperties.referrer,
        search: '',
        title: pageProperties.title,
        url: pageProperties.url,
        referring_domain: pageProperties.referring_domain,
        tab_url: pageProperties.tab_url,
        initial_referrer: pageProperties.initial_referrer,
        initial_referring_domain: pageProperties.initial_referring_domain,
      });
    });
  });

  describe('getMergedContext', () => {
    it('should return context with data merged from options', () => {
      // Set specific contextual data in options to override
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        app: {
          name: 'test1',
          isNew: true,
        },
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test1',
          isNew: true,
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
        screen: {
          width: 1920,
          height: 1080,
        },
        'ua-ch': {
          brand: 'test',
          model: 'test',
        },
        userAgent: 'defaultUA',
      });
    });

    it('should return context with data the context object merged from options', () => {
      // Set specific contextual data in options to override
      // Moreover, directly specify the 'context' object itself
      const apiOptions = {
        newContextKey1: {
          someKey: 'someValue',
        },
        context: {
          campaign: {
            name: 'test1',
            isNew: true,
          },
          locale: 'en-UK',
          app: {
            name: 'test3',
            version: '2.0',
          },
        },
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-UK',
        app: {
          name: 'test3',
          version: '2.0',
        },
        campaign: {
          name: 'test1',
          isNew: true,
          source: 'test',
        },
        newContextKey1: {
          someKey: 'someValue',
        },
        screen: {
          width: 1920,
          height: 1080,
        },
        'ua-ch': {
          brand: 'test',
          model: 'test',
        },
        userAgent: 'defaultUA',
      });
    });

    it('should skip merging into context if options contain either top-level or context reserved elements', () => {
      // Set specific contextual data in options to override
      // Include top-level elements and reserved elements in options and options context object
      // which should be skipped
      const apiOptions: ApiOptions = {
        newContextKey1: 'newContextValue1',
        anonymousId: 'test_anon_id',
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        context: {
          campaign: {
            name: 'test1',
            isNew: true,
          },
          locale: 'en-UK',
          consentManagement: {
            deniedConsentIds: ['id1', 'id2'],
          },
          userAgent: 'overridden ua',
          screen: {
            width: 100,
            height: 200,
          },
          library: {
            name: 'test1',
            isNew: true,
          },
          'ua-ch': {},
        },
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        newContextKey1: 'newContextValue1',
        locale: 'en-UK',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test1',
          isNew: true,
          source: 'test',
        },
        screen: {
          width: 1920,
          height: 1080,
        },
        'ua-ch': {
          brand: 'test',
          model: 'test',
        },
        userAgent: 'defaultUA',
      });
    });

    it('should log warning if the context inside the options is not a valid object', () => {
      // Set specific contextual data in options to override
      // Set the 'context' object to be a string
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        newContextKey2: 'newContextValue2',
        context: 'test',
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions, mockLogger);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
        newContextKey2: 'newContextValue2',
        screen: {
          width: 1920,
          height: 1080,
        },
        'ua-ch': {
          brand: 'test',
          model: 'test',
        },
        userAgent: 'defaultUA',
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `EventManager:: Please make sure that the \"context\" property in the event API's \"options\" argument is a valid object literal with key-value pairs.`,
      );
    });

    it('should log warning if the context inside the options is null', () => {
      // Set specific contextual data in options to override
      // Set the 'context' object to be a null
      const apiOptions: ApiOptions = {
        newContextKey1: 'newContextValue1',
        context: null,
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions, mockLogger);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
        screen: {
          width: 1920,
          height: 1080,
        },
        'ua-ch': {
          brand: 'test',
          model: 'test',
        },
        userAgent: 'defaultUA',
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `EventManager:: Please make sure that the \"context\" property in the event API's \"options\" argument is a valid object literal with key-value pairs.`,
      );
    });

    it('should log warning if the context inside the options is undefined', () => {
      // Set specific contextual data in options to override
      // Set the 'context' object to be undefined
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        context: undefined,
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions, mockLogger);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
        screen: {
          width: 1920,
          height: 1080,
        },
        'ua-ch': {
          brand: 'test',
          model: 'test',
        },
        userAgent: 'defaultUA',
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `EventManager:: Please make sure that the \"context\" property in the event API's \"options\" argument is a valid object literal with key-value pairs.`,
      );
    });
  });

  describe('updateTopLevelEventElements', () => {
    const rudderEvent: RudderEvent = {} as RudderEvent;

    beforeEach(() => {
      rudderEvent.anonymousId = defaultAnonId;
      rudderEvent.integrations = R.clone(defaultIntegrations);
      rudderEvent.originalTimestamp = defaultOriginalTimestamp;
    });

    it('should update top level event elements from options', () => {
      const apiOptions: ApiOptions = {
        anonymousId: sampleAnonId,
        integrations: R.clone(sampleIntegrations),
        originalTimestamp: sampleOriginalTimestamp,
      };
      updateTopLevelEventElements(rudderEvent, apiOptions);
      expect(rudderEvent.anonymousId).toEqual(apiOptions.anonymousId);
      expect(rudderEvent.integrations).toEqual(apiOptions.integrations);
      expect(rudderEvent.originalTimestamp).toEqual(apiOptions.originalTimestamp);
    });

    it('should not update the top level event elements from options that are not valid', () => {
      const apiOptions: ApiOptions = {
        integrations: sampleIntegrations,
      };

      updateTopLevelEventElements(rudderEvent, apiOptions);
      expect(rudderEvent.anonymousId).toEqual(defaultAnonId);
      expect(rudderEvent.integrations).toEqual(apiOptions.integrations);
      expect(rudderEvent.originalTimestamp).toEqual(defaultOriginalTimestamp);
    });

    it('should not update the top level event elements from options that are not valid type', () => {
      // Intentionally use invalid types to test the type check
      // @ts-ignore
      const apiOptions = {
        anonymousId: 123,
        integrations: 'sample-integrations',
        originalTimestamp: {},
      } as ApiOptions;

      updateTopLevelEventElements(rudderEvent, apiOptions);
      expect(rudderEvent.anonymousId).toEqual(defaultAnonId);
      expect(rudderEvent.integrations).toEqual(defaultIntegrations);
      expect(rudderEvent.originalTimestamp).toEqual(defaultOriginalTimestamp);
    });
  });

  describe('getEnrichedEvent', () => {
    const pageProperties: ApiObject = {
      path: '/test',
      referrer: 'https://www.google.com/test',
      search: '?test=true',
      title: 'test page',
      url: 'https://www.rudderlabs.com/test',
      referring_domain: 'www.google.com',
      tab_url: 'https://www.rudderlabs.com/test1',
      initial_referrer: 'https://www.google.com/test1',
      initial_referring_domain: 'www.google.com',
    } as ApiObject;

    beforeEach(() => {
      resetApplicationState();
    });

    it('should return common event data using the data in state', () => {
      batch(() => {
        state.session.anonymousUserId.value = 'anon_id';
        state.session.userTraits.value = { test: 'test' };
        state.session.userId.value = 'user_id';
        state.session.sessionInfo.value = { sessionStart: true, id: 1234 } as SessionInfo;
        state.session.initialReferrer.value = 'initial_referrer';
        state.session.initialReferringDomain.value = 'initial_referring_domain';

        state.consents.data.value.deniedConsentIds = ['id1', 'id2'];

        state.context['ua-ch'].value = { mobile: true } as UADataValues;
        state.context.app.value = { name: 'test', version: '1.0' } as AppInfo;
        state.context.library.value = { name: 'test', version: '1.0' } as LibraryInfo;
        state.context.locale.value = 'en-US';
        state.context.userAgent.value = 'test';
        state.context.screen.value = { width: 100, height: 100 } as ScreenInfo;
        state.context.os.value = { name: 'test', version: '1.0' } as OSInfo;
      });

      const rudderEvent = {
        type: 'track',
        event: 'test_event',
      } as RudderEvent;

      const options = {
        anonymousId: 'modified_anon_id',
      };

      const enrichedEvent = getEnrichedEvent(rudderEvent, options, pageProperties);

      expect(enrichedEvent).toEqual({
        event: 'test_event',
        type: 'track',
        anonymousId: 'modified_anon_id',
        channel: 'web',
        context: {
          page: {
            path: pageProperties.path,
            referrer: pageProperties.referrer,
            search: pageProperties.search,
            title: pageProperties.title,
            url: pageProperties.url,
            referring_domain: pageProperties.referring_domain,
            tab_url: pageProperties.tab_url,
            initial_referrer: pageProperties.initial_referrer,
            initial_referring_domain: pageProperties.initial_referring_domain,
          },
          traits: { test: 'test' },
          sessionId: 1234,
          sessionStart: true,
          consentManagement: {
            deniedConsentIds: ['id1', 'id2'],
          },
          campaign: {},
          library: {
            name: 'test',
            version: '1.0',
          },
          locale: 'en-US',
          userAgent: 'test',
          screen: {
            height: 0,
            width: 0,
            density: 1,
            innerHeight: 1024,
            innerWidth: 1680,
          },
          os: {
            name: 'test',
            version: '1.0',
          },
          app: {
            name: 'test',
            version: '1.0',
          },
          'ua-ch': {
            mobile: true,
          },
        },
        properties: null,
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        integrations: { All: true },
        messageId: 'test_uuid',
        userId: 'user_id',
      });
    });
  });
});
