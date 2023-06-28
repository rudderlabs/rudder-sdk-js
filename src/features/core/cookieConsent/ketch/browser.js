import logger from '../../../../utils/logUtil';
import { Cookie } from '../../../../utils/storage/cookie';

/* eslint-disable class-methods-use-this */
class Ketch {
  constructor() {
    this.userConsentedPurposes = [];
    this.userDeniedPurposes = [];

    // updateKetchConsent callback function to update current consent purpose state
    // this will be called from ketch rudderstack plugin
    window.updateKetchConsent = (consent) => {
      if (consent) {
        this.userConsentedPurposes = [];
        this.userDeniedPurposes = [];
        this.updatePurposes(consent);
      }
    };

    // getKetchUserConsentedPurposes returns current ketch opted-in purposes
    window.getKetchUserConsentedPurposes = () => this.userConsentedPurposes.slice();

    // getKetchUserDeniedPurposes returns current ketch opted-out purposes
    window.getKetchUserDeniedPurposes = () => this.userDeniedPurposes.slice();

    // initialize purposes with existing user consent state
    if (window.ketchConsent) {
      this.updatePurposes(window.ketchConsent);
    } else {
      const consent = this.getConsent();
      this.updatePurposes(consent);
    }
  }

  updatePurposes = (consent) => {
    if (consent) {
      Object.entries(consent).forEach((e) => {
        const purposeCode = e[0];
        const isConsented = e[1];
        if (isConsented) {
          this.userConsentedPurposes.push(purposeCode);
        } else {
          this.userDeniedPurposes.push(purposeCode);
        }
      });
    }
  };

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
      if (ketchConsentPurposes && ketchConsentPurposes.length === 0) {
        return true;
      }

      const purposes = ketchConsentPurposes.map((p) => p.purpose).filter((n) => n);

      let containsAnyOfConsent = true;
      // Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
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

  getConsent() {
    const value = Cookie.get('_ketch_consent_v1_');
    if (!value) {
      return undefined;
    }
    let consentObj;
    try {
      consentObj = JSON.parse(atob(value));
    } catch (e) {
      logger.error(`Error occured while parsing consent cookie ${e}`);
      return undefined;
    }
    if (!consentObj) {
      return undefined;
    }
    const consent = {};
    Object.entries(consentObj).forEach((e) => {
      const purposeCode = e[0];
      const purposeValue = e[1];
      if (purposeValue && purposeValue.status) {
        consent[purposeCode] = purposeValue.status === 'granted';
      }
    });
    return consent;
  }
}

export default Ketch;
