const RemotePlugin = () => ({
  name: 'remoteTest',
  remote: {
    test: jest.fn((data: any[], cb: (data: any[]) => void) => cb(data)),
  },
});

export default RemotePlugin;
