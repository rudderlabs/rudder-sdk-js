const ExternalAnonymousId = () => ({
  name: 'ExternalAnonymousId',
  storage: {
    getAnonymousId: jest.fn(() => {
      return 'dummy-anonymousId-12345678';
    }),
  },
});

export default ExternalAnonymousId;
