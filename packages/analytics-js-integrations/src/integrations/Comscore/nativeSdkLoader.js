import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

export function loadNativeSdk() {
    (function() {
        var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
        s.setAttribute('data-loader', LOAD_ORIGIN)
        s.src = "https://sb.scorecardresearch.com/cs/1234567/beacon.js";
        el.parentNode.insertBefore(s, el);
    })();
}

