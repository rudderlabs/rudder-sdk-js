/* eslint-disable no-plusplus */
import { rest } from 'msw';
import { state } from '@rudderstack/analytics-js/state';
import { DeviceModeTransformation } from '../../src/deviceModeTransformation';
import { createPayload } from '../../src/deviceModeTransformation/utilities';
import { server } from '../../__fixtures__/msw.server';
import {
  dummyDataplaneHost,
  dummyWriteKey,
  rudderEventPage,
  dmtSuccessResponse,
  dmtPartialSuccessResponse,
} from '../../__fixtures__/fixtures';

describe('Device mode transformation plugin', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });
  const retryCount = 3;
  let payload;
  const destinationIds = ['id1', 'id2', 'id3'];
  beforeEach(() => {
    payload = createPayload(rudderEventPage, destinationIds, 'sample-auth-token');
  });

  it('should add DeviceModeTransformation plugin in the loaded plugin list', () => {
    DeviceModeTransformation().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('DeviceModeTransformation')).toBe(true);
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
