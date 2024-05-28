const CDN_INT_DIR = 'js-integrations';
const CDN_PLUGINS_DIR = 'plugins';
const URL_PATTERN = new RegExp(
  '^(https?:\\/\\/)' + // protocol
    '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|(\\d{1,3}\\.){3}\\d{1,3})' + // domain name or IP
    '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
);

export { CDN_INT_DIR, CDN_PLUGINS_DIR, URL_PATTERN };
