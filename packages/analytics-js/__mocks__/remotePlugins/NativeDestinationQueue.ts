const NativeDestinationQueue = () => ({
  name: 'NativeDestinationQueue',
  destinationsEventsQueue: {
    init: jest.fn(() => {}),
    enqueue: jest.fn(() => {}),
    enqueueEventToDestination: jest.fn(() => {}),
  },
});

export default NativeDestinationQueue;
