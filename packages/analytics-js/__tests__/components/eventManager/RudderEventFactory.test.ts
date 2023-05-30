import { RudderEventFactory } from '../../../src/components/eventManager/RudderEventFactory';
import { APIEvent, RudderEventType } from '../../../src/components/eventManager/types';
import { state } from '@rudderstack/analytics-js/state';
import {
  AppInfo,
  LibraryInfo,
  OSInfo,
  SessionInfo,
  UTMParameters,
} from '@rudderstack/analytics-js/state/types';
import { ScreenInfo } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';
import { batch } from '@preact/signals-core';

jest.mock('@rudderstack/analytics-js/components/utilities/timestamp', () => ({
  getCurrentTimeFormatted: jest.fn().mockReturnValue('2020-01-01T00:00:00.000Z'),
}));

jest.mock('@rudderstack/analytics-js/components/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

describe('RudderEventFactory', () => {
  const rudderEventFactory = new RudderEventFactory();

  beforeEach(() => {
    batch(() => {
      state.session.anonymousUserId.value = 'anon_id';
      state.session.userTraits.value = { test: 'test' };
      state.session.userId.value = 'user_id';
      state.session.sessionInfo.value = { sessionStart: true, id: 1234 } as SessionInfo;
      state.session.groupId.value = 'group_id';
      state.session.groupTraits.value = { test: 'test' };
      state.session.initialReferrer.value = 'https://test.com/page';
      state.session.initialReferringDomain.value = 'https://test.com';

      state.consents.deniedConsentIds.value = ['id1', 'id2'];

      state.context['ua-ch'].value = { mobile: true } as UADataValues;
      state.context.app.value = { name: 'test', version: '1.0' } as AppInfo;
      state.context.campaign.value = { name: 'test', source: 'test' } as UTMParameters;
      state.context.library.value = { name: 'test', version: '1.0' } as LibraryInfo;
      state.context.locale.value = 'en-US';
      state.context.userAgent.value = 'test';
      state.context.screen.value = { width: 100, height: 100 } as ScreenInfo;
      state.context.os.value = { name: 'test', version: '1.0' } as OSInfo;

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
  });

  it('should generate a page event if page event data is provided', () => {
    const apiEvent = {
      type: RudderEventType.Page,
      category: 'category',
      name: 'name',
      properties: {
        key: 'value',
      },
      options: {
        page: {
          path: '/NewPage',
          referrer: 'https://sample.com/NewPage',
          referring_domain: 'https://sample.com',
        },
      },
    } as APIEvent;
    const pageEvent = rudderEventFactory.create(apiEvent);

    expect(pageEvent).toEqual({
      type: 'page',
      anonymousId: 'anon_id',
      category: 'category',
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
          path: '/NewPage',
          referrer: 'https://sample.com/NewPage',
          referring_domain: 'https://sample.com',
          search: '?a=1&b=2&utm_campaign=test&utm_source=test',
          title: 'title',
          url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          initial_referrer: 'https://test.com/page',
          initial_referring_domain: 'https://test.com',
        },
      },
      name: 'name',
      originalTimestamp: '2020-01-01T00:00:00.000Z',
      properties: {
        category: 'category',
        name: 'name',
        key: 'value',
        path: '/NewPage',
        referrer: 'https://sample.com/NewPage',
        referring_domain: 'https://sample.com',
        search: '?a=1&b=2&utm_campaign=test&utm_source=test',
        title: 'title',
        url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
        tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
        initial_referrer: 'https://test.com/page',
        initial_referring_domain: 'https://test.com',
      },
      messageId: 'test_uuid',
      integrations: { All: true },
      userId: 'user_id',
      event: null,
    });
  });

  it('should generate a track event if track event data is provided', () => {
    const apiEvent = {
      type: RudderEventType.Track,
      name: 'Sample event',
      properties: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      options: {
        anonymousId: 'modified_anon_id',
      },
    } as APIEvent;
    const trackEvent = rudderEventFactory.create(apiEvent);

    expect(trackEvent).toEqual({
      type: 'track',
      anonymousId: 'modified_anon_id',
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
          path: '/Page',
          referrer: 'https://sample.com/Page',
          referring_domain: 'https://sample.com',
          search: '?a=1&b=2&utm_campaign=test&utm_source=test',
          title: 'title',
          url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          initial_referrer: 'https://test.com/page',
          initial_referring_domain: 'https://test.com',
        },
      },
      event: 'Sample event',
      originalTimestamp: '2020-01-01T00:00:00.000Z',
      properties: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      messageId: 'test_uuid',
      integrations: { All: true },
      userId: 'user_id',
    });
  });

  it('should generate a track event if track event data is provided even without event name', () => {
    const apiEvent = {
      type: RudderEventType.Track,
      properties: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
    } as APIEvent;
    const trackEvent = rudderEventFactory.create(apiEvent);

    expect(trackEvent).toEqual({
      type: 'track',
      anonymousId: 'anon_id',
      channel: 'web',
      event: null,
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
          path: '/Page',
          referrer: 'https://sample.com/Page',
          referring_domain: 'https://sample.com',
          search: '?a=1&b=2&utm_campaign=test&utm_source=test',
          title: 'title',
          url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          initial_referrer: 'https://test.com/page',
          initial_referring_domain: 'https://test.com',
        },
      },
      originalTimestamp: '2020-01-01T00:00:00.000Z',
      properties: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      messageId: 'test_uuid',
      integrations: { All: true },
      userId: 'user_id',
    });
  });

  it('should generate an identify event if identify event data is provided', () => {
    const apiEvent = {
      type: RudderEventType.Identify,
      userId: 'new_user_id',
      traits: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
    } as APIEvent;

    batch(() => {
      state.session.userId.value = 'new_user_id';
      state.session.userTraits.value = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        test: 'test',
      };
    });

    const identifyEvent = rudderEventFactory.create(apiEvent);

    expect(identifyEvent).toEqual({
      type: 'identify',
      anonymousId: 'anon_id',
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
          key1: 'value1',
          key2: 'value2',
          key3: 'value3',
        },
        'ua-ch': {
          mobile: true,
        },
        userAgent: 'test',
        consentManagement: {
          deniedConsentIds: ['id1', 'id2'],
        },
        page: {
          path: '/Page',
          referrer: 'https://sample.com/Page',
          referring_domain: 'https://sample.com',
          search: '?a=1&b=2&utm_campaign=test&utm_source=test',
          title: 'title',
          url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          initial_referrer: 'https://test.com/page',
          initial_referring_domain: 'https://test.com',
        },
      },
      originalTimestamp: '2020-01-01T00:00:00.000Z',
      messageId: 'test_uuid',
      integrations: { All: true },
      userId: 'new_user_id',
      event: null,
      properties: null,
    });
  });

  it('should generate an alias event if alias event data is provided', () => {
    const apiEvent = {
      type: RudderEventType.Alias,
      from: 'user_id',
      to: 'new_user_id',
    } as APIEvent;

    const aliasEvent = rudderEventFactory.create(apiEvent);

    expect(aliasEvent).toEqual({
      type: 'alias',
      anonymousId: 'anon_id',
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
          path: '/Page',
          referrer: 'https://sample.com/Page',
          referring_domain: 'https://sample.com',
          search: '?a=1&b=2&utm_campaign=test&utm_source=test',
          title: 'title',
          url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          initial_referrer: 'https://test.com/page',
          initial_referring_domain: 'https://test.com',
        },
      },
      originalTimestamp: '2020-01-01T00:00:00.000Z',
      messageId: 'test_uuid',
      integrations: { All: true },
      previousId: 'user_id',
      userId: 'new_user_id',
      properties: null,
      event: null,
    });
  });

  it('should generate a group event if group event data is provided', () => {
    const apiEvent = {
      type: RudderEventType.Group,
      groupId: 'overridden_group_id',
      traits: {
        key4: 'value4',
        key5: 'value5',
      },
    } as APIEvent;

    batch(() => {
      state.session.groupId.value = 'overridden_group_id';
      state.session.groupTraits.value = {
        key4: 'value4',
        key5: 'value5',
        test: 'test',
      };
    });

    const groupEvent = rudderEventFactory.create(apiEvent);

    expect(groupEvent).toEqual({
      type: 'group',
      anonymousId: 'anon_id',
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
          path: '/Page',
          referrer: 'https://sample.com/Page',
          referring_domain: 'https://sample.com',
          search: '?a=1&b=2&utm_campaign=test&utm_source=test',
          title: 'title',
          url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          tab_url: 'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test',
          initial_referrer: 'https://test.com/page',
          initial_referring_domain: 'https://test.com',
        },
      },
      originalTimestamp: '2020-01-01T00:00:00.000Z',
      traits: {
        test: 'test',
        key4: 'value4',
        key5: 'value5',
      },
      messageId: 'test_uuid',
      groupId: 'overridden_group_id',
      integrations: { All: true },
      userId: 'user_id',
      properties: null,
      event: null,
    });
  });

  it('should not generate any event if the event type is not supported', () => {
    // @ts-ignore
    const apiEvent = {
      type: 'test',
    } as APIEvent;

    const testEvent = rudderEventFactory.create(apiEvent);

    expect(testEvent).toBeUndefined();
  });
});
