import {
  updateTopLevelEventElements,
  checkForReservedElementsInObject,
  checkForReservedElements,
  getUpdatedPageProperties,
  getContextPageProperties,
  getCommonEventData,
  getMergedContext,
} from '../../../src/components/eventManager/utilities';
import {
  RudderEvent,
  RudderContext,
} from '@rudderstack/analytics-js/components/eventManager/types';
import {
  ApiObject,
  ApiOptions,
  AppInfo,
  LibraryInfo,
  OSInfo,
  SessionInfo,
  UTMParameters,
} from '@rudderstack/analytics-js/state/types';
import * as R from 'ramda';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { state } from '@rudderstack/analytics-js/state';
import { batch } from '@preact/signals-core';
import { ScreenInfo } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';

jest.mock('@rudderstack/analytics-js/components/utilities/timestamp', () => ({
  getCurrentTimeFormatted: jest.fn().mockReturnValue('2020-01-01T00:00:00.000Z'),
}));

jest.mock('@rudderstack/analytics-js/components/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

const defaultAnonId = 'default-anon-id';
const defaultIntegrations = { All: false, 'Default Integration': true };
const defaultOriginalTimestamp = 'default-timestamp';

const sampleAnonId = 'sample-anon-id';
const sampleIntegrations = { All: true, 'Sample Integration': true };
const sampleOriginalTimestamp = 'sample-timestamp';

const resetPageState = () => {
  batch(() => {
    state.page.initial_referrer.value = undefined;
    state.page.initial_referring_domain.value = undefined;
    state.page.referrer.value = '';
    state.page.referring_domain.value = '';
    state.page.search.value = '';
    state.page.title.value = '';
    state.page.url.value = '';
    state.page.path.value = '';
    state.page.tab_url.value = '';
  });
};

const resetApplicationState = () => {
  batch(() => {
    resetPageState();
  });
};

describe('Event Manager - Utilities', () => {
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
      const apiOptions: ApiOptions = {
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

  describe('checkForReservedElementsInObject', () => {
    const defaultParentKeyPath = 'traits';

    it('should log a warn message if the object contains reserved elements', () => {
      const obj = {
        anonymous_id: sampleAnonId,
        original_timestamp: sampleOriginalTimestamp,
        nonReservedKey: 123,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn.mock.calls[0][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "anonymous_id" for ${defaultEventType} event`,
      );
      expect(mockLogger.warn.mock.calls[1][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "original_timestamp" for ${defaultEventType} event`,
      );
    });

    it('should not log a warn message if the object does not contain reserved elements', () => {
      const obj = {
        nonReservedKey: 123,
        nonReservedKey2: 'sample',
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn message if the logger is not provided', () => {
      const obj = {
        anonymous_id: sampleAnonId,
        original_timestamp: sampleOriginalTimestamp,
        nonReservedKey: 123,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn message if the object is not provided', () => {
      checkForReservedElementsInObject(
        undefined,
        defaultEventType,
        defaultParentKeyPath,
        mockLogger,
      );

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should log a warn message if the object contains reserved elements but with different case', () => {
      const obj = {
        ANONYMOUS_ID: sampleAnonId,
        EVENT: 'test event',
        nonReservedKey: 123,
        original_timestamp: sampleOriginalTimestamp,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn.mock.calls[0][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "ANONYMOUS_ID" for ${defaultEventType} event`,
      );
      expect(mockLogger.warn.mock.calls[1][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "EVENT" for ${defaultEventType} event`,
      );
      expect(mockLogger.warn.mock.calls[2][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "original_timestamp" for ${defaultEventType} event`,
      );
    });
  });

  describe('checkForReservedElements', () => {
    it('should log a warn message if the event (properties, traits, and context traits) contains reserved elements', () => {
      // @ts-ignore
      const rudderEvent: RudderEvent = {
        type: defaultEventType,
        properties: {
          anonymous_id: sampleAnonId,
          original_timestamp: sampleOriginalTimestamp,
        },
        traits: {
          original_timestamp: sampleOriginalTimestamp,
          event: 'test event',
        },
        // @ts-ignore
        context: {
          traits: {
            anonymous_id: sampleAnonId,
          },
          locale: 'en-US',
        } as RudderContext,
      } as RudderEvent;

      checkForReservedElements(rudderEvent, mockLogger);

      expect(mockLogger.warn.mock.calls[0][0]).toEqual(
        `Reserved keyword used in properties --> "anonymous_id" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[1][0]).toEqual(
        `Reserved keyword used in properties --> "original_timestamp" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[2][0]).toEqual(
        `Reserved keyword used in traits --> "original_timestamp" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[3][0]).toEqual(
        `Reserved keyword used in traits --> "event" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[4][0]).toEqual(
        `Reserved keyword used in context.traits --> "anonymous_id" for ${rudderEvent.type} event`,
      );
    });
  });

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
        anonymous_id: defaultAnonId,
      } as ApiObject;
      resetPageState();
    });

    it('should return the input page properties if options is invalid', () => {
      const updatedPageProperties = getUpdatedPageProperties(pageProperties, undefined);

      expect(updatedPageProperties).toEqual(pageProperties);
    });

    it('should return the input page properties if the page properties provided in options is not a valid object', () => {
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
        anonymous_id: defaultAnonId,
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
        state.page.initial_referrer.value = 'https://www.google.com/test3';
        state.page.initial_referring_domain.value = 'www.google3.com';
        state.page.tab_url.value = 'https://www.rudderlabs.com/test3';
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
        tab_url: state.page.tab_url.value,
        initial_referrer: state.page.initial_referrer.value,
        initial_referring_domain: state.page.initial_referring_domain.value,
        anonymous_id: pageProperties.anonymous_id,
      });
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
        anonymous_id: defaultAnonId,
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
      // Set some specific page properties in state
      batch(() => {
        state.page.path.value = 'https://www.google.com/test3.html';
        state.page.search.value = '?asdf=1234';
      });

      // Reset the input page properties
      pageProperties.path = undefined;
      pageProperties.search = undefined;

      const updatedPageProperties = getContextPageProperties(pageProperties);

      expect(updatedPageProperties).toEqual({
        path: state.page.path.value,
        referrer: pageProperties.referrer,
        search: state.page.search.value,
        title: pageProperties.title,
        url: pageProperties.url,
        referring_domain: pageProperties.referring_domain,
        tab_url: pageProperties.tab_url,
        initial_referrer: pageProperties.initial_referrer,
        initial_referring_domain: pageProperties.initial_referring_domain,
      });
    });
  });

  describe('getCommonEventData', () => {
    let pageProperties: ApiObject = {
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

    it('should return common event data using the date in state', () => {
      batch(() => {
        state.session.rl_anonymous_id.value = 'modified_anon_id';
        state.session.rl_trait.value = { test: 'test' };
        state.session.rl_user_id.value = 'modified_user_id';
        state.session.rl_session.value = { sessionStart: true, id: 1234 } as SessionInfo;
        state.session.rl_group_id.value = 'modified_group_id';
        state.session.rl_group_trait.value = { test: 'test' };
        state.consents.deniedConsentIds.value = ['id1', 'id2'];
        state.context['ua-ch'].value = { mobile: true } as UADataValues;
        state.context.app.value = { name: 'test', version: '1.0' } as AppInfo;
        state.context.campaign.value = { name: 'test', source: 'test' } as UTMParameters;
        state.context.library.value = { name: 'test', version: '1.0' } as LibraryInfo;
        state.context.locale.value = 'en-US';
        state.context.userAgent.value = 'test';
        state.context.screen.value = { width: 100, height: 100 } as ScreenInfo;
        state.context.os.value = { name: 'test', version: '1.0' } as OSInfo;
      });

      const commonEventData = getCommonEventData(pageProperties);

      expect(commonEventData).toEqual({
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
          campaign: {
            name: 'test',
            source: 'test',
          },
          library: {
            name: 'test',
            version: '1.0',
          },
          locale: 'en-US',
          userAgent: 'test',
          screen: {
            width: 100,
            height: 100,
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
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        integrations: { All: true },
        messageId: 'test_uuid',
        userId: 'modified_user_id',
        groupId: 'modified_group_id',
        traits: { test: 'test' },
      });
    });
  });

  describe('getMergeContext', () => {
    const context: ApiObject = {
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
    };

    it('should return context with data merged from options', () => {
      // Set specific contextual data in options to override
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        app: {
          name: 'test1',
          isNew: true,
        },
      };

      const mergedContext = getMergedContext(context, apiOptions);

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
      });
    });

    it('should return context with data the context object merged from options', () => {
      // Set specific contextual data in options to override
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
          }
        },
      };

      const mergedContext = getMergedContext(context, apiOptions);

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
      });
    });
  });
});
