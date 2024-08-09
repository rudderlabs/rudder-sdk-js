const FetchQueue = () => ({
  name: 'FetchQueue',
  dataplaneEventsQueue: {
    init: jest.fn(() => {}),
    enqueue: jest.fn(() => {}),
  },
});

export default FetchQueue;
