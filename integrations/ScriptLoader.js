/* eslint-disable no-use-before-define */
import logger from "../utils/logUtil";

const defaultAsyncState = true;

const ScriptLoader = (id, src, async = defaultAsyncState) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.async = async === undefined ? defaultAsyncState : async;
  js.type = "text/javascript";
  js.id = id;
  const h = document.getElementsByTagName("head")[0];
  if (Object.keys(h).length !== 0) {
    const e = h.getElementsByTagName("script")[0];
    logger.debug("==parent script==", e);
    logger.debug("==adding script==", js);
    h.insertBefore(js, e);
  } else {
    const e = h.getElementsByTagName("script")[0];
    logger.debug("==parent script==", e);
    logger.debug("==adding script==", js);
    e.parentNode.insertBefore(js, e);
  }
};

export default ScriptLoader;
