import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(containerID, serverUrl, environmentID, authorizationToken) {
  const defaultUrl = 'https://www.googletagmanager.com';
  window.finalUrl = serverUrl || defaultUrl;

  // Reference: https://developers.google.com/tag-platform/tag-manager/server-side/send-data#update_the_gtmjs_source_domain
  (function (window, document, tag, dataLayerName, containerID) {
    window[dataLayerName] = window[dataLayerName] || [];
    window[dataLayerName].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const firstScript = document.getElementsByTagName(tag)[0];
    const gtmScript = document.createElement(tag);

    // Construct query parameters using URLSearchParams
    const queryParams = new URLSearchParams({ id: containerID, gtm_cookies_win: 'x' });

    if (dataLayerName !== 'dataLayer') queryParams.append('l', dataLayerName);
    if (environmentID) queryParams.append('gtm_preview', environmentID);
    if (authorizationToken) queryParams.append('gtm_auth', authorizationToken);

    gtmScript.setAttribute('data-loader', LOAD_ORIGIN);
    gtmScript.async = true;
    gtmScript.src = `${window.finalUrl}/gtm.js?${queryParams.toString()}`;

    firstScript.parentNode.insertBefore(gtmScript, firstScript);
  })(window, document, 'script', 'dataLayer', containerID);
}

export { loadNativeSdk };
