const IubendaConsentManager = () => ({
    name: 'IubendaConsentManager',
    consentManager: {
      init: jest.fn(() => {}),
      updateConsentsInfo: jest.fn(() => {}),
      isDestinationConsented: jest.fn(() => {}),
    },
  });
  
  export default IubendaConsentManager;
  