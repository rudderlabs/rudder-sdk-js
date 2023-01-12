const getUserAgent = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  let { userAgent } = navigator;
  const { brave } = navigator;

  // For supporting Brave browser detection,
  // add "Brave/<version>" to the user agent with the version value from the Chrome component
  if (brave && Object.getPrototypeOf(brave).isBrave) {
    // Example:
    // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36
    const matchedArr = userAgent.match(/(chrome)\/([\w.]+)/i);

    if (matchedArr) {
      userAgent = `${userAgent} Brave/${matchedArr[2]}`;
    }
  }

  return userAgent;
};

const getLanguage = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  return navigator.language || navigator.browserLanguage;
};

export { getUserAgent, getLanguage };
