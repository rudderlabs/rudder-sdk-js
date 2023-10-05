const DeviceModeTransformation = () => ({
  name: 'DeviceModeTransformation',
  transformEvent: {
    init: jest.fn(() => {}),
    enqueue: jest.fn(() => {}),
  },
});

export default DeviceModeTransformation;
