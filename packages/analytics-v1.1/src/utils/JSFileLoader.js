const DEFAULT_TIMEOUT = 10 * 1000; // 10 seconds

/**
 *
 * @param {*} url The URL of the script to be loaded
 * @param {*} id ID for the script tag [optional]
 * @param {*} timeout timeout [optional]
 * @param {*} async Whether to load the script in async mode. Defaults to `true` [optional]
 * @returns
 */
const loadScript = (url, id, timeout, async = true) =>
  new Promise((resolve, reject) => {
    try {
      const exists = document.getElementById(id);
      if (exists) {
        reject(new Error(`A script with the id "${id}" is already loaded. Hence, skipping it.`));
      }

      // Create the DOM element to load the script
      const scriptElem = document.createElement('script');
      scriptElem.type = 'text/javascript';
      scriptElem.src = url;
      scriptElem.id = id;
      scriptElem.async = async || true;

      let timeoutID;
      scriptElem.onload = function onLoad() {
        clearTimeout(timeoutID);
        resolve();
      };

      scriptElem.onerror = function onError() {
        clearTimeout(timeoutID);
        reject(new Error(`Couldn't load the script: "${url}".`));
      };

      // Add it to the document
      // First try to add it to the head
      const headElmColl = document.getElementsByTagName('head');
      if (headElmColl.length > 0) {
        headElmColl[0].insertBefore(scriptElem, headElmColl[0].firstChild);
      } else {
        // Add it before the first script tag
        const scriptsColl = document.getElementsByTagName('script');
        if (scriptsColl.length > 0) {
          scriptsColl[0].parentNode.insertBefore(scriptElem, scriptsColl[0]);
        } else {
          // Create a head element and the script
          const headElem = document.createElement('head');
          headElem.appendChild(scriptElem);
          const htmlElem = document.getElementsByTagName('html')[0];
          htmlElem.insertBefore(headElem, htmlElem.firstChild);
        }
      }

      // Set the timer
      const delay = timeout || DEFAULT_TIMEOUT;
      timeoutID = setTimeout(() => {
        reject(new Error(`Timeout (${delay} ms) occurred. Couldn't load the script: "${url}".`));
      }, delay);
    } catch (err) {
      reject(new Error(`Exception occurred while loading the script "${url}": "${err}"`));
    }
  });

export { loadScript };
