import { advanceTo } from 'jest-date-mock';
import { Analytics } from '../../src/service-worker';
import { server } from './__fixtures__/msw.server';
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
} from './__fixtures__/fixtures';

jest.mock('uuid', () => ({ v4: () => '123456789' }));

describe('JS SDK Service Worker', () => {
  let rudderAnalyticsClient = null;
  let requestBody;

  beforeAll(() => {
    advanceTo(new Date(2022, 1, 21, 0, 0, 0));
    server.listen();
  });

  beforeEach(() => {
    rudderAnalyticsClient = new Analytics(dummyWriteKey, dummyDataplaneHost, dummyInitOptions);
    server.events.on('request:start', req => {
      requestBody = req.body;
    });
  });

  afterEach(() => {
    rudderAnalyticsClient = null;
    server.resetHandlers();
    server.events.removeAllListeners();
    requestBody = null;
  });

  afterAll(() => {
    server.close();
  });

  it('Should initialise with correct values', () => {
    expect(rudderAnalyticsClient.writeKey).toBe(dummyWriteKey);
    expect(rudderAnalyticsClient.host).toBe(dummyDataplaneHost);
    expect(rudderAnalyticsClient.timeout).toBe(dummyInitOptions.timeout);
    expect(rudderAnalyticsClient.flushAt).toBe(dummyInitOptions.flushAt);
    expect(rudderAnalyticsClient.flushInterval).toBe(dummyInitOptions.flushInterval);
    expect(rudderAnalyticsClient.maxInternalQueueSize).toBe(dummyInitOptions.maxInternalQueueSize);
    expect(rudderAnalyticsClient.logLevel).toBe(dummyInitOptions.logLevel);
    expect(rudderAnalyticsClient.enable).toBe(dummyInitOptions.enable);
  });

  it('Should record identify', async () => {
    rudderAnalyticsClient.identify(identifyRequestPayload);
    rudderAnalyticsClient.flush();

    await new Promise(r => setTimeout(r, 1));

    expect(requestBody.batch[0]).toEqual(expect.objectContaining(identifyRequestPayload));
  });

  it('Should record track', async () => {
    rudderAnalyticsClient.track(trackRequestPayload);
    rudderAnalyticsClient.flush();

    await new Promise(r => setTimeout(r, 1));

    expect(requestBody.batch[0]).toEqual(expect.objectContaining(trackRequestPayload));
  });

  it('Should record page', async () => {
    rudderAnalyticsClient.page(pageRequestPayload);
    rudderAnalyticsClient.flush();

    await new Promise(r => setTimeout(r, 1));

    expect(requestBody.batch[0]).toEqual(expect.objectContaining(pageRequestPayload));
  });

  it('Should record screen', async () => {
    rudderAnalyticsClient.screen(screenRequestPayload);
    rudderAnalyticsClient.flush();

    await new Promise(r => setTimeout(r, 1));

    expect(requestBody.batch[0]).toEqual(expect.objectContaining(screenRequestPayload));
  });

  it('Should record group', async () => {
    rudderAnalyticsClient.group(groupRequestPayload);
    rudderAnalyticsClient.flush();

    await new Promise(r => setTimeout(r, 1));

    expect(requestBody.batch[0]).toEqual(expect.objectContaining(groupRequestPayload));
  });

  it('Should record alias', async () => {
    rudderAnalyticsClient.alias(aliasRequestPayload);
    rudderAnalyticsClient.flush();

    await new Promise(r => setTimeout(r, 1));

    expect(requestBody.batch[0]).toEqual(expect.objectContaining(aliasRequestPayload));
  });
});
