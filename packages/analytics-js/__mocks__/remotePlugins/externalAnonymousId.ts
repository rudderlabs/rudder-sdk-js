const externalAnonymousId = () => ({
  name: 'externalAnonymousId',
  storage: {
    getAnonymousId: jest.fn(() => {
      return 'dummy-anonymousId-12345678';
    }),
  },
});

export default externalAnonymousId;
