import { batch } from '@preact/signals-core';
import { ScreenInfo } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';
import { eventProcessor } from '@rudderstack/analytics-js/plugins/eventProcessor/eventProcessor';
import { state } from '@rudderstack/analytics-js/state';
import {
  ApiObject,
  AppInfo,
  LibraryInfo,
  OSInfo,
  SessionInfo,
  UTMParameters,
} from '@rudderstack/analytics-js/state/types';
import { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
import { ExtensionPoint } from '@rudderstack/analytics-js-plugins/types/common';

jest.mock('@rudderstack/analytics-js/components/utilities/timestamp', () => ({
  getCurrentTimeFormatted: jest.fn().mockReturnValue('2020-01-01T00:00:00.000Z'),
}));

jest.mock('@rudderstack/analytics-js/components/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

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

describe('eventProcessor', () => {
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

    it('should return common event data using the data in state', () => {
      batch(() => {
        state.session.rl_anonymous_id.value = 'anon_id';
        state.session.rl_trait.value = { test: 'test' };
        state.session.rl_user_id.value = 'user_id';
        state.session.rl_session.value = { sessionStart: true, id: 1234 } as SessionInfo;
        state.session.rl_page_init_referrer.value = 'initial_referrer';
        state.session.rl_page_init_referring_domain.value = 'initial_referring_domain';

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

      const rudderEvent = {
        type: 'track',
        event: 'test_event',
      } as RudderEvent;

      const options = {
        anonymousId: 'modified_anon_id',
      };

      const processedEvent = (eventProcessor()['event'] as ExtensionPoint)['process'](
        rudderEvent,
        options,
        pageProperties,
      );

      expect(processedEvent).toEqual({
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
        userId: 'user_id',
      });
    });
  });
});
