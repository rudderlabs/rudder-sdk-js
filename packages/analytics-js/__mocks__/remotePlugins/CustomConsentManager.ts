const CustomConsentManager = () => ({
  name: 'CustomConsentManager',
  consentManager: {
    init: jest.fn(() => {}),
    updateConsentsInfo: jest.fn(() => {}),
    isDestinationConsented: jest.fn(() => {}),
  },
});

export default CustomConsentManager;
