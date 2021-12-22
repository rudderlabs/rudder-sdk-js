class OneTrust {
  constructor(sourceConfig) {
    this.sourceConfig = sourceConfig;
  }

  isEnabled(destConfig) {
    console.log(this.sourceConfig);
    const { oneTrustConsentGroup } = destConfig; // mapping of the destination with the consent group name
    const userSetConsentGroupIds = window.OnetrustActiveGroups.split(","); // Content ids user has rejected
    const oneTrustAllGroupsInfo = window.OneTrust.GetDomainData().Groups; // info about all the groups created in the onetrust account
    const userSetConsentGroupNames = [];
    oneTrustAllGroupsInfo.forEach((group) => {
      const { CustomGroupId, GroupName } = group;
      if (userSetConsentGroupIds.includes(CustomGroupId)) {
        userSetConsentGroupNames.push(GroupName.toUpperCase().trim());
      }
    });
    const oneTrustConsentGroupArr = oneTrustConsentGroup.map(
      (c) => c.oneTrustConsentGroup
    );
    const containsAllConsent = oneTrustConsentGroupArr
      .filter((n) => n)
      .every((element) =>
        userSetConsentGroupNames.includes(element.toUpperCase().trim())
      );
    return containsAllConsent;
  }
}

export default OneTrust;
