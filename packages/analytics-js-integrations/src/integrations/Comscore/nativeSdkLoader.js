import { ScriptLoader } from '@rudderstack/analytics-js-common/utilsV1/ScriptLoader';

function loadNativeSdk() {
  const src = `${
    document.location.protocol == 'https:' ? 'https://sb' : 'http://b'
  }.scorecardresearch.com/beacon.js`;
  ScriptLoader('comscore', src);
}

export { loadNativeSdk };
