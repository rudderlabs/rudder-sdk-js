const OneTrustConsentManager = () => ({
  name: 'OneTrustConsentManager',
  consentManager: {
    getConsentInfo: jest.fn(() => {}),
    isDestinationConsented: jest.fn(() => {}),
  },
});

export default OneTrustConsentManager;
