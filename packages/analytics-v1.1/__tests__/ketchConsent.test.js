import { Ketch } from '../src/features/core/cookieConsent/ketch';

window.ketchConsent = {
  analytics: true,
  email_mktg: false,
  behavioral_advertising: false,
};

const expectedDeniedPurposes = ['email_mktg', 'behavioral_advertising'];

const ketch = new Ketch();

describe('Test suit for Ketch consent manager', () => {
  it('should allow events when no category is set in destination config', () => {
    const destConfig = {};
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('should allow events when purpose in destination config is present in consented categories', () => {
    const destConfig = {
      ketchConsentPurposes: [{ purpose: 'analytics' }],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('should not allow events when consented category name is not present in destination config', () => {
    const destConfig = {
      ketchConsentPurposes: [{ purpose: 'performance' }],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });

  it('should not allow events when all the category IDs in destination config present in consented category IDs', () => {
    const destConfig = {
      ketchConsentPurposes: [{ purpose: 'analytics' }, { purpose: 'email_mktg' }],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('should return the category IDs that the user has not consented for', () => {
    const actualDeniedPurposes = ketch.getDeniedList();
    expect(actualDeniedPurposes).toEqual(expectedDeniedPurposes);
  });
  it('should return the category IDs that the user has not consented for', () => {
    const actualDeniedPurposes = ketch.getDeniedList();
    expect(actualDeniedPurposes).toEqual(expectedDeniedPurposes);
  });
});
