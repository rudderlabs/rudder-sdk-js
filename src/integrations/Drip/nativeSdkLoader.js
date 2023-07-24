import ScriptLoader, { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(accountId) {
  window._dcq = window._dcq || [];
  window._dcs = window._dcs || {};
  window._dcs.account = accountId;
  ScriptLoader('drip', `//tag.getdrip.com/${window._dcs.account}.js`);
}

export { loadNativeSdk };
