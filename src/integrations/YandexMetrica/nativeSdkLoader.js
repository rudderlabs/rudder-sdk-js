import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(tagId, clickmap, trackLinks, accurateTrackBounce, webvisor, ecommerce) {
  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) {
        return;
      }
    }
    (k = e.createElement(t)),
      (a = e.getElementsByTagName(t)[0]),
      (k.async = 1),
      (k.src = r),
      k.setAttribute('data-loader', LOAD_ORIGIN),
      a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  ym(tagId, 'init', {
    clickmap,
    trackLinks,
    accurateTrackBounce,
    webvisor,
    ecommerce,
  });
  window[`${ecommerce}`] = window[`${ecommerce}`] || [];
  window[`${ecommerce}`].push({});
}

export { loadNativeSdk };
