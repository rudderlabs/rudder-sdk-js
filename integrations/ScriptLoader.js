import logger from "../utils/logUtil";

const ScriptLoader = (id, src) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.async = true;
  js.type = "text/javascript";
  if(id === "TVSquared-integration"){
    js.defer = true;
  }
  js.id = id;
  const e = document.getElementsByTagName("script")[0];
  logger.debug("==script==", e);
  console.log("==script==", e)
  e.parentNode.insertBefore(js, e);
};

export default ScriptLoader;
