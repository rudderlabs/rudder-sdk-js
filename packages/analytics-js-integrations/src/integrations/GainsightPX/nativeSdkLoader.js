import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { DISPLAY_NAME, } from '@rudderstack/analytics-js-common/constants/integrations/GainsightPX/constants';
import { stringifyWithoutCircularV1 } from '@rudderstack/analytics-js-common/v1.1/utils/ObjectUtils';
import Logger from '../../utils/logger';
const logger = new Logger(DISPLAY_NAME);

function loadNativeSdk(productKey, dataCenter, extraConfigStr) {
  let hostName = 'web-sdk.aptrinsic.com';
  switch (dataCenter) {
    case 'EU':
      hostName = 'web-sdk-eu.aptrinsic.com';
      break;
    case 'US2':
      hostName = 'web-sdk-eu.aptrinsic.com';
      break;
  }
  const sdkUrl= "https://" + hostName + "/api/aptrinsic.js";

  let extraConfig = {};
  try {
    extraConfig = JSON.parse(extraConfigStr);
  } catch (error) {
    logger.error(`Error in parsing extra config - ${stringifyWithoutCircularV1(error, true)}`);
  }

  (function(n,t,a,e, co){
      var i="aptrinsic";
      n[i]=n[i]||function(){
        (n[i].q=n[i].q||[]).push(arguments)
      },n[i].p=e;
      n[i].c=co;
      var r=t.createElement("script");
      r.async=!0,r.src=a+"?a="+e;
      r.setAttribute('data-loader', LOAD_ORIGIN);
      var c=t.getElementsByTagName("script")[0];
      c.parentNode.insertBefore(r,c)
   })(window, document, sdkUrl, productKey, extraConfig);
}

export { loadNativeSdk };
