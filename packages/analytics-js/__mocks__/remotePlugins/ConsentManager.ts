const ConsentManager = () => ({
  name: 'ConsentManager',
  consentManager: {
    init: jest.fn(() => {}),
    isDestinationConsented: jest.fn(() => {}),
  },
});

export default ConsentManager;
