import { advanceTo } from 'jest-date-mock';
import { Analytics } from '../src/Analytics';
import { server } from '../__fixtures__/msw.server';
import {
  aliasRequestPayload,
  dummyDataplaneHost,
  dummyInitOptions,
  dummyWriteKey,
  groupRequestPayload,
  identifyRequestPayload,
  pageRequestPayload,
  screenRequestPayload,
  trackRequestPayload,
} from '../__fixtures__/fixtures';

jest.mock('uuid', () => ({ v4: () => '123456789' }));

describe('JS SDK Service Worker', () => {
  let rudderAnalyticsClient: Analytics;
  let requestBody: any;

  beforeAll(() => {
    advanceTo(new Date(2022, 1, 21, 0, 0, 0));
    server.listen();
  });

  beforeEach(() => {
    rudderAnalyticsClient = new Analytics(
      dummyWriteKey,
      dummyDataplaneHost,
      dummyInitOptions as any,
    );
    server.events.on('request:start', async ({ request }) => {
      const requestState = Object.getOwnPropertySymbols(request).find(
        s => s.description === 'state',
      );
      requestBody = JSON.parse(request[requestState]?.body?.source);
    });
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
    rudderAnalyticsClient = null as any;
    requestBody = null;
  });

  afterAll(() => {
    server.close();
  });

  it('should throw error if the write key is invalid', () => {
    expect(() => {
      new Analytics('', dummyDataplaneHost, dummyInitOptions as any);
    }).toThrow('You must pass the source write key.');
  });

  it('should throw error if the data plane URL is empty', () => {
    expect(() => {
      new Analytics(dummyWriteKey, '', dummyInitOptions as any);
    }).toThrow('The provided data plane URL "" is invalid.');
  });

  it('should throw an error if the data plane URL input is not a valid URL', () => {
    expect(() => {
      new Analytics(dummyWriteKey, 'dummy', dummyInitOptions as any);
    }).toThrow('The provided data plane URL "dummy" is invalid.');
  });

  it('Should initialise with correct values', () => {
    expect(rudderAnalyticsClient.writeKey).toBe(dummyWriteKey);
    expect(rudderAnalyticsClient.host).toBe('https://dummy.dataplane.host.com/v1/batch');
    expect(rudderAnalyticsClient.timeout).toBe(undefined);
    expect(rudderAnalyticsClient.flushAt).toBe(dummyInitOptions.flushAt);
    expect(rudderAnalyticsClient.flushInterval).toBe(dummyInitOptions.flushInterval);
    expect(rudderAnalyticsClient.maxInternalQueueSize).toBe(dummyInitOptions.maxInternalQueueSize);
    expect(rudderAnalyticsClient.logLevel).toBe(dummyInitOptions.logLevel);
    expect(rudderAnalyticsClient.enable).toBe(dummyInitOptions.enable);
  });

  it('Should record identify', done => {
    rudderAnalyticsClient.identify(identifyRequestPayload);
    rudderAnalyticsClient.flush();
    setTimeout(() => {
      expect(requestBody.batch[0]).toEqual(expect.objectContaining(identifyRequestPayload));
      done();
    }, 10);
  });

  it('Should record track', done => {
    rudderAnalyticsClient.track(trackRequestPayload);
    rudderAnalyticsClient.flush();
    setTimeout(() => {
      expect(requestBody.batch[0]).toEqual(expect.objectContaining(trackRequestPayload));
      done();
    }, 10);
  });

  it('Should record page', done => {
    rudderAnalyticsClient.page(pageRequestPayload);
    rudderAnalyticsClient.flush();

    setTimeout(() => {
      expect(requestBody.batch[0]).toEqual(expect.objectContaining(pageRequestPayload));
      done();
    }, 10);
  });

  it('Should record screen', done => {
    rudderAnalyticsClient.screen(screenRequestPayload);
    rudderAnalyticsClient.flush();

    setTimeout(() => {
      expect(requestBody.batch[0]).toEqual(expect.objectContaining(screenRequestPayload));
      done();
    }, 10);
  });

  it('Should record group', done => {
    rudderAnalyticsClient.group(groupRequestPayload);
    rudderAnalyticsClient.flush();

    setTimeout(() => {
      expect(requestBody.batch[0]).toEqual(expect.objectContaining(groupRequestPayload));
      done();
    }, 10);
  });

  it('Should record alias', done => {
    rudderAnalyticsClient.alias(aliasRequestPayload);
    rudderAnalyticsClient.flush();

    setTimeout(() => {
      expect(requestBody.batch[0]).toEqual(expect.objectContaining(aliasRequestPayload));
      done();
    }, 10);
  });
});
