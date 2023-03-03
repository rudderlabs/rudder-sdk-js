import logger from '../../../../utils/logUtil';

const ACCEPT = 'ACCEPT';
const oneTrustMapping = {
  C0001: 'ESSENTIAL',
  C0002: 'ESSENTIAL',
  C0003: 'PERSONALIZATION',
  C0004: 'PERSONALIZATION',
  C0005: 'MARKETING',
};

/* eslint-disable class-methods-use-this */
class OsanoConsent {
  constructor() {
    // If user does not load osano sdk before loading rudderstack sdk
    // we will not be filtering any of the destinations.
    if (!window.Osano) {
      throw new Error(
        'Osano resources are not accessible. Thus all the destinations will be loaded',
      );
    }

    this.consentObject = window.Osano.cm.getConsent();
    this.userSetConsentGroupIds = Object.keys(this.consentObject)
      .filter((key) => this.consentObject[key] === ACCEPT)
      .map((x) => x.toUpperCase().trim());
  }

  isEnabled(destConfig) {
    let containsAllConsent = true;
    const { oneTrustCookieCategories } = destConfig; // mapping of the destination with the consent group name

    if (!oneTrustCookieCategories) {
      return true;
    }
    try {
      const oneTrustConsentGroupArr = oneTrustCookieCategories
        .map((c) => c.oneTrustCookieCategory.toUpperCase().trim())
        .filter((n) => n);
      containsAllConsent = oneTrustConsentGroupArr.every(
        (element) =>
          oneTrustMapping[element.toUpperCase().trim()] ||
          this.userSetConsentGroupIds.includes(element.toUpperCase().trim()),
      );
    } catch (e) {
      logger.error(`Error during Osano cookie consent management ${e}`);
    }

    return containsAllConsent;
  }
}

export default OsanoConsent;
