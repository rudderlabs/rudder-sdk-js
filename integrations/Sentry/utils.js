import logger from "../../utils/logUtil";

const convertObjectToArray = (objectInput) => {
  const list = [];
  objectInput.forEach(function (objectItem) {
    const x = objectItem.eventCustomProperties;
    list.push(x);
  });
  return list;
};

const SentryRewriteFramesLoader = (id, src) => {
  logger.debug(`In rewriteFrame loader === ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.integrity =
    "sha384-WOm9k3kzVt1COFAB/zCXOFx4lDMtJh/2vmEizIwgog7OW0P/dPwl3s8f6MdwrD7q";
  js.crossorigin = "anonymous";
  js.async = true;
  js.type = "text/javascript";
  js.id = id;
  const e = document.getElementsByTagName("script")[0];
  logger.debug("==parent script==", e);
  logger.debug("==adding script==", js);
  e.parentNode.insertBefore(js, e);
};

const SentryScriptLoader = (id, src) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.integrity =
    "sha384-S3qfdh3AsT1UN84WIYNuOX9vVOoFg3nB17Jp5/pTFGDBGBt+dtz7MGAV845efkZr";
  js.crossorigin = "anonymous";
  js.async = true;
  js.type = "text/javascript";
  js.id = id;
  const e = document.getElementsByTagName("script")[0];
  logger.debug("==parent script==", e);
  logger.debug("==adding script==", js);
  e.parentNode.insertBefore(js, e);
  SentryRewriteFramesLoader(
    "Sentry",
    `https://browser.sentry-cdn.com/6.12.0/rewriteframes.min.js`
  );
};

const identifierPayloadBuilder = (userId, email, name, ipAddress) => {
  const userIdentifierPayload = {};
  if (userId) {
    userIdentifierPayload.id = userId;
  }
  if (email) {
    userIdentifierPayload.email = email;
  }
  if (name) {
    userIdentifierPayload.username = name;
  }
  if (ipAddress) {
    userIdentifierPayload.ip_address = ipAddress;
  }
  return userIdentifierPayload;
};

export {
  SentryScriptLoader,
  identifierPayloadBuilder,
  SentryRewriteFramesLoader,
  convertObjectToArray,
};
