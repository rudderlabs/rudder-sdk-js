import { rudderEventPage } from '../../__fixtures__/fixtures';
import { createPayload } from '../../src/deviceModeTransformation/utilities';

describe('DMT Plugin Utilities', () => {
  it('should create request payload in appropriate format', () => {
    const destinationIds = ['destination id 1', 'destination id 2'];
    const payload = createPayload(rudderEventPage, destinationIds, 'sample-auth-token');

    expect(payload).toEqual({
      metadata: {
        'Custom-Authorization': 'sample-auth-token',
      },
      batch: [
        {
          orderNo: expect.any(Number),
          destinationIds,
          event: rudderEventPage,
        },
      ],
    });
  });
});
