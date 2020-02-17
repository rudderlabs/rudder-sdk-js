import { getDefaultPageProperties } from "./utils";
import logger from "./logUtil";

function addDomEventHandlers(rudderanalytics) {
  var handler = e => {
    e = e || window.event;
    var target = e.target || e.srcElement;

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
    logger.error("No valid element provided to register_event");
    return;
  }
  element.addEventListener(type, handler, !!useCapture);
}

function shouldTrackDomEvent(el, event) {
  if (!el || isTag(el, "html") || !isElementNode(el)) {
    return false;
  }
  var tag = el.tagName.toLowerCase();
  switch (tag) {
    case "html":
      return false;
    case "form":
      return event.type === "submit";
    case "input":
      if (["button", "submit"].indexOf(el.getAttribute("type")) === -1) {
        return event.type === "change";
      } else {
        return event.type === "click";
      }
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
  var target = e.target || e.srcElement;
  var formValues = undefined;
  if (isTextNode(target)) {
    target = target.parentNode;
  }

  if (shouldTrackDomEvent(target, e)) {
    if (target.tagName.toLowerCase() == "form") {
      formValues = {};
      for (var i = 0; i < target.elements.length; i++) {
        var formElement = target.elements[i];
        if (
          isElToBeTracked(formElement) &&
          isElValueToBeTracked(formElement, rudderanalytics.trackValues)
        ) {
          let name = formElement.id ? formElement.id : formElement.name;
          if (name && typeof name === "string") {
            var key = formElement.id ? formElement.id : formElement.name;
            // formElement.value gives the same thing
            var value = formElement.id
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
    var targetElementList = [target];
    var curEl = target;
    while (curEl.parentNode && !isTag(curEl, "body")) {
      targetElementList.push(curEl.parentNode);
      curEl = curEl.parentNode;
    }

    var elementsJson = [];
    var href,
      explicitNoTrack = false;

    targetElementList.forEach(el => {
      var shouldTrackEl = shouldTrackElement(el);

      // if the element or a parent element is an anchor tag
      // include the href as a property
      if (el.tagName.toLowerCase() === "a") {
        href = el.getAttribute("href");
        href = shouldTrackEl && href;
      }

      // allow users to programatically prevent tracking of elements by adding class 'rudder-no-track'

      explicitNoTrack = explicitNoTrack || !isElToBeTracked(el);

      //explicitNoTrack = !isElToBeTracked(el);

      elementsJson.push(getPropertiesFromElement(el, rudderanalytics));
    });

    if (explicitNoTrack) {
      return false;
    }

    var elementText = "";
    var text = getText(target); //target.innerText//target.textContent//getSafeText(target);
    if (text && text.length) {
      elementText = text;
    }
    var props = {
      event_type: e.type,
      page: getDefaultPageProperties(),
      elements: elementsJson,
      el_attr_href: href,
      el_text: elementText
    };

    if (formValues) {
      props["form_values"] = formValues;
    }

    logger.debug("web_event", props);
    rudderanalytics.track("autotrack", props);
    return true;
  }
}

function isElValueToBeTracked(el, includeList) {
  var elAttributesLength = el.attributes.length;
  for (let i = 0; i < elAttributesLength; i++) {
    let value = el.attributes[i].value;
    if (includeList.indexOf(value) > -1) {
      return true;
    }
  }
  return false;
}

function isElToBeTracked(el) {
  var classes = getClassName(el).split(" ");
  if (classes.indexOf("rudder-no-track") >= 0) {
    return false;
  }
  return true;
}

function getText(el) {
  var text = "";
  el.childNodes.forEach(function(value) {
    if (value.nodeType === Node.TEXT_NODE) {
      text += value.nodeValue;
    }
  });
  return text.trim();
}

function getPropertiesFromElement(elem, rudderanalytics) {
  var props = {
    classes: getClassName(elem).split(" "),
    tag_name: elem.tagName.toLowerCase()
  };

  let attrLength = elem.attributes.length;
  for (let i = 0; i < attrLength; i++) {
    let name = elem.attributes[i].name;
    let value = elem.attributes[i].value;
    if (value) {
      props["attr__" + name] = value;
    }
    if (
      (name == "name" || name == "id") &&
      isElValueToBeTracked(elem, rudderanalytics.trackValues)
    ) {
      props["field_value"] =
        name == "id"
          ? document.getElementById(value).value
          : document.getElementsByName(value)[0].value;

      if (elem.type === "checkbox" || elem.type === "radio") {
        props["field_value"] = elem.checked;
      }
    }
  }

  var nthChild = 1;
  var nthOfType = 1;
  var currentElem = elem;
  while ((currentElem = previousElementSibling(currentElem))) {
    nthChild++;
    if (currentElem.tagName === elem.tagName) {
      nthOfType++;
    }
  }
  props["nth_child"] = nthChild;
  props["nth_of_type"] = nthOfType;

  return props;
}

function previousElementSibling(el) {
  if (el.previousElementSibling) {
    return el.previousElementSibling;
  } else {
    do {
      el = el.previousSibling;
    } while (el && !isElementNode(el));
    return el;
  }
}
export { addDomEventHandlers };
