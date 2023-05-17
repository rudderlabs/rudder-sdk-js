import { Ketch } from '../src/features/core/cookieConsent/ketch';

window.ketchConsent = {
  analytics: true,
  email_mktg: false,
  behavioral_advertising: false,
};

const expectedDeniedPurposes = ['EMAIL_MKTG', 'BEHAVIORAL_ADVERTISING'];

const ketch = new Ketch();

describe('Test suit for OneTrust cookie consent manager', () => {
  it('Should allow events when no category is set in destination config', () => {
    const destConfig = {};
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when oneTrustCookieCategory in destination config is present in consented categories', () => {
    const destConfig = {
      ketchPurposeGroup: ['analytics'],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should not allow events when consented category name is not present in destination config', () => {
    const destConfig = {
      ketchPurposeGroup: ['performance'],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });

  it('Should not allow events when all the category IDs in destination config present in consented category IDs', () => {
    const destConfig = {
      ketchPurposeGroup: ['analytics', 'email_mktg'],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should return the category IDs that the user has not consented for', () => {
    const actualDeniedPurposes = ketch.getDeniedList();
    expect(actualDeniedPurposes).toEqual(expectedDeniedPurposes);
  });
});
