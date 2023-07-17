import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk() {
  const dc = document.createElement('script');
  dc.type = 'text/javascript';
  dc.setAttribute('data-loader', LOAD_ORIGIN);
  dc.async = true;
  dc.src = `//tag.getdrip.com/${window._dcs.account}.js`;
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(dc, s);
}

export { loadNativeSdk };
