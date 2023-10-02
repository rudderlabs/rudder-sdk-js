/* eslint-disable no-plusplus */
import { batch } from '@preact/signals-core';
import { rest } from 'msw';
import { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { state } from '@rudderstack/analytics-js/state';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import {
  dummyDataplaneHost,
  dummyWriteKey,
  rudderEventPage,
  dmtSuccessResponse,
  dmtPartialSuccessResponse,
} from '../../__fixtures__/fixtures';
import { server } from '../../__fixtures__/msw.server';
import { createPayload } from '../../src/deviceModeTransformation/utilities';
import { DeviceModeTransformation } from '../../src/deviceModeTransformation';

describe('Device mode transformation plugin', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  const defaultStoreManager = new StoreManager(defaultPluginsManager);

  const mockLogger = {
    error: jest.fn(),
  } as unknown as ILogger;

  beforeAll(() => {
    server.listen();
    batch(() => {
      state.lifecycle.writeKey.value = 'sampleWriteKey';
      state.lifecycle.activeDataplaneUrl.value = 'https://sampleurl.com';
      state.session.authToken.value = 'sample-auth-token';
    });
  });

  const httpClient = new HttpClient();

  afterAll(() => {
    server.close();
  });
  const retryCount = 3;
  let payload;
  const destinations = [
    {
      id: 'id1',
      displayName: 'Destination 1',
      userFriendlyId: 'Destination_568fhgvb7689',
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {},
    },
    {
      id: 'id2',
      displayName: 'Destination 2',
      userFriendlyId: 'Destination_0986fhgvb7689',
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: true,
      config: {},
    },
    {
      id: 'id3',
      displayName: 'Destination 3',
      userFriendlyId: 'Destination_123fhgvb7689',
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {},
    },
  ];

  const destinationIds = ['id1', 'id2', 'id3'];
  beforeEach(() => {
    payload = createPayload(rudderEventPage, destinationIds, 'sample-auth-token');
  });

  it('should add DeviceModeTransformation plugin in the loaded plugin list', () => {
    DeviceModeTransformation().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('DeviceModeTransformation')).toBe(true);
  });

  it('should return a queue object on init', () => {
    const queue = DeviceModeTransformation().transformEvent?.init(
      state,
      defaultPluginsManager,
      httpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );

    expect(queue).toBeDefined();
    expect(queue.name).toBe('rudder_sampleWriteKey');
  });

  it('should add item in queue on enqueue', () => {
    const queue = DeviceModeTransformation().transformEvent?.init(
      state,
      defaultPluginsManager,
      httpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );

    const addItemSpy = jest.spyOn(queue, 'addItem');

    const event: RudderEvent = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    };

    DeviceModeTransformation().transformEvent?.enqueue(state, queue, event, destinations);

    expect(addItemSpy).toBeCalledWith({
      token: 'sample-auth-token',
      destinationIds,
      event,
    });

    addItemSpy.mockRestore();
  });

  it.skip('Transformation server returning response in right format in case of successful transformation', async () => {
    DeviceModeTransformation().init(dummyWriteKey, `${dummyDataplaneHost}/success`);

    await DeviceModeTransformation()
      .sendEventForTransformation(payload, retryCount)
      .then(response => {
        expect(Array.isArray(response.transformedPayload)).toEqual(true);

        const destObj = response.transformedPayload[0];

        expect(typeof destObj).toEqual('object');
        expect(Object.prototype.hasOwnProperty.call(destObj, 'id')).toEqual(true);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'payload')).toEqual(true);
      })
      .catch(e => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });
});
