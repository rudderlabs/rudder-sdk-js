import logger from "../../utils/logUtil";

const SentryScriptLoader = (id, src) => {
  logger.debug(`in script loader=== ${id}`);
  const js = document.createElement("script");
  js.src = src;
  js.integrity = "sha384-S3qfdh3AsT1UN84WIYNuOX9vVOoFg3nB17Jp5/pTFGDBGBt+dtz7MGAV845efkZr";
  js.crossorigin = "anonymous"
  js.async = true;
  js.type = "text/javascript";
  js.id = id;
  const e = document.getElementsByTagName("script")[0];
  logger.debug("==parent script==", e);
  logger.debug("==adding script==", js);
  e.parentNode.insertBefore(js, e);
};

const identifierPayloadBuilder = (userId, email, name, ip_address) => {
    payload = {};
    if (userId) {
        userIdentifierPayload.id = userId;
    }
    if(email) {
        userIdentifierPayload.email = email;
    }
    if(name) {
        userIdentifierPayload.username = name;
    }
    if(ip_address) {
        userIdentifierPayload.ip_address = ip_address;
    }
    return payload;
};

export {SentryScriptLoader, identifierPayloadBuilder}; 
