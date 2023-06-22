const BeaconQueue = () => ({
  name: 'BeaconQueue',
  dataplaneEventsQueue: {
    init: jest.fn(() => {}),
    enqueue: jest.fn(() => {}),
  },
});

export default BeaconQueue;
