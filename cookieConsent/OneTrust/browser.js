class OneTrust {
  constructor(sourceConfig, destConfig) {
    this.sourceConfig = sourceConfig;
    this.destConfig = destConfig;
  }

  init() {
    console.log("=============");
    console.log(this.destConfig.oneTrustConsentGroup); // mapping of the destination with the consent group name
    const userSetConsentGroupIds = window.OnetrustActiveGroups;
    const oneTrustAllGroupsInfo = window.OneTrust.GetDomainData().Groups;
    console.log(oneTrustAllGroupsInfo); // info about all the groups created in the onetrust account
    console.log(userSetConsentGroupIds); // Content ids user has rejected
    return true;
  }
}

export default OneTrust;
