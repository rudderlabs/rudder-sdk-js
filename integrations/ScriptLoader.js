import logger from "../utils/logUtil";

const ScriptLoader = (id, src) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.async = true;
  js.type = "text/javascript";
  js.id = id;
  const e = document.getElementsByTagName("script")[0];
  logger.debug("==parent script==", e);
  logger.debug("==adding script==", js);
  e.parentNode.insertBefore(js, e);
};

export default ScriptLoader;
