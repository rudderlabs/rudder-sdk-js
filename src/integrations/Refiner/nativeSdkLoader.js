import ScriptLoader, { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(apiKey) {
  window._refinerQueue = window._refinerQueue || [];
  this._refiner = function () {
    window._refinerQueue.push(arguments);
  };
  ScriptLoader('refiner', 'https://js.refiner.io/v001/client.js');
  this._refiner('setProject', apiKey);
}

export { loadNativeSdk };
