var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform$2 = 'browser';
var browser = true;
var env = {};
var argv = [];
var version$1 = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop$2() {}

var on = noop$2;
var addListener = noop$2;
var once = noop$2;
var off = noop$2;
var removeListener = noop$2;
var removeAllListeners = noop$2;
var emit = noop$2;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version$1,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform$2,
  release: release,
  config: config,
  uptime: uptime
};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function bind(fn,thisArg){return function wrap(){return fn.apply(thisArg,arguments);};}

const{toString: toString$2}=Object.prototype;const{getPrototypeOf}=Object;const kindOf=(cache=>thing=>{const str=toString$2.call(thing);return cache[str]||(cache[str]=str.slice(8,-1).toLowerCase());})(Object.create(null));const kindOfTest=type=>{type=type.toLowerCase();return thing=>kindOf(thing)===type;};const typeOfTest=type=>thing=>typeof thing===type;/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */const{isArray: isArray$3}=Array;/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */const isUndefined$1=typeOfTest('undefined');/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */function isBuffer$1(val){return val!==null&&!isUndefined$1(val)&&val.constructor!==null&&!isUndefined$1(val.constructor)&&isFunction$2(val.constructor.isBuffer)&&val.constructor.isBuffer(val);}/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */const isArrayBuffer=kindOfTest('ArrayBuffer');/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */function isArrayBufferView(val){let result;if(typeof ArrayBuffer!=='undefined'&&ArrayBuffer.isView){result=ArrayBuffer.isView(val);}else {result=val&&val.buffer&&isArrayBuffer(val.buffer);}return result;}/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */const isString$3=typeOfTest('string');/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */const isFunction$2=typeOfTest('function');/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */const isNumber$1=typeOfTest('number');/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */const isObject$2=thing=>thing!==null&&typeof thing==='object';/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */const isBoolean$1=thing=>thing===true||thing===false;/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */const isPlainObject=val=>{if(kindOf(val)!=='object'){return false;}const prototype=getPrototypeOf(val);return (prototype===null||prototype===Object.prototype||Object.getPrototypeOf(prototype)===null)&&!(Symbol.toStringTag in val)&&!(Symbol.iterator in val);};/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */const isDate$1=kindOfTest('Date');/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */const isFile=kindOfTest('File');/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */const isBlob=kindOfTest('Blob');/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */const isFileList=kindOfTest('FileList');/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */const isStream=val=>isObject$2(val)&&isFunction$2(val.pipe);/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */const isFormData=thing=>{let kind;return thing&&(typeof FormData==='function'&&thing instanceof FormData||isFunction$2(thing.append)&&((kind=kindOf(thing))==='formdata'||// detect form-data instance
kind==='object'&&isFunction$2(thing.toString)&&thing.toString()==='[object FormData]'));};/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */const isURLSearchParams=kindOfTest('URLSearchParams');/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */const trim=str=>str.trim?str.trim():str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */function forEach(obj,fn,{allOwnKeys=false}={}){// Don't bother if no value provided
if(obj===null||typeof obj==='undefined'){return;}let i;let l;// Force an array if not already something iterable
if(typeof obj!=='object'){/*eslint no-param-reassign:0*/obj=[obj];}if(isArray$3(obj)){// Iterate over array values
for(i=0,l=obj.length;i<l;i++){fn.call(null,obj[i],i,obj);}}else {// Iterate over object keys
const keys=allOwnKeys?Object.getOwnPropertyNames(obj):Object.keys(obj);const len=keys.length;let key;for(i=0;i<len;i++){key=keys[i];fn.call(null,obj[key],key,obj);}}}function findKey(obj,key){key=key.toLowerCase();const keys=Object.keys(obj);let i=keys.length;let _key;while(i-->0){_key=keys[i];if(key===_key.toLowerCase()){return _key;}}return null;}const _global=(()=>{/*eslint no-undef:0*/if(typeof globalThis!=="undefined")return globalThis;return typeof self!=="undefined"?self:typeof window!=='undefined'?window:global$1;})();const isContextDefined=context=>!isUndefined$1(context)&&context!==_global;/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */function merge(/* obj1, obj2, obj3, ... */){const{caseless}=isContextDefined(this)&&this||{};const result={};const assignValue=(val,key)=>{const targetKey=caseless&&findKey(result,key)||key;if(isPlainObject(result[targetKey])&&isPlainObject(val)){result[targetKey]=merge(result[targetKey],val);}else if(isPlainObject(val)){result[targetKey]=merge({},val);}else if(isArray$3(val)){result[targetKey]=val.slice();}else {result[targetKey]=val;}};for(let i=0,l=arguments.length;i<l;i++){arguments[i]&&forEach(arguments[i],assignValue);}return result;}/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */const extend=(a,b,thisArg,{allOwnKeys}={})=>{forEach(b,(val,key)=>{if(thisArg&&isFunction$2(val)){a[key]=bind(val,thisArg);}else {a[key]=val;}},{allOwnKeys});return a;};/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */const stripBOM=content=>{if(content.charCodeAt(0)===0xFEFF){content=content.slice(1);}return content;};/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */const inherits$2=(constructor,superConstructor,props,descriptors)=>{constructor.prototype=Object.create(superConstructor.prototype,descriptors);constructor.prototype.constructor=constructor;Object.defineProperty(constructor,'super',{value:superConstructor.prototype});props&&_extends(constructor.prototype,props);};/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */const toFlatObject=(sourceObj,destObj,filter,propFilter)=>{let props;let i;let prop;const merged={};destObj=destObj||{};// eslint-disable-next-line no-eq-null,eqeqeq
if(sourceObj==null)return destObj;do{props=Object.getOwnPropertyNames(sourceObj);i=props.length;while(i-->0){prop=props[i];if((!propFilter||propFilter(prop,sourceObj,destObj))&&!merged[prop]){destObj[prop]=sourceObj[prop];merged[prop]=true;}}sourceObj=filter!==false&&getPrototypeOf(sourceObj);}while(sourceObj&&(!filter||filter(sourceObj,destObj))&&sourceObj!==Object.prototype);return destObj;};/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */const endsWith=(str,searchString,position)=>{str=String(str);if(position===undefined||position>str.length){position=str.length;}position-=searchString.length;const lastIndex=str.indexOf(searchString,position);return lastIndex!==-1&&lastIndex===position;};/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */const toArray=thing=>{if(!thing)return null;if(isArray$3(thing))return thing;let i=thing.length;if(!isNumber$1(i))return null;const arr=new Array(i);while(i-->0){arr[i]=thing[i];}return arr;};/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */ // eslint-disable-next-line func-names
const isTypedArray=(TypedArray=>{// eslint-disable-next-line func-names
return thing=>{return TypedArray&&thing instanceof TypedArray;};})(typeof Uint8Array!=='undefined'&&getPrototypeOf(Uint8Array));/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */const forEachEntry=(obj,fn)=>{const generator=obj&&obj[Symbol.iterator];const iterator=generator.call(obj);let result;while((result=iterator.next())&&!result.done){const pair=result.value;fn.call(obj,pair[0],pair[1]);}};/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */const matchAll=(regExp,str)=>{let matches;const arr=[];while((matches=regExp.exec(str))!==null){arr.push(matches);}return arr;};/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */const isHTMLForm=kindOfTest('HTMLFormElement');const toCamelCase=str=>{return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function replacer(m,p1,p2){return p1.toUpperCase()+p2;});};/* Creating a function that will check if an object has a property. */const hasOwnProperty$1=(({hasOwnProperty})=>(obj,prop)=>hasOwnProperty.call(obj,prop))(Object.prototype);/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */const isRegExp$1=kindOfTest('RegExp');const reduceDescriptors=(obj,reducer)=>{const descriptors=Object.getOwnPropertyDescriptors(obj);const reducedDescriptors={};forEach(descriptors,(descriptor,name)=>{let ret;if((ret=reducer(descriptor,name,obj))!==false){reducedDescriptors[name]=ret||descriptor;}});Object.defineProperties(obj,reducedDescriptors);};/**
 * Makes all methods read-only
 * @param {Object} obj
 */const freezeMethods=obj=>{reduceDescriptors(obj,(descriptor,name)=>{// skip restricted props in strict mode
if(isFunction$2(obj)&&['arguments','caller','callee'].indexOf(name)!==-1){return false;}const value=obj[name];if(!isFunction$2(value))return;descriptor.enumerable=false;if('writable'in descriptor){descriptor.writable=false;return;}if(!descriptor.set){descriptor.set=()=>{throw Error('Can not rewrite read-only method \''+name+'\'');};}});};const toObjectSet=(arrayOrString,delimiter)=>{const obj={};const define=arr=>{arr.forEach(value=>{obj[value]=true;});};isArray$3(arrayOrString)?define(arrayOrString):define(String(arrayOrString).split(delimiter));return obj;};const noop$1=()=>{};const toFiniteNumber=(value,defaultValue)=>{value=+value;return Number.isFinite(value)?value:defaultValue;};const ALPHA='abcdefghijklmnopqrstuvwxyz';const DIGIT='0123456789';const ALPHABET={DIGIT,ALPHA,ALPHA_DIGIT:ALPHA+ALPHA.toUpperCase()+DIGIT};const generateString=(size=16,alphabet=ALPHABET.ALPHA_DIGIT)=>{let str='';const{length}=alphabet;while(size--){str+=alphabet[Math.random()*length|0];}return str;};/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */function isSpecCompliantForm(thing){return !!(thing&&isFunction$2(thing.append)&&thing[Symbol.toStringTag]==='FormData'&&thing[Symbol.iterator]);}const toJSONObject=obj=>{const stack=new Array(10);const visit=(source,i)=>{if(isObject$2(source)){if(stack.indexOf(source)>=0){return;}if(!('toJSON'in source)){stack[i]=source;const target=isArray$3(source)?[]:{};forEach(source,(value,key)=>{const reducedValue=visit(value,i+1);!isUndefined$1(reducedValue)&&(target[key]=reducedValue);});stack[i]=undefined;return target;}}return source;};return visit(obj,0);};const isAsyncFn=kindOfTest('AsyncFunction');const isThenable=thing=>thing&&(isObject$2(thing)||isFunction$2(thing))&&isFunction$2(thing.then)&&isFunction$2(thing.catch);var utils$1 = {isArray: isArray$3,isArrayBuffer,isBuffer: isBuffer$1,isFormData,isArrayBufferView,isString: isString$3,isNumber: isNumber$1,isBoolean: isBoolean$1,isObject: isObject$2,isPlainObject,isUndefined: isUndefined$1,isDate: isDate$1,isFile,isBlob,isRegExp: isRegExp$1,isFunction: isFunction$2,isStream,isURLSearchParams,isTypedArray,isFileList,forEach,merge,extend,trim,stripBOM,inherits: inherits$2,toFlatObject,kindOf,kindOfTest,endsWith,toArray,forEachEntry,matchAll,isHTMLForm,hasOwnProperty: hasOwnProperty$1,hasOwnProp:hasOwnProperty$1,// an alias to avoid ESLint no-prototype-builtins detection
reduceDescriptors,freezeMethods,toObjectSet,toCamelCase,noop: noop$1,toFiniteNumber,findKey,global:_global,isContextDefined,ALPHABET,generateString,isSpecCompliantForm,toJSONObject,isAsyncFn,isThenable};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString$1 = {}.toString;

var isArray$2 = Array.isArray || function (arr) {
  return toString$1.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */


var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
kMaxLength();

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) ;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray$2(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray$2(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */function AxiosError(message,code,config,request,response){Error.call(this);if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor);}else {this.stack=new Error().stack;}this.message=message;this.name='AxiosError';code&&(this.code=code);config&&(this.config=config);request&&(this.request=request);response&&(this.response=response);}utils$1.inherits(AxiosError,Error,{toJSON:function toJSON(){return {// Standard
message:this.message,name:this.name,// Microsoft
description:this.description,number:this.number,// Mozilla
fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,// Axios
config:utils$1.toJSONObject(this.config),code:this.code,status:this.response&&this.response.status?this.response.status:null};}});const prototype$1=AxiosError.prototype;const descriptors={};['ERR_BAD_OPTION_VALUE','ERR_BAD_OPTION','ECONNABORTED','ETIMEDOUT','ERR_NETWORK','ERR_FR_TOO_MANY_REDIRECTS','ERR_DEPRECATED','ERR_BAD_RESPONSE','ERR_BAD_REQUEST','ERR_CANCELED','ERR_NOT_SUPPORT','ERR_INVALID_URL'// eslint-disable-next-line func-names
].forEach(code=>{descriptors[code]={value:code};});Object.defineProperties(AxiosError,descriptors);Object.defineProperty(prototype$1,'isAxiosError',{value:true});// eslint-disable-next-line func-names
AxiosError.from=(error,code,config,request,response,customProps)=>{const axiosError=Object.create(prototype$1);utils$1.toFlatObject(error,axiosError,function filter(obj){return obj!==Error.prototype;},prop=>{return prop!=='isAxiosError';});AxiosError.call(axiosError,error.message,code,config,request,response);axiosError.cause=error;axiosError.name=error.name;customProps&&_extends(axiosError,customProps);return axiosError;};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */function isVisitable(thing){return utils$1.isPlainObject(thing)||utils$1.isArray(thing);}/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */function removeBrackets(key){return utils$1.endsWith(key,'[]')?key.slice(0,-2):key;}/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */function renderKey(path,key,dots){if(!path)return key;return path.concat(key).map(function each(token,i){// eslint-disable-next-line no-param-reassign
token=removeBrackets(token);return !dots&&i?'['+token+']':token;}).join(dots?'.':'');}/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */function isFlatArray(arr){return utils$1.isArray(arr)&&!arr.some(isVisitable);}const predicates=utils$1.toFlatObject(utils$1,{},null,function filter(prop){return /^is[A-Z]/.test(prop);});/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/ /**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */function toFormData(obj,formData,options){if(!utils$1.isObject(obj)){throw new TypeError('target must be an object');}// eslint-disable-next-line no-param-reassign
formData=formData||new(FormData)();// eslint-disable-next-line no-param-reassign
options=utils$1.toFlatObject(options,{metaTokens:true,dots:false,indexes:false},false,function defined(option,source){// eslint-disable-next-line no-eq-null,eqeqeq
return !utils$1.isUndefined(source[option]);});const metaTokens=options.metaTokens;// eslint-disable-next-line no-use-before-define
const visitor=options.visitor||defaultVisitor;const dots=options.dots;const indexes=options.indexes;const _Blob=options.Blob||typeof Blob!=='undefined'&&Blob;const useBlob=_Blob&&utils$1.isSpecCompliantForm(formData);if(!utils$1.isFunction(visitor)){throw new TypeError('visitor must be a function');}function convertValue(value){if(value===null)return '';if(utils$1.isDate(value)){return value.toISOString();}if(!useBlob&&utils$1.isBlob(value)){throw new AxiosError('Blob is not supported. Use a Buffer instead.');}if(utils$1.isArrayBuffer(value)||utils$1.isTypedArray(value)){return useBlob&&typeof Blob==='function'?new Blob([value]):Buffer.from(value);}return value;}/**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */function defaultVisitor(value,key,path){let arr=value;if(value&&!path&&typeof value==='object'){if(utils$1.endsWith(key,'{}')){// eslint-disable-next-line no-param-reassign
key=metaTokens?key:key.slice(0,-2);// eslint-disable-next-line no-param-reassign
value=JSON.stringify(value);}else if(utils$1.isArray(value)&&isFlatArray(value)||(utils$1.isFileList(value)||utils$1.endsWith(key,'[]'))&&(arr=utils$1.toArray(value))){// eslint-disable-next-line no-param-reassign
key=removeBrackets(key);arr.forEach(function each(el,index){!(utils$1.isUndefined(el)||el===null)&&formData.append(// eslint-disable-next-line no-nested-ternary
indexes===true?renderKey([key],index,dots):indexes===null?key:key+'[]',convertValue(el));});return false;}}if(isVisitable(value)){return true;}formData.append(renderKey(path,key,dots),convertValue(value));return false;}const stack=[];const exposedHelpers=_extends(predicates,{defaultVisitor,convertValue,isVisitable});function build(value,path){if(utils$1.isUndefined(value))return;if(stack.indexOf(value)!==-1){throw Error('Circular reference detected in '+path.join('.'));}stack.push(value);utils$1.forEach(value,function each(el,key){const result=!(utils$1.isUndefined(el)||el===null)&&visitor.call(formData,el,utils$1.isString(key)?key.trim():key,path,exposedHelpers);if(result===true){build(el,path?path.concat(key):[key]);}});stack.pop();}if(!utils$1.isObject(obj)){throw new TypeError('data must be an object');}build(obj);return formData;}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */function encode$1(str){const charMap={'!':'%21',"'":'%27','(':'%28',')':'%29','~':'%7E','%20':'+','%00':'\x00'};return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g,function replacer(match){return charMap[match];});}/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */function AxiosURLSearchParams(params,options){this._pairs=[];params&&toFormData(params,this,options);}const prototype=AxiosURLSearchParams.prototype;prototype.append=function append(name,value){this._pairs.push([name,value]);};prototype.toString=function toString(encoder){const _encode=encoder?function(value){return encoder.call(this,value,encode$1);}:encode$1;return this._pairs.map(function each(pair){return _encode(pair[0])+'='+_encode(pair[1]);},'').join('&');};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */function encode(val){return encodeURIComponent(val).replace(/%3A/gi,':').replace(/%24/g,'$').replace(/%2C/gi,',').replace(/%20/g,'+').replace(/%5B/gi,'[').replace(/%5D/gi,']');}/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */function buildURL(url,params,options){/*eslint no-param-reassign:0*/if(!params){return url;}const _encode=options&&options.encode||encode;const serializeFn=options&&options.serialize;let serializedParams;if(serializeFn){serializedParams=serializeFn(params,options);}else {serializedParams=utils$1.isURLSearchParams(params)?params.toString():new AxiosURLSearchParams(params,options).toString(_encode);}if(serializedParams){const hashmarkIndex=url.indexOf("#");if(hashmarkIndex!==-1){url=url.slice(0,hashmarkIndex);}url+=(url.indexOf('?')===-1?'?':'&')+serializedParams;}return url;}

class InterceptorManager{constructor(){this.handlers=[];}/**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */use(fulfilled,rejected,options){this.handlers.push({fulfilled,rejected,synchronous:options?options.synchronous:false,runWhen:options?options.runWhen:null});return this.handlers.length-1;}/**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */eject(id){if(this.handlers[id]){this.handlers[id]=null;}}/**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */clear(){if(this.handlers){this.handlers=[];}}/**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */forEach(fn){utils$1.forEach(this.handlers,function forEachHandler(h){if(h!==null){fn(h);}});}}

var transitionalDefaults = {silentJSONParsing:true,forcedJSONParsing:true,clarifyTimeoutError:false};

var URLSearchParams$1 = typeof URLSearchParams!=='undefined'?URLSearchParams:AxiosURLSearchParams;

var FormData$1 = typeof FormData!=='undefined'?FormData:null;

var Blob$1 = typeof Blob!=='undefined'?Blob:null;

var platform$1 = {isBrowser:true,classes:{URLSearchParams: URLSearchParams$1,FormData: FormData$1,Blob: Blob$1},protocols:['http','https','file','blob','url','data']};

const hasBrowserEnv=typeof window!=='undefined'&&typeof document!=='undefined';/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */const hasStandardBrowserEnv=(product=>{return hasBrowserEnv&&['ReactNative','NativeScript','NS'].indexOf(product)<0;})(typeof navigator!=='undefined'&&navigator.product);/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */const hasStandardBrowserWebWorkerEnv=(()=>{return typeof WorkerGlobalScope!=='undefined'&&// eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope&&typeof self.importScripts==='function';})();

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv
});

var platform = {...utils,...platform$1};

function toURLEncodedForm(data,options){return toFormData(data,new platform.classes.URLSearchParams(),_extends({visitor:function(value,key,path,helpers){if(platform.isNode&&utils$1.isBuffer(value)){this.append(key,value.toString('base64'));return false;}return helpers.defaultVisitor.apply(this,arguments);}},options));}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */function parsePropPath(name){// foo[x][y][z]
// foo.x.y.z
// foo-x-y-z
// foo x y z
return utils$1.matchAll(/\w+|\[(\w*)]/g,name).map(match=>{return match[0]==='[]'?'':match[1]||match[0];});}/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */function arrayToObject(arr){const obj={};const keys=Object.keys(arr);let i;const len=keys.length;let key;for(i=0;i<len;i++){key=keys[i];obj[key]=arr[key];}return obj;}/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */function formDataToJSON(formData){function buildPath(path,value,target,index){let name=path[index++];if(name==='__proto__')return true;const isNumericKey=Number.isFinite(+name);const isLast=index>=path.length;name=!name&&utils$1.isArray(target)?target.length:name;if(isLast){if(utils$1.hasOwnProp(target,name)){target[name]=[target[name],value];}else {target[name]=value;}return !isNumericKey;}if(!target[name]||!utils$1.isObject(target[name])){target[name]=[];}const result=buildPath(path,value,target[name],index);if(result&&utils$1.isArray(target[name])){target[name]=arrayToObject(target[name]);}return !isNumericKey;}if(utils$1.isFormData(formData)&&utils$1.isFunction(formData.entries)){const obj={};utils$1.forEachEntry(formData,(name,value)=>{buildPath(parsePropPath(name),value,obj,0);});return obj;}return null;}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */function stringifySafely(rawValue,parser,encoder){if(utils$1.isString(rawValue)){try{(parser||JSON.parse)(rawValue);return utils$1.trim(rawValue);}catch(e){if(e.name!=='SyntaxError'){throw e;}}}return (encoder||JSON.stringify)(rawValue);}const defaults={transitional:transitionalDefaults,adapter:['xhr','http'],transformRequest:[function transformRequest(data,headers){const contentType=headers.getContentType()||'';const hasJSONContentType=contentType.indexOf('application/json')>-1;const isObjectPayload=utils$1.isObject(data);if(isObjectPayload&&utils$1.isHTMLForm(data)){data=new FormData(data);}const isFormData=utils$1.isFormData(data);if(isFormData){return hasJSONContentType?JSON.stringify(formDataToJSON(data)):data;}if(utils$1.isArrayBuffer(data)||utils$1.isBuffer(data)||utils$1.isStream(data)||utils$1.isFile(data)||utils$1.isBlob(data)){return data;}if(utils$1.isArrayBufferView(data)){return data.buffer;}if(utils$1.isURLSearchParams(data)){headers.setContentType('application/x-www-form-urlencoded;charset=utf-8',false);return data.toString();}let isFileList;if(isObjectPayload){if(contentType.indexOf('application/x-www-form-urlencoded')>-1){return toURLEncodedForm(data,this.formSerializer).toString();}if((isFileList=utils$1.isFileList(data))||contentType.indexOf('multipart/form-data')>-1){const _FormData=this.env&&this.env.FormData;return toFormData(isFileList?{'files[]':data}:data,_FormData&&new _FormData(),this.formSerializer);}}if(isObjectPayload||hasJSONContentType){headers.setContentType('application/json',false);return stringifySafely(data);}return data;}],transformResponse:[function transformResponse(data){const transitional=this.transitional||defaults.transitional;const forcedJSONParsing=transitional&&transitional.forcedJSONParsing;const JSONRequested=this.responseType==='json';if(data&&utils$1.isString(data)&&(forcedJSONParsing&&!this.responseType||JSONRequested)){const silentJSONParsing=transitional&&transitional.silentJSONParsing;const strictJSONParsing=!silentJSONParsing&&JSONRequested;try{return JSON.parse(data);}catch(e){if(strictJSONParsing){if(e.name==='SyntaxError'){throw AxiosError.from(e,AxiosError.ERR_BAD_RESPONSE,this,null,this.response);}throw e;}}}return data;}],/**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */timeout:0,xsrfCookieName:'XSRF-TOKEN',xsrfHeaderName:'X-XSRF-TOKEN',maxContentLength:-1,maxBodyLength:-1,env:{FormData:platform.classes.FormData,Blob:platform.classes.Blob},validateStatus:function validateStatus(status){return status>=200&&status<300;},headers:{common:{'Accept':'application/json, text/plain, */*','Content-Type':undefined}}};utils$1.forEach(['delete','get','head','post','put','patch'],method=>{defaults.headers[method]={};});var defaults$1 = defaults;

// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf=utils$1.toObjectSet(['age','authorization','content-length','content-type','etag','expires','from','host','if-modified-since','if-unmodified-since','last-modified','location','max-forwards','proxy-authorization','referer','retry-after','user-agent']);/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */var parseHeaders = (rawHeaders=>{const parsed={};let key;let val;let i;rawHeaders&&rawHeaders.split('\n').forEach(function parser(line){i=line.indexOf(':');key=line.substring(0,i).trim().toLowerCase();val=line.substring(i+1).trim();if(!key||parsed[key]&&ignoreDuplicateOf[key]){return;}if(key==='set-cookie'){if(parsed[key]){parsed[key].push(val);}else {parsed[key]=[val];}}else {parsed[key]=parsed[key]?parsed[key]+', '+val:val;}});return parsed;});

const $internals=Symbol('internals');function normalizeHeader(header){return header&&String(header).trim().toLowerCase();}function normalizeValue(value){if(value===false||value==null){return value;}return utils$1.isArray(value)?value.map(normalizeValue):String(value);}function parseTokens(str){const tokens=Object.create(null);const tokensRE=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let match;while(match=tokensRE.exec(str)){tokens[match[1]]=match[2];}return tokens;}const isValidHeaderName=str=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());function matchHeaderValue(context,value,header,filter,isHeaderNameFilter){if(utils$1.isFunction(filter)){return filter.call(this,value,header);}if(isHeaderNameFilter){value=header;}if(!utils$1.isString(value))return;if(utils$1.isString(filter)){return value.indexOf(filter)!==-1;}if(utils$1.isRegExp(filter)){return filter.test(value);}}function formatHeader(header){return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(w,char,str)=>{return char.toUpperCase()+str;});}function buildAccessors(obj,header){const accessorName=utils$1.toCamelCase(' '+header);['get','set','has'].forEach(methodName=>{Object.defineProperty(obj,methodName+accessorName,{value:function(arg1,arg2,arg3){return this[methodName].call(this,header,arg1,arg2,arg3);},configurable:true});});}class AxiosHeaders{constructor(headers){headers&&this.set(headers);}set(header,valueOrRewrite,rewrite){const self=this;function setHeader(_value,_header,_rewrite){const lHeader=normalizeHeader(_header);if(!lHeader){throw new Error('header name must be a non-empty string');}const key=utils$1.findKey(self,lHeader);if(!key||self[key]===undefined||_rewrite===true||_rewrite===undefined&&self[key]!==false){self[key||_header]=normalizeValue(_value);}}const setHeaders=(headers,_rewrite)=>utils$1.forEach(headers,(_value,_header)=>setHeader(_value,_header,_rewrite));if(utils$1.isPlainObject(header)||header instanceof this.constructor){setHeaders(header,valueOrRewrite);}else if(utils$1.isString(header)&&(header=header.trim())&&!isValidHeaderName(header)){setHeaders(parseHeaders(header),valueOrRewrite);}else {header!=null&&setHeader(valueOrRewrite,header,rewrite);}return this;}get(header,parser){header=normalizeHeader(header);if(header){const key=utils$1.findKey(this,header);if(key){const value=this[key];if(!parser){return value;}if(parser===true){return parseTokens(value);}if(utils$1.isFunction(parser)){return parser.call(this,value,key);}if(utils$1.isRegExp(parser)){return parser.exec(value);}throw new TypeError('parser must be boolean|regexp|function');}}}has(header,matcher){header=normalizeHeader(header);if(header){const key=utils$1.findKey(this,header);return !!(key&&this[key]!==undefined&&(!matcher||matchHeaderValue(this,this[key],key,matcher)));}return false;}delete(header,matcher){const self=this;let deleted=false;function deleteHeader(_header){_header=normalizeHeader(_header);if(_header){const key=utils$1.findKey(self,_header);if(key&&(!matcher||matchHeaderValue(self,self[key],key,matcher))){delete self[key];deleted=true;}}}if(utils$1.isArray(header)){header.forEach(deleteHeader);}else {deleteHeader(header);}return deleted;}clear(matcher){const keys=Object.keys(this);let i=keys.length;let deleted=false;while(i--){const key=keys[i];if(!matcher||matchHeaderValue(this,this[key],key,matcher,true)){delete this[key];deleted=true;}}return deleted;}normalize(format){const self=this;const headers={};utils$1.forEach(this,(value,header)=>{const key=utils$1.findKey(headers,header);if(key){self[key]=normalizeValue(value);delete self[header];return;}const normalized=format?formatHeader(header):String(header).trim();if(normalized!==header){delete self[header];}self[normalized]=normalizeValue(value);headers[normalized]=true;});return this;}concat(...targets){return this.constructor.concat(this,...targets);}toJSON(asStrings){const obj=Object.create(null);utils$1.forEach(this,(value,header)=>{value!=null&&value!==false&&(obj[header]=asStrings&&utils$1.isArray(value)?value.join(', '):value);});return obj;}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]();}toString(){return Object.entries(this.toJSON()).map(([header,value])=>header+': '+value).join('\n');}get[Symbol.toStringTag](){return 'AxiosHeaders';}static from(thing){return thing instanceof this?thing:new this(thing);}static concat(first,...targets){const computed=new this(first);targets.forEach(target=>computed.set(target));return computed;}static accessor(header){const internals=this[$internals]=this[$internals]={accessors:{}};const accessors=internals.accessors;const prototype=this.prototype;function defineAccessor(_header){const lHeader=normalizeHeader(_header);if(!accessors[lHeader]){buildAccessors(prototype,_header);accessors[lHeader]=true;}}utils$1.isArray(header)?header.forEach(defineAccessor):defineAccessor(header);return this;}}AxiosHeaders.accessor(['Content-Type','Content-Length','Accept','Accept-Encoding','User-Agent','Authorization']);// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders.prototype,({value},key)=>{let mapped=key[0].toUpperCase()+key.slice(1);// map `set` => `Set`
return {get:()=>value,set(headerValue){this[mapped]=headerValue;}};});utils$1.freezeMethods(AxiosHeaders);var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */function transformData(fns,response){const config=this||defaults$1;const context=response||config;const headers=AxiosHeaders$1.from(context.headers);let data=context.data;utils$1.forEach(fns,function transform(fn){data=fn.call(config,data,headers.normalize(),response?response.status:undefined);});headers.normalize();return data;}

function isCancel(value){return !!(value&&value.__CANCEL__);}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */function CanceledError(message,config,request){// eslint-disable-next-line no-eq-null,eqeqeq
AxiosError.call(this,message==null?'canceled':message,AxiosError.ERR_CANCELED,config,request);this.name='CanceledError';}utils$1.inherits(CanceledError,AxiosError,{__CANCEL__:true});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */function settle(resolve,reject,response){const validateStatus=response.config.validateStatus;if(!response.status||!validateStatus||validateStatus(response.status)){resolve(response);}else {reject(new AxiosError('Request failed with status code '+response.status,[AxiosError.ERR_BAD_REQUEST,AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status/100)-4],response.config,response.request,response));}}

var cookies = platform.hasStandardBrowserEnv?// Standard browser envs support document.cookie
{write(name,value,expires,path,domain,secure){const cookie=[name+'='+encodeURIComponent(value)];utils$1.isNumber(expires)&&cookie.push('expires='+new Date(expires).toGMTString());utils$1.isString(path)&&cookie.push('path='+path);utils$1.isString(domain)&&cookie.push('domain='+domain);secure===true&&cookie.push('secure');document.cookie=cookie.join('; ');},read(name){const match=document.cookie.match(new RegExp('(^|;\\s*)('+name+')=([^;]*)'));return match?decodeURIComponent(match[3]):null;},remove(name){this.write(name,'',Date.now()-86400000);}}:// Non-standard browser env (web workers, react-native) lack needed support.
{write(){},read(){return null;},remove(){}};

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */function isAbsoluteURL(url){// A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
// RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
// by any combination of letters, digits, plus, period, or hyphen.
return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */function combineURLs(baseURL,relativeURL){return relativeURL?baseURL.replace(/\/?\/$/,'')+'/'+relativeURL.replace(/^\/+/,''):baseURL;}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */function buildFullPath(baseURL,requestedURL){if(baseURL&&!isAbsoluteURL(requestedURL)){return combineURLs(baseURL,requestedURL);}return requestedURL;}

var isURLSameOrigin = platform.hasStandardBrowserEnv?// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv(){const msie=/(msie|trident)/i.test(navigator.userAgent);const urlParsingNode=document.createElement('a');let originURL;/**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */function resolveURL(url){let href=url;if(msie){// IE needs attribute set twice to normalize properties
urlParsingNode.setAttribute('href',href);href=urlParsingNode.href;}urlParsingNode.setAttribute('href',href);// urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
return {href:urlParsingNode.href,protocol:urlParsingNode.protocol?urlParsingNode.protocol.replace(/:$/,''):'',host:urlParsingNode.host,search:urlParsingNode.search?urlParsingNode.search.replace(/^\?/,''):'',hash:urlParsingNode.hash?urlParsingNode.hash.replace(/^#/,''):'',hostname:urlParsingNode.hostname,port:urlParsingNode.port,pathname:urlParsingNode.pathname.charAt(0)==='/'?urlParsingNode.pathname:'/'+urlParsingNode.pathname};}originURL=resolveURL(window.location.href);/**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */return function isURLSameOrigin(requestURL){const parsed=utils$1.isString(requestURL)?resolveURL(requestURL):requestURL;return parsed.protocol===originURL.protocol&&parsed.host===originURL.host;};}():// Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv(){return function isURLSameOrigin(){return true;};}();

function parseProtocol(url){const match=/^([-+\w]{1,25})(:?\/\/|:)/.exec(url);return match&&match[1]||'';}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */function speedometer(samplesCount,min){samplesCount=samplesCount||10;const bytes=new Array(samplesCount);const timestamps=new Array(samplesCount);let head=0;let tail=0;let firstSampleTS;min=min!==undefined?min:1000;return function push(chunkLength){const now=Date.now();const startedAt=timestamps[tail];if(!firstSampleTS){firstSampleTS=now;}bytes[head]=chunkLength;timestamps[head]=now;let i=tail;let bytesCount=0;while(i!==head){bytesCount+=bytes[i++];i=i%samplesCount;}head=(head+1)%samplesCount;if(head===tail){tail=(tail+1)%samplesCount;}if(now-firstSampleTS<min){return;}const passed=startedAt&&now-startedAt;return passed?Math.round(bytesCount*1000/passed):undefined;};}

function progressEventReducer(listener,isDownloadStream){let bytesNotified=0;const _speedometer=speedometer(50,250);return e=>{const loaded=e.loaded;const total=e.lengthComputable?e.total:undefined;const progressBytes=loaded-bytesNotified;const rate=_speedometer(progressBytes);const inRange=loaded<=total;bytesNotified=loaded;const data={loaded,total,progress:total?loaded/total:undefined,bytes:progressBytes,rate:rate?rate:undefined,estimated:rate&&total&&inRange?(total-loaded)/rate:undefined,event:e};data[isDownloadStream?'download':'upload']=true;listener(data);};}const isXHRAdapterSupported=typeof XMLHttpRequest!=='undefined';var xhrAdapter = isXHRAdapterSupported&&function(config){return new Promise(function dispatchXhrRequest(resolve,reject){let requestData=config.data;const requestHeaders=AxiosHeaders$1.from(config.headers).normalize();let{responseType,withXSRFToken}=config;let onCanceled;function done(){if(config.cancelToken){config.cancelToken.unsubscribe(onCanceled);}if(config.signal){config.signal.removeEventListener('abort',onCanceled);}}let contentType;if(utils$1.isFormData(requestData)){if(platform.hasStandardBrowserEnv||platform.hasStandardBrowserWebWorkerEnv){requestHeaders.setContentType(false);// Let the browser set it
}else if((contentType=requestHeaders.getContentType())!==false){// fix semicolon duplication issue for ReactNative FormData implementation
const[type,...tokens]=contentType?contentType.split(';').map(token=>token.trim()).filter(Boolean):[];requestHeaders.setContentType([type||'multipart/form-data',...tokens].join('; '));}}let request=new XMLHttpRequest();// HTTP basic authentication
if(config.auth){const username=config.auth.username||'';const password=config.auth.password?unescape(encodeURIComponent(config.auth.password)):'';requestHeaders.set('Authorization','Basic '+btoa(username+':'+password));}const fullPath=buildFullPath(config.baseURL,config.url);request.open(config.method.toUpperCase(),buildURL(fullPath,config.params,config.paramsSerializer),true);// Set the request timeout in MS
request.timeout=config.timeout;function onloadend(){if(!request){return;}// Prepare the response
const responseHeaders=AxiosHeaders$1.from('getAllResponseHeaders'in request&&request.getAllResponseHeaders());const responseData=!responseType||responseType==='text'||responseType==='json'?request.responseText:request.response;const response={data:responseData,status:request.status,statusText:request.statusText,headers:responseHeaders,config,request};settle(function _resolve(value){resolve(value);done();},function _reject(err){reject(err);done();},response);// Clean up request
request=null;}if('onloadend'in request){// Use onloadend if available
request.onloadend=onloadend;}else {// Listen for ready state to emulate onloadend
request.onreadystatechange=function handleLoad(){if(!request||request.readyState!==4){return;}// The request errored out and we didn't get a response, this will be
// handled by onerror instead
// With one exception: request that using file: protocol, most browsers
// will return status as 0 even though it's a successful request
if(request.status===0&&!(request.responseURL&&request.responseURL.indexOf('file:')===0)){return;}// readystate handler is calling before onerror or ontimeout handlers,
// so we should call onloadend on the next 'tick'
setTimeout(onloadend);};}// Handle browser request cancellation (as opposed to a manual cancellation)
request.onabort=function handleAbort(){if(!request){return;}reject(new AxiosError('Request aborted',AxiosError.ECONNABORTED,config,request));// Clean up request
request=null;};// Handle low level network errors
request.onerror=function handleError(){// Real errors are hidden from us by the browser
// onerror should only fire if it's a network error
reject(new AxiosError('Network Error',AxiosError.ERR_NETWORK,config,request));// Clean up request
request=null;};// Handle timeout
request.ontimeout=function handleTimeout(){let timeoutErrorMessage=config.timeout?'timeout of '+config.timeout+'ms exceeded':'timeout exceeded';const transitional=config.transitional||transitionalDefaults;if(config.timeoutErrorMessage){timeoutErrorMessage=config.timeoutErrorMessage;}reject(new AxiosError(timeoutErrorMessage,transitional.clarifyTimeoutError?AxiosError.ETIMEDOUT:AxiosError.ECONNABORTED,config,request));// Clean up request
request=null;};// Add xsrf header
// This is only done if running in a standard browser environment.
// Specifically not if we're in a web worker, or react-native.
if(platform.hasStandardBrowserEnv){withXSRFToken&&utils$1.isFunction(withXSRFToken)&&(withXSRFToken=withXSRFToken(config));if(withXSRFToken||withXSRFToken!==false&&isURLSameOrigin(fullPath)){// Add xsrf header
const xsrfValue=config.xsrfHeaderName&&config.xsrfCookieName&&cookies.read(config.xsrfCookieName);if(xsrfValue){requestHeaders.set(config.xsrfHeaderName,xsrfValue);}}}// Remove Content-Type if data is undefined
requestData===undefined&&requestHeaders.setContentType(null);// Add headers to the request
if('setRequestHeader'in request){utils$1.forEach(requestHeaders.toJSON(),function setRequestHeader(val,key){request.setRequestHeader(key,val);});}// Add withCredentials to request if needed
if(!utils$1.isUndefined(config.withCredentials)){request.withCredentials=!!config.withCredentials;}// Add responseType to request if needed
if(responseType&&responseType!=='json'){request.responseType=config.responseType;}// Handle progress if needed
if(typeof config.onDownloadProgress==='function'){request.addEventListener('progress',progressEventReducer(config.onDownloadProgress,true));}// Not all browsers support upload events
if(typeof config.onUploadProgress==='function'&&request.upload){request.upload.addEventListener('progress',progressEventReducer(config.onUploadProgress));}if(config.cancelToken||config.signal){// Handle cancellation
// eslint-disable-next-line func-names
onCanceled=cancel=>{if(!request){return;}reject(!cancel||cancel.type?new CanceledError(null,config,request):cancel);request.abort();request=null;};config.cancelToken&&config.cancelToken.subscribe(onCanceled);if(config.signal){config.signal.aborted?onCanceled():config.signal.addEventListener('abort',onCanceled);}}const protocol=parseProtocol(fullPath);if(protocol&&platform.protocols.indexOf(protocol)===-1){reject(new AxiosError('Unsupported protocol '+protocol+':',AxiosError.ERR_BAD_REQUEST,config));return;}// Send the request
request.send(requestData||null);});};

const knownAdapters={http:httpAdapter,xhr:xhrAdapter};utils$1.forEach(knownAdapters,(fn,value)=>{if(fn){try{Object.defineProperty(fn,'name',{value});}catch(e){// eslint-disable-next-line no-empty
}Object.defineProperty(fn,'adapterName',{value});}});const renderReason=reason=>`- ${reason}`;const isResolvedHandle=adapter=>utils$1.isFunction(adapter)||adapter===null||adapter===false;var adapters = {getAdapter:adapters=>{adapters=utils$1.isArray(adapters)?adapters:[adapters];const{length}=adapters;let nameOrAdapter;let adapter;const rejectedReasons={};for(let i=0;i<length;i++){nameOrAdapter=adapters[i];let id;adapter=nameOrAdapter;if(!isResolvedHandle(nameOrAdapter)){adapter=knownAdapters[(id=String(nameOrAdapter)).toLowerCase()];if(adapter===undefined){throw new AxiosError(`Unknown adapter '${id}'`);}}if(adapter){break;}rejectedReasons[id||'#'+i]=adapter;}if(!adapter){const reasons=Object.entries(rejectedReasons).map(([id,state])=>`adapter ${id} `+(state===false?'is not supported by the environment':'is not available in the build'));let s=length?reasons.length>1?'since :\n'+reasons.map(renderReason).join('\n'):' '+renderReason(reasons[0]):'as no adapter specified';throw new AxiosError(`There is no suitable adapter to dispatch the request `+s,'ERR_NOT_SUPPORT');}return adapter;},adapters:knownAdapters};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */function throwIfCancellationRequested(config){if(config.cancelToken){config.cancelToken.throwIfRequested();}if(config.signal&&config.signal.aborted){throw new CanceledError(null,config);}}/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */function dispatchRequest(config){throwIfCancellationRequested(config);config.headers=AxiosHeaders$1.from(config.headers);// Transform request data
config.data=transformData.call(config,config.transformRequest);if(['post','put','patch'].indexOf(config.method)!==-1){config.headers.setContentType('application/x-www-form-urlencoded',false);}const adapter=adapters.getAdapter(config.adapter||defaults$1.adapter);return adapter(config).then(function onAdapterResolution(response){throwIfCancellationRequested(config);// Transform response data
response.data=transformData.call(config,config.transformResponse,response);response.headers=AxiosHeaders$1.from(response.headers);return response;},function onAdapterRejection(reason){if(!isCancel(reason)){throwIfCancellationRequested(config);// Transform response data
if(reason&&reason.response){reason.response.data=transformData.call(config,config.transformResponse,reason.response);reason.response.headers=AxiosHeaders$1.from(reason.response.headers);}}return Promise.reject(reason);});}

const headersToObject=thing=>thing instanceof AxiosHeaders$1?thing.toJSON():thing;/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */function mergeConfig(config1,config2){// eslint-disable-next-line no-param-reassign
config2=config2||{};const config={};function getMergedValue(target,source,caseless){if(utils$1.isPlainObject(target)&&utils$1.isPlainObject(source)){return utils$1.merge.call({caseless},target,source);}else if(utils$1.isPlainObject(source)){return utils$1.merge({},source);}else if(utils$1.isArray(source)){return source.slice();}return source;}// eslint-disable-next-line consistent-return
function mergeDeepProperties(a,b,caseless){if(!utils$1.isUndefined(b)){return getMergedValue(a,b,caseless);}else if(!utils$1.isUndefined(a)){return getMergedValue(undefined,a,caseless);}}// eslint-disable-next-line consistent-return
function valueFromConfig2(a,b){if(!utils$1.isUndefined(b)){return getMergedValue(undefined,b);}}// eslint-disable-next-line consistent-return
function defaultToConfig2(a,b){if(!utils$1.isUndefined(b)){return getMergedValue(undefined,b);}else if(!utils$1.isUndefined(a)){return getMergedValue(undefined,a);}}// eslint-disable-next-line consistent-return
function mergeDirectKeys(a,b,prop){if(prop in config2){return getMergedValue(a,b);}else if(prop in config1){return getMergedValue(undefined,a);}}const mergeMap={url:valueFromConfig2,method:valueFromConfig2,data:valueFromConfig2,baseURL:defaultToConfig2,transformRequest:defaultToConfig2,transformResponse:defaultToConfig2,paramsSerializer:defaultToConfig2,timeout:defaultToConfig2,timeoutMessage:defaultToConfig2,withCredentials:defaultToConfig2,withXSRFToken:defaultToConfig2,adapter:defaultToConfig2,responseType:defaultToConfig2,xsrfCookieName:defaultToConfig2,xsrfHeaderName:defaultToConfig2,onUploadProgress:defaultToConfig2,onDownloadProgress:defaultToConfig2,decompress:defaultToConfig2,maxContentLength:defaultToConfig2,maxBodyLength:defaultToConfig2,beforeRedirect:defaultToConfig2,transport:defaultToConfig2,httpAgent:defaultToConfig2,httpsAgent:defaultToConfig2,cancelToken:defaultToConfig2,socketPath:defaultToConfig2,responseEncoding:defaultToConfig2,validateStatus:mergeDirectKeys,headers:(a,b)=>mergeDeepProperties(headersToObject(a),headersToObject(b),true)};utils$1.forEach(Object.keys(_extends({},config1,config2)),function computeConfigValue(prop){const merge=mergeMap[prop]||mergeDeepProperties;const configValue=merge(config1[prop],config2[prop],prop);utils$1.isUndefined(configValue)&&merge!==mergeDirectKeys||(config[prop]=configValue);});return config;}

const VERSION="1.6.7";

const validators$1={};// eslint-disable-next-line func-names
['object','boolean','number','function','string','symbol'].forEach((type,i)=>{validators$1[type]=function validator(thing){return typeof thing===type||'a'+(i<1?'n ':' ')+type;};});const deprecatedWarnings={};/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */validators$1.transitional=function transitional(validator,version,message){function formatMessage(opt,desc){return '[Axios v'+VERSION+'] Transitional option \''+opt+'\''+desc+(message?'. '+message:'');}// eslint-disable-next-line func-names
return (value,opt,opts)=>{if(validator===false){throw new AxiosError(formatMessage(opt,' has been removed'+(version?' in '+version:'')),AxiosError.ERR_DEPRECATED);}if(version&&!deprecatedWarnings[opt]){deprecatedWarnings[opt]=true;// eslint-disable-next-line no-console
console.warn(formatMessage(opt,' has been deprecated since v'+version+' and will be removed in the near future'));}return validator?validator(value,opt,opts):true;};};/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */function assertOptions(options,schema,allowUnknown){if(typeof options!=='object'){throw new AxiosError('options must be an object',AxiosError.ERR_BAD_OPTION_VALUE);}const keys=Object.keys(options);let i=keys.length;while(i-->0){const opt=keys[i];const validator=schema[opt];if(validator){const value=options[opt];const result=value===undefined||validator(value,opt,options);if(result!==true){throw new AxiosError('option '+opt+' must be '+result,AxiosError.ERR_BAD_OPTION_VALUE);}continue;}if(allowUnknown!==true){throw new AxiosError('Unknown option '+opt,AxiosError.ERR_BAD_OPTION);}}}var validator = {assertOptions,validators: validators$1};

const validators=validator.validators;/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */class Axios{constructor(instanceConfig){this.defaults=instanceConfig;this.interceptors={request:new InterceptorManager(),response:new InterceptorManager()};}/**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */async request(configOrUrl,config){try{return await this._request(configOrUrl,config);}catch(err){if(err instanceof Error){let dummy;Error.captureStackTrace?Error.captureStackTrace(dummy={}):dummy=new Error();// slice off the Error: ... line
const stack=dummy.stack?dummy.stack.replace(/^.+\n/,''):'';if(!err.stack){err.stack=stack;// match without the 2 top stack lines
}else if(stack&&!String(err.stack).endsWith(stack.replace(/^.+\n.+\n/,''))){err.stack+='\n'+stack;}}throw err;}}_request(configOrUrl,config){/*eslint no-param-reassign:0*/ // Allow for axios('example/url'[, config]) a la fetch API
if(typeof configOrUrl==='string'){config=config||{};config.url=configOrUrl;}else {config=configOrUrl||{};}config=mergeConfig(this.defaults,config);const{transitional,paramsSerializer,headers}=config;if(transitional!==undefined){validator.assertOptions(transitional,{silentJSONParsing:validators.transitional(validators.boolean),forcedJSONParsing:validators.transitional(validators.boolean),clarifyTimeoutError:validators.transitional(validators.boolean)},false);}if(paramsSerializer!=null){if(utils$1.isFunction(paramsSerializer)){config.paramsSerializer={serialize:paramsSerializer};}else {validator.assertOptions(paramsSerializer,{encode:validators.function,serialize:validators.function},true);}}// Set config.method
config.method=(config.method||this.defaults.method||'get').toLowerCase();// Flatten headers
let contextHeaders=headers&&utils$1.merge(headers.common,headers[config.method]);headers&&utils$1.forEach(['delete','get','head','post','put','patch','common'],method=>{delete headers[method];});config.headers=AxiosHeaders$1.concat(contextHeaders,headers);// filter out skipped interceptors
const requestInterceptorChain=[];let synchronousRequestInterceptors=true;this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor){if(typeof interceptor.runWhen==='function'&&interceptor.runWhen(config)===false){return;}synchronousRequestInterceptors=synchronousRequestInterceptors&&interceptor.synchronous;requestInterceptorChain.unshift(interceptor.fulfilled,interceptor.rejected);});const responseInterceptorChain=[];this.interceptors.response.forEach(function pushResponseInterceptors(interceptor){responseInterceptorChain.push(interceptor.fulfilled,interceptor.rejected);});let promise;let i=0;let len;if(!synchronousRequestInterceptors){const chain=[dispatchRequest.bind(this),undefined];chain.unshift.apply(chain,requestInterceptorChain);chain.push.apply(chain,responseInterceptorChain);len=chain.length;promise=Promise.resolve(config);while(i<len){promise=promise.then(chain[i++],chain[i++]);}return promise;}len=requestInterceptorChain.length;let newConfig=config;i=0;while(i<len){const onFulfilled=requestInterceptorChain[i++];const onRejected=requestInterceptorChain[i++];try{newConfig=onFulfilled(newConfig);}catch(error){onRejected.call(this,error);break;}}try{promise=dispatchRequest.call(this,newConfig);}catch(error){return Promise.reject(error);}i=0;len=responseInterceptorChain.length;while(i<len){promise=promise.then(responseInterceptorChain[i++],responseInterceptorChain[i++]);}return promise;}getUri(config){config=mergeConfig(this.defaults,config);const fullPath=buildFullPath(config.baseURL,config.url);return buildURL(fullPath,config.params,config.paramsSerializer);}}// Provide aliases for supported request methods
utils$1.forEach(['delete','get','head','options'],function forEachMethodNoData(method){/*eslint func-names:0*/Axios.prototype[method]=function(url,config){return this.request(mergeConfig(config||{},{method,url,data:(config||{}).data}));};});utils$1.forEach(['post','put','patch'],function forEachMethodWithData(method){/*eslint func-names:0*/function generateHTTPMethod(isForm){return function httpMethod(url,data,config){return this.request(mergeConfig(config||{},{method,headers:isForm?{'Content-Type':'multipart/form-data'}:{},url,data}));};}Axios.prototype[method]=generateHTTPMethod();Axios.prototype[method+'Form']=generateHTTPMethod(true);});var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */class CancelToken{constructor(executor){if(typeof executor!=='function'){throw new TypeError('executor must be a function.');}let resolvePromise;this.promise=new Promise(function promiseExecutor(resolve){resolvePromise=resolve;});const token=this;// eslint-disable-next-line func-names
this.promise.then(cancel=>{if(!token._listeners)return;let i=token._listeners.length;while(i-->0){token._listeners[i](cancel);}token._listeners=null;});// eslint-disable-next-line func-names
this.promise.then=onfulfilled=>{let _resolve;// eslint-disable-next-line func-names
const promise=new Promise(resolve=>{token.subscribe(resolve);_resolve=resolve;}).then(onfulfilled);promise.cancel=function reject(){token.unsubscribe(_resolve);};return promise;};executor(function cancel(message,config,request){if(token.reason){// Cancellation has already been requested
return;}token.reason=new CanceledError(message,config,request);resolvePromise(token.reason);});}/**
   * Throws a `CanceledError` if cancellation has been requested.
   */throwIfRequested(){if(this.reason){throw this.reason;}}/**
   * Subscribe to the cancel signal
   */subscribe(listener){if(this.reason){listener(this.reason);return;}if(this._listeners){this._listeners.push(listener);}else {this._listeners=[listener];}}/**
   * Unsubscribe from the cancel signal
   */unsubscribe(listener){if(!this._listeners){return;}const index=this._listeners.indexOf(listener);if(index!==-1){this._listeners.splice(index,1);}}/**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */static source(){let cancel;const token=new CancelToken(function executor(c){cancel=c;});return {token,cancel};}}var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */function spread(callback){return function wrap(arr){return callback.apply(null,arr);};}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */function isAxiosError(payload){return utils$1.isObject(payload)&&payload.isAxiosError===true;}

const HttpStatusCode={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(HttpStatusCode).forEach(([key,value])=>{HttpStatusCode[value]=key;});var HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */function createInstance(defaultConfig){const context=new Axios$1(defaultConfig);const instance=bind(Axios$1.prototype.request,context);// Copy axios.prototype to instance
utils$1.extend(instance,Axios$1.prototype,context,{allOwnKeys:true});// Copy context to instance
utils$1.extend(instance,context,null,{allOwnKeys:true});// Factory for creating new instances
instance.create=function create(instanceConfig){return createInstance(mergeConfig(defaultConfig,instanceConfig));};return instance;}// Create the default instance to be exported
const axios=createInstance(defaults$1);// Expose Axios class to allow class inheritance
axios.Axios=Axios$1;// Expose Cancel & CancelToken
axios.CanceledError=CanceledError;axios.CancelToken=CancelToken$1;axios.isCancel=isCancel;axios.VERSION=VERSION;axios.toFormData=toFormData;// Expose AxiosError class
axios.AxiosError=AxiosError;// alias for CanceledError for backward compatibility
axios.Cancel=axios.CanceledError;// Expose all/spread
axios.all=function all(promises){return Promise.all(promises);};axios.spread=spread;// Expose isAxiosError
axios.isAxiosError=isAxiosError;// Expose mergeConfig
axios.mergeConfig=mergeConfig;axios.AxiosHeaders=AxiosHeaders$1;axios.formToJSON=thing=>formDataToJSON(utils$1.isHTMLForm(thing)?new FormData(thing):thing);axios.getAdapter=adapters.getAdapter;axios.HttpStatusCode=HttpStatusCode$1;axios.default=axios;// this module should only have a default export

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

const denyList=new Set(['ENOTFOUND','ENETUNREACH',// SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328
'UNABLE_TO_GET_ISSUER_CERT','UNABLE_TO_GET_CRL','UNABLE_TO_DECRYPT_CERT_SIGNATURE','UNABLE_TO_DECRYPT_CRL_SIGNATURE','UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY','CERT_SIGNATURE_FAILURE','CRL_SIGNATURE_FAILURE','CERT_NOT_YET_VALID','CERT_HAS_EXPIRED','CRL_NOT_YET_VALID','CRL_HAS_EXPIRED','ERROR_IN_CERT_NOT_BEFORE_FIELD','ERROR_IN_CERT_NOT_AFTER_FIELD','ERROR_IN_CRL_LAST_UPDATE_FIELD','ERROR_IN_CRL_NEXT_UPDATE_FIELD','OUT_OF_MEM','DEPTH_ZERO_SELF_SIGNED_CERT','SELF_SIGNED_CERT_IN_CHAIN','UNABLE_TO_GET_ISSUER_CERT_LOCALLY','UNABLE_TO_VERIFY_LEAF_SIGNATURE','CERT_CHAIN_TOO_LONG','CERT_REVOKED','INVALID_CA','PATH_LENGTH_EXCEEDED','INVALID_PURPOSE','CERT_UNTRUSTED','CERT_REJECTED','HOSTNAME_MISMATCH']);// TODO: Use `error?.code` when targeting Node.js 14
var isRetryAllowed=error=>!denyList.has(error&&error.code);var isRetryAllowed$1 = /*@__PURE__*/getDefaultExportFromCjs(isRetryAllowed);

function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg);var value=info.value;}catch(error){reject(error);return;}if(info.done){resolve(value);}else {Promise.resolve(value).then(_next,_throw);}}function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise(function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value);}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err);}_next(undefined);});};}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly){symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});}keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){_defineProperty(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else {ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key]=value;}return obj;}var namespace='axios-retry';/**
 * @param  {Error}  error
 * @return {boolean}
 */function isNetworkError(error){var CODE_EXCLUDE_LIST=['ERR_CANCELED','ECONNABORTED'];return !error.response&&Boolean(error.code)&&// Prevents retrying cancelled requests
!CODE_EXCLUDE_LIST.includes(error.code)&&// Prevents retrying timed out & cancelled requests
isRetryAllowed$1(error)// Prevents retrying unsafe errors
;}var SAFE_HTTP_METHODS=['get','head','options'];var IDEMPOTENT_HTTP_METHODS=SAFE_HTTP_METHODS.concat(['put','delete']);/**
 * @param  {Error}  error
 * @return {boolean}
 */function isRetryableError(error){return error.code!=='ECONNABORTED'&&(!error.response||error.response.status>=500&&error.response.status<=599);}/**
 * @param  {Error}  error
 * @return {boolean}
 */function isSafeRequestError(error){if(!error.config){// Cannot determine if the request can be retried
return false;}return isRetryableError(error)&&SAFE_HTTP_METHODS.indexOf(error.config.method)!==-1;}/**
 * @param  {Error}  error
 * @return {boolean}
 */function isIdempotentRequestError(error){if(!error.config){// Cannot determine if the request can be retried
return false;}return isRetryableError(error)&&IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method)!==-1;}/**
 * @param  {Error}  error
 * @return {boolean}
 */function isNetworkOrIdempotentRequestError(error){return isNetworkError(error)||isIdempotentRequestError(error);}/**
 * @return {number} - delay in milliseconds, always 0
 */function noDelay(){return 0;}/**
 * Set delayFactor 1000 for an exponential delay to occur on the order
 * of seconds
 * @param  {number} [retryNumber=0]
 * @param  {Error}  error - unused; for existing API of retryDelay callback
 * @param  {number} [delayFactor=100] milliseconds
 * @return {number} - delay in milliseconds
 */function exponentialDelay(){var retryNumber=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var delayFactor=arguments.length>2&&arguments[2]!==undefined?arguments[2]:100;var delay=Math.pow(2,retryNumber)*delayFactor;var randomSum=delay*0.2*Math.random();// 0-20% of the delay
return delay+randomSum;}/** @type {IAxiosRetryConfig} */var DEFAULT_OPTIONS={retries:3,retryCondition:isNetworkOrIdempotentRequestError,retryDelay:noDelay,shouldResetTimeout:false,onRetry:()=>{}};/**
 * Returns the axios-retry options for the current request
 * @param  {AxiosRequestConfig} config
 * @param  {IAxiosRetryConfig} defaultOptions
 * @return {IAxiosRetryConfigExtended}
 */function getRequestOptions(config,defaultOptions){return _objectSpread(_objectSpread(_objectSpread({},DEFAULT_OPTIONS),defaultOptions),config[namespace]);}/**
 * Initializes and returns the retry state for the given request/config
 * @param  {AxiosRequestConfig} config
 * @param  {IAxiosRetryConfig} defaultOptions
 * @return {IAxiosRetryConfigExtended}
 */function getCurrentState(config,defaultOptions){var currentState=getRequestOptions(config,defaultOptions);currentState.retryCount=currentState.retryCount||0;config[namespace]=currentState;return currentState;}/**
 * @param  {Axios} axios
 * @param  {AxiosRequestConfig} config
 */function fixConfig(axios,config){if(axios.defaults.agent===config.agent){delete config.agent;}if(axios.defaults.httpAgent===config.httpAgent){delete config.httpAgent;}if(axios.defaults.httpsAgent===config.httpsAgent){delete config.httpsAgent;}}/**
 * Checks retryCondition if request can be retried. Handles it's returning value or Promise.
 * @param  {IAxiosRetryConfigExtended} currentState
 * @param  {Error} error
 * @return {Promise<boolean>}
 */function shouldRetry(_x,_x2){return _shouldRetry.apply(this,arguments);}/**
 * Adds response interceptors to an axios instance to retry requests failed due to network issues
 *
 * @example
 *
 * import axios from 'axios';
 *
 * axiosRetry(axios, { retries: 3 });
 *
 * axios.get('http://example.com/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Exponential back-off retry delay between requests
 * axiosRetry(axios, { retryDelay : axiosRetry.exponentialDelay});
 *
 * // Custom retry delay
 * axiosRetry(axios, { retryDelay : (retryCount) => {
 *   return retryCount * 1000;
 * }});
 *
 * // Also works with custom axios instances
 * const client = axios.create({ baseURL: 'http://example.com' });
 * axiosRetry(client, { retries: 3 });
 *
 * client.get('/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Allows request-specific configuration
 * client
 *   .get('/test', {
 *     'axios-retry': {
 *       retries: 0
 *     }
 *   })
 *   .catch(error => { // The first request fails
 *     error !== undefined
 *   });
 *
 * @param {Axios} axios An axios instance (the axios object or one created from axios.create)
 * @param {Object} [defaultOptions]
 * @param {number} [defaultOptions.retries=3] Number of retries
 * @param {boolean} [defaultOptions.shouldResetTimeout=false]
 *        Defines if the timeout should be reset between retries
 * @param {Function} [defaultOptions.retryCondition=isNetworkOrIdempotentRequestError]
 *        A function to determine if the error can be retried
 * @param {Function} [defaultOptions.retryDelay=noDelay]
 *        A function to determine the delay between retry requests
 * @param {Function} [defaultOptions.onRetry=()=>{}]
 *        A function to get notified when a retry occurs
 * @return {{ requestInterceptorId: number, responseInterceptorId: number }}
 *        The ids of the interceptors added to the request and to the response (so they can be ejected at a later time)
 */function _shouldRetry(){_shouldRetry=_asyncToGenerator(function*(currentState,error){var{retries,retryCondition}=currentState;var shouldRetryOrPromise=currentState.retryCount<retries&&retryCondition(error);// This could be a promise
if(typeof shouldRetryOrPromise==='object'){try{var shouldRetryPromiseResult=yield shouldRetryOrPromise;// keep return true unless shouldRetryPromiseResult return false for compatibility
return shouldRetryPromiseResult!==false;}catch(_err){return false;}}return shouldRetryOrPromise;});return _shouldRetry.apply(this,arguments);}function axiosRetry(axios,defaultOptions){var requestInterceptorId=axios.interceptors.request.use(config=>{var currentState=getCurrentState(config,defaultOptions);currentState.lastRequestTime=Date.now();return config;});var responseInterceptorId=axios.interceptors.response.use(null,/*#__PURE__*/function(){var _ref=_asyncToGenerator(function*(error){var{config}=error;// If we have no information to retry the request
if(!config){return Promise.reject(error);}var currentState=getCurrentState(config,defaultOptions);if(yield shouldRetry(currentState,error)){currentState.retryCount+=1;var{retryDelay,shouldResetTimeout,onRetry}=currentState;var delay=retryDelay(currentState.retryCount,error);// Axios fails merging this configuration to the default configuration because it has an issue
// with circular structures: https://github.com/mzabriskie/axios/issues/370
fixConfig(axios,config);if(!shouldResetTimeout&&config.timeout&&currentState.lastRequestTime){var lastRequestDuration=Date.now()-currentState.lastRequestTime;var timeout=config.timeout-lastRequestDuration-delay;if(timeout<=0){return Promise.reject(error);}config.timeout=timeout;}config.transformRequest=[data=>data];yield onRetry(currentState.retryCount,error,config);return new Promise(resolve=>setTimeout(()=>resolve(axios(config)),delay));}return Promise.reject(error);});return function(_x3){return _ref.apply(this,arguments);};}());return {requestInterceptorId,responseInterceptorId};}// Compatibility with CommonJS
axiosRetry.isNetworkError=isNetworkError;axiosRetry.isSafeRequestError=isSafeRequestError;axiosRetry.isIdempotentRequestError=isIdempotentRequestError;axiosRetry.isNetworkOrIdempotentRequestError=isNetworkOrIdempotentRequestError;axiosRetry.exponentialDelay=exponentialDelay;axiosRetry.isRetryableError=isRetryableError;

var s=1000;var m=s*60;var h=m*60;var d=h*24;var w=d*7;var y=d*365.25;/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */var ms=function(val,options){options=options||{};var type=typeof val;if(type==='string'&&val.length>0){return parse(val);}else if(type==='number'&&isFinite(val)){return options.long?fmtLong(val):fmtShort(val);}throw new Error('val is not a non-empty string or a valid number. val='+JSON.stringify(val));};/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */function parse(str){str=String(str);if(str.length>100){return;}var match=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);if(!match){return;}var n=parseFloat(match[1]);var type=(match[2]||'ms').toLowerCase();switch(type){case'years':case'year':case'yrs':case'yr':case'y':return n*y;case'weeks':case'week':case'w':return n*w;case'days':case'day':case'd':return n*d;case'hours':case'hour':case'hrs':case'hr':case'h':return n*h;case'minutes':case'minute':case'mins':case'min':case'm':return n*m;case'seconds':case'second':case'secs':case'sec':case's':return n*s;case'milliseconds':case'millisecond':case'msecs':case'msec':case'ms':return n;default:return undefined;}}/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function fmtShort(ms){var msAbs=Math.abs(ms);if(msAbs>=d){return Math.round(ms/d)+'d';}if(msAbs>=h){return Math.round(ms/h)+'h';}if(msAbs>=m){return Math.round(ms/m)+'m';}if(msAbs>=s){return Math.round(ms/s)+'s';}return ms+'ms';}/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */function fmtLong(ms){var msAbs=Math.abs(ms);if(msAbs>=d){return plural(ms,msAbs,d,'day');}if(msAbs>=h){return plural(ms,msAbs,h,'hour');}if(msAbs>=m){return plural(ms,msAbs,m,'minute');}if(msAbs>=s){return plural(ms,msAbs,s,'second');}return ms+' ms';}/**
 * Pluralization helper.
 */function plural(ms,msAbs,n,name){var isPlural=msAbs>=n*1.5;return Math.round(ms/n)+' '+name+(isPlural?'s':'');}var ms$1 = /*@__PURE__*/getDefaultExportFromCjs(ms);

var IDX=256,HEX=[],BUFFER;while(IDX--)HEX[IDX]=(IDX+256).toString(16).substring(1);function v4(){var i=0,num,out='';if(!BUFFER||IDX+16>256){BUFFER=Array(i=256);while(i--)BUFFER[i]=256*Math.random()|0;i=IDX=0;}for(;i<16;i++){num=BUFFER[IDX+i];if(i==6)out+=HEX[num&15|64];else if(i==8)out+=HEX[num&63|128];else out+=HEX[num];if(i&1&&i>1&&i<11)out+='-';}IDX++;return out;}

/** `Object#toString` result references. */var stringTag='[object String]';/** Used for built-in method references. */var objectProto=Object.prototype;/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */var objectToString$1=objectProto.toString;/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */var isArray$1=Array.isArray;/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */function isObjectLike(value){return !!value&&typeof value=='object';}/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */function isString$1(value){return typeof value=='string'||!isArray$1(value)&&isObjectLike(value)&&objectToString$1.call(value)==stringTag;}var lodash_isstring=isString$1;var isString$2 = /*@__PURE__*/getDefaultExportFromCjs(lodash_isstring);

var lodash_clonedeep = {exports: {}};

lodash_clonedeep.exports;(function(module,exports){/** Used as the size to enable large array optimizations. */var LARGE_ARRAY_SIZE=200;/** Used to stand-in for `undefined` hash values. */var HASH_UNDEFINED='__lodash_hash_undefined__';/** Used as references for various `Number` constants. */var MAX_SAFE_INTEGER=9007199254740991;/** `Object#toString` result references. */var argsTag='[object Arguments]',arrayTag='[object Array]',boolTag='[object Boolean]',dateTag='[object Date]',errorTag='[object Error]',funcTag='[object Function]',genTag='[object GeneratorFunction]',mapTag='[object Map]',numberTag='[object Number]',objectTag='[object Object]',promiseTag='[object Promise]',regexpTag='[object RegExp]',setTag='[object Set]',stringTag='[object String]',symbolTag='[object Symbol]',weakMapTag='[object WeakMap]';var arrayBufferTag='[object ArrayBuffer]',dataViewTag='[object DataView]',float32Tag='[object Float32Array]',float64Tag='[object Float64Array]',int8Tag='[object Int8Array]',int16Tag='[object Int16Array]',int32Tag='[object Int32Array]',uint8Tag='[object Uint8Array]',uint8ClampedTag='[object Uint8ClampedArray]',uint16Tag='[object Uint16Array]',uint32Tag='[object Uint32Array]';/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */var reRegExpChar=/[\\^$.*+?()[\]{}|]/g;/** Used to match `RegExp` flags from their coerced string values. */var reFlags=/\w*$/;/** Used to detect host constructors (Safari). */var reIsHostCtor=/^\[object .+?Constructor\]$/;/** Used to detect unsigned integer values. */var reIsUint=/^(?:0|[1-9]\d*)$/;/** Used to identify `toStringTag` values supported by `_.clone`. */var cloneableTags={};cloneableTags[argsTag]=cloneableTags[arrayTag]=cloneableTags[arrayBufferTag]=cloneableTags[dataViewTag]=cloneableTags[boolTag]=cloneableTags[dateTag]=cloneableTags[float32Tag]=cloneableTags[float64Tag]=cloneableTags[int8Tag]=cloneableTags[int16Tag]=cloneableTags[int32Tag]=cloneableTags[mapTag]=cloneableTags[numberTag]=cloneableTags[objectTag]=cloneableTags[regexpTag]=cloneableTags[setTag]=cloneableTags[stringTag]=cloneableTags[symbolTag]=cloneableTags[uint8Tag]=cloneableTags[uint8ClampedTag]=cloneableTags[uint16Tag]=cloneableTags[uint32Tag]=true;cloneableTags[errorTag]=cloneableTags[funcTag]=cloneableTags[weakMapTag]=false;/** Detect free variable `global` from Node.js. */var freeGlobal=typeof commonjsGlobal=='object'&&commonjsGlobal&&commonjsGlobal.Object===Object&&commonjsGlobal;/** Detect free variable `self`. */var freeSelf=typeof self=='object'&&self&&self.Object===Object&&self;/** Used as a reference to the global object. */var root=freeGlobal||freeSelf||Function('return this')();/** Detect free variable `exports`. */var freeExports=exports&&!exports.nodeType&&exports;/** Detect free variable `module`. */var freeModule=freeExports&&'object'=='object'&&module&&!module.nodeType&&module;/** Detect the popular CommonJS extension `module.exports`. */var moduleExports=freeModule&&freeModule.exports===freeExports;/**
	 * Adds the key-value `pair` to `map`.
	 *
	 * @private
	 * @param {Object} map The map to modify.
	 * @param {Array} pair The key-value pair to add.
	 * @returns {Object} Returns `map`.
	 */function addMapEntry(map,pair){// Don't return `map.set` because it's not chainable in IE 11.
map.set(pair[0],pair[1]);return map;}/**
	 * Adds `value` to `set`.
	 *
	 * @private
	 * @param {Object} set The set to modify.
	 * @param {*} value The value to add.
	 * @returns {Object} Returns `set`.
	 */function addSetEntry(set,value){// Don't return `set.add` because it's not chainable in IE 11.
set.add(value);return set;}/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */function arrayEach(array,iteratee){var index=-1,length=array?array.length:0;while(++index<length){if(iteratee(array[index],index,array)===false){break;}}return array;}/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */function arrayPush(array,values){var index=-1,length=values.length,offset=array.length;while(++index<length){array[offset+index]=values[index];}return array;}/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */function arrayReduce(array,iteratee,accumulator,initAccum){var index=-1,length=array?array.length:0;if(initAccum&&length){accumulator=array[++index];}while(++index<length){accumulator=iteratee(accumulator,array[index],index,array);}return accumulator;}/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */function baseTimes(n,iteratee){var index=-1,result=Array(n);while(++index<n){result[index]=iteratee(index);}return result;}/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */function getValue(object,key){return object==null?undefined:object[key];}/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */function isHostObject(value){// Many host objects are `Object` objects that can coerce to strings
// despite having improperly defined `toString` methods.
var result=false;if(value!=null&&typeof value.toString!='function'){try{result=!!(value+'');}catch(e){}}return result;}/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */function mapToArray(map){var index=-1,result=Array(map.size);map.forEach(function(value,key){result[++index]=[key,value];});return result;}/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */function overArg(func,transform){return function(arg){return func(transform(arg));};}/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */function setToArray(set){var index=-1,result=Array(set.size);set.forEach(function(value){result[++index]=value;});return result;}/** Used for built-in method references. */var arrayProto=Array.prototype,funcProto=Function.prototype,objectProto=Object.prototype;/** Used to detect overreaching core-js shims. */var coreJsData=root['__core-js_shared__'];/** Used to detect methods masquerading as native. */var maskSrcKey=function(){var uid=/[^.]+$/.exec(coreJsData&&coreJsData.keys&&coreJsData.keys.IE_PROTO||'');return uid?'Symbol(src)_1.'+uid:'';}();/** Used to resolve the decompiled source of functions. */var funcToString=funcProto.toString;/** Used to check objects for own properties. */var hasOwnProperty=objectProto.hasOwnProperty;/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */var objectToString=objectProto.toString;/** Used to detect if a method is native. */var reIsNative=RegExp('^'+funcToString.call(hasOwnProperty).replace(reRegExpChar,'\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,'$1.*?')+'$');/** Built-in value references. */var Buffer=moduleExports?root.Buffer:undefined,Symbol=root.Symbol,Uint8Array=root.Uint8Array,getPrototype=overArg(Object.getPrototypeOf,Object),objectCreate=Object.create,propertyIsEnumerable=objectProto.propertyIsEnumerable,splice=arrayProto.splice;/* Built-in method references for those with the same name as other `lodash` methods. */var nativeGetSymbols=Object.getOwnPropertySymbols,nativeIsBuffer=Buffer?Buffer.isBuffer:undefined,nativeKeys=overArg(Object.keys,Object);/* Built-in method references that are verified to be native. */var DataView=getNative(root,'DataView'),Map=getNative(root,'Map'),Promise=getNative(root,'Promise'),Set=getNative(root,'Set'),WeakMap=getNative(root,'WeakMap'),nativeCreate=getNative(Object,'create');/** Used to detect maps, sets, and weakmaps. */var dataViewCtorString=toSource(DataView),mapCtorString=toSource(Map),promiseCtorString=toSource(Promise),setCtorString=toSource(Set),weakMapCtorString=toSource(WeakMap);/** Used to convert symbols to primitives and strings. */var symbolProto=Symbol?Symbol.prototype:undefined,symbolValueOf=symbolProto?symbolProto.valueOf:undefined;/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */function Hash(entries){var index=-1,length=entries?entries.length:0;this.clear();while(++index<length){var entry=entries[index];this.set(entry[0],entry[1]);}}/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */function hashClear(){this.__data__=nativeCreate?nativeCreate(null):{};}/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */function hashDelete(key){return this.has(key)&&delete this.__data__[key];}/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */function hashGet(key){var data=this.__data__;if(nativeCreate){var result=data[key];return result===HASH_UNDEFINED?undefined:result;}return hasOwnProperty.call(data,key)?data[key]:undefined;}/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */function hashHas(key){var data=this.__data__;return nativeCreate?data[key]!==undefined:hasOwnProperty.call(data,key);}/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */function hashSet(key,value){var data=this.__data__;data[key]=nativeCreate&&value===undefined?HASH_UNDEFINED:value;return this;}// Add methods to `Hash`.
Hash.prototype.clear=hashClear;Hash.prototype['delete']=hashDelete;Hash.prototype.get=hashGet;Hash.prototype.has=hashHas;Hash.prototype.set=hashSet;/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */function ListCache(entries){var index=-1,length=entries?entries.length:0;this.clear();while(++index<length){var entry=entries[index];this.set(entry[0],entry[1]);}}/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */function listCacheClear(){this.__data__=[];}/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */function listCacheDelete(key){var data=this.__data__,index=assocIndexOf(data,key);if(index<0){return false;}var lastIndex=data.length-1;if(index==lastIndex){data.pop();}else {splice.call(data,index,1);}return true;}/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */function listCacheGet(key){var data=this.__data__,index=assocIndexOf(data,key);return index<0?undefined:data[index][1];}/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */function listCacheHas(key){return assocIndexOf(this.__data__,key)>-1;}/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */function listCacheSet(key,value){var data=this.__data__,index=assocIndexOf(data,key);if(index<0){data.push([key,value]);}else {data[index][1]=value;}return this;}// Add methods to `ListCache`.
ListCache.prototype.clear=listCacheClear;ListCache.prototype['delete']=listCacheDelete;ListCache.prototype.get=listCacheGet;ListCache.prototype.has=listCacheHas;ListCache.prototype.set=listCacheSet;/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */function MapCache(entries){var index=-1,length=entries?entries.length:0;this.clear();while(++index<length){var entry=entries[index];this.set(entry[0],entry[1]);}}/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */function mapCacheClear(){this.__data__={'hash':new Hash(),'map':new(Map||ListCache)(),'string':new Hash()};}/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */function mapCacheDelete(key){return getMapData(this,key)['delete'](key);}/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */function mapCacheGet(key){return getMapData(this,key).get(key);}/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */function mapCacheHas(key){return getMapData(this,key).has(key);}/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */function mapCacheSet(key,value){getMapData(this,key).set(key,value);return this;}// Add methods to `MapCache`.
MapCache.prototype.clear=mapCacheClear;MapCache.prototype['delete']=mapCacheDelete;MapCache.prototype.get=mapCacheGet;MapCache.prototype.has=mapCacheHas;MapCache.prototype.set=mapCacheSet;/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */function Stack(entries){this.__data__=new ListCache(entries);}/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */function stackClear(){this.__data__=new ListCache();}/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */function stackDelete(key){return this.__data__['delete'](key);}/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */function stackGet(key){return this.__data__.get(key);}/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */function stackHas(key){return this.__data__.has(key);}/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */function stackSet(key,value){var cache=this.__data__;if(cache instanceof ListCache){var pairs=cache.__data__;if(!Map||pairs.length<LARGE_ARRAY_SIZE-1){pairs.push([key,value]);return this;}cache=this.__data__=new MapCache(pairs);}cache.set(key,value);return this;}// Add methods to `Stack`.
Stack.prototype.clear=stackClear;Stack.prototype['delete']=stackDelete;Stack.prototype.get=stackGet;Stack.prototype.has=stackHas;Stack.prototype.set=stackSet;/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */function arrayLikeKeys(value,inherited){// Safari 8.1 makes `arguments.callee` enumerable in strict mode.
// Safari 9 makes `arguments.length` enumerable in strict mode.
var result=isArray(value)||isArguments(value)?baseTimes(value.length,String):[];var length=result.length,skipIndexes=!!length;for(var key in value){if((inherited||hasOwnProperty.call(value,key))&&!(skipIndexes&&(key=='length'||isIndex(key,length)))){result.push(key);}}return result;}/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */function assignValue(object,key,value){var objValue=object[key];if(!(hasOwnProperty.call(object,key)&&eq(objValue,value))||value===undefined&&!(key in object)){object[key]=value;}}/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */function assocIndexOf(array,key){var length=array.length;while(length--){if(eq(array[length][0],key)){return length;}}return -1;}/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */function baseAssign(object,source){return object&&copyObject(source,keys(source),object);}/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @param {boolean} [isFull] Specify a clone including symbols.
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */function baseClone(value,isDeep,isFull,customizer,key,object,stack){var result;if(customizer){result=object?customizer(value,key,object,stack):customizer(value);}if(result!==undefined){return result;}if(!isObject(value)){return value;}var isArr=isArray(value);if(isArr){result=initCloneArray(value);if(!isDeep){return copyArray(value,result);}}else {var tag=getTag(value),isFunc=tag==funcTag||tag==genTag;if(isBuffer(value)){return cloneBuffer(value,isDeep);}if(tag==objectTag||tag==argsTag||isFunc&&!object){if(isHostObject(value)){return object?value:{};}result=initCloneObject(isFunc?{}:value);if(!isDeep){return copySymbols(value,baseAssign(result,value));}}else {if(!cloneableTags[tag]){return object?value:{};}result=initCloneByTag(value,tag,baseClone,isDeep);}}// Check for circular references and return its corresponding clone.
stack||(stack=new Stack());var stacked=stack.get(value);if(stacked){return stacked;}stack.set(value,result);if(!isArr){var props=isFull?getAllKeys(value):keys(value);}arrayEach(props||value,function(subValue,key){if(props){key=subValue;subValue=value[key];}// Recursively populate clone (susceptible to call stack limits).
assignValue(result,key,baseClone(subValue,isDeep,isFull,customizer,key,value,stack));});return result;}/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} prototype The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */function baseCreate(proto){return isObject(proto)?objectCreate(proto):{};}/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */function baseGetAllKeys(object,keysFunc,symbolsFunc){var result=keysFunc(object);return isArray(object)?result:arrayPush(result,symbolsFunc(object));}/**
	 * The base implementation of `getTag`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */function baseGetTag(value){return objectToString.call(value);}/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */function baseIsNative(value){if(!isObject(value)||isMasked(value)){return false;}var pattern=isFunction(value)||isHostObject(value)?reIsNative:reIsHostCtor;return pattern.test(toSource(value));}/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */function baseKeys(object){if(!isPrototype(object)){return nativeKeys(object);}var result=[];for(var key in Object(object)){if(hasOwnProperty.call(object,key)&&key!='constructor'){result.push(key);}}return result;}/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */function cloneBuffer(buffer,isDeep){if(isDeep){return buffer.slice();}var result=new buffer.constructor(buffer.length);buffer.copy(result);return result;}/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */function cloneArrayBuffer(arrayBuffer){var result=new arrayBuffer.constructor(arrayBuffer.byteLength);new Uint8Array(result).set(new Uint8Array(arrayBuffer));return result;}/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */function cloneDataView(dataView,isDeep){var buffer=isDeep?cloneArrayBuffer(dataView.buffer):dataView.buffer;return new dataView.constructor(buffer,dataView.byteOffset,dataView.byteLength);}/**
	 * Creates a clone of `map`.
	 *
	 * @private
	 * @param {Object} map The map to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned map.
	 */function cloneMap(map,isDeep,cloneFunc){var array=isDeep?cloneFunc(mapToArray(map),true):mapToArray(map);return arrayReduce(array,addMapEntry,new map.constructor());}/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */function cloneRegExp(regexp){var result=new regexp.constructor(regexp.source,reFlags.exec(regexp));result.lastIndex=regexp.lastIndex;return result;}/**
	 * Creates a clone of `set`.
	 *
	 * @private
	 * @param {Object} set The set to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned set.
	 */function cloneSet(set,isDeep,cloneFunc){var array=isDeep?cloneFunc(setToArray(set),true):setToArray(set);return arrayReduce(array,addSetEntry,new set.constructor());}/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */function cloneSymbol(symbol){return symbolValueOf?Object(symbolValueOf.call(symbol)):{};}/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */function cloneTypedArray(typedArray,isDeep){var buffer=isDeep?cloneArrayBuffer(typedArray.buffer):typedArray.buffer;return new typedArray.constructor(buffer,typedArray.byteOffset,typedArray.length);}/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */function copyArray(source,array){var index=-1,length=source.length;array||(array=Array(length));while(++index<length){array[index]=source[index];}return array;}/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */function copyObject(source,props,object,customizer){object||(object={});var index=-1,length=props.length;while(++index<length){var key=props[index];var newValue=customizer?customizer(object[key],source[key],key,object,source):undefined;assignValue(object,key,newValue===undefined?source[key]:newValue);}return object;}/**
	 * Copies own symbol properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */function copySymbols(source,object){return copyObject(source,getSymbols(source),object);}/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */function getAllKeys(object){return baseGetAllKeys(object,keys,getSymbols);}/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */function getMapData(map,key){var data=map.__data__;return isKeyable(key)?data[typeof key=='string'?'string':'hash']:data.map;}/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */function getNative(object,key){var value=getValue(object,key);return baseIsNative(value)?value:undefined;}/**
	 * Creates an array of the own enumerable symbol properties of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */var getSymbols=nativeGetSymbols?overArg(nativeGetSymbols,Object):stubArray;/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */var getTag=baseGetTag;// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if(DataView&&getTag(new DataView(new ArrayBuffer(1)))!=dataViewTag||Map&&getTag(new Map())!=mapTag||Promise&&getTag(Promise.resolve())!=promiseTag||Set&&getTag(new Set())!=setTag||WeakMap&&getTag(new WeakMap())!=weakMapTag){getTag=function(value){var result=objectToString.call(value),Ctor=result==objectTag?value.constructor:undefined,ctorString=Ctor?toSource(Ctor):undefined;if(ctorString){switch(ctorString){case dataViewCtorString:return dataViewTag;case mapCtorString:return mapTag;case promiseCtorString:return promiseTag;case setCtorString:return setTag;case weakMapCtorString:return weakMapTag;}}return result;};}/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */function initCloneArray(array){var length=array.length,result=array.constructor(length);// Add properties assigned by `RegExp#exec`.
if(length&&typeof array[0]=='string'&&hasOwnProperty.call(array,'index')){result.index=array.index;result.input=array.input;}return result;}/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */function initCloneObject(object){return typeof object.constructor=='function'&&!isPrototype(object)?baseCreate(getPrototype(object)):{};}/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */function initCloneByTag(object,tag,cloneFunc,isDeep){var Ctor=object.constructor;switch(tag){case arrayBufferTag:return cloneArrayBuffer(object);case boolTag:case dateTag:return new Ctor(+object);case dataViewTag:return cloneDataView(object,isDeep);case float32Tag:case float64Tag:case int8Tag:case int16Tag:case int32Tag:case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:return cloneTypedArray(object,isDeep);case mapTag:return cloneMap(object,isDeep,cloneFunc);case numberTag:case stringTag:return new Ctor(object);case regexpTag:return cloneRegExp(object);case setTag:return cloneSet(object,isDeep,cloneFunc);case symbolTag:return cloneSymbol(object);}}/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */function isIndex(value,length){length=length==null?MAX_SAFE_INTEGER:length;return !!length&&(typeof value=='number'||reIsUint.test(value))&&value>-1&&value%1==0&&value<length;}/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */function isKeyable(value){var type=typeof value;return type=='string'||type=='number'||type=='symbol'||type=='boolean'?value!=='__proto__':value===null;}/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */function isMasked(func){return !!maskSrcKey&&maskSrcKey in func;}/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */function isPrototype(value){var Ctor=value&&value.constructor,proto=typeof Ctor=='function'&&Ctor.prototype||objectProto;return value===proto;}/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */function toSource(func){if(func!=null){try{return funcToString.call(func);}catch(e){}try{return func+'';}catch(e){}}return '';}/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */function cloneDeep(value){return baseClone(value,true,true);}/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */function eq(value,other){return value===other||value!==value&&other!==other;}/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */function isArguments(value){// Safari 8.1 makes `arguments.callee` enumerable in strict mode.
return isArrayLikeObject(value)&&hasOwnProperty.call(value,'callee')&&(!propertyIsEnumerable.call(value,'callee')||objectToString.call(value)==argsTag);}/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */var isArray=Array.isArray;/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */function isArrayLike(value){return value!=null&&isLength(value.length)&&!isFunction(value);}/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */function isArrayLikeObject(value){return isObjectLike(value)&&isArrayLike(value);}/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */var isBuffer=nativeIsBuffer||stubFalse;/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */function isFunction(value){// The use of `Object#toString` avoids issues with the `typeof` operator
// in Safari 8-9 which returns 'object' for typed array and other constructors.
var tag=isObject(value)?objectToString.call(value):'';return tag==funcTag||tag==genTag;}/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */function isLength(value){return typeof value=='number'&&value>-1&&value%1==0&&value<=MAX_SAFE_INTEGER;}/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */function isObject(value){var type=typeof value;return !!value&&(type=='object'||type=='function');}/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */function isObjectLike(value){return !!value&&typeof value=='object';}/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */function keys(object){return isArrayLike(object)?arrayLikeKeys(object):baseKeys(object);}/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */function stubArray(){return [];}/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */function stubFalse(){return false;}module.exports=cloneDeep;})(lodash_clonedeep,lodash_clonedeep.exports);var lodash_clonedeepExports=lodash_clonedeep.exports;var cloneDeep = /*@__PURE__*/getDefaultExportFromCjs(lodash_clonedeepExports);

/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */async function fetchAdapter(config){const request=createRequest(config);const promiseChain=[getResponse(request,config)];if(config.timeout&&config.timeout>0){promiseChain.push(new Promise(res=>{setTimeout(()=>{const message=config.timeoutErrorMessage?config.timeoutErrorMessage:'timeout of '+config.timeout+'ms exceeded';res(createError(message,config,'ECONNABORTED',request));},config.timeout);}));}const data=await Promise.race(promiseChain);return new Promise((resolve,reject)=>{if(data instanceof Error){reject(data);}else {Object.prototype.toString.call(config.settle)==='[object Function]'?config.settle(resolve,reject,data):settle(resolve,reject,data);}});}/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */async function getResponse(request,config){let stageOne;try{stageOne=await fetch(request);}catch(e){return createError('Network Error',config,'ERR_NETWORK',request);}const response={ok:stageOne.ok,status:stageOne.status,statusText:stageOne.statusText,headers:new Headers(stageOne.headers),// Make a copy of headers
config:config,request};if(stageOne.status>=200&&stageOne.status!==204){switch(config.responseType){case'arraybuffer':response.data=await stageOne.arrayBuffer();break;case'blob':response.data=await stageOne.blob();break;case'json':response.data=await stageOne.json();break;case'formData':response.data=await stageOne.formData();break;default:response.data=await stageOne.text();break;}}return response;}/**
 * This function will create a Request object based on configuration's axios
 */function createRequest(config){const headers=new Headers(config.headers);// HTTP basic authentication
if(config.auth){const username=config.auth.username||'';const password=config.auth.password?decodeURI(encodeURIComponent(config.auth.password)):'';headers.set('Authorization',`Basic ${btoa(username+':'+password)}`);}const method=config.method.toUpperCase();const options={headers:headers,method};if(method!=='GET'&&method!=='HEAD'){options.body=config.data;// In these cases the browser will automatically set the correct Content-Type,
// but only if that header hasn't been set yet. So that's why we're deleting it.
if(utils$1.isFormData(options.body)&&platform$1.isStandardBrowserEnv()){headers.delete('Content-Type');}}if(config.mode){options.mode=config.mode;}if(config.cache){options.cache=config.cache;}if(config.integrity){options.integrity=config.integrity;}if(config.redirect){options.redirect=config.redirect;}if(config.referrer){options.referrer=config.referrer;}// This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
// So if withCredentials is not set, default value 'same-origin' will be used
if(!utils$1.isUndefined(config.withCredentials)){options.credentials=config.withCredentials?'include':'omit';}const fullPath=buildFullPath(config.baseURL,config.url);const url=buildURL(fullPath,config.params,config.paramsSerializer);// Expected browser to throw error if there is any wrong configuration value
return new Request(url,options);}/**
 * Note:
 * 
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 * 
 * 
 * 
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */function createError(message,config,code,request,response){if(axios.AxiosError&&typeof axios.AxiosError==='function'){return new axios.AxiosError(message,axios.AxiosError[code],config,request,response);}var error=new Error(message);return enhanceError(error,config,code,request,response);}/**
 * 
 * Note:
 * 
 *   This function is for backward compatible.
 * 
 *  
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */function enhanceError(error,config,code,request,response){error.config=config;if(code){error.code=code;}error.request=request;error.response=response;error.isAxiosError=true;error.toJSON=function toJSON(){return {// Standard
message:this.message,name:this.name,// Microsoft
description:this.description,number:this.number,// Mozilla
fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,// Axios
config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null};};return error;}

const{toString}=Object.prototype;const NODE_TYPE_ELEMENT=1;const DOM_PROPERTIES_TO_CHECK=['innerHTML','ownerDocument','style','attributes','nodeValue'];function isObject$1(value){return value!==null&&typeof value==='object';}function isHtmlElement(value){return isObject$1(value)&&value.nodeType===NODE_TYPE_ELEMENT&&typeof value.nodeName==='string'&&DOM_PROPERTIES_TO_CHECK.every(property=>property in value);}var componentType=function(value){if(value===undefined){return 'undefined';}if(value===null){return 'null';}if(Number.isNaN(value)){return 'nan';}if(Array.isArray(value)){return 'array';}switch(toString.call(value)){case'[object Date]':{return 'date';}case'[object RegExp]':{return 'regexp';}case'[object Arguments]':{return 'arguments';}case'[object Error]':{return 'error';}// No default
}if(value&&isHtmlElement(value)){return 'element';}if(value&&value instanceof Uint8Array&&value.constructor.name==='Buffer'){return 'buffer';}if(typeof value.valueOf==='function'){value=value.valueOf?.()??Object.prototype.valueOf.apply(value);}return typeof value;};var type = /*@__PURE__*/getDefaultExportFromCjs(componentType);

/**
 * Join `arr` with the trailing `str` defaulting to "and",
 * and `sep` string defaulting to ", ".
 *
 * @param {Array} arr
 * @param {String} str
 * @param {String} sep
 * @return {String}
 * @api public
 */var joinComponent=function(arr,str,sep){str=str||'and';sep=sep||', ';if(arr.length<2)return arr[0]||'';var oxford=str.slice(0,2)===sep;if(!oxford){str=' '+str;}else if(arr.length==2){str=str.slice(1);}return arr.slice(0,-1).join(sep)+str+' '+arr[arr.length-1];};var join = /*@__PURE__*/getDefaultExportFromCjs(joinComponent);

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect$1(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect$1.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect$1.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect$1.styles[styleType];

  if (style) {
    return '\u001b[' + inspect$1.colors[style][0] + 'm' + str +
           '\u001b[' + inspect$1.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction$1(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect$1 &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction$1(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction$1(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    if (cur.indexOf('\n') >= 0) ;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isNull(arg) {
  return arg === null;
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction$1(arg) {
  return typeof arg === 'function';
}

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
var hasOwn = Object.prototype.hasOwnProperty;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};
var pSlice = Array.prototype.slice;
var _functionsHaveNames;
function functionsHaveNames() {
  if (typeof _functionsHaveNames !== 'undefined') {
    return _functionsHaveNames;
  }
  return _functionsHaveNames = (function () {
    return function foo() {}.name === 'foo';
  }());
}
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global$1.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

function assert(value, message) {
  if (!value) fail(value, true, message, '==', ok);
}

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!isFunction$1(func)) {
    return;
  }
  if (functionsHaveNames()) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = AssertionError;
function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
}

// assert.AssertionError instanceof Error
inherits$1(AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames() || !isFunction$1(something)) {
    return inspect$1(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);
assert.equal = equal;
function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', equal);
}

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);
assert.notEqual = notEqual;
function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', notEqual);
  }
}

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);
assert.deepEqual = deepEqual;
function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', deepEqual);
  }
}
assert.deepStrictEqual = deepStrictEqual;
function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', deepStrictEqual);
  }
}

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (isDate(actual) && isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (isRegExp(actual) && isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (isPrimitive(a) || isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);
assert.notDeepEqual = notDeepEqual;
function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', notDeepEqual);
  }
}

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);
assert.strictEqual = strictEqual;
function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', strictEqual);
  }
}

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
assert.notStrictEqual = notStrictEqual;
function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', notStrictEqual);
  }
}

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);
assert.throws = throws;
function throws(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
}

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = doesNotThrow;
function doesNotThrow(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
}

assert.ifError = ifError;
function ifError(err) {
  if (err) throw err;
}

// eslint-disable-next-line no-bitwise
const MAX_SIZE=32<<10;/**
 * Validate a "track" event.
 */const validateTrackEvent=event=>{assert(event.anonymousId||event.userId,'You must pass either an "anonymousId" or a "userId".');assert(event.event,'You must pass an "event".');};/**
 * Validate a "group" event.
 */const validateGroupEvent=event=>{assert(event.anonymousId||event.userId,'You must pass either an "anonymousId" or a "userId".');assert(event.groupId,'You must pass a "groupId".');};/**
 * Validate a "identify" event.
 */const validateIdentifyEvent=event=>{assert(event.anonymousId||event.userId,'You must pass either an "anonymousId" or a "userId".');};/**
 * Validate a "page" event.
 */const validatePageEvent=event=>{assert(event.anonymousId||event.userId,'You must pass either an "anonymousId" or a "userId".');};/**
 * Validate a "screen" event.
 */const validateScreenEvent=event=>{assert(event.anonymousId||event.userId,'You must pass either an "anonymousId" or a "userId".');};/**
 * Validate an "alias" event.
 */const validateAliasEvent=event=>{assert(event.userId,'You must pass a "userId".');assert(event.previousId,'You must pass a "previousId".');};/**
 * Validation rules.
 */const genericValidationRules={anonymousId:['string','number'],category:'string',context:'object',event:'string',groupId:['string','number'],integrations:'object',name:'string',previousId:['string','number'],timestamp:'date',userId:['string','number'],type:'string'};/**
 * Validate an event object.
 */const validateGenericEvent=event=>{assert(type(event)==='object','You must pass a message object.');const json=JSON.stringify(event);// Strings are variable byte encoded, so json.length is not sufficient.
assert(Buffer.byteLength(json,'utf8')<MAX_SIZE,'Your message must be < 32kb.');// eslint-disable-next-line guard-for-in,no-restricted-syntax
for(const key in genericValidationRules){const val=event[key];if(!val){// eslint-disable-next-line no-continue
continue;}let rule=genericValidationRules[key];if(type(rule)!=='array'){rule=[rule];}const a=rule[0]==='object'?'an':'a';assert(rule.some(e=>type(val)===e),`"${key}" must be ${a} ${join(rule,'or')}.`);}};/**
 * Validate an event.
 */const looselyValidateEvent=(event,type)=>{validateGenericEvent(event);// eslint-disable-next-line no-param-reassign
type=type||event.type;assert(type,'You must pass an event type.');switch(type){case'track':return validateTrackEvent(event);case'group':return validateGroupEvent(event);case'identify':return validateIdentifyEvent(event);case'page':return validatePageEvent(event);case'screen':return validateScreenEvent(event);case'alias':return validateAliasEvent(event);default:return assert(0,`Invalid event type: "${type}"`);}};

const version='3.0.6';const removeTrailingSlashes=inURL=>inURL&&inURL.endsWith('/')?inURL.replace(/\/+$/,''):inURL;const isFunction=value=>typeof value==='function'&&Boolean(value.constructor&&value.call&&value.apply);const setImmediate=browser$1.nextTick.bind(browser$1);const noop=()=>{};class Analytics{/**
   * Initialize a new `Analytics` with your RudderStack source's `writeKey` and an
   * optional dictionary of `options`.
   *
   * @param {String} writeKey
   * @param {String} dataPlaneURL
   * @param {Object=} options (optional)
   * @param {Number=20} options.flushAt (default: 20)
   * @param {Number=20000} options.flushInterval (default: 20000)
   * @param {Boolean=true} options.enable (default: true)
   * @param {Number=20000} options.maxInternalQueueSize (default: 20000)
   * @param {Number} options.timeout (default: false)
   * @param {String=info} options.logLevel (default: info)
   * @param {Function} options.flushOverride (optional)
   */constructor(writeKey,dataPlaneURL,options){options=options||{};if(!writeKey){throw new Error("You must pass your project's write key.");}if(!dataPlaneURL){throw new Error('You must pass our data plane url.');}this.queue=[];this.writeKey=writeKey;this.host=removeTrailingSlashes(dataPlaneURL);this.timeout=options.timeout||undefined;this.flushAt=options.flushAt?Math.max(options.flushAt,1):20;this.flushInterval=options.flushInterval||20000;this.maxInternalQueueSize=options.maxInternalQueueSize||20000;this.logLevel=options.logLevel||'info';this.flushOverride=options.flushOverride&&isFunction(options.flushOverride)?options.flushOverride:undefined;this.flushed=false;this.axiosInstance=axios.create({adapter:fetchAdapter});Object.defineProperty(this,'enable',{configurable:false,writable:false,enumerable:true,value:typeof options.enable==='boolean'?options.enable:true});this.logger={error(message,...args){if(this.logLevel!=='off'){console.error(`${new Date().toISOString()} ["Rudder"] error: ${message}`,...args);}},info(message,...args){if(['silly','debug','info'].includes(this.logLevel)){console.log(`${new Date().toISOString()} ["Rudder"] info: ${message}`,...args);}},debug(message,...args){if(['silly','debug'].includes(this.logLevel)){console.debug(`${new Date().toISOString()} ["Rudder"] debug: ${message}`,...args);}},silly(message,...args){if(['silly'].includes(this.logLevel)){console.info(`${new Date().toISOString()} ["Rudder"] silly: ${message}`,...args);}}};axiosRetry(this.axiosInstance,{retries:0});}_validate(message,type){try{looselyValidateEvent(message,type);}catch(e){if(e.message==='Your message must be < 32kb.'){this.logger.info('Your message must be < 32kb. This is currently surfaced as a warning. Please update your code',message);return;}throw e;}}/**
   * Send an identify `message`.
   *
   * @param {Object} message
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.traits (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */identify(message,callback){this._validate(message,'identify');this.enqueue('identify',message,callback);return this;}/**
   * Send a group `message`.
   *
   * @param {Object} message
   * @param {String} message.groupId
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.traits (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */group(message,callback){this._validate(message,'group');this.enqueue('group',message,callback);return this;}/**
   * Send a track `message`.
   *
   * @param {Object} message
   * @param {String} message.event
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */track(message,callback){this._validate(message,'track');this.enqueue('track',message,callback);return this;}/**
   * Send a page `message`.
   *
   * @param {Object} message
   * @param {String} message.name
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */page(message,callback){this._validate(message,'page');this.enqueue('page',message,callback);return this;}/**
   * Send a screen `message`.
   *
   * @param {Object} message
   * @param {Function} callback (optional)
   * @return {Analytics}
   */screen(message,callback){this._validate(message,'screen');this.enqueue('screen',message,callback);return this;}/**
   * Send an alias `message`.
   *
   * @param {Object} message
   * @param {String} message.previousId
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */alias(message,callback){this._validate(message,'alias');this.enqueue('alias',message,callback);return this;}/**
   * Add a `message` of type `type` to the queue and
   * check whether it should be flushed.
   *
   * @param {String} type
   * @param {Object} message
   * @param {Function} [callback] (optional)
   * @api private
   */enqueue(type,message,callback){if(this.queue.length>=this.maxInternalQueueSize){this.logger.error(`not adding events for processing as queue size ${this.queue.length} >= than max configuration ${this.maxInternalQueueSize}`);return;}// Clone the incoming message object
// before altering the data
let lMessage=cloneDeep(message);callback=callback||noop;if(!this.enable){return setImmediate(callback);}if(type==='identify'&&lMessage.traits){if(!lMessage.context){lMessage.context={};}lMessage.context.traits=lMessage.traits;}lMessage={...lMessage};lMessage.type=type;lMessage.context={library:{name:'analytics-service-worker',version},...lMessage.context};lMessage.channel='service-worker';lMessage._metadata={serviceWorkerVersion:version,...lMessage._metadata};if(!lMessage.originalTimestamp){lMessage.originalTimestamp=new Date();}if(!lMessage.messageId){lMessage.messageId=v4();}// Historically this library has accepted strings and numbers as IDs.
// However, our spec only allows strings. To avoid breaking compatibility,
// we'll coerce these to strings if they aren't already.
if(lMessage.anonymousId&&!isString$2(lMessage.anonymousId)){lMessage.anonymousId=JSON.stringify(lMessage.anonymousId);}if(lMessage.userId&&!isString$2(lMessage.userId)){lMessage.userId=JSON.stringify(lMessage.userId);}this.queue.push({message:lMessage,callback});if(!this.flushed){this.flushed=true;this.flush();return;}if(this.queue.length>=this.flushAt){this.logger.debug('flushAt reached, trying flush...');this.flush();}if(this.flushInterval&&!this.flushTimer){this.logger.debug('no existing flush timer, creating new one');this.flushTimer=setTimeout(this.flush.bind(this),this.flushInterval);}}/**
   * Flush the current queue
   *
   * @param {Function} [callback] (optional)
   * @return {any}
   */flush(callback){// check if earlier flush was pushed to queue
this.logger.debug('in flush');callback=callback||noop;if(!this.enable){return setImmediate(callback);}if(this.timer){this.logger.debug('cancelling existing timer...');clearTimeout(this.timer);this.timer=null;}if(this.flushTimer){this.logger.debug('cancelling existing flushTimer...');clearTimeout(this.flushTimer);this.flushTimer=null;}if(this.queue.length===0){this.logger.debug('queue is empty, nothing to flush');return setImmediate(callback);}const items=this.queue.splice(0,this.flushAt);const callbacks=items.map(item=>item.callback);const messages=items.map(item=>{// if someone mangles directly with queue
if(typeof item.message==='object'){item.message.sentAt=new Date();}return item.message;});const data={batch:messages,sentAt:new Date()};this.logger.debug(`batch size is ${items.length}`);this.logger.silly('===data===',data);const done=err=>{callbacks.forEach(callback_=>{if(callback_){callback_(err);}});if(callback){callback(err,data);}};// Don't set the user agent if we're not on a browser. The latest spec allows
// the User-Agent header (see https://fetch.spec.whatwg.org/#terminology-headers
// and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader),
// but browsers such as Chrome and Safari have not caught up.
const headers={};if(typeof window==='undefined'){headers['user-agent']=`analytics-service-worker/${version}`;headers['Content-Type']=`application/json`;}const reqTimeout=typeof this.timeout==='string'?parseInt(ms$1(this.timeout),10):this.timeout;if(data.batch.length===0){this.logger.debug('batch is empty, nothing to flush');return setImmediate(callback);}if(this.flushOverride){this.flushOverride({host:`${this.host}`,writeKey:this.writeKey,data,headers,reqTimeout,flush:this.flush.bind(this),done,isErrorRetryable:this._isErrorRetryable.bind(this)});}else {const req={method:'POST',url:`${this.host}`,auth:{username:this.writeKey},data,headers};if(reqTimeout){req.timeout=reqTimeout;}this.axiosInstance({...req,'axios-retry':{retries:3,retryCondition:this._isErrorRetryable.bind(this),retryDelay:axiosRetry.exponentialDelay}})// eslint-disable-next-line @typescript-eslint/no-unused-vars
.then(response=>{this.timer=setTimeout(this.flush.bind(this),this.flushInterval);done();}).catch(err=>{this.logger.error(err);this.logger.error(`got error while attempting send for 3 times, dropping ${items.length} events`);this.timer=setTimeout(this.flush.bind(this),this.flushInterval);if(err.response){const error=new Error(err.response.statusText);return done(error);}done(err);});}}_isErrorRetryable(error){// Retry Network Errors.
if(axiosRetry.isNetworkError(error)){return true;}if(!error.response){// Cannot determine if the request can be retried
return false;}this.logger.error(`error status: ${error.response.status}`);// Retry Server Errors (5xx).
if(error.response.status>=500&&error.response.status<=599){return true;}// Retry if rate limited.
if(error.response.status===429){return true;}return false;}}

export { Analytics };
