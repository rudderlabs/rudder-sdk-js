const OneTrustConsentManager = () => ({
  name: 'OneTrustConsentManager',
  consentManager: {
    init: jest.fn(() => {}),
    isDestinationConsented: jest.fn(() => {}),
  },
});

export default OneTrustConsentManager;
