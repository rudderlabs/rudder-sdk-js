import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(
  m,
  e,
  t,
  r,
  i,
  k,
  a,
  tagId,
  clickmap,
  trackLinks,
  accurateTrackBounce,
  webvisor,
  ecommerce,
) {
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

  ym(tagId, 'init', {
    clickmap,
    trackLinks,
    accurateTrackBounce,
    webvisor,
    ecommerce,
  });
  window[`${this.containerName}`] = window[`${this.containerName}`] || [];
  window[`${this.containerName}`].push({});
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };
