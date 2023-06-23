const OneTrust = () => ({
  name: 'OneTrust',
  consentProvider: {
    getConsentInfo: jest.fn(() => {}),
    isDestinationConsented: jest.fn(() => {}),
  },
});

export default OneTrust;
