import { Ketch } from '../src/features/core/cookieConsent/ketch';

window.ketchConsent = {
  analytics: true,
  email_mktg: false,
  behavioral_advertising: false,
};

const expectedDeniedPurposes = ['EMAIL_MKTG', 'BEHAVIORAL_ADVERTISING'];

const ketch = new Ketch();

describe('Test suit for Ketch consent manager', () => {
  it('Should allow events when no purpose is set in destination config', () => {
    const destConfig = {};
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when ketch purpose in destination config is opted-in', () => {
    const destConfig = {
      ketchPurposeGroup: ['analytics'],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should not allow events when no purpose present in destination config', () => {
    const destConfig = {
      ketchPurposeGroup: ['performance'],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });

  it('Should allow events when any of the ketch purpose in destination config is opted-in', () => {
    const destConfig = {
      ketchPurposeGroup: ['analytics', 'email_mktg'],
    };
    const allowEvent = ketch.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should return the purposes that the user has not consented for', () => {
    const actualDeniedPurposes = ketch.getDeniedList();
    expect(actualDeniedPurposes).toEqual(expectedDeniedPurposes);
  });
});
