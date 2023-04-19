export type ParsedURL = {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  query?: string;
};

/**
 * Return default port for `protocol`
 */
const port = (protocol: string): string => {
  switch (protocol) {
    case 'http:':
      return '80';
    case 'https:':
      return '443';
    default:
      return window.location.port;
  }
};

/**
 * Parse the given `url`
 */
const parse = (url: string): ParsedURL => {
  // TODO: does this calculate the same as new URL(url)? (hostname, pathname are the same)
  //  if yes replace all usages with URL API and remove this one
  const a = document.createElement('a');
  a.href = url;

  return {
    href: a.href,
    host: a.host || window.location.host,
    port: ['0', ''].includes(a.port) ? port(a.protocol) : a.port,
    hash: a.hash,
    hostname: a.hostname || window.location.hostname,
    pathname: a.pathname.charAt(0) !== '/' ? `/${a.pathname}` : a.pathname,
    protocol: !a.protocol || a.protocol === ':' ? window.location.protocol : a.protocol,
    search: a.search,
    query: a.search.slice(1),
  };
};

/**
 * Check if `url` is absolute
 */
const isAbsolute = (url: string): boolean => url.indexOf('//') === 0 || url.indexOf('://') > 0;

/**
 * Check if `url` is relative
 */
const isRelative = (url: string) => {
  return !isAbsolute(url);
};

/**
 * Check if `url` is cross domain
 */
const isCrossDomain = (urlString: string): boolean => {
  const url = parse(urlString);
  const location = parse(window.location.href);

  return Boolean(
    url.hostname !== location.hostname ||
      url.port !== location.port ||
      url.protocol !== location.protocol,
  );
};

export { parse, isAbsolute, isRelative, isCrossDomain };
