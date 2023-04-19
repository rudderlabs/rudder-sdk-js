import {
  updateTopLevelEventElements,
  checkForReservedElementsInObject,
  checkForReservedElements,
  getUpdatedPageProperties,
  getContextPageProperties,
} from '../../../src/components/eventManager/utilities';
import {
  RudderEvent,
  RudderContext,
} from '@rudderstack/analytics-js/components/eventManager/types';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import * as R from 'ramda';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { state } from '@rudderstack/analytics-js/state';
import { batch } from '@preact/signals-core';

const defaultAnonId = 'default-anon-id';
const defaultIntegrations = { All: false, 'Default Integration': true };
const defaultOriginalTimestamp = 'default-timestamp';

const sampleAnonId = 'sample-anon-id';
const sampleIntegrations = { All: true, 'Sample Integration': true };
const sampleOriginalTimestamp = 'sample-timestamp';

const resetPageState = () => {
  batch(() => {
    state.page.initial_referrer.value = undefined;
    state.page.initial_referrer_domain.value = undefined;
    state.page.referrer.value = '';
    state.page.referrer_domain.value = '';
    state.page.search.value = '';
    state.page.title.value = '';
    state.page.url.value = '';
    state.page.path.value = '';
    state.page.tab_url.value = '';
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

      expect(updatedPageProperties.path).toEqual(optionsPageProperties.path);
      expect(updatedPageProperties.referrer).toEqual(optionsPageProperties.referrer);
      expect(updatedPageProperties.search).toEqual(optionsPageProperties.search);
      expect(updatedPageProperties.title).toEqual(optionsPageProperties.title);
      expect(updatedPageProperties.url).toEqual(optionsPageProperties.url);
      expect(updatedPageProperties.referring_domain).toEqual(
        optionsPageProperties.referring_domain,
      );
      expect(updatedPageProperties.tab_url).toEqual(optionsPageProperties.tab_url);
      expect(updatedPageProperties.initial_referrer).toEqual(
        optionsPageProperties.initial_referrer,
      );
      expect(updatedPageProperties.initial_referring_domain).toEqual(
        optionsPageProperties.initial_referring_domain,
      );
    });

    it('should return updated page properties from state if some page properties are not defined in options and input page parameters are not defined', () => {
      // Set some specific page properties in state
      state.page.initial_referrer.value = 'https://www.google.com/test3';
      state.page.initial_referring_domain.value = 'www.google3.com';
      state.page.tab_url.value = 'https://www.rudderlabs.com/test3';

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

      expect(updatedPageProperties.path).toEqual(optionsPageProperties.path);
      expect(updatedPageProperties.referrer).toEqual(optionsPageProperties.referrer);
      expect(updatedPageProperties.search).toEqual(pageProperties.search);
      expect(updatedPageProperties.title).toEqual(pageProperties.title);
      expect(updatedPageProperties.url).toEqual(pageProperties.url);
      expect(updatedPageProperties.referring_domain).toEqual(pageProperties.referring_domain);
      expect(updatedPageProperties.tab_url).toEqual(state.page.tab_url.value);
      expect(updatedPageProperties.initial_referrer).toEqual(state.page.initial_referrer.value);
      expect(updatedPageProperties.initial_referring_domain).toEqual(
        state.page.initial_referring_domain.value,
      );
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

      expect(contextPageProperties.path).toEqual(pageProperties.path);
      expect(contextPageProperties.referrer).toEqual(pageProperties.referrer);
      expect(contextPageProperties.search).toEqual(pageProperties.search);
      expect(contextPageProperties.title).toEqual(pageProperties.title);
      expect(contextPageProperties.url).toEqual(pageProperties.url);
      expect(contextPageProperties.referring_domain).toEqual(pageProperties.referring_domain);
      expect(contextPageProperties.tab_url).toEqual(pageProperties.tab_url);
      expect(contextPageProperties.initial_referrer).toEqual(pageProperties.initial_referrer);
      expect(contextPageProperties.initial_referring_domain).toEqual(
        pageProperties.initial_referring_domain,
      );
    });

    it('should return page properties from state if some input page parameters are not defined', () => {
      // Set some specific page properties in state
      state.page.path.value = 'https://www.google.com/test3.html';
      state.page.search.value = '?asdf=1234';

      // Reset the input page properties
      pageProperties.path = undefined;
      pageProperties.search = undefined;

      const updatedPageProperties = getContextPageProperties(pageProperties);

      expect(updatedPageProperties.path).toEqual(state.page.path.value);
      expect(updatedPageProperties.referrer).toEqual(pageProperties.referrer);
      expect(updatedPageProperties.search).toEqual(state.page.search.value);
      expect(updatedPageProperties.title).toEqual(pageProperties.title);
      expect(updatedPageProperties.url).toEqual(pageProperties.url);
      expect(updatedPageProperties.referring_domain).toEqual(pageProperties.referring_domain);
      expect(updatedPageProperties.tab_url).toEqual(pageProperties.tab_url);
      expect(updatedPageProperties.initial_referrer).toEqual(pageProperties.initial_referrer);
      expect(updatedPageProperties.initial_referring_domain).toEqual(
        pageProperties.initial_referring_domain,
      );
    });
  });
});
