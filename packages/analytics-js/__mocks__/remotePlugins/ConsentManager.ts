const ConsentOrchestrator = () => ({
  name: 'ConsentOrchestrator',
  consentOrchestrator: {
    init: jest.fn(() => {}),
    isDestinationConsented: jest.fn(() => {}),
  },
});

export default ConsentOrchestrator;
