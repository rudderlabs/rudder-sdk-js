import logger from '../../../../utils/logUtil';

/* eslint-disable class-methods-use-this */
class OneTrust {
  isInitialized = false;

  constructor() {
    // If user does not load onetrust sdk before loading rudderstack sdk
    // we will not be filtering any of the destinations.
    if (!window.OneTrust || !window.OnetrustActiveGroups) {
      logger.error('OneTrust resources are not accessible.');
      return;
    }
    // OneTrust Cookie Compliance populates a data layer object OnetrustActiveGroups with
    // the cookie categories that the user has consented to.
    // Eg: ',C0001,C0003,'
    // We split it and save it as an array.

    this.userSetConsentGroupIds = window.OnetrustActiveGroups.split(',').filter((n) => n); // Ids user has consented

    // Get information about the cookie script - data includes, consent models, cookies in preference centre, etc.
    // We get the groups(cookie categorization), user has created in one trust account.

    const oneTrustAllGroupsInfo = window.OneTrust.GetDomainData().Groups;
    this.userSetConsentGroupNames = [];
    this.userDeniedConsentGroupIds = [];

    // Get the names of the cookies consented by the user in the browser.

    oneTrustAllGroupsInfo.forEach((group) => {
      const { CustomGroupId, GroupName } = group;
      if (this.userSetConsentGroupIds.includes(CustomGroupId)) {
        this.userSetConsentGroupNames.push(GroupName.toUpperCase().trim());
      } else {
        this.userDeniedConsentGroupIds.push(CustomGroupId);
      }
    });

    this.userSetConsentGroupIds = this.userSetConsentGroupIds.map((e) => e.toUpperCase());
    this.isInitialized = true;
  }

  isEnabled(destConfig) {
    try {
      if (!this.isInitialized) {
        return true;
      }
      /**
     * Structure of onetrust consent group destination config.
     * 
     * "oneTrustConsentGroup": [
                        {
                            "oneTrustConsentGroup": "Performance Cookies"
                        },
                        {
                            "oneTrustConsentGroup": "Functional Cookies"
                        },
                        {
                            "oneTrustConsentGroup": ""
                        }
                    ]
      *
     */

      const { oneTrustCookieCategories } = destConfig; // mapping of the destination with the consent group name

      // If the destination do not have this mapping events will be sent.

      if (!oneTrustCookieCategories) {
        return true;
      }

      // Change the structure of oneTrustConsentGroup as an array and filter values if empty string
      // Eg:
      // ["Performance Cookies", "Functional Cookies"]

      const oneTrustConsentGroupArr = oneTrustCookieCategories
        .map((c) => c.oneTrustCookieCategory)
        .filter((n) => n);
      let containsAllConsent = true;
      // Check if all the destination's mapped cookie categories are consented by the user in the browser.
      containsAllConsent = oneTrustConsentGroupArr.every(
        (element) =>
          this.userSetConsentGroupIds.includes(element.toUpperCase().trim()) ||
          this.userSetConsentGroupNames.includes(element.toUpperCase().trim()),
      );
      return containsAllConsent;
    } catch (e) {
      logger.error(`Error during onetrust cookie consent management ${e}`);
      return true;
    }
  }

  getDeniedList() {
    if (!this.isInitialized) {
      return [];
    }
    return this.userDeniedConsentGroupIds;
  }
}

export default OneTrust;
