import { EXTERNAL_SOURCE_LOAD_ORIGIN } from '@rudderstack/analytics-js/constants/htmlAttributes';
import { serializeError } from 'serialize-error';
import { keys } from 'ramda';

/**
 * Create the DOM element to load a script marked as RS SDK originated
 *
 * @param {*} url The URL of the script to be loaded
 * @param {*} id ID for the script tag
 * @param {*} async Whether to load the script in async mode. Defaults to `true` [optional]
 * @param {*} onload callback to invoke onload [optional]
 * @param {*} onerror callback to invoke onerror [optional]
 * @param {*} extraAttributes key/value pair with html attributes to add in html tag [optional]
 *
 * @returns HTMLScriptElement
 */
const createScriptElement = (
  url: string,
  id: string,
  async = true,
  onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null,
  onerror: OnErrorEventHandler = null,
  extraAttributes: Record<string, string> = {},
) => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.onload = onload;
  scriptElement.onerror = onerror;
  scriptElement.src = url;
  scriptElement.id = id;
  scriptElement.async = async;
  scriptElement.setAttribute('data-append-origin', EXTERNAL_SOURCE_LOAD_ORIGIN);

  Object.keys(extraAttributes).forEach(attributeName => {
    scriptElement.setAttribute(attributeName, extraAttributes[attributeName]);
  });

  return scriptElement;
};

/**
 * Add script DOM element to DOM
 *
 * @param {*} newScriptElement the script element to add
 *
 * @returns
 */
const insertScript = (newScriptElement: HTMLScriptElement) => {
  // First try to add it to the head
  const headElements = document.getElementsByTagName('head');
  if (headElements.length > 0) {
    headElements[0].insertBefore(newScriptElement, headElements[0].firstChild);
    return;
  }

  // Else wise add it before the first script tag
  const scriptElements = document.getElementsByTagName('script');
  if (scriptElements.length > 0 && scriptElements[0].parentNode) {
    scriptElements[0].parentNode.insertBefore(newScriptElement, scriptElements[0]);
    return;
  }

  // Create a new head element and add the script as fallback
  const headElement = document.createElement('head');
  headElement.appendChild(newScriptElement);

  const htmlElement = document.getElementsByTagName('html')[0];
  htmlElement.insertBefore(headElement, htmlElement.firstChild);
};

/**
 * Loads external js file as a script html tag
 *
 * @param {*} url The URL of the script to be loaded
 * @param {*} id ID for the script tag
 * @param {*} timeout loading timeout
 * @param {*} async Whether to load the script in async mode. Defaults to `true` [optional]
 * @param {*} extraAttributes key/value pair with html attributes to add in html tag [optional]
 *
 * @returns
 */
const jsFileLoader = (
  url: string,
  id: string,
  timeout: number,
  async = true,
  extraAttributes?: Record<string, string>,
): Promise<string | undefined> =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve, reject) => {
    const scriptExists = document.getElementById(id);
    if (scriptExists) {
      reject(new Error(`A script with the id "${id}" is already loaded. Hence, skipping it.`));
    }

    try {
      let timeoutID: number;

      const onload = () => {
        clearTimeout(timeoutID);
        resolve(id);
      };

      const onerror = () => {
        clearTimeout(timeoutID);
        reject(new Error(`Couldn't load the script: "${url}" with id ${id}.`));
      };

      // Create the DOM element to load the script and add it to the DOM
      insertScript(createScriptElement(url, id, async, onload, onerror, extraAttributes));

      // Reject on timeout
      timeoutID = window.setTimeout(() => {
        reject(
          new Error(
            `Timeout (${timeout} ms) occurred. Couldn't load the script: "${url}" with id ${id}.`,
          ),
        );
      }, timeout);
    } catch (err) {
      reject(
        new Error(
          `Exception occurred while loading the script "${url}" with id ${id}: "${serializeError(
            err,
          )}"`,
        ),
      );
    }
  });

export { jsFileLoader, insertScript, createScriptElement };
