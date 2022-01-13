/* eslint-disable no-use-before-define */
// import logger from "../utils/logUtil";

const defaultAsyncState = true;

const ScriptLoader = (id, src, async = defaultAsyncState) => {
  const exists = document.getElementById(id);
  if (exists) {
    // logger.debug("script already loaded");
    return;
  }
  const js = document.createElement("script");
  js.src = src;
  js.async = async === undefined ? defaultAsyncState : async;
  js.type = "text/javascript";
  js.id = id;
  const headElems = document.getElementsByTagName("head");
  if (Object.keys(headElems).length !== 0) {
    // logger.debug("==adding script==", js);
    headElems.insertBefore(js, headElems.firstChild);
  } else {
    const e = document.getElementsByTagName("script")[0];
    // logger.debug("==parent script==", e);
    // logger.debug("==adding script==", js);
    e.parentNode.insertBefore(js, e);
  }
};

export default ScriptLoader;
