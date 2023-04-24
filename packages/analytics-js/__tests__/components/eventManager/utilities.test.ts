import {
  getUpdatedPageProperties,
  getEnrichedEvent,
} from '@rudderstack/analytics-js/components/eventManager/utilities';

import {
  ApiObject,
  ApiOptions,
  AppInfo,
  LibraryInfo,
  OSInfo,
  SessionInfo,
  UTMParameters,
} from '@rudderstack/analytics-js/state/types';
import { state } from '@rudderstack/analytics-js/state';
import { batch } from '@preact/signals-core';
import { defaultPluginManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
import { ScreenInfo } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';

jest.mock('@rudderstack/analytics-js/components/utilities/timestamp', () => ({
  getCurrentTimeFormatted: jest.fn().mockReturnValue('2020-01-01T00:00:00.000Z'),
}));

jest.mock('@rudderstack/analytics-js/components/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

const defaultAnonId = 'default-anon-id';

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
  resetPageState();
};

describe('Event Manager - Utilities', () => {
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

  describe('getEnrichedEvent', () => {
    beforeEach(() => {
      resetApplicationState();
    });

    it('should return processed event if the event processor plugin is registered', () => {
      defaultPluginManager.registerLocalPlugins();
      batch(() => {
        state.session.rl_anonymous_id.value = 'anon_id';
        state.session.rl_trait.value = { test: 'test' };
        state.session.rl_user_id.value = 'user_id';
        state.session.rl_session.value = { sessionStart: true, id: 1234 } as SessionInfo;
        state.session.rl_group_id.value = 'group_id';
        state.session.rl_group_trait.value = { test: 'test' };
        state.session.rl_page_init_referrer.value = 'https://test.com/page';
        state.session.rl_page_init_referring_domain.value = 'https://test.com';

        state.consents.deniedConsentIds.value = ['id1', 'id2'];

        state.context['ua-ch'].value = { mobile: true } as UADataValues;
        state.context.app.value = { name: 'test', version: '1.0' } as AppInfo;
        state.context.campaign.value = { name: 'test', source: 'test' } as UTMParameters;
        state.context.library.value = { name: 'test', version: '1.0' } as LibraryInfo;
        state.context.locale.value = 'en-US';
        state.context.userAgent.value = 'test';
        state.context.screen.value = { width: 100, height: 100 } as ScreenInfo;
        state.context.os.value = { name: 'test', version: '1.0' } as OSInfo;

        state.page.initial_referrer.value = 'https://test.com/page';
        state.page.initial_referring_domain.value = 'https://test.com';
        state.page.referrer.value = 'https://sample.com/Page';
        state.page.referring_domain.value = 'https://sample.com';
        state.page.search.value = '?a=1&b=2&utm_campaign=test&utm_source=test';
        state.page.title.value = 'title';
        state.page.url.value =
          'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test';
        state.page.path.value = '/Page';
        state.page.tab_url.value =
          'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test';
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
          campaign: {
            name: 'test',
            source: 'test',
          },
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
            height: 100,
            width: 100,
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
            referring_domain: 'https://sample.com',
            search: '?a=1&b=2&utm_campaign=test&utm_source=test',
            title: 'title',
            url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
            tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
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
      });

      defaultPluginManager.unregisterLocalPlugins();
    });

    it('should return input event if the event processor plugin is not registered yet', () => {
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

      expect(enrichedEvent).toEqual(event);
    });
  });
});
