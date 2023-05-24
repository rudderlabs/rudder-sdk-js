/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import Storage from './storage';

function getReferrer() {
  return document.referrer || '$direct';
}

function getReferringDomain(referrer) {
  const split = referrer.split('/');
  if (split.length >= 3) {
    return split[2];
  }
  return '';
}

function getCanonicalUrl() {
  const tags = document.getElementsByTagName('link');
  for (let i = 0; tags[i]; i += 1) {
    const tag = tags[i];
    if (tag.getAttribute('rel') === 'canonical') {
      return tag.getAttribute('href');
    }
  }
}

function getUrl(search) {
  const canonicalUrl = getCanonicalUrl();
  let url;
  if (canonicalUrl) {
    url = canonicalUrl.includes('?') ? canonicalUrl : canonicalUrl + search;
  } else {
    url = window.location.href;
  }
  const hashIndex = url.indexOf('#');
  return hashIndex > -1 ? url.slice(0, hashIndex) : url;
}

function getDefaultPageProperties() {
  const canonicalUrl = getCanonicalUrl();
  let path = window.location.pathname;

  if (canonicalUrl) {
    try {
      const urlObj = new URL(canonicalUrl);
      path = urlObj.pathname;
    } catch (err) {
      // Do nothing
    }
  }

  const { search, href } = window.location;
  const { title } = document;
  const url = getUrl(search);
  const tab_url = href;

  const referrer = getReferrer();
  const referring_domain = getReferringDomain(referrer);
  const initial_referrer = Storage.getInitialReferrer() || '';
  const initial_referring_domain = Storage.getInitialReferringDomain() || '';
  return {
    path,
    referrer,
    referring_domain,
    search,
    title,
    url,
    tab_url,
    initial_referrer,
    initial_referring_domain,
  };
}

export { getReferrer, getReferringDomain, getDefaultPageProperties };
