import logger from '../../../../utils/logUtil';

/* eslint-disable class-methods-use-this */
class Ketch {
  constructor() {
    this.userConsentedPurposes = [];
    this.userDeniedPurposes = [];

    // updateKetchConsent callback function to update current consent purpose state
    // this will be called from ketch ruddersatck plugin
    window.updateKetchConsent = (consent) => {
      if (consent.purposes) {
        const p = consent.purposes;
        this.userConsentedPurposes = [];
        this.userDeniedPurposes = [];
        Object.entries(p).forEach((e) => {
          if (e[1]) {
            this.userConsentedPurposes.push(e[0]);
          } else {
            this.userDeniedPurposes.push(e[0]);
          }
        });
      }
    };

    // getKetchUserConsentedPurposes returns current ketch opted-in purposes
    window.getKetchUserConsentedPurposes = () => this.userConsentedPurposes.slice();

    // getKetchUserDeniedPurposes returns current ketch opted-out purposes
    window.getKetchUserDeniedPurposes = () => this.userDeniedPurposes.slice();

    // If ketch tag is loaded before rudderstack and has existing consent then update the consent state
    if (window.ketchConsent) {
      Object.entries(window.ketchConsent).forEach((e) => {
        if (e[1]) {
          this.userConsentedPurposes.push(e[0]);
        } else {
          this.userDeniedPurposes.push(e[0]);
        }
      });
    }
  }

  isEnabled(destConfig) {
    try {
      /**
       * Structure of ketch consent purpose destination config.
       *
       * "ketchConsentPurposes": [
       * {
       * "purpose" : "analytics"
       * }
       * ]
       *
       */

      const { ketchConsentPurposes } = destConfig; // mapping of the destination with the consent group name

      // If the destination do not have this mapping events will be sent.
      if (ketchConsentPurposes.length === 0) {
        return true;
      }

      const purposes = ketchConsentPurposes.map((p) => p.purpose).filter((n) => n);

      let containsAnyOfConsent = true;
      // Check if all the destination's mapped cookie categories are consented by the user in the browser.
      containsAnyOfConsent = purposes.some((element) =>
        this.userConsentedPurposes.includes(element.trim()),
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
