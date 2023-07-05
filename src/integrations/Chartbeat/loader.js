import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN

function loader(script) {
  const e = document.createElement('script');
  const n = document.getElementsByTagName('script')[0];
  e.type = 'text/javascript';
  e.async = true;
  e.src = `//static.chartbeat.com/js/${script}`;
  e.setAttribute('data-loader', LOAD_ORIGIN);
  n.parentNode.insertBefore(e, n);
}

/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };
