/**
 * Returns updated mapped properties
 * @param {*} props
 * @param {*} campaignState
 * @param {*} customCampaignProperties
 * @returns
 */
const mapRudderPropsToOptimizelyProps = (props, campaignState, customCampaignProperties) => {
  const properties = props;
  if (campaignState && customCampaignProperties.length > 0) {
    customCampaignProperties.forEach(customCampaignProperty => {
      const rudderProp = customCampaignProperties[customCampaignProperty].from;
      const optimizelyProp = customCampaignProperties[customCampaignProperty].to;
      if (typeof properties[optimizelyProp] !== 'undefined') {
        properties[rudderProp] = properties[optimizelyProp];
        delete properties[optimizelyProp];
      }
    });
  }
  return properties;
};

export { mapRudderPropsToOptimizelyProps };
