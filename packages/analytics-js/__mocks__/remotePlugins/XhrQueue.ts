const XhrQueue = () => ({
  name: 'XhrQueue',
  dataplaneEventsQueue: {
    init: jest.fn(() => {}),
    enqueue: jest.fn(() => {}),
  },
});

export default XhrQueue;
