import {getDefaultPageProperties} from "./utils"
function addDomEventHandlers(rudderanalytics) {
    /* var handler = bind(function(e) {
        console.log("handler");
        e = e || window.event;
        console.log("handler");
    }, this); */
    var handler = e => {
        e = e || window.event;
        var target = e.target || e.srcElement;
        
        if (isTextNode(target)) { 
            target = target.parentNode;
        }
        if(shouldTrackDomEvent(target, e)){
            console.log("to be tracked ", e.type);
        } else {
            console.log("not to be tracked ", e.type);
        }
        trackWindowEvent(e, rudderanalytics);
        
    }
    register_event(document, 'submit', handler, true);
    register_event(document, 'change', handler, true);
    register_event(document, 'click', handler, true);
    rudderanalytics.page();
};

function register_event (element, type, handler, useCapture) {
    if (!element) {
        console.error('No valid element provided to register_event');
        return;
    }
    element.addEventListener(type, handler, !!useCapture);
};

function shouldTrackDomEvent(el, event) {
    if (!el || isTag(el, 'html') || !isElementNode(el)) {
        return false;
    }
    var tag = el.tagName.toLowerCase();
    switch (tag) {
        case 'html':
            return false;
        case 'form':
            return event.type === 'submit';
        case 'input':
            if (['button', 'submit'].indexOf(el.getAttribute('type')) === -1) {
                return event.type === 'change';
            } else {
                return event.type === 'click';
            }
        case 'select':
        case 'textarea':
            return event.type === 'change';
        default:
            return event.type === 'click';
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

function shouldTrackElement(el){
    if(!el.parentNode || isTag(el, 'body'))
        return false
    return true
}

function getClassName(el) {
    switch(typeof el.className) {
        case 'string':
            return el.className;
        case 'object': // handle cases where className might be SVGAnimatedString or some other type
            return el.className.baseVal || el.getAttribute('class') || '';
        default: // future proof
            return '';
    }
}

function trackWindowEvent(e, rudderanalytics) {
    var target = e.target || e.srcElement;
    if (isTextNode(target)) {
        target = target.parentNode;
    }

    if (shouldTrackDomEvent(target, e)) {
        var targetElementList = [target];
        console.log(targetElementList)
        var curEl = target;
        while (curEl.parentNode && !isTag(curEl, 'body')) {
            targetElementList.push(curEl.parentNode);
            curEl = curEl.parentNode;
        }
        console.log(targetElementList)

        var elementsJson = [];
        var href, explicitNoTrack = false;

        targetElementList.forEach(el => {
            var shouldTrackEl = shouldTrackElement(el);

            // if the element or a parent element is an anchor tag
            // include the href as a property
            if (el.tagName.toLowerCase() === 'a') {
                href = el.getAttribute('href');
                href = shouldTrackEl && href;
            }

            // allow users to programatically prevent tracking of elements by adding class 'rudder-no-track'
            var classes = getClassName(el).split(' ');
            if (classes.indexOf('rudder-no-track') >= 0) {
                explicitNoTrack = true;
            }

            elementsJson.push(getPropertiesFromElement(el));
        });

        if (explicitNoTrack) {
            return false;
        }

        
        var elementText="";
        var text = getText(target)//target.innerText//target.textContent//getSafeText(target);
        if (text && text.length) {
            elementText = text;
        }
        var props = {
            'event_type': e.type,
            'page': getDefaultPageProperties(),
            'elements':  elementsJson,
            'el_attr_href': href,
            'el_text': elementText
        }
        console.log('web_event', props);
        rudderanalytics.track('autotrack', props);
        return true;
    }
}

function getText(el){
    var text = "";
    el.childNodes.forEach(function(value){
        if(value.nodeType === Node.TEXT_NODE) { 
           console.log("Current textNode value is : ", value.nodeValue.trim())
           text += value.nodeValue;
        }
    });	
    return text.trim();
}

function getPropertiesFromElement(elem) {
    var props = {
        'classes': getClassName(elem).split(' '),
        'tag_name': elem.tagName.toLowerCase()
    };
    console.log(elem.attributes)
    
    let attrLength = elem.attributes.length;
    console.log(elem.attributes.length, typeof(elem.attributes))
    for(let i=0;i<attrLength;i++){
        let name = elem.attributes[i].name;
        let value = elem.attributes[i].value;
        if(value){
            props['attr__' + name] = value;
        }   
    } 

    var nthChild = 1;
    var nthOfType = 1;
    var currentElem = elem;
    while (currentElem = previousElementSibling(currentElem)) {
        nthChild++;
        if (currentElem.tagName === elem.tagName) {
            nthOfType++;
        }
    }
    props['nth_child'] = nthChild;
    props['nth_of_type'] = nthOfType;

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
export {addDomEventHandlers}