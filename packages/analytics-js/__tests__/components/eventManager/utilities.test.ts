import * as R from 'ramda';
import { batch } from '@preact/signals-core';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import type {
  AppInfo,
  LibraryInfo,
  OSInfo,
  ScreenInfo,
} from '@rudderstack/analytics-js-common/types/EventContext';
import type { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import type { RudderContext, RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { resetState, state } from '../../../src/state';
import {
  checkForReservedElements,
  checkForReservedElementsInObject,
  getContextPageProperties,
  getMergedContext,
  processOptions,
  updateTopLevelEventElements,
  getUpdatedPageProperties,
  getEnrichedEvent,
  getEventIntegrationsConfig,
} from '../../../src/components/eventManager/utilities';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { defaultLogger } from '../../../__mocks__/Logger';

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
} as unknown as RudderContext;

describe('Event Manager - Utilities', () => {
  const defaultEventType = 'test';
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  defaultPluginsManager.init();

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
        tab_url: 'https://www.test-host.com/',
        initial_referrer: state.session.initialReferrer.value,
        initial_referring_domain: state.session.initialReferringDomain.value,
        anonymousId: pageProperties.anonymousId,
      });
    });
  });

  describe('getEnrichedEvent', () => {
    beforeEach(() => {
      resetState();

      batch(() => {
        state.session.anonymousId.value = 'anon_id';
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
        state.context.timezone.value = 'GMT+0530';

        state.storage.entries.value = {
          anonymousId: {
            key: 'rl_anonymous_id',
            type: 'cookieStorage',
          },
          userId: {
            key: 'rl_user_id',
            type: 'cookieStorage',
          },
          userTraits: {
            key: 'rl_trait',
            type: 'cookieStorage',
          },
          groupId: {
            key: 'rl_group_id',
            type: 'cookieStorage',
          },
          groupTraits: {
            key: 'rl_group_trait',
            type: 'cookieStorage',
          },
          sessionInfo: {
            key: 'rl_session',
            type: 'cookieStorage',
          },
        };
      });
    });

    it('should return common event data using the data in state', () => {
      const rudderEvent = {
        type: 'track',
        event: 'test_event',
      } as RudderEvent;

      const options = {
        anonymousId: 'modified_anon_id',
      };

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
          campaign: {},
          library: {
            name: 'test',
            version: '1.0',
          },
          locale: 'en-US',
          userAgent: 'test',
          screen: {
            height: 100,
            width: 100,
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
          timezone: 'GMT+0530',
        },
        properties: null,
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        integrations: { All: true },
        messageId: 'test_uuid',
        userId: 'user_id',
      });
    });

    it('should set event data from incoming data if user has opted for no storage', () => {
      batch(() => {
        state.storage.trulyAnonymousTracking.value = true;

        state.storage.entries.value = {
          anonymousId: {
            key: 'rl_anonymous_id',
            type: 'none',
          },
          userId: {
            key: 'rl_user_id',
            type: 'none',
          },
          userTraits: {
            key: 'rl_trait',
            type: 'none',
          },
          groupId: {
            key: 'rl_group_id',
            type: 'none',
          },
          groupTraits: {
            key: 'rl_group_trait',
            type: 'none',
          },
          sessionInfo: {
            key: 'rl_session',
            type: 'none',
          },
        };
      });

      const identifyEvent = {
        userId: 'cur_user_id',
        context: {
          traits: {
            newTest: 'newTest',
          },
        },
        type: 'identify',
      } as unknown as RudderEvent;

      const enrichedIdentifyEvent = getEnrichedEvent(identifyEvent);

      expect(enrichedIdentifyEvent).toEqual({
        type: 'identify',
        anonymousId: 'test_uuid',
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
          trulyAnonymousTracking: true,
          locale: 'en-US',
          os: {
            name: 'test',
            version: '1.0',
          },
          screen: {
            height: 100,
            width: 100,
          },
          traits: {
            newTest: 'newTest',
          },
          'ua-ch': {
            mobile: true,
          },
          userAgent: 'test',
          timezone: 'GMT+0530',
          page: {
            initial_referrer: 'https://test.com/page',
            initial_referring_domain: 'https://test.com',
            path: '/',
            referrer: '$direct',
            referring_domain: '',
            search: '',
            tab_url: 'https://www.test-host.com/',
            title: '',
            url: 'https://www.test-host.com/',
          },
        },
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        messageId: 'test_uuid',
        integrations: { All: true },
        userId: 'cur_user_id',
        event: null,
        properties: null,
      });

      const groupEvent = {
        groupId: 'cur_group_id',
        traits: {
          newTest1: 'newTest1',
        },
        type: 'group',
      } as unknown as RudderEvent;

      const enrichedGroupEvent = getEnrichedEvent(groupEvent);

      expect(enrichedGroupEvent).toEqual({
        type: 'group',
        anonymousId: 'test_uuid',
        channel: 'web',
        context: {
          sessionStart: true,
          sessionId: 1234,
          app: {
            name: 'test',
            version: '1.0',
          },
          traits: {
            test: 'test',
          },
          campaign: {},
          library: {
            name: 'test',
            version: '1.0',
          },
          trulyAnonymousTracking: true,
          locale: 'en-US',
          os: {
            name: 'test',
            version: '1.0',
          },
          screen: {
            height: 100,
            width: 100,
          },
          'ua-ch': {
            mobile: true,
          },
          userAgent: 'test',
          timezone: 'GMT+0530',
          page: {
            initial_referrer: 'https://test.com/page',
            initial_referring_domain: 'https://test.com',
            path: '/',
            referrer: '$direct',
            referring_domain: '',
            search: '',
            tab_url: 'https://www.test-host.com/',
            title: '',
            url: 'https://www.test-host.com/',
          },
        },
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        messageId: 'test_uuid',
        integrations: { All: true },
        groupId: 'cur_group_id',
        userId: 'user_id',
        traits: {
          newTest1: 'newTest1',
        },
        event: null,
        properties: null,
      });
    });
  });

  describe('checkForReservedElementsInObject', () => {
    const defaultParentKeyPath = 'traits';

    it('should log a warn message if the object contains reserved elements', () => {
      const obj = {
        anonymous_id: sampleAnonId,
        original_timestamp: sampleOriginalTimestamp,
        nonReservedKey: 123,
        id: 'myMsgId',
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultParentKeyPath, defaultLogger);

      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        1,
        `EventManager:: The "anonymous_id" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        2,
        `EventManager:: The "original_timestamp" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        3,
        `EventManager:: The "id" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
    });

    it('should not log a warn message if the object does not contain reserved elements', () => {
      const obj = {
        nonReservedKey: 123,
        nonReservedKey2: 'sample',
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultParentKeyPath, defaultLogger);

      expect(defaultLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn message if the object is not provided', () => {
      checkForReservedElementsInObject(undefined, defaultParentKeyPath, defaultLogger);

      expect(defaultLogger.warn).not.toHaveBeenCalled();
    });

    it('should log a warn message if the object contains reserved elements but with different case', () => {
      const obj = {
        EVENT: 'test event',
        nonReservedKey: 123,
        original_timestamp: sampleOriginalTimestamp,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultParentKeyPath, defaultLogger);

      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        1,
        `EventManager:: The "EVENT" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        2,
        `EventManager:: The "original_timestamp" property defined under "${defaultParentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
    });
  });

  describe('checkForReservedElements', () => {
    it('should log a warn message if the event (properties, traits, and context traits) contains reserved elements', () => {
      const rudderEvent = {
        type: defaultEventType,
        properties: {
          anonymous_id: sampleAnonId,
          original_timestamp: sampleOriginalTimestamp,
        },
        traits: {
          original_timestamp: sampleOriginalTimestamp,
          event: 'test event',
        },
        context: {
          traits: {
            anonymous_id: sampleAnonId,
          },
          locale: 'en-US',
        } as unknown as RudderContext,
      } as unknown as RudderEvent;

      checkForReservedElements(rudderEvent, defaultLogger);

      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        1,
        `EventManager:: The "anonymous_id" property defined under "properties" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        2,
        `EventManager:: The "original_timestamp" property defined under "properties" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        3,
        `EventManager:: The "original_timestamp" property defined under "traits" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        4,
        `EventManager:: The "event" property defined under "traits" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
      );
      expect(defaultLogger.warn).toHaveBeenNthCalledWith(
        5,
        `EventManager:: The "anonymous_id" property defined under "context.traits" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (id,anonymous_id,user_id,sent_at,timestamp,received_at,original_timestamp,event,event_text,channel,context_ip,context_request_ip,context_passed_ip,group_id,previous_id).`,
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
      processOptions(rudderEvent);

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

      const mergedContext = getMergedContext(defaultContext, apiOptions, defaultLogger);

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
      expect(defaultLogger.warn).toHaveBeenCalledWith(
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

      const mergedContext = getMergedContext(defaultContext, apiOptions, defaultLogger);

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
      expect(defaultLogger.warn).toHaveBeenCalledWith(
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

      const mergedContext = getMergedContext(defaultContext, apiOptions, defaultLogger);

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
      expect(defaultLogger.warn).toHaveBeenCalledWith(
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

  describe('getEventIntegrationsConfig', () => {
    afterEach(() => {
      resetState();
    });

    it('should return global load API integrations object', () => {
      batch(() => {
        state.loadOptions.value = {
          useGlobalIntegrationsConfigInEvents: true,
        };

        state.nativeDestinations.loadOnlyIntegrations.value = {
          All: false,
        };
      });

      expect(getEventIntegrationsConfig()).toEqual({
        All: false,
      });
    });

    it('should return consent API integrations object', () => {
      batch(() => {
        state.loadOptions.value = {
          useGlobalIntegrationsConfigInEvents: true,
        };

        state.nativeDestinations.loadOnlyIntegrations.value = {
          All: true,
          GA4: false,
        };

        state.consents.postConsent.value = {
          integrations: {
            All: false,
            MP: true,
          },
        };
      });

      expect(getEventIntegrationsConfig()).toEqual({
        All: false,
        MP: true,
      });
    });

    it('should return global load API integrations object if consent API integrations object is not defined', () => {
      batch(() => {
        state.loadOptions.value = {
          useGlobalIntegrationsConfigInEvents: true,
        };

        state.nativeDestinations.loadOnlyIntegrations.value = {
          All: false,
        };
      });

      expect(getEventIntegrationsConfig()).toEqual({
        All: false,
      });
    });

    it("should return event's integrations object", () => {
      expect(
        getEventIntegrationsConfig({
          All: true,
          AM: false,
        }),
      ).toEqual({
        All: true,
        AM: false,
      });
    });

    it("should return default integrations object if event's integrations object is not defined", () => {
      expect(getEventIntegrationsConfig()).toEqual({
        All: true,
      });
    });
  });
});
