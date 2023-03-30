const RemotePlugin2 = () => ({
  name: 'remoteTest2',
  remote: {
    test: jest.fn((data: any[], cb: (data: any[]) => void) => cb(data)),
  },
});

export default RemotePlugin2;
