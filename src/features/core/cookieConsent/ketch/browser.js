import logger from '../../../../utils/logUtil';

/* eslint-disable class-methods-use-this */
class Ketch {
  constructor() {
    // If user does not load ketch sdk before loading rudderstack sdk
    // we will not be filtering any of the destinations.
    if (!window.ketchConsent) {
      throw new Error(
        'Ketch resources are not accessible. Thus all the destinations will be loaded',
      );
    }

    this.userConsentedPurposes = [];
    this.userDeniedPurposes = [];

    if (window.ketchConsent) {
      Object.entries(window.ketchConsent).forEach((e) => {
        if (e[1]) {
          this.userConsentedPurposes.push(e[0].toUpperCase().trim());
        } else {
          this.userDeniedPurposes.push(e[0].toUpperCase().trim());
        }
      });
    }
  }

  isEnabled(destConfig) {
    try {
      /**
       * Structure of ketch consent purpose destination config.
       *
       * "ketchPurposeGroup": ["analytics", "email_mktg"]
       *
       */

      const { ketchPurposeGroup } = destConfig; // mapping of the destination with the consent group name

      // If the destination do not have this mapping events will be sent.
      if (ketchPurposeGroup.length === 0) {
        return true;
      }

      let containsAnyOfConsent = true;
      // Check if all the destination's mapped cookie categories are consented by the user in the browser.
      containsAnyOfConsent = ketchPurposeGroup.some((element) =>
        this.userConsentedPurposes.includes(element.toUpperCase().trim()),
      );
      return containsAnyOfConsent;
    } catch (e) {
      logger.error(`Error occured checking ketch consent state ${e}`);
      return true;
    }
  }

  getDeniedList() {
    return this.userDeniedPurposes;
  }
}

export default Ketch;
