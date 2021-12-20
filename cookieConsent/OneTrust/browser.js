class OneTrust {
  constructor(sourceConfig, destConfig) {
    this.sourceConfig = sourceConfig;
    this.destConfig = destConfig;
  }

  init() {
    const { oneTrustConsentGroup } = this.destConfig; // mapping of the destination with the consent group name
    const userSetConsentGroupIds = window.OnetrustActiveGroups.split(","); // Content ids user has rejected
    const oneTrustAllGroupsInfo = window.OneTrust.GetDomainData().Groups; // info about all the groups created in the onetrust account
    const userSetConsentGroupNames = [];
    oneTrustAllGroupsInfo.forEach((group) => {
      const { CustomGroupId, GroupName } = group;
      if (userSetConsentGroupIds.includes(CustomGroupId)) {
        userSetConsentGroupNames.push(GroupName);
      }
    });
    const oneTrustConsentGroupArr = oneTrustConsentGroup.map(
      (c) => c.oneTrustConsentGroup
    );
    for (let consentGroupName in oneTrustConsentGroupArr) {
      if (
        userSetConsentGroupNames.includes(
          oneTrustConsentGroupArr[consentGroupName]
        )
      ) {
        return false;
      }
    }
    return true;
  }
}

export default OneTrust;
