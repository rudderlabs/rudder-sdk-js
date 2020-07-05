import { getDefaultPageProperties } from "./utils";
import logger from "./logUtil";

function addDomEventHandlers(rudderanalytics) {
  const handler = (e) => {
    e = e || window.event;
    let target = e.target || e.srcElement;

    if (isTextNode(target)) {
      target = target.parentNode;
    }
    if (shouldTrackDomEvent(target, e)) {
      logger.debug("to be tracked ", e.type);
    } else {
      logger.debug("not to be tracked ", e.type);
    }
    trackWindowEvent(e, rudderanalytics);
  };
  register_event(document, "submit", handler, true);
  register_event(document, "change", handler, true);
  register_event(document, "click", handler, true);
  rudderanalytics.page();
}

function register_event(element, type, handler, useCapture) {
  if (!element) {
    logger.error(
      "[Autotrack] register_event:: No valid element provided to register_event"
    );
    return;
  }
  element.addEventListener(type, handler, !!useCapture);
}

function shouldTrackDomEvent(el, event) {
  if (!el || isTag(el, "html") || !isElementNode(el)) {
    return false;
  }
  const tag = el.tagName.toLowerCase();
  switch (tag) {
    case "html":
      return false;
    case "form":
      return event.type === "submit";
    case "input":
      if (["button", "submit"].indexOf(el.getAttribute("type")) === -1) {
        return event.type === "change";
      }
      return event.type === "click";

    case "select":
    case "textarea":
      return event.type === "change";
    default:
      return event.type === "click";
  }
}

function isTag(el, tag) {
  return el && el.tagName && el.tagName.toLowerCase() === tag.toLowerCase();
}

function isElementNode(el) {
  return el && el.nodeType === 1; // Node.ELEMENT_NODE - use integer constant for browser portability
}

function isTextNode(el) {
  return el && el.nodeType === 3; // Node.TEXT_NODE - use integer constant for browser portability
}

function shouldTrackElement(el) {

  if (!el.parentNode || isTag(el, "body")) return false;

  let curEl = el;
  while (curEl.parentNode && !isTag(curEl, "body")) {
    let classes = getClassName(el).split(" ");

    // if explicitly specified "rudder-no-track", even at parent level, dont track the child nodes too.
    if (classes.indexOf("rudder-no-track") >= 0) {
      return false;
    }
    curEl = curEl.parentNode;
  }

  // if explicitly set "rudder-include", at element level, then track the element even if the element is hidden or sensitive.
  let classes = getClassName(el).split(" ");
  if (classes.indexOf("rudder-include") >= 0) {
    return true;
  }

  // for general elements, do not track input/select/textarea(s)
  if (
    isTag(el, 'input') ||
    isTag(el, 'select') ||
    isTag(el, 'textarea') ||
    el.getAttribute('contenteditable') === 'true'
  ) {
    return false;
  } else if (el.getAttribute('contenteditable') === 'inherit'){
    for(curEl = el.parentNode; curEl.parentNode && !isTag(curEl, "body"); curEl = curEl.parentNode){
      if(curEl.getAttribute('contenteditable') === 'true'){
        return false;
      }
    }
  }

  // do not track hidden/password elements
  let type = el.type || '';
    if (typeof type === 'string') { // it's possible for el.type to be a DOM element if el is a form with a child input[name="type"]
        switch(type.toLowerCase()) {
            case 'hidden':
                return false;
            case 'password':
                return false;
        }
    }

    // filter out data from fields that look like sensitive field - 
    // safeguard - match with regex with possible strings as id or name of an element for creditcard, password, ssn, pan, adhar
    let name = el.name || el.id || '';
    if (typeof name === 'string') { // it's possible for el.name or el.id to be a DOM element if el is a form with a child input[name="name"]
        let sensitiveNameRegex = /^adhar|cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pan|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i;
        if (sensitiveNameRegex.test(name.replace(/[^a-zA-Z0-9]/g, ''))) {
            return false;
        }
    }

  return true;
}

function getClassName(el) {
  switch (typeof el.className) {
    case "string":
      return el.className;
    case "object": // handle cases where className might be SVGAnimatedString or some other type
      return el.className.baseVal || el.getAttribute("class") || "";
    default:
      // future proof
      return "";
  }
}

function trackWindowEvent(e, rudderanalytics) {
  let target = e.target || e.srcElement;
  let formValues;
  if (isTextNode(target)) {
    target = target.parentNode;
  }

  if (shouldTrackDomEvent(target, e)) {
    if (target.tagName.toLowerCase() == "form") {
      formValues = {};
      for (let i = 0; i < target.elements.length; i++) {
        const formElement = target.elements[i];
        if (
          shouldTrackElement(formElement) &&
          isValueToBeTrackedFromTrackingList(formElement, rudderanalytics.trackValues)
        ) {
          const name = formElement.id ? formElement.id : formElement.name;
          if (name && typeof name === "string") {
            const key = formElement.id ? formElement.id : formElement.name;
            // formElement.value gives the same thing
            let value = formElement.id
              ? document.getElementById(formElement.id).value
              : document.getElementsByName(formElement.name)[0].value;
            if (
              formElement.type === "checkbox" ||
              formElement.type === "radio"
            ) {
              value = formElement.checked;
            }
            if (key.trim() !== "") {
              formValues[encodeURIComponent(key)] = encodeURIComponent(value);
            }
          }
        }
      }
    }
    const targetElementList = [];
    let curEl = target;
    if(isExplicitNoTrack(curEl)){
      return false;
    }
    while (curEl.parentNode && !isTag(curEl, "body")) {
      if(shouldTrackElement(curEl)){
        targetElementList.push(curEl);
      }
      curEl = curEl.parentNode;
    }

    const elementsJson = [];
    let href;

    targetElementList.forEach((el) => {

      // if the element or a parent element is an anchor tag
      // include the href as a property
      if (el.tagName.toLowerCase() === "a") {
        href = el.getAttribute("href");
        href =  isValueToBeTracked(href) && href;
      }
      elementsJson.push(getPropertiesFromElement(el, rudderanalytics));
    });

    if (targetElementList && targetElementList.length == 0) {
      return false;
    }

    let elementText = "";
    const text = getText(target); 
    if (text && text.length) {
      elementText = text;
    }
    const props = {
      event_type: e.type,
      page: getDefaultPageProperties(),
      elements: elementsJson,
      el_attr_href: href,
      el_text: elementText,
    };

    if (formValues) {
      props.form_values = formValues;
    }

    logger.debug("web_event", props);
    rudderanalytics.track("autotrack", props);
    return true;
  }
}

function isExplicitNoTrack(el){
  const classes = getClassName(el).split(" ");
  if (classes.indexOf("rudder-no-track") >= 0) {
    return true;
  }
  return false;
}

function isValueToBeTracked(value){
  if(value === null || value === undefined){
    return false;
  }
  if (typeof value === 'string') {
    value = value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

    // check to see if input value looks like a credit card number
    // see: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s20.html
    var ccRegex = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
    if (ccRegex.test((value || '').replace(/[- ]/g, ''))) {
        return false;
    }

    // check to see if input value looks like a social security number
    var ssnRegex = /(^\d{3}-?\d{2}-?\d{4}$)/;
    if (ssnRegex.test(value)) {
        return false;
    }

    // check to see if input value looks like a adhar number
    var adharRegex = /(^\d{4}-?\d{4}-?\d{4}$)/;
    if (adharRegex.test(value)) {
        return false;
    }

    // check to see if input value looks like a PAN number
    var panRegex = /(^\w{5}-?\d{4}-?\w{1}$)/;
    if (panRegex.test(value)) {
        return false;
    }
}

return true;
}

function isValueToBeTrackedFromTrackingList(el, includeList) {
  const elAttributesLength = el.attributes.length;
  for (let i = 0; i < elAttributesLength; i++) {
    const { value } = el.attributes[i];
    if (includeList.indexOf(value) > -1) {
      return true;
    }
  }
  return false;
}

function getText(el) {
  let text = "";
  el.childNodes.forEach(function (value) {
    if (value.nodeType === Node.TEXT_NODE) {
      let textContent = value.nodeValue.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

      // take each word from the text content and check whether the value should be tracked. Also, replace the whitespaces.
      let textValue = textContent.split(/(\s+)/).filter(isValueToBeTracked).join('').replace(/[\r\n]/g, ' ');
      text += textValue;
    }
  });
  return text.trim();
}

function getPropertiesFromElement(elem, rudderanalytics) {
  const props = {
    classes: getClassName(elem).split(" "),
    tag_name: elem.tagName.toLowerCase(),
  };

  const attrLength = elem.attributes.length;
  for (let i = 0; i < attrLength; i++) {
    const { name } = elem.attributes[i];
    const { value } = elem.attributes[i];
    if (value && isValueToBeTracked(value)) {
      props[`attr__${name}`] = value;
    }
    if (
      (name == "name" || name == "id") &&
      isValueToBeTrackedFromTrackingList(elem, rudderanalytics.trackValues)
    ) {
      props.field_value =
        name == "id"
          ? document.getElementById(value).value
          : document.getElementsByName(value)[0].value;

      if (elem.type === "checkbox" || elem.type === "radio") {
        props.field_value = elem.checked;
      }
    }
  }

  let nthChild = 1;
  let nthOfType = 1;
  let currentElem = elem;
  while ((currentElem = previousElementSibling(currentElem))) {
    nthChild++;
    if (currentElem.tagName === elem.tagName) {
      nthOfType++;
    }
  }
  props.nth_child = nthChild;
  props.nth_of_type = nthOfType;

  return props;
}

function previousElementSibling(el) {
  if (el.previousElementSibling) {
    return el.previousElementSibling;
  }
  do {
    el = el.previousSibling;
  } while (el && !isElementNode(el));
  return el;
}
export { addDomEventHandlers };
