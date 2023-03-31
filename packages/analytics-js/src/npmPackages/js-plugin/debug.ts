/*
 * Only support debug mode on browser when url contains query param JS_PLUGIN_DEBUG
 */
const isPluginEngineDebugMode = document.location.search.includes('JS_PLUGIN_DEBUG');

export { isPluginEngineDebugMode };
