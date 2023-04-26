const externalAnonymousId = () => ({
  name: 'externalAnonymousId',
  storage: {
    getAnonymousId: jest.fn((value: any) => value),
  },
});

export default externalAnonymousId;
