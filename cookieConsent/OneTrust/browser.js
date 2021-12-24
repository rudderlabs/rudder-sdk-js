import logger from "../../utils/logUtil";

/* eslint-disable class-methods-use-this */
class OneTrust {
  constructor(sourceConfig) {
    this.sourceConfig = sourceConfig;
    // OneTrust Cookie Compliance populates a data layer object OnetrustActiveGroups with
    // the cookie categories that the user has consented to.
    // Eg: ',C0001,C0003,'
    // We split it and save it as an array.

    const userSetConsentGroupIds = window.OnetrustActiveGroups.split(","); // Ids user has consented

    // Get information about the cookie script - data includes, consent models, cookies in preference centre, etc.
    // We get the groups(cookie categorization), user has created in one trust account.

    const oneTrustAllGroupsInfo = window.OneTrust.GetDomainData().Groups;
    this.userSetConsentGroupNames = [];

    // Get the names of the cookies consented by the user in the browser.

    oneTrustAllGroupsInfo.forEach((group) => {
      const { CustomGroupId, GroupName } = group;
      if (userSetConsentGroupIds.includes(CustomGroupId)) {
        this.userSetConsentGroupNames.push(
          GroupName.toUpperCase().trim()
        );
      }
    });
  }

  isEnabled(destConfig) {
    // If user does not load onetrust sdk before loading rudderstack sdk
    // we will not be filtering any of the destinations.
    try {
      if (!window.OneTrust || !window.OnetrustActiveGroups) {
        logger.debug(
          `Onetrust window objects not retrieved. Thus events are sent.`
        );
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
        logger.debug(
          "No onetrust cookie category set for the destination. Thus events are sent."
        );
        return true;
      }

      // Change the structure of oneTrustConsentGroup as an array and filter values if empty string
      // Eg:
      // ["Performance Cookies", "Functional Cookies"]

      const oneTrustConsentGroupArr = oneTrustCookieCategories
        .map((c) => c.oneTrustCookieCategory)
        .filter((n) => n);
      let containsAllConsent = true;

      // Check if any value is there in the destination's cookie groups.
      // If not events will go anyway to the destination.

      if (
        Array.isArray(oneTrustConsentGroupArr) &&
        oneTrustConsentGroupArr.length
      ) {
        // Check if all the destination's mapped cookie categories are consented by the user in the browser.
        containsAllConsent = oneTrustConsentGroupArr.every((element) =>
          this.userSetConsentGroupNames.includes(
            element.toUpperCase().trim()
          )
        );
      }
      return containsAllConsent;
    } catch (e) {
      logger.error(`Error during onetrust cookie consent management ${e}`);
    }
  }
}

export default OneTrust;
