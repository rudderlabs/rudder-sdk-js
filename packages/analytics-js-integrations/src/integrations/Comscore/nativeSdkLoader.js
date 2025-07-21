import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

export function loadNativeSdk(publisherId) {
    (function() {
        var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
        s.setAttribute('data-loader', LOAD_ORIGIN)
        s.src = `https://sb.scorecardresearch.com/cs/${publisherId}/beacon.js`;
        el.parentNode.insertBefore(s, el);
    })();
}

