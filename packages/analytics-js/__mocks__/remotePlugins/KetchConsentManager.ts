const KetchConsentManager = () => ({
  name: 'KetchConsentManager',
  consentManager: {
    init: jest.fn(() => {}),
    updateConsentsInfo: jest.fn(() => {}),
    isDestinationConsented: jest.fn(() => {}),
  },
});

export default KetchConsentManager;
