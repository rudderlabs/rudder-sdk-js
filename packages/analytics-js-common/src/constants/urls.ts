const CDN_INT_DIR = 'js-integrations';
const CDN_PLUGINS_DIR = 'plugins';
const URL_PATTERN = new RegExp(
  '^(https?:\\/\\/)' + // protocol
    '(' +
    '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
    'localhost|' + // localhost
    '((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]?)\\.){3}' + // OR IP (v4) address first 3 octets
    '(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]?))' + // last octet of IP address
    ')' +
    '(\\:\\d+)?' + // port
    '(\\/[-a-zA-Z\\d%_.~+]*)*' + // path
    '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
);

export { CDN_INT_DIR, CDN_PLUGINS_DIR, URL_PATTERN };
