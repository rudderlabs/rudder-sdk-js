import { QUEUE_NAME as DMT_QUEUE_NAME } from '../../../src/deviceModeTransformation/constants';
import { QUEUE_NAME as XHR_QUEUE_NAME } from '../../../src/xhrQueue/constants';
import { QUEUE_NAME as BEACON_QUEUE_NAME } from '../../../src/beaconQueue/constants';
import { QUEUE_NAME as NATIVE_DESTINATION_QUEUE_NAME } from '../../../src/nativeDestinationQueue/constants';

describe('RetryQueue names', () => {
  // RetryQueue.findOtherQueues matches donor queues on the store name alone, so two
  // plugins sharing a QUEUE_NAME will reclaim each other's items once they land on the
  // same storage engine. See SDK-5473.
  it('should be distinct across every plugin that builds a RetryQueue', () => {
    const queueNames = [
      DMT_QUEUE_NAME,
      XHR_QUEUE_NAME,
      BEACON_QUEUE_NAME,
      NATIVE_DESTINATION_QUEUE_NAME,
    ];

    expect(new Set(queueNames).size).toBe(queueNames.length);
  });
});
