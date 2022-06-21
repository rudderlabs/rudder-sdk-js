/* eslint-disable no-use-before-define */
import logger from "../utils/logUtil";

const defaultAsyncState = true;

export const LOAD_ORIGIN = "RS_JS_SDK";

const ScriptLoader = (id, src, async = defaultAsyncState) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.async = async === undefined ? defaultAsyncState : async;
  js.type = "text/javascript";
  js.id = id;
  js.dataset.loader = LOAD_ORIGIN;
  const headElmColl = document.getElementsByTagName("head");
  if (headElmColl.length !== 0) {
    logger.debug("==adding script==", js);
    headElmColl[0].insertBefore(js, headElmColl[0].firstChild);
  } else {
    const e = document.getElementsByTagName("script")[0];
    logger.debug("==parent script==", e);
    logger.debug("==adding script==", js);
    e.parentNode.insertBefore(js, e);
  }
};

export default ScriptLoader;
