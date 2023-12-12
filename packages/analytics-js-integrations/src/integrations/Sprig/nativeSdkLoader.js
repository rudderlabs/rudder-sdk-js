import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(environmentId) {
    (function (l, e, a, p) {
        if (window.Sprig) return;
        window.Sprig = function () { S._queue.push(arguments) }
        var S = window.Sprig; 
        S.appId = a; 
        S._queue = []; 
        window.UserLeap = S;
        a = l.createElement('script');
        a.async = 1; a.src = e + '?id=' + S.appId;
        a.setAttribute('data-loader', LOAD_ORIGIN);
        p = l.getElementsByTagName('script')[0];
        p.parentNode.insertBefore(a, p);
    })(document, 'https://cdn.sprig.com/shim.js', environmentId);
}

export { loadNativeSdk };