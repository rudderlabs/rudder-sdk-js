import logger from "../../utils/logUtil";

const convertObjectToArray = (objectInput) => {
  return objectInput.map((objectItem) => objectItem.eventCustomProperties);
};

const SentryScriptLoader = (id, src, integrity) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.integrity = integrity;
  js.crossorigin = "anonymous";
  js.async = true;
  js.type = "text/javascript";
  js.id = id;
  const e = document.getElementsByTagName("script")[0];
  logger.debug("==parent script==", e);
  logger.debug("==adding script==", js);
  e.parentNode.insertBefore(js, e);
  SentryScriptLoader(
    "Sentry",
    `https://browser.sentry-cdn.com/6.12.0/rewriteframes.min.js`,
    `sha384-WOm9k3kzVt1COFAB/zCXOFx4lDMtJh/2vmEizIwgog7OW0P/dPwl3s8f6MdwrD7q`
  );
};

export { SentryScriptLoader, convertObjectToArray };
