import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(script) {
  const e = document.createElement('script');
  const n = document.getElementsByTagName('script')[0];
  e.type = 'text/javascript';
  e.async = true;
  e.src = `//static.chartbeat.com/js/${script}`;
  e.setAttribute('data-loader', LOAD_ORIGIN);
  n.parentNode.insertBefore(e, n);
}

export { loadNativeSdk };
