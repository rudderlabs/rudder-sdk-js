import { getMutatedError } from '../../utilities/errors';
import { EXTERNAL_SOURCE_LOAD_ORIGIN } from '../../constants/htmlAttributes';
import {
  SCRIPT_ALREADY_EXISTS_ERROR,
  SCRIPT_LOAD_ERROR,
  SCRIPT_LOAD_TIMEOUT_ERROR,
} from '../../constants/logMessages';

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

  Object.keys(extraAttributes).forEach(attributeName => {
    scriptElement.setAttribute(attributeName, extraAttributes[attributeName] as string);
  });

  scriptElement.setAttribute('data-loader', EXTERNAL_SOURCE_LOAD_ORIGIN);

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
    headElements[0]?.insertBefore(newScriptElement, headElements[0]?.firstChild);
    return;
  }

  // Else wise add it before the first script tag
  const scriptElements = document.getElementsByTagName('script');
  if (scriptElements.length > 0 && scriptElements[0]?.parentNode) {
    scriptElements[0]?.parentNode.insertBefore(newScriptElement, scriptElements[0]);
    return;
  }

  // Create a new head element and add the script as fallback
  const headElement = document.createElement('head');
  headElement.appendChild(newScriptElement);

  const htmlElement = document.getElementsByTagName('html')[0];
  htmlElement?.insertBefore(headElement, htmlElement.firstChild);
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
  new Promise((resolve, reject) => {
    const scriptExists = document.getElementById(id);
    if (scriptExists) {
      reject(new Error(SCRIPT_ALREADY_EXISTS_ERROR(id)));
    }

    try {
      let timeoutID: number;

      const onload = () => {
        (globalThis as typeof window).clearTimeout(timeoutID);
        resolve(id);
      };

      const onerror = () => {
        (globalThis as typeof window).clearTimeout(timeoutID);
        reject(new Error(SCRIPT_LOAD_ERROR(id, url)));
      };

      // Create the DOM element to load the script and add it to the DOM
      insertScript(createScriptElement(url, id, async, onload, onerror, extraAttributes));

      // Reject on timeout
      timeoutID = (globalThis as typeof window).setTimeout(() => {
        reject(new Error(SCRIPT_LOAD_TIMEOUT_ERROR(id, url, timeout)));
      }, timeout);
    } catch (err) {
      reject(getMutatedError(err, SCRIPT_LOAD_ERROR(id, url)));
    }
  });

export { jsFileLoader, insertScript, createScriptElement };
