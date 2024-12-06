// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.
(() => {
    //======================== npm cjs package code ==========================================

    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    
    function _isPlaceholder(a){return a!=null&&typeof a==='object'&&a['@@functional/placeholder']===true;}
    
    /**
     * Optimized internal one-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */function _curry1(fn){return function f1(a){if(arguments.length===0||_isPlaceholder(a)){return f1;}else {return fn.apply(this,arguments);}};}
    
    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */function _curry2(fn){return function f2(a,b){switch(arguments.length){case 0:return f2;case 1:return _isPlaceholder(a)?f2:_curry1(function(_b){return fn(a,_b);});default:return _isPlaceholder(a)&&_isPlaceholder(b)?f2:_isPlaceholder(a)?_curry1(function(_a){return fn(_a,b);}):_isPlaceholder(b)?_curry1(function(_b){return fn(a,_b);}):fn(a,b);}};}
    
    /**
     * Optimized internal three-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */function _curry3(fn){return function f3(a,b,c){switch(arguments.length){case 0:return f3;case 1:return _isPlaceholder(a)?f3:_curry2(function(_b,_c){return fn(a,_b,_c);});case 2:return _isPlaceholder(a)&&_isPlaceholder(b)?f3:_isPlaceholder(a)?_curry2(function(_a,_c){return fn(_a,b,_c);}):_isPlaceholder(b)?_curry2(function(_b,_c){return fn(a,_b,_c);}):_curry1(function(_c){return fn(a,b,_c);});default:return _isPlaceholder(a)&&_isPlaceholder(b)&&_isPlaceholder(c)?f3:_isPlaceholder(a)&&_isPlaceholder(b)?_curry2(function(_a,_b){return fn(_a,_b,c);}):_isPlaceholder(a)&&_isPlaceholder(c)?_curry2(function(_a,_c){return fn(_a,b,_c);}):_isPlaceholder(b)&&_isPlaceholder(c)?_curry2(function(_b,_c){return fn(a,_b,_c);}):_isPlaceholder(a)?_curry1(function(_a){return fn(_a,b,c);}):_isPlaceholder(b)?_curry1(function(_b){return fn(a,_b,c);}):_isPlaceholder(c)?_curry1(function(_c){return fn(a,b,_c);}):fn(a,b,c);}};}
    
    function _has(prop,obj){return Object.prototype.hasOwnProperty.call(obj,prop);}
    
    /**
     * Gives a single-word string description of the (native) type of a value,
     * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
     * attempt to distinguish user Object types any further, reporting them all as
     * 'Object'.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Type
     * @sig * -> String
     * @param {*} val The value to test
     * @return {String}
     * @example
     *
     *      R.type({}); //=> "Object"
     *      R.type(1); //=> "Number"
     *      R.type(false); //=> "Boolean"
     *      R.type('s'); //=> "String"
     *      R.type(null); //=> "Null"
     *      R.type([]); //=> "Array"
     *      R.type(/[A-z]/); //=> "RegExp"
     *      R.type(() => {}); //=> "Function"
     *      R.type(async () => {}); //=> "AsyncFunction"
     *      R.type(undefined); //=> "Undefined"
     */var type=/*#__PURE__*/_curry1(function type(val){return val===null?'Null':val===undefined?'Undefined':Object.prototype.toString.call(val).slice(8,-1);});
    
    function _isObject(x){return Object.prototype.toString.call(x)==='[object Object]';}
    
    /**
     * Determine if the passed argument is an integer.
     *
     * @private
     * @param {*} n
     * @category Type
     * @return {Boolean}
     */const _isInteger = Number.isInteger||function _isInteger(n){return n<<0===n;};
    
    function _isString(x){return Object.prototype.toString.call(x)==='[object String]';}
    
    /**
     * Returns the nth element of the given list or string. If n is negative the
     * element at index length + n is returned.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Number -> [a] -> a | Undefined
     * @sig Number -> String -> String
     * @param {Number} offset
     * @param {*} list
     * @return {*}
     * @example
     *
     *      const list = ['foo', 'bar', 'baz', 'quux'];
     *      R.nth(1, list); //=> 'bar'
     *      R.nth(-1, list); //=> 'quux'
     *      R.nth(-99, list); //=> undefined
     *
     *      R.nth(2, 'abc'); //=> 'c'
     *      R.nth(3, 'abc'); //=> ''
     * @symb R.nth(-1, [a, b, c]) = c
     * @symb R.nth(0, [a, b, c]) = a
     * @symb R.nth(1, [a, b, c]) = b
     */var nth=/*#__PURE__*/_curry2(function nth(offset,list){var idx=offset<0?list.length+offset:offset;return _isString(list)?list.charAt(idx):list[idx];});
    
    function _cloneRegExp(pattern){return new RegExp(pattern.source,pattern.flags?pattern.flags:(pattern.global?'g':'')+(pattern.ignoreCase?'i':'')+(pattern.multiline?'m':'')+(pattern.sticky?'y':'')+(pattern.unicode?'u':'')+(pattern.dotAll?'s':''));}
    
    /**
     * Copies an object.
     *
     * @private
     * @param {*} value The value to be copied
     * @param {Boolean} deep Whether or not to perform deep cloning.
     * @return {*} The copied value.
     */function _clone(value,deep,map){map||(map=new _ObjectMap());// this avoids the slower switch with a quick if decision removing some milliseconds in each run.
    if(_isPrimitive(value)){return value;}var copy=function copy(copiedValue){// Check for circular and same references on the object graph and return its corresponding clone.
    var cachedCopy=map.get(value);if(cachedCopy){return cachedCopy;}map.set(value,copiedValue);for(var key in value){if(Object.prototype.hasOwnProperty.call(value,key)){copiedValue[key]=deep?_clone(value[key],true,map):value[key];}}return copiedValue;};switch(type(value)){case'Object':return copy(Object.create(Object.getPrototypeOf(value)));case'Array':return copy([]);case'Date':return new Date(value.valueOf());case'RegExp':return _cloneRegExp(value);case'Int8Array':case'Uint8Array':case'Uint8ClampedArray':case'Int16Array':case'Uint16Array':case'Int32Array':case'Uint32Array':case'Float32Array':case'Float64Array':case'BigInt64Array':case'BigUint64Array':return value.slice();default:return value;}}function _isPrimitive(param){var type=typeof param;return param==null||type!='object'&&type!='function';}var _ObjectMap=/*#__PURE__*/function(){function _ObjectMap(){this.map={};this.length=0;}_ObjectMap.prototype.set=function(key,value){const hashedKey=this.hash(key);let bucket=this.map[hashedKey];if(!bucket){this.map[hashedKey]=bucket=[];}bucket.push([key,value]);this.length+=1;};_ObjectMap.prototype.hash=function(key){let hashedKey=[];for(var value in key){hashedKey.push(Object.prototype.toString.call(key[value]));}return hashedKey.join();};_ObjectMap.prototype.get=function(key){/**
         * depending on the number of objects to be cloned is faster to just iterate over the items in the map just because the hash function is so costly,
         * on my tests this number is 180, anything above that using the hash function is faster.
         */if(this.length<=180){for(const p in this.map){const bucket=this.map[p];for(let i=0;i<bucket.length;i+=1){const element=bucket[i];if(element[0]===key){return element[1];}}}return;}const hashedKey=this.hash(key);const bucket=this.map[hashedKey];if(!bucket){return;}for(let i=0;i<bucket.length;i+=1){const element=bucket[i];if(element[0]===key){return element[1];}}};return _ObjectMap;}();
    
    /**
     * Creates a deep copy of the source that can be used in place of the source
     * object without retaining any references to it.
     * The source object may contain (nested) `Array`s and `Object`s,
     * `Number`s, `String`s, `Boolean`s and `Date`s.
     * `Function`s are assigned by reference rather than copied.
     *
     * Dispatches to a `clone` method if present.
     *
     * Note that if the source object has multiple nodes that share a reference,
     * the returned object will have the same structure, but the references will
     * be pointed to the location within the cloned value.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {*} -> {*}
     * @param {*} value The object or array to clone
     * @return {*} A deeply cloned copy of `val`
     * @example
     *
     *      const objects = [{}, {}, {}];
     *      const objectsClone = R.clone(objects);
     *      objects === objectsClone; //=> false
     *      objects[0] === objectsClone[0]; //=> false
     */var clone=/*#__PURE__*/_curry1(function clone(value){return value!=null&&typeof value.clone==='function'?value.clone():_clone(value,true);});
    
    /**
     * Retrieves the values at given paths of an object.
     *
     * @func
     * @memberOf R
     * @since v0.27.1
     * @category Object
     * @typedefn Idx = [String | Int | Symbol]
     * @sig [Idx] -> {a} -> [a | Undefined]
     * @param {Array} pathsArray The array of paths to be fetched.
     * @param {Object} obj The object to retrieve the nested properties from.
     * @return {Array} A list consisting of values at paths specified by "pathsArray".
     * @see R.path
     * @example
     *
     *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
     *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
     */var paths=/*#__PURE__*/_curry2(function paths(pathsArray,obj){return pathsArray.map(function(paths){var val=obj;var idx=0;var p;while(idx<paths.length){if(val==null){return;}p=paths[idx];val=_isInteger(p)?nth(p,val):val[p];idx+=1;}return val;});});
    
    /**
     * Retrieves the value at a given path. The nodes of the path can be arbitrary strings or non-negative integers.
     * For anything else, the value is unspecified. Integer paths are meant to index arrays, strings are meant for objects.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Object
     * @typedefn Idx = String | Int | Symbol
     * @sig [Idx] -> {a} -> a | Undefined
     * @sig Idx = String | NonNegativeInt
     * @param {Array} path The path to use.
     * @param {Object} obj The object or array to retrieve the nested property from.
     * @return {*} The data at `path`.
     * @see R.prop, R.nth, R.assocPath, R.dissocPath
     * @example
     *
     *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
     *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
     *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
     *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
     *      R.path([2], {'2': 2}); //=> 2
     *      R.path([-2], {'-2': 'a'}); //=> undefined
     */var path=/*#__PURE__*/_curry2(function path(pathAr,obj){return paths([pathAr],obj)[0];});
    
    /**
     * Creates a new object with the own properties of the two provided objects. If
     * a key exists in both objects, the provided function is applied to the key
     * and the values associated with the key in each object, with the result being
     * used as the value associated with the key in the returned object.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Object
     * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} l
     * @param {Object} r
     * @return {Object}
     * @see R.mergeDeepWithKey, R.merge, R.mergeWith
     * @example
     *
     *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
     *      R.mergeWithKey(concatValues,
     *                     { a: true, thing: 'foo', values: [10, 20] },
     *                     { b: true, thing: 'bar', values: [15, 35] });
     *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
     * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
     */var mergeWithKey=/*#__PURE__*/_curry3(function mergeWithKey(fn,l,r){var result={};var k;l=l||{};r=r||{};for(k in l){if(_has(k,l)){result[k]=_has(k,r)?fn(k,l[k],r[k]):l[k];}}for(k in r){if(_has(k,r)&&!_has(k,result)){result[k]=r[k];}}return result;});
    
    /**
     * Creates a new object with the own properties of the two provided objects.
     * If a key exists in both objects:
     * - and both associated values are also objects then the values will be
     *   recursively merged.
     * - otherwise the provided function is applied to the key and associated values
     *   using the resulting value as the new value associated with the key.
     * If a key only exists in one object, the value will be associated with the key
     * of the resulting object.
     *
     * @func
     * @memberOf R
     * @since v0.24.0
     * @category Object
     * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} lObj
     * @param {Object} rObj
     * @return {Object}
     * @see R.mergeWithKey, R.mergeDeepWith
     * @example
     *
     *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
     *      R.mergeDeepWithKey(concatValues,
     *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
     *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
     *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
     */var mergeDeepWithKey=/*#__PURE__*/_curry3(function mergeDeepWithKey(fn,lObj,rObj){return mergeWithKey(function(k,lVal,rVal){if(_isObject(lVal)&&_isObject(rVal)){return mergeDeepWithKey(fn,lVal,rVal);}else {return fn(k,lVal,rVal);}},lObj,rObj);});
    
    /**
     * Creates a new object with the own properties of the two provided objects.
     * If a key exists in both objects:
     * - and both associated values are also objects then the values will be
     *   recursively merged.
     * - otherwise the provided function is applied to associated values using the
     *   resulting value as the new value associated with the key.
     * If a key only exists in one object, the value will be associated with the key
     * of the resulting object.
     *
     * @func
     * @memberOf R
     * @since v0.24.0
     * @category Object
     * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} lObj
     * @param {Object} rObj
     * @return {Object}
     * @see R.mergeWith, R.mergeDeepWithKey
     * @example
     *
     *      R.mergeDeepWith(R.concat,
     *                      { a: true, c: { values: [10, 20] }},
     *                      { b: true, c: { values: [15, 35] }});
     *      //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
     */var mergeDeepWith=/*#__PURE__*/_curry3(function mergeDeepWith(fn,lObj,rObj){return mergeDeepWithKey(function(k,lVal,rVal){return fn(lVal,rVal);},lObj,rObj);});
    
    /**
     * Returns a partial copy of an object containing only the keys that satisfy
     * the supplied predicate.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @sig ((v, k) -> Boolean) -> {k: v} -> {k: v}
     * @param {Function} pred A predicate to determine whether or not a key
     *        should be included on the output object.
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties that satisfy `pred`
     *         on it.
     * @see R.pick, R.filter
     * @example
     *
     *      const isUpperCase = (val, key) => key.toUpperCase() === key;
     *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
     */var pickBy=/*#__PURE__*/_curry2(function pickBy(test,obj){var result={};for(var prop in obj){if(test(obj[prop],prop,obj)){result[prop]=obj[prop];}}return result;});
    
    /**
     * A function to check given value is a function
     * @param value input value
     * @returns boolean
     */ // eslint-disable-next-line @typescript-eslint/ban-types
    const isFunction=value=>typeof value==='function'&&Boolean(value.constructor&&value.call&&value.apply);/**
     * A function to check given value is a string
     * @param value input value
     * @returns boolean
     */const isString=value=>typeof value==='string';/**
     * A function to check given value is null or not
     * @param value input value
     * @returns boolean
     */const isNull=value=>value===null;/**
     * A function to check given value is undefined
     * @param value input value
     * @returns boolean
     */const isUndefined=value=>typeof value==='undefined';/**
     * A function to check given value is null or undefined
     * @param value input value
     * @returns boolean
     */const isNullOrUndefined=value=>isNull(value)||isUndefined(value);/**
     * A function to check given value is defined
     * @param value input value
     * @returns boolean
     */const isDefined=value=>!isUndefined(value);/**
     * A function to check given value is defined and not null
     * @param value input value
     * @returns boolean
     */const isDefinedAndNotNull=value=>!isNullOrUndefined(value);/**
     * A function to check given value is defined and not null
     * @param value input value
     * @returns boolean
     */const isDefinedNotNullAndNotEmptyString=value=>isDefinedAndNotNull(value)&&value!=='';/**
     * Determines if the input is an instance of Error
     * @param obj input value
     * @returns true if the input is an instance of Error and false otherwise
     */const isTypeOfError=obj=>obj instanceof Error;
    
    const getValueByPath=(obj,keyPath)=>{const pathParts=keyPath.split('.');return path(pathParts,obj);};const hasValueByPath=(obj,path)=>Boolean(getValueByPath(obj,path));/**
     * Checks if the input is an object literal or built-in object type and not null
     * @param value Input value
     * @returns true if the input is an object and not null
     */const isObjectAndNotNull=value=>!isNull(value)&&typeof value==='object'&&!Array.isArray(value);/**
     * Checks if the input is an object literal and not null
     * @param value Input value
     * @returns true if the input is an object and not null
     */const isObjectLiteralAndNotNull=value=>!isNull(value)&&Object.prototype.toString.call(value)==='[object Object]';const mergeDeepRightObjectArrays=(leftValue,rightValue)=>{if(!Array.isArray(leftValue)||!Array.isArray(rightValue)){return clone(rightValue);}const mergedArray=clone(leftValue);rightValue.forEach((value,index)=>{mergedArray[index]=Array.isArray(value)||isObjectAndNotNull(value)?// eslint-disable-next-line @typescript-eslint/no-use-before-define
    mergeDeepRight(mergedArray[index],value):value;});return mergedArray;};const mergeDeepRight=(leftObject,rightObject)=>mergeDeepWith(mergeDeepRightObjectArrays,leftObject,rightObject);/**
     Checks if the input is a non-empty object literal type and not undefined or null
     * @param value input any
     * @returns boolean
     */const isNonEmptyObject=value=>isObjectLiteralAndNotNull(value)&&Object.keys(value).length>0;/**
     * A utility to recursively remove undefined values from an object
     * @param obj input object
     * @returns a new object
     */const removeUndefinedValues=obj=>{const result=pickBy(isDefined,obj);Object.keys(result).forEach(key=>{const value=result[key];if(isObjectLiteralAndNotNull(value)){result[key]=removeUndefinedValues(value);}});return result;};/**
     * A utility to recursively remove undefined and null values from an object
     * @param obj input object
     * @returns a new object
     */const removeUndefinedAndNullValues=obj=>{const result=pickBy(isDefinedAndNotNull,obj);Object.keys(result).forEach(key=>{const value=result[key];if(isObjectLiteralAndNotNull(value)){result[key]=removeUndefinedAndNullValues(value);}});return result;};
    
    const trim=value=>value.replace(/^\s+|\s+$/gm,'');const removeDoubleSpaces=value=>value.replace(/ {2,}/g,' ');/**
     * A function to convert values to string
     * @param val input value
     * @returns stringified value
     */const tryStringify=val=>{let retVal=val;if(!isString(val)&&!isNullOrUndefined(val)){try{retVal=JSON.stringify(val);}catch(e){retVal=null;}}return retVal;};// The following text encoding and decoding is done before base64 encoding to prevent
    // https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    /**
     * Converts a base64 encoded string to bytes array
     * @param base64Str base64 encoded string
     * @returns bytes array
     */const base64ToBytes=base64Str=>{const binString=globalThis.atob(base64Str);const bytes=binString.split('').map(char=>char.charCodeAt(0));return new Uint8Array(bytes);};/**
     * Converts a bytes array to base64 encoded string
     * @param bytes bytes array to be converted to base64
     * @returns base64 encoded string
     */const bytesToBase64=bytes=>{const binString=Array.from(bytes,x=>String.fromCodePoint(x)).join('');return globalThis.btoa(binString);};/**
     * Encodes a string to base64 even with unicode characters
     * @param value input string
     * @returns base64 encoded string
     */const toBase64=value=>bytesToBase64(new TextEncoder().encode(value));/**
     * Decodes a base64 encoded string
     * @param value base64 encoded string
     * @returns decoded string
     */const fromBase64=value=>new TextDecoder().decode(base64ToBytes(value));
    
    //   if yes make them null instead of omitting in overloaded cases
    /*
     * Normalise the overloaded arguments of the page call facade
     */const pageArgumentsToCallOptions=(category,name,properties,options,callback)=>{const payload={category:category,name:name,properties:properties,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.category=category;payload.name=name;payload.properties=properties;delete payload.options;payload.callback=options;}if(isFunction(properties)){payload.category=category;payload.name=name;delete payload.properties;delete payload.options;payload.callback=properties;}if(isFunction(name)){payload.category=category;delete payload.name;delete payload.properties;delete payload.options;payload.callback=name;}if(isFunction(category)){delete payload.category;delete payload.name;delete payload.properties;delete payload.options;payload.callback=category;}if(isObjectLiteralAndNotNull(category)){delete payload.name;delete payload.category;payload.properties=category;payload.options=name;}else if(isObjectLiteralAndNotNull(name)){delete payload.name;payload.properties=name;payload.options=!isFunction(properties)?properties:null;}// if the category argument alone is provided b/w category and name,
    // use it as name and set category to undefined
    if(isString(category)&&!isString(name)){delete payload.category;payload.name=category;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    if(!isDefined(payload.category)){delete payload.category;}if(!isDefined(payload.name)){delete payload.name;}payload.properties=payload.properties?clone(payload.properties):{};if(isDefined(payload.options)){payload.options=clone(payload.options);}else {delete payload.options;}// add name and category to properties
    payload.properties=mergeDeepRight(isObjectLiteralAndNotNull(payload.properties)?payload.properties:{},{name:isString(payload.name)?payload.name:null,category:isString(payload.category)?payload.category:null});return payload;};/*
     * Normalise the overloaded arguments of the track call facade
     */const trackArgumentsToCallOptions=(event,properties,options,callback)=>{const payload={name:event,properties:properties,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.properties=properties;delete payload.options;payload.callback=options;}if(isFunction(properties)){delete payload.properties;delete payload.options;payload.callback=properties;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    payload.properties=isDefinedAndNotNull(payload.properties)?clone(payload.properties):{};if(isDefined(payload.options)){payload.options=clone(payload.options);}else {delete payload.options;}return payload;};/*
     * Normalise the overloaded arguments of the identify call facade
     */const identifyArgumentsToCallOptions=(userId,traits,options,callback)=>{const payload={userId:userId,traits:traits,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.userId=userId;payload.traits=traits;delete payload.options;payload.callback=options;}if(isFunction(traits)){payload.userId=userId;delete payload.traits;delete payload.options;payload.callback=traits;}if(isObjectLiteralAndNotNull(userId)||isNull(userId)){// Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.userId=null;payload.traits=userId;payload.options=traits;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    if(isDefined(payload.userId)){payload.userId=tryStringify(payload.userId);}else {delete payload.userId;}if(isObjectLiteralAndNotNull(payload.traits)){payload.traits=clone(payload.traits);}else {delete payload.traits;}if(isDefined(payload.options)){payload.options=clone(payload.options);}else {delete payload.options;}return payload;};/*
     * Normalise the overloaded arguments of the alias call facade
     */const aliasArgumentsToCallOptions=(to,from,options,callback)=>{const payload={to:to,from:from,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.to=to;payload.from=from;delete payload.options;payload.callback=options;}if(isFunction(from)){payload.to=to;delete payload.from;delete payload.options;payload.callback=from;}else if(isObjectLiteralAndNotNull(from)||isNull(from)){payload.to=to;delete payload.from;payload.options=from;}if(isFunction(to)){delete payload.to;delete payload.from;delete payload.options;payload.callback=to;}else if(isObjectLiteralAndNotNull(to)||isNull(to)){delete payload.to;delete payload.from;payload.options=to;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    if(isDefined(payload.to)){payload.to=tryStringify(payload.to);}else {delete payload.to;}if(isDefined(payload.from)){payload.from=tryStringify(payload.from);}else {delete payload.from;}if(isDefined(payload.options)){payload.options=clone(payload.options);}else {delete payload.options;}return payload;};/*
     * Normalise the overloaded arguments of the group call facade
     */const groupArgumentsToCallOptions=(groupId,traits,options,callback)=>{const payload={groupId:groupId,traits:traits,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.groupId=groupId;payload.traits=traits;delete payload.options;payload.callback=options;}if(isFunction(traits)){payload.groupId=groupId;delete payload.traits;delete payload.options;payload.callback=traits;}// TODO: why do we enable overload for group that only passes callback? is there any use case?
    if(isFunction(groupId)){// Explicitly set null to prevent resetting the existing value
    payload.groupId=null;delete payload.traits;delete payload.options;payload.callback=groupId;}else if(isObjectLiteralAndNotNull(groupId)||isNull(groupId)){// Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.groupId=null;payload.traits=groupId;payload.options=!isFunction(traits)?traits:null;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    if(isDefined(payload.groupId)){payload.groupId=tryStringify(payload.groupId);}else {delete payload.groupId;}payload.traits=isObjectLiteralAndNotNull(payload.traits)?clone(payload.traits):{};if(isDefined(payload.options)){payload.options=clone(payload.options);}else {delete payload.options;}return payload;};
    
    const CAPABILITIES_MANAGER='CapabilitiesManager';const CONFIG_MANAGER='ConfigManager';const EVENT_MANAGER='EventManager';const PLUGINS_MANAGER='PluginsManager';const USER_SESSION_MANAGER='UserSessionManager';const ERROR_HANDLER='ErrorHandler';const PLUGIN_ENGINE='PluginEngine';const STORE_MANAGER='StoreManager';const READY_API='readyApi';const EVENT_REPOSITORY='EventRepository';const EXTERNAL_SRC_LOADER='ExternalSrcLoader';const HTTP_CLIENT='HttpClient';const RS_APP='RudderStackApplication';const ANALYTICS_CORE='AnalyticsCore';
    
    const APP_NAME='RudderLabs JavaScript SDK';const APP_VERSION='3.0.4';const APP_NAMESPACE='com.rudderlabs.javascript';const MODULE_TYPE='npm';const ADBLOCK_PAGE_CATEGORY='RudderJS-Initiated';const ADBLOCK_PAGE_NAME='ad-block page request';const ADBLOCK_PAGE_PATH='/ad-blocked';const GLOBAL_PRELOAD_BUFFER='preloadedEventsBuffer';const CONSENT_TRACK_EVENT_NAME='Consent Management Interaction';
    
    const QUERY_PARAM_TRAIT_PREFIX='ajs_trait_';const QUERY_PARAM_PROPERTY_PREFIX='ajs_prop_';const QUERY_PARAM_ANONYMOUS_ID_KEY='ajs_aid';const QUERY_PARAM_USER_ID_KEY='ajs_uid';const QUERY_PARAM_TRACK_EVENT_NAME_KEY='ajs_event';
    
    const DEFAULT_XHR_TIMEOUT_MS=10*1000;// 10 seconds
    const DEFAULT_COOKIE_MAX_AGE_MS=31536000*1000;// 1 year
    const DEFAULT_SESSION_TIMEOUT_MS=30*60*1000;// 30 minutes
    const MIN_SESSION_TIMEOUT_MS=10*1000;// 10 seconds
    const DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS=10*1000;// 10 seconds
    const DEBOUNCED_TIMEOUT_MS=250;// 250 milliseconds
    
    /**
     * Create globally accessible RudderStackGlobals object
     */const createExposedGlobals=(analyticsInstanceId='app')=>{if(!globalThis.RudderStackGlobals){globalThis.RudderStackGlobals={};}if(!globalThis.RudderStackGlobals[analyticsInstanceId]){globalThis.RudderStackGlobals[analyticsInstanceId]={};}};/**
     * Add move values to globally accessible RudderStackGlobals object per analytics instance
     */const setExposedGlobal=(keyName,value,analyticsInstanceId='app')=>{createExposedGlobals(analyticsInstanceId);globalThis.RudderStackGlobals[analyticsInstanceId][keyName]=value;};/**
     * Get values from globally accessible RudderStackGlobals object by analytics instance
     */const getExposedGlobal=(keyName,analyticsInstanceId='app')=>{createExposedGlobals(analyticsInstanceId);return globalThis.RudderStackGlobals[analyticsInstanceId][keyName];};function debounce(func,thisArg,delay=DEBOUNCED_TIMEOUT_MS){let timeoutId;return (...args)=>{globalThis.clearTimeout(timeoutId);timeoutId=globalThis.setTimeout(()=>{func.apply(thisArg,args);},delay);};}
    
    /**
     * Parse query string params into object values for keys that start with a defined prefix
     */const getEventDataFromQueryString=(params,dataTypeNamePrefix)=>{const data={};params.forEach((value,key)=>{if(key.startsWith(dataTypeNamePrefix)){// remove prefix from key name
    const dataKey=key.substring(dataTypeNamePrefix.length);// add new key value pair in generated object
    data[dataKey]=params.get(key);}});return data;};/**
     * Parse query string into preload buffer events & push into existing array before any other events
     */const retrieveEventsFromQueryString=(argumentsArray=[])=>{// Mapping for trait and properties values based on key prefix
    const eventArgumentToQueryParamMap={trait:QUERY_PARAM_TRAIT_PREFIX,properties:QUERY_PARAM_PROPERTY_PREFIX};const queryObject=new URLSearchParams(globalThis.location.search);// Add track events with name and properties
    if(queryObject.get(QUERY_PARAM_TRACK_EVENT_NAME_KEY)){argumentsArray.unshift(['track',queryObject.get(QUERY_PARAM_TRACK_EVENT_NAME_KEY),getEventDataFromQueryString(queryObject,eventArgumentToQueryParamMap.properties)]);}// Set userId and user traits
    if(queryObject.get(QUERY_PARAM_USER_ID_KEY)){argumentsArray.unshift(['identify',queryObject.get(QUERY_PARAM_USER_ID_KEY),getEventDataFromQueryString(queryObject,eventArgumentToQueryParamMap.trait)]);}// Set anonymousID
    if(queryObject.get(QUERY_PARAM_ANONYMOUS_ID_KEY)){argumentsArray.unshift(['setAnonymousId',queryObject.get(QUERY_PARAM_ANONYMOUS_ID_KEY)]);}};/**
     * Retrieve an existing buffered load method call and remove from the existing array
     */const getPreloadedLoadEvent=preloadedEventsArray=>{const loadMethodName='load';let loadEvent=[];/**
       * Iterate the buffered API calls until we find load call and process it separately
       */let i=0;while(i<preloadedEventsArray.length){if(preloadedEventsArray[i]&&preloadedEventsArray[i][0]===loadMethodName){loadEvent=clone(preloadedEventsArray[i]);preloadedEventsArray.splice(i,1);break;}i+=1;}return loadEvent;};/**
     * Promote consent events to the top of the preloaded events array
     * @param preloadedEventsArray Preloaded events array
     * @returns None
     */const promotePreloadedConsentEventsToTop=preloadedEventsArray=>{const consentMethodName='consent';const consentEvents=preloadedEventsArray.filter(bufferedEvent=>bufferedEvent[0]===consentMethodName);const nonConsentEvents=preloadedEventsArray.filter(bufferedEvent=>bufferedEvent[0]!==consentMethodName);// Remove all elements and add consent events first followed by non consent events
    // eslint-disable-next-line unicorn/no-useless-spread
    preloadedEventsArray.splice(0,preloadedEventsArray.length,...consentEvents,...nonConsentEvents);};/**
     * Retrieve any existing events that were triggered before SDK load and enqueue in buffer
     */const retrievePreloadBufferEvents=instance=>{const preloadedEventsArray=getExposedGlobal(GLOBAL_PRELOAD_BUFFER)||[];// Get events that are pre-populated via query string params
    retrieveEventsFromQueryString(preloadedEventsArray);// Enqueue the non load events in the buffer of the global rudder analytics singleton
    if(preloadedEventsArray.length>0){instance.enqueuePreloadBufferEvents(preloadedEventsArray);setExposedGlobal(GLOBAL_PRELOAD_BUFFER,[]);}};const consumePreloadBufferedEvent=(event,analyticsInstance)=>{const methodName=event.shift();let callOptions;if(isFunction(analyticsInstance[methodName])){switch(methodName){case'page':callOptions=pageArgumentsToCallOptions(...event);break;case'track':callOptions=trackArgumentsToCallOptions(...event);break;case'identify':callOptions=identifyArgumentsToCallOptions(...event);break;case'alias':callOptions=aliasArgumentsToCallOptions(...event);break;case'group':callOptions=groupArgumentsToCallOptions(...event);break;default:analyticsInstance[methodName](...event);break;}if(callOptions){analyticsInstance[methodName](callOptions);}}};
    
    const DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS=10*1000;// 10 seconds
    
    const LOG_CONTEXT_SEPARATOR=':: ';const SCRIPT_ALREADY_EXISTS_ERROR=id=>`A script with the id "${id}" is already loaded. Skipping the loading of this script to prevent conflicts.`;const SCRIPT_LOAD_ERROR=(id,url)=>`Failed to load the script with the id "${id}" from URL "${url}".`;const SCRIPT_LOAD_TIMEOUT_ERROR=(id,url,timeout)=>`A timeout of ${timeout} ms occurred while trying to load the script with id "${id}" from URL "${url}".`;const CIRCULAR_REFERENCE_WARNING=(context,key)=>`${context}${LOG_CONTEXT_SEPARATOR}A circular reference has been detected in the object and the property "${key}" has been dropped from the output.`;const JSON_STRINGIFY_WARNING=`Failed to convert the value to a JSON string.`;
    
    const JSON_STRINGIFY='JSONStringify';const getCircularReplacer=(excludeNull,excludeKeys,logger)=>{const ancestors=[];// Here we do not want to use arrow function to use "this" in function context
    // eslint-disable-next-line func-names
    return function(key,value){if(excludeKeys?.includes(key)){return undefined;}if(excludeNull&&isNullOrUndefined(value)){return undefined;}if(typeof value!=='object'||isNull(value)){return value;}// `this` is the object that value is contained in, i.e., its direct parent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    while(ancestors.length>0&&ancestors[ancestors.length-1]!==this){ancestors.pop();}if(ancestors.includes(value)){logger?.warn(CIRCULAR_REFERENCE_WARNING(JSON_STRINGIFY,key));return '[Circular Reference]';}ancestors.push(value);return value;};};/**
     * Utility method for JSON stringify object excluding null values & circular references
     *
     * @param {*} value input
     * @param {boolean} excludeNull if it should exclude nul or not
     * @param {function} logger optional logger methods for warning
     * @returns string
     */const stringifyWithoutCircular=(value,excludeNull,excludeKeys,logger)=>{try{return JSON.stringify(value,getCircularReplacer(excludeNull,excludeKeys,logger));}catch(err){logger?.warn(JSON_STRINGIFY_WARNING,err);return null;}};
    
    /**
     * Get mutated error with issue prepended to error message
     * @param err Original error
     * @param issue Issue to prepend to error message
     * @returns Instance of Error with message prepended with issue
     */const getMutatedError=(err,issue)=>{let finalError=err;if(!isTypeOfError(err)){finalError=new Error(`${issue}: ${stringifyWithoutCircular(err)}`);}else {finalError.message=`${issue}: ${err.message}`;}return finalError;};
    
    const EXTERNAL_SOURCE_LOAD_ORIGIN='RS_JS_SDK';
    
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
     */const createScriptElement=(url,id,async=true,onload=null,onerror=null,extraAttributes={})=>{const scriptElement=document.createElement('script');scriptElement.type='text/javascript';scriptElement.onload=onload;scriptElement.onerror=onerror;scriptElement.src=url;scriptElement.id=id;scriptElement.async=async;scriptElement.setAttribute('data-append-origin',EXTERNAL_SOURCE_LOAD_ORIGIN);Object.keys(extraAttributes).forEach(attributeName=>{scriptElement.setAttribute(attributeName,extraAttributes[attributeName]);});return scriptElement;};/**
     * Add script DOM element to DOM
     *
     * @param {*} newScriptElement the script element to add
     *
     * @returns
     */const insertScript=newScriptElement=>{// First try to add it to the head
    const headElements=document.getElementsByTagName('head');if(headElements.length>0){headElements[0]?.insertBefore(newScriptElement,headElements[0]?.firstChild);return;}// Else wise add it before the first script tag
    const scriptElements=document.getElementsByTagName('script');if(scriptElements.length>0&&scriptElements[0]?.parentNode){scriptElements[0]?.parentNode.insertBefore(newScriptElement,scriptElements[0]);return;}// Create a new head element and add the script as fallback
    const headElement=document.createElement('head');headElement.appendChild(newScriptElement);const htmlElement=document.getElementsByTagName('html')[0];htmlElement?.insertBefore(headElement,htmlElement.firstChild);};/**
     * Loads external js file as a script html tag
     *
     * @param {*} url The URL of the script to be loaded
     * @param {*} id ID for the script tag
     * @param {*} timeout loading timeout
     * @param {*} async Whether to load the script in async mode. Defaults to `true` [optional]
     * @param {*} extraAttributes key/value pair with html attributes to add in html tag [optional]
     *
     * @returns
     */const jsFileLoader=(url,id,timeout,async=true,extraAttributes)=>new Promise((resolve,reject)=>{const scriptExists=document.getElementById(id);if(scriptExists){reject(new Error(SCRIPT_ALREADY_EXISTS_ERROR(id)));}try{let timeoutID;const onload=()=>{globalThis.clearTimeout(timeoutID);resolve(id);};const onerror=()=>{globalThis.clearTimeout(timeoutID);reject(new Error(SCRIPT_LOAD_ERROR(id,url)));};// Create the DOM element to load the script and add it to the DOM
    insertScript(createScriptElement(url,id,async,onload,onerror,extraAttributes));// Reject on timeout
    timeoutID=globalThis.setTimeout(()=>{reject(new Error(SCRIPT_LOAD_TIMEOUT_ERROR(id,url,timeout)));},timeout);}catch(err){reject(getMutatedError(err,SCRIPT_LOAD_ERROR(id,url)));}});
    
    /**
     * Service to load external resources/files
     */class ExternalSrcLoader{hasErrorHandler=false;constructor(errorHandler,logger,timeout=DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS){this.errorHandler=errorHandler;this.logger=logger;this.timeout=timeout;this.hasErrorHandler=Boolean(this.errorHandler);this.onError=this.onError.bind(this);}/**
       * Load external resource of type javascript
       */loadJSFile(config){const{url,id,timeout,async,callback,extraAttributes}=config;const isFireAndForget=!isFunction(callback);jsFileLoader(url,id,timeout||this.timeout,async,extraAttributes).then(id=>{if(!isFireAndForget){callback(id);}}).catch(err=>{this.onError(err);if(!isFireAndForget){callback();}});}/**
       * Handle errors
       */onError(error){if(this.hasErrorHandler){this.errorHandler?.onError(error,EXTERNAL_SRC_LOADER);}else {throw error;}}}
    
    function i(){throw new Error("Cycle detected");}var t=Symbol.for("preact-signals");function r(){if(!(v>1)){var i,t=!1;while(void 0!==f){var r=f;f=void 0;e++;while(void 0!==r){var n=r.o;r.o=void 0;r.f&=-3;if(!(8&r.f)&&l(r))try{r.c();}catch(r){if(!t){i=r;t=!0;}}r=n;}}e=0;v--;if(t)throw i;}else v--;}function n(i){if(v>0)return i();v++;try{return i();}finally{r();}}var o=void 0;var f=void 0,v=0,e=0,u=0;function c(i){if(void 0!==o){var t=i.n;if(void 0===t||t.t!==o){t={i:0,S:i,p:o.s,n:void 0,t:o,e:void 0,x:void 0,r:t};if(void 0!==o.s)o.s.n=t;o.s=t;i.n=t;if(32&o.f)i.S(t);return t;}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=o.s;t.n=void 0;o.s.n=t;o.s=t;}return t;}}}function d$1(i){this.v=i;this.i=0;this.n=void 0;this.t=void 0;}d$1.prototype.brand=t;d$1.prototype.h=function(){return !0;};d$1.prototype.S=function(i){if(this.t!==i&&void 0===i.e){i.x=this.t;if(void 0!==this.t)this.t.e=i;this.t=i;}};d$1.prototype.U=function(i){if(void 0!==this.t){var t=i.e,r=i.x;if(void 0!==t){t.x=r;i.e=void 0;}if(void 0!==r){r.e=t;i.x=void 0;}if(i===this.t)this.t=r;}};d$1.prototype.subscribe=function(i){var t=this;return O(function(){var r=t.value,n=32&this.f;this.f&=-33;try{i(r);}finally{this.f|=n;}});};d$1.prototype.valueOf=function(){return this.value;};d$1.prototype.toString=function(){return this.value+"";};d$1.prototype.toJSON=function(){return this.value;};d$1.prototype.peek=function(){return this.v;};Object.defineProperty(d$1.prototype,"value",{get:function(){var i=c(this);if(void 0!==i)i.i=this.i;return this.v;},set:function(t){if(o instanceof _)!function(){throw new Error("Computed cannot have side-effects");}();if(t!==this.v){if(e>100)i();this.v=t;this.i++;u++;v++;try{for(var n=this.t;void 0!==n;n=n.x)n.t.N();}finally{r();}}}});function a(i){return new d$1(i);}function l(i){for(var t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return !0;return !1;}function y(i){for(var t=i.s;void 0!==t;t=t.n){var r=t.S.n;if(void 0!==r)t.r=r;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break;}}}function w(i){var t=i.s,r=void 0;while(void 0!==t){var n=t.p;if(-1===t.i){t.S.U(t);if(void 0!==n)n.n=t.n;if(void 0!==t.n)t.n.p=n;}else r=t;t.S.n=t.r;if(void 0!==t.r)t.r=void 0;t=n;}i.s=r;}function _(i){d$1.call(this,void 0);this.x=i;this.s=void 0;this.g=u-1;this.f=4;}(_.prototype=new d$1()).h=function(){this.f&=-3;if(1&this.f)return !1;if(32==(36&this.f))return !0;this.f&=-5;if(this.g===u)return !0;this.g=u;this.f|=1;if(this.i>0&&!l(this)){this.f&=-2;return !0;}var i=o;try{y(this);o=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}o=i;w(this);this.f&=-2;return !0;};_.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.S.S(t);}d$1.prototype.S.call(this,i);};_.prototype.U=function(i){if(void 0!==this.t){d$1.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.S.U(t);}}};_.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.N();}};_.prototype.peek=function(){if(!this.h())i();if(16&this.f)throw this.v;return this.v;};Object.defineProperty(_.prototype,"value",{get:function(){if(1&this.f)i();var t=c(this);this.h();if(void 0!==t)t.i=this.i;if(16&this.f)throw this.v;return this.v;}});function g(i){var t=i.u;i.u=void 0;if("function"==typeof t){v++;var n=o;o=void 0;try{t();}catch(t){i.f&=-2;i.f|=8;b(i);throw t;}finally{o=n;r();}}}function b(i){for(var t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;g(i);}function x$1(i){if(o!==this)throw new Error("Out-of-order effect");w(this);o=i;this.f&=-2;if(8&this.f)b(this);r();}function E(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}E.prototype.c=function(){var i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};E.prototype.S=function(){if(1&this.f)i();this.f|=1;this.f&=-9;g(this);y(this);v++;var t=o;o=this;return x$1.bind(this,t);};E.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=f;f=this;}};E.prototype.d=function(){this.f|=8;if(!(1&this.f))b(this);};function O(i){var t=new E(i);try{t.c();}catch(i){t.d();throw i;}return t.d.bind(t);}
    
    /**
     * A buffer queue to serve as a store for any type of data
     */class BufferQueue{constructor(){this.items=[];}enqueue(item){this.items.push(item);}dequeue(){if(this.items.length===0){return null;}return this.items.shift();}isEmpty(){return this.items.length===0;}size(){return this.items.length;}clear(){this.items=[];}}
    
    const LOG_LEVEL_MAP={LOG:0,INFO:1,DEBUG:2,WARN:3,ERROR:4,NONE:5};const DEFAULT_LOG_LEVEL='ERROR';const LOG_MSG_PREFIX='RS SDK';const LOG_MSG_PREFIX_STYLE='font-weight: bold; background: black; color: white;';const LOG_MSG_STYLE='font-weight: normal;';/**
     * Service to log messages/data to output provider, default is console
     */class Logger{constructor(minLogLevel=DEFAULT_LOG_LEVEL,scope='',logProvider=console){this.minLogLevel=LOG_LEVEL_MAP[minLogLevel];this.scope=scope;this.logProvider=logProvider;}log(...data){this.outputLog('LOG',data);}info(...data){this.outputLog('INFO',data);}debug(...data){this.outputLog('DEBUG',data);}warn(...data){this.outputLog('WARN',data);}error(...data){this.outputLog('ERROR',data);}outputLog(logMethod,data){if(this.minLogLevel<=LOG_LEVEL_MAP[logMethod]){this.logProvider[logMethod.toLowerCase()]?.(...this.formatLogData(data));}}setScope(scopeVal){this.scope=scopeVal||this.scope;}// TODO: should we allow to change the level via global variable on run time
    //  to assist on the fly debugging?
    setMinLogLevel(logLevel){this.minLogLevel=LOG_LEVEL_MAP[logLevel];if(isUndefined(this.minLogLevel)){this.minLogLevel=LOG_LEVEL_MAP[DEFAULT_LOG_LEVEL];}}/**
       * Formats the console message using `scope` and styles
       */formatLogData(data){if(Array.isArray(data)&&data.length>0){// prefix SDK identifier
    let msg=`%c ${LOG_MSG_PREFIX}`;// format the log message using `scope`
    if(this.scope){msg=`${msg} - ${this.scope}`;}// trim whitespaces for original message
    const originalMsg=isString(data[0])?data[0].trim():'';// prepare the final message
    msg=`${msg} %c ${originalMsg}`;const styledLogArgs=[msg,LOG_MSG_PREFIX_STYLE,// add style for the prefix
    LOG_MSG_STYLE// reset the style for the actual message
    ];// add first it if it was not a string msg
    if(!isString(data[0])){styledLogArgs.push(data[0]);}// append rest of the original arguments
    styledLogArgs.push(...data.slice(1));return styledLogArgs;}return data;}}const defaultLogger=new Logger();
    
    // default is v3
    const SUPPORTED_STORAGE_TYPES=['localStorage','memoryStorage','cookieStorage','sessionStorage','none'];const DEFAULT_STORAGE_TYPE='cookieStorage';
    
    const SOURCE_CONFIG_OPTION_ERROR=`"getSourceConfig" must be a function. Please make sure that it is defined and returns a valid source configuration object.`;const INTG_CDN_BASE_URL_ERROR=`Failed to load the SDK as the CDN base URL for integrations is not valid.`;const PLUGINS_CDN_BASE_URL_ERROR=`Failed to load the SDK as the CDN base URL for plugins is not valid.`;const DATA_PLANE_URL_ERROR=`Failed to load the SDK as the data plane URL could not be determined. Please check that the data plane URL is set correctly and try again.`;const SOURCE_CONFIG_RESOLUTION_ERROR=`Unable to process/parse source configuration response.`;const XHR_PAYLOAD_PREP_ERROR=`Failed to prepare data for the request.`;const EVENT_OBJECT_GENERATION_ERROR=`Failed to generate the event object.`;const PLUGIN_EXT_POINT_MISSING_ERROR=`Failed to invoke plugin because the extension point name is missing.`;const PLUGIN_EXT_POINT_INVALID_ERROR=`Failed to invoke plugin because the extension point name is invalid.`;// ERROR
    const UNSUPPORTED_CONSENT_MANAGER_ERROR=(context,selectedConsentManager,consentManagersToPluginNameMap)=>`${context}${LOG_CONTEXT_SEPARATOR}The consent manager "${selectedConsentManager}" is not supported. Please choose one of the following supported consent managers: "${Object.keys(consentManagersToPluginNameMap)}".`;const REPORTING_PLUGIN_INIT_FAILURE_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to initialize the error reporting plugin.`;const NOTIFY_FAILURE_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to notify the error.`;const PLUGIN_NAME_MISSING_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin name is missing.`;const PLUGIN_ALREADY_EXISTS_ERROR=(context,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" already exists.`;const PLUGIN_NOT_FOUND_ERROR=(context,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" not found.`;const PLUGIN_ENGINE_BUG_ERROR=(context,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" not found in plugins but found in byName. This indicates a bug in the plugin engine. Please report this issue to the development team.`;const PLUGIN_DEPS_ERROR=(context,pluginName,notExistDeps)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" could not be loaded because some of its dependencies "${notExistDeps}" do not exist.`;const PLUGIN_INVOCATION_ERROR=(context,extPoint,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to invoke the "${extPoint}" extension point of plugin "${pluginName}".`;const STORAGE_UNAVAILABILITY_ERROR_PREFIX=(context,storageType)=>`${context}${LOG_CONTEXT_SEPARATOR}The "${storageType}" storage type is `;const SOURCE_CONFIG_FETCH_ERROR=reason=>`Failed to fetch the source config. Reason: ${reason}`;const WRITE_KEY_VALIDATION_ERROR=writeKey=>`The write key "${writeKey}" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.`;const DATA_PLANE_URL_VALIDATION_ERROR=dataPlaneUrl=>`The data plane URL "${dataPlaneUrl}" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.`;const READY_API_CALLBACK_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}The callback is not a function.`;const XHR_DELIVERY_ERROR=(prefix,status,statusText,url)=>`${prefix} with status: ${status}, ${statusText} for URL: ${url}.`;const XHR_REQUEST_ERROR=(prefix,e,url)=>`${prefix} due to timeout or no connection (${e?e.type:''}) for URL: ${url}.`;const XHR_SEND_ERROR=(prefix,url)=>`${prefix} for URL: ${url}`;const STORE_DATA_SAVE_ERROR=key=>`Failed to save the value for "${key}" to storage`;const STORE_DATA_FETCH_ERROR=key=>`Failed to retrieve or parse data for "${key}" from storage`;// WARNING
    const STORAGE_TYPE_VALIDATION_WARNING=(context,storageType,defaultStorageType)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage type "${storageType}" is not supported. Please choose one of the following supported types: "${SUPPORTED_STORAGE_TYPES}". The default type "${defaultStorageType}" will be used instead.`;const UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING=(context,selectedErrorReportingProvider,errorReportingProvidersToPluginNameMap,defaultProvider)=>`${context}${LOG_CONTEXT_SEPARATOR}The error reporting provider "${selectedErrorReportingProvider}" is not supported. Please choose one of the following supported providers: "${Object.keys(errorReportingProvidersToPluginNameMap)}". The default provider "${defaultProvider}" will be used instead.`;const UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING=(context,selectedStorageEncryptionVersion,storageEncryptionVersionsToPluginNameMap,defaultVersion)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage encryption version "${selectedStorageEncryptionVersion}" is not supported. Please choose one of the following supported versions: "${Object.keys(storageEncryptionVersionsToPluginNameMap)}". The default version "${defaultVersion}" will be used instead.`;const STORAGE_DATA_MIGRATION_OVERRIDE_WARNING=(context,storageEncryptionVersion,defaultVersion)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage data migration has been disabled because the configured storage encryption version (${storageEncryptionVersion}) is not the latest (${defaultVersion}). To enable storage data migration, please update the storage encryption version to the latest version.`;const UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING=(context,selectedResidencyServerRegion,defaultRegion)=>`${context}${LOG_CONTEXT_SEPARATOR}The residency server region "${selectedResidencyServerRegion}" is not supported. Please choose one of the following supported regions: "US, EU". The default region "${defaultRegion}" will be used instead.`;const RESERVED_KEYWORD_WARNING=(context,property,parentKeyPath,reservedElements)=>`${context}${LOG_CONTEXT_SEPARATOR}The "${property}" property defined under "${parentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (${reservedElements}).`;const INVALID_CONTEXT_OBJECT_WARNING=logContext=>`${logContext}${LOG_CONTEXT_SEPARATOR}Please make sure that the "context" property in the event API's "options" argument is a valid object literal with key-value pairs.`;const UNSUPPORTED_BEACON_API_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}The Beacon API is not supported by your browser. The events will be sent using XHR instead.`;const TIMEOUT_NOT_NUMBER_WARNING=(context,timeout,defaultValue)=>`${context}${LOG_CONTEXT_SEPARATOR}The session timeout value "${timeout}" is not a number. The default timeout of ${defaultValue} ms will be used instead.`;const TIMEOUT_ZERO_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}The session timeout value is 0, which disables the automatic session tracking feature. If you want to enable session tracking, please provide a positive integer value for the timeout.`;const TIMEOUT_NOT_RECOMMENDED_WARNING=(context,timeout,minTimeout)=>`${context}${LOG_CONTEXT_SEPARATOR}The session timeout value ${timeout} ms is less than the recommended minimum of ${minTimeout} ms. Please consider increasing the timeout value to ensure optimal performance and reliability.`;const INVALID_SESSION_ID_WARNING=(context,sessionId,minSessionIdLength)=>`${context}${LOG_CONTEXT_SEPARATOR}The provided session ID (${sessionId}) is either invalid, not a positive integer, or not at least "${minSessionIdLength}" digits long. A new session ID will be auto-generated instead.`;const STORAGE_QUOTA_EXCEEDED_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}The storage is either full or unavailable, so the data will not be persisted. Switching to in-memory storage.`;const STORAGE_UNAVAILABLE_WARNING=(context,entry,selectedStorageType,finalStorageType)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage type "${selectedStorageType}" is not available for entry "${entry}". The SDK will initialize the entry with "${finalStorageType}" storage type instead.`;const WRITE_KEY_NOT_A_STRING_ERROR=(context,writeKey)=>`${context}${LOG_CONTEXT_SEPARATOR}The write key "${writeKey}" is not a string. Please check that the write key is correct and try again.`;const EMPTY_GROUP_CALL_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}The group() method must be called with at least one argument.`;const READY_CALLBACK_INVOKE_ERROR=`Failed to invoke the ready callback`;const API_CALLBACK_INVOKE_ERROR=`API Callback Invocation Failed`;const NATIVE_DEST_PLUGIN_INITIALIZE_ERROR=`NativeDestinationQueuePlugin initialization failed`;const DATAPLANE_PLUGIN_INITIALIZE_ERROR=`XhrQueuePlugin initialization failed`;const DMT_PLUGIN_INITIALIZE_ERROR=`DeviceModeTransformationPlugin initialization failed`;const NATIVE_DEST_PLUGIN_ENQUEUE_ERROR=`NativeDestinationQueuePlugin event enqueue failed`;const DATAPLANE_PLUGIN_ENQUEUE_ERROR=`XhrQueuePlugin event enqueue failed`;const INVALID_CONFIG_URL_WARNING=(context,configUrl)=>`${context}${LOG_CONTEXT_SEPARATOR}The provided config URL "${configUrl}" is invalid. Using the default value instead.`;const POLYFILL_SCRIPT_LOAD_ERROR=(scriptId,url)=>`Failed to load the polyfill script with ID "${scriptId}" from URL ${url}.`;const COOKIE_DATA_ENCODING_ERROR=`Failed to encode the cookie data.`;const UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY=(context,selectedStrategy,defaultStrategy)=>`${context}${LOG_CONTEXT_SEPARATOR}The pre-consent storage strategy "${selectedStrategy}" is not supported. Please choose one of the following supported strategies: "none, session, anonymousId". The default strategy "${defaultStrategy}" will be used instead.`;const UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE=(context,selectedDeliveryType,defaultDeliveryType)=>`${context}${LOG_CONTEXT_SEPARATOR}The pre-consent events delivery type "${selectedDeliveryType}" is not supported. Please choose one of the following supported types: "immediate, buffer". The default type "${defaultDeliveryType}" will be used instead.`;// DEBUG
    
    const CDN_INT_DIR='js-integrations';const CDN_PLUGINS_DIR='plugins';
    
    const BUILD_TYPE='modern';const SDK_CDN_BASE_URL='https://cdn.rudderlabs.com';const CDN_ARCH_VERSION_DIR='v3';const DEST_SDK_BASE_URL=`${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_INT_DIR}`;const PLUGINS_BASE_URL=`${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;const DEFAULT_CONFIG_BE_URL='https://api.rudderstack.com';
    
    const DEFAULT_ERROR_REPORTING_PROVIDER='bugsnag';const DEFAULT_STORAGE_ENCRYPTION_VERSION='v3';const ConsentManagersToPluginNameMap={oneTrust:'OneTrustConsentManager',ketch:'KetchConsentManager',custom:'CustomConsentManager'};const ErrorReportingProvidersToPluginNameMap={[DEFAULT_ERROR_REPORTING_PROVIDER]:'Bugsnag'};const StorageEncryptionVersionsToPluginNameMap={[DEFAULT_STORAGE_ENCRYPTION_VERSION]:'StorageEncryption',legacy:'StorageEncryptionLegacy'};
    
    const defaultLoadOptions={logLevel:'ERROR',configUrl:DEFAULT_CONFIG_BE_URL,loadIntegration:true,sessions:{autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS},sameSiteCookie:'Lax',polyfillIfRequired:true,integrations:{All:true},useBeacon:false,beaconQueueOptions:{},destinationsQueueOptions:{},queueOptions:{},lockIntegrationsVersion:false,uaChTrackLevel:'none',plugins:[],useGlobalIntegrationsConfigInEvents:false,bufferDataPlaneEventsUntilReady:false,dataPlaneEventsBufferTimeout:DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,storage:{encryption:{version:DEFAULT_STORAGE_ENCRYPTION_VERSION},migrate:true},sendAdblockPageOptions:{}};const loadOptionsState=a(clone(defaultLoadOptions));
    
    const USER_SESSION_STORAGE_KEYS={userId:'rl_user_id',userTraits:'rl_trait',anonymousId:'rl_anonymous_id',groupId:'rl_group_id',groupTraits:'rl_group_trait',initialReferrer:'rl_page_init_referrer',initialReferringDomain:'rl_page_init_referring_domain',sessionInfo:'rl_session',authToken:'rl_auth_token'};const DEFAULT_USER_SESSION_VALUES={userId:'',userTraits:{},anonymousId:'',groupId:'',groupTraits:{},initialReferrer:'',initialReferringDomain:'',sessionInfo:{},authToken:null};
    
    const defaultSessionInfo={autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS};const sessionState={userId:a(DEFAULT_USER_SESSION_VALUES.userId),userTraits:a(DEFAULT_USER_SESSION_VALUES.userTraits),anonymousId:a(DEFAULT_USER_SESSION_VALUES.anonymousId),groupId:a(DEFAULT_USER_SESSION_VALUES.groupId),groupTraits:a(DEFAULT_USER_SESSION_VALUES.groupTraits),initialReferrer:a(DEFAULT_USER_SESSION_VALUES.initialReferrer),initialReferringDomain:a(DEFAULT_USER_SESSION_VALUES.initialReferringDomain),sessionInfo:a(DEFAULT_USER_SESSION_VALUES.sessionInfo),authToken:a(DEFAULT_USER_SESSION_VALUES.authToken)};
    
    const capabilitiesState={isOnline:a(true),storage:{isLocalStorageAvailable:a(false),isCookieStorageAvailable:a(false),isSessionStorageAvailable:a(false)},isBeaconAvailable:a(false),isLegacyDOM:a(false),isUaCHAvailable:a(false),isCryptoAvailable:a(false),isIE11:a(false),isAdBlocked:a(false)};
    
    const reportingState={isErrorReportingEnabled:a(false),isMetricsReportingEnabled:a(false),errorReportingProviderPluginName:a(undefined),isErrorReportingPluginLoaded:a(false)};
    
    const sourceConfigState=a(undefined);
    
    const lifecycleState={activeDataplaneUrl:a(undefined),integrationsCDNPath:a(DEST_SDK_BASE_URL),pluginsCDNPath:a(PLUGINS_BASE_URL),sourceConfigUrl:a(undefined),status:a(undefined),initialized:a(false),logLevel:a('ERROR'),loaded:a(false),readyCallbacks:a([]),writeKey:a(undefined),dataPlaneUrl:a(undefined)};
    
    const consentsState={enabled:a(false),initialized:a(false),data:a({}),activeConsentManagerPluginName:a(undefined),preConsent:a({enabled:false}),postConsent:a({}),resolutionStrategy:a('and'),provider:a(undefined),metadata:a(undefined)};
    
    const metricsState={retries:a(0),dropped:a(0),sent:a(0),queued:a(0),triggered:a(0)};
    
    const contextState={app:a({name:APP_NAME,namespace:APP_NAMESPACE,version:APP_VERSION}),traits:a(null),library:a({name:APP_NAME,version:APP_VERSION,snippetVersion:globalThis.RudderSnippetVersion}),userAgent:a(''),device:a(null),network:a(null),os:a({name:'',version:''}),locale:a(null),screen:a({density:0,width:0,height:0,innerWidth:0,innerHeight:0}),'ua-ch':a(undefined),timezone:a(undefined)};
    
    const nativeDestinationsState={configuredDestinations:a([]),activeDestinations:a([]),loadOnlyIntegrations:a({}),failedDestinations:a([]),loadIntegration:a(true),initializedDestinations:a([]),clientDestinationsReady:a(false),integrationsConfig:a({})};
    
    const eventBufferState={toBeProcessedArray:a([]),readyCallbacksArray:a([])};
    
    const pluginsState={ready:a(false),loadedPlugins:a([]),failedPlugins:a([]),pluginsToLoadFromConfig:a([]),activePlugins:a([]),totalPluginsToLoad:a(0)};
    
    const storageState={encryptionPluginName:a(undefined),migrate:a(false),type:a(undefined),cookie:a(undefined),entries:a({}),trulyAnonymousTracking:a(false)};
    
    const defaultStateValues={capabilities:capabilitiesState,consents:consentsState,context:contextState,eventBuffer:eventBufferState,lifecycle:lifecycleState,loadOptions:loadOptionsState,metrics:metricsState,nativeDestinations:nativeDestinationsState,plugins:pluginsState,reporting:reportingState,session:sessionState,source:sourceConfigState,storage:storageState};const state={...clone(defaultStateValues)};
    
    //  to next or return the value if it is the last one instead of an array per
    //  plugin that is the normal invoke
    // TODO: add invoke method for extension point that we know only one plugin can be used. add invokeMultiple and invokeSingle methods
    class PluginEngine{plugins=[];byName={};cache={};config={throws:true};constructor(options={},logger){this.config={throws:true,...options};this.logger=logger;}register(plugin,state){if(!plugin.name){const errorMessage=PLUGIN_NAME_MISSING_ERROR(PLUGIN_ENGINE);if(this.config.throws){throw new Error(errorMessage);}else {this.logger?.error(errorMessage,plugin);}}if(this.byName[plugin.name]){const errorMessage=PLUGIN_ALREADY_EXISTS_ERROR(PLUGIN_ENGINE,plugin.name);if(this.config.throws){throw new Error(errorMessage);}else {this.logger?.error(errorMessage);}}this.cache={};this.plugins=this.plugins.slice();let pos=this.plugins.length;this.plugins.forEach((pluginItem,index)=>{if(pluginItem.deps?.includes(plugin.name)){pos=Math.min(pos,index);}});this.plugins.splice(pos,0,plugin);this.byName[plugin.name]=plugin;if(isFunction(plugin.initialize)){plugin.initialize(state);}}unregister(name){const plugin=this.byName[name];if(!plugin){const errorMessage=PLUGIN_NOT_FOUND_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(errorMessage);}else {this.logger?.error(errorMessage);}}const index=this.plugins.indexOf(plugin);if(index===-1){const errorMessage=PLUGIN_ENGINE_BUG_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(errorMessage);}else {this.logger?.error(errorMessage);}}this.cache={};delete this.byName[name];this.plugins=this.plugins.slice();this.plugins.splice(index,1);}getPlugin(name){return this.byName[name];}getPlugins(extPoint){const lifeCycleName=extPoint??'.';if(!this.cache[lifeCycleName]){this.cache[lifeCycleName]=this.plugins.filter(plugin=>{if(plugin.deps?.some(dependency=>!this.byName[dependency])){// If deps not exist, then not load it.
    const notExistDeps=plugin.deps.filter(dependency=>!this.byName[dependency]);this.logger?.error(PLUGIN_DEPS_ERROR(PLUGIN_ENGINE,plugin.name,notExistDeps));return false;}return lifeCycleName==='.'?true:hasValueByPath(plugin,lifeCycleName);});}return this.cache[lifeCycleName];}// This method allows to process this.plugins so that it could
    // do some unified pre-process before application starts.
    processRawPlugins(callback){callback(this.plugins);this.cache={};}invoke(extPoint,allowMultiple=true,...args){let extensionPointName=extPoint;if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_MISSING_ERROR);}const noCall=extensionPointName.startsWith('!');const throws=this.config.throws??extensionPointName.endsWith('!');// eslint-disable-next-line unicorn/better-regex
    extensionPointName=extensionPointName.replace(/(^!|!$)/g,'');if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_INVALID_ERROR);}const extensionPointNameParts=extensionPointName.split('.');extensionPointNameParts.pop();const pluginMethodPath=extensionPointNameParts.join('.');const pluginsToInvoke=allowMultiple?this.getPlugins(extensionPointName):[this.getPlugins(extensionPointName)[0]];return pluginsToInvoke.map(plugin=>{const method=getValueByPath(plugin,extensionPointName);if(!isFunction(method)||noCall){return method;}try{return method.apply(getValueByPath(plugin,pluginMethodPath),args);}catch(err){// When a plugin failed, doesn't break the app
    if(throws){throw err;}else {this.logger?.error(PLUGIN_INVOCATION_ERROR(PLUGIN_ENGINE,extensionPointName,plugin.name),err);}}return null;});}invokeSingle(extPoint,...args){return this.invoke(extPoint,false,...args)[0];}invokeMultiple(extPoint,...args){return this.invoke(extPoint,true,...args);}}const defaultPluginEngine=new PluginEngine({throws:true},defaultLogger);
    
    const FAILED_REQUEST_ERR_MSG_PREFIX='The request failed';const ERROR_MESSAGES_TO_BE_FILTERED=[FAILED_REQUEST_ERR_MSG_PREFIX];
    
    const LOAD_ORIGIN='RS_JS_SDK';
    
    /**
     * Utility method to normalise errors
     */const processError=error=>{let errorMessage;try{if(isString(error)){errorMessage=error;}else if(error instanceof Error){errorMessage=error.message;}else if(error instanceof ErrorEvent){errorMessage=error.message;}// TODO: remove this block once all device mode integrations start using the v3 script loader module (TS)
    else if(error instanceof Event){const eventTarget=error.target;// Discard all the non-script loading errors
    if(eventTarget&&eventTarget.localName!=='script'){return '';}// Discard script errors that are not originated at SDK or from native SDKs
    if(eventTarget?.dataset&&(eventTarget.dataset.loader!==LOAD_ORIGIN||eventTarget.dataset.isnonnativesdk!=='true')){return '';}errorMessage=`Error in loading a third-party script from URL ${eventTarget?.src} with ID ${eventTarget?.id}.`;}else {errorMessage=error.message?error.message:stringifyWithoutCircular(error);}}catch(e){errorMessage=`Unknown error: ${e.message}`;}return errorMessage;};/**
     * A function to determine whether the error should be promoted to notify or not
     * @param {Error} error
     * @returns
     */const isAllowedToBeNotified=error=>{if(error.message){return !ERROR_MESSAGES_TO_BE_FILTERED.some(e=>error.message.includes(e));}return true;};
    
    /**
     * A service to handle errors
     */class ErrorHandler{// If no logger is passed errors will be thrown as unhandled error
    constructor(logger,pluginEngine){this.logger=logger;this.pluginEngine=pluginEngine;this.errorBuffer=new BufferQueue();this.attachEffect();}attachEffect(){if(state.reporting.isErrorReportingPluginLoaded.value===true){while(this.errorBuffer.size()>0){this.errorBuffer.dequeue();}}}attachErrorListeners(){if('addEventListener'in globalThis){globalThis.addEventListener('error',event=>{this.onError(event,undefined,undefined,undefined,'unhandledException');});globalThis.addEventListener('unhandledrejection',event=>{this.onError(event,undefined,undefined,undefined,'unhandledPromiseRejection');});}else {this.logger?.debug(`Failed to attach global error listeners.`);}}init(externalSrcLoader){if(!this.pluginEngine){return;}try{const extPoint='errorReporting.init';const errReportingInitVal=this.pluginEngine.invokeSingle(extPoint,state,this.pluginEngine,externalSrcLoader,this.logger);if(errReportingInitVal instanceof Promise){errReportingInitVal.then(client=>{this.errReportingClient=client;}).catch(err=>{this.logger?.error(REPORTING_PLUGIN_INIT_FAILURE_ERROR(ERROR_HANDLER),err);});}}catch(err){this.onError(err,ERROR_HANDLER);}}onError(error,context='',customMessage='',shouldAlwaysThrow=false,errorType='handled'){// Error handling is already implemented in processError method
    let errorMessage=processError(error);// If no error message after we normalize, then we swallow/ignore the errors
    if(!errorMessage){return;}// eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMessage=removeDoubleSpaces(`${context}${LOG_CONTEXT_SEPARATOR}${customMessage} ${errorMessage}`);let normalizedError=new Error(errorMessage);if(isTypeOfError(error)){normalizedError=Object.create(error,{message:{value:errorMessage}});}if(errorType==='handled'){// TODO: Remove the below line once the new Reporting plugin is ready
    this.notifyError(normalizedError);if(this.logger){this.logger.error(errorMessage);if(shouldAlwaysThrow){throw normalizedError;}}else {throw normalizedError;}}// eslint-disable-next-line sonarjs/no-all-duplicated-branches
    if(state.reporting.isErrorReportingEnabled.value&&!state.reporting.isErrorReportingPluginLoaded.value);}/**
       * Add breadcrumbs to add insight of a user's journey before an error
       * occurred and send to external error monitoring service via a plugin
       *
       * @param {string} breadcrumb breadcrumbs message
       */leaveBreadcrumb(breadcrumb){if(this.pluginEngine){try{this.pluginEngine.invokeSingle('errorReporting.breadcrumb',this.pluginEngine,this.errReportingClient,breadcrumb,this.logger);}catch(err){this.onError(err,ERROR_HANDLER,'errorReporting.breadcrumb');}}}/**
       * Send handled errors to external error monitoring service via a plugin
       *
       * @param {Error} error Error instance from handled error
       */notifyError(error){if(this.pluginEngine&&isAllowedToBeNotified(error)){try{this.pluginEngine.invokeSingle('errorReporting.notify',this.pluginEngine,this.errReportingClient,error,state,this.logger);}catch(err){// Not calling onError here as we don't want to go into infinite loop
    this.logger?.error(NOTIFY_FAILURE_ERROR(ERROR_HANDLER),err);}}}}const defaultErrorHandler=new ErrorHandler(defaultLogger,defaultPluginEngine);
    
    /**
     * A function to filter and return non cloud mode destinations
     * @param destination
     *
     * @returns boolean
     */const isNonCloudDestination=destination=>Boolean(destination.config.connectionMode!=='cloud'||destination.config.useNativeSDKToSend===true||// this is the older flag for hybrid mode destinations
    destination.config.useNativeSDK===true);const isHybridModeDestination=destination=>Boolean(destination.config.connectionMode==='hybrid'||destination.config.useNativeSDKToSend===true);/**
     * A function to filter and return non cloud mode destinations
     * @param destinations
     *
     * @returns destinations
     */const getNonCloudDestinations=destinations=>destinations.filter(isNonCloudDestination);
    
    /**
     * List of plugin names that are loaded as dynamic imports in modern builds
     */const pluginNamesList=['BeaconQueue','Bugsnag','CustomConsentManager','DeviceModeDestinations','DeviceModeTransformation','ErrorReporting','ExternalAnonymousId','GoogleLinker','KetchConsentManager','NativeDestinationQueue','OneTrustConsentManager','StorageEncryption','StorageEncryptionLegacy','StorageMigrator','XhrQueue'];
    
    /**
     * To get the current timestamp in ISO string format
     * @returns ISO formatted timestamp string
     */const getCurrentTimeFormatted=()=>{const curDateTime=new Date().toISOString();return curDateTime;};
    
    const COOKIE_STORAGE='cookieStorage';const LOCAL_STORAGE='localStorage';const SESSION_STORAGE='sessionStorage';const MEMORY_STORAGE='memoryStorage';const NO_STORAGE='none';
    
    const removeDuplicateSlashes=str=>str.replace(/\/{2,}/g,'/');
    
    function random(len){return crypto.getRandomValues(new Uint8Array(len));}
    
    var SIZE=4096,HEX$1=[],IDX$1=0,BUFFER$1;for(;IDX$1<256;IDX$1++){HEX$1[IDX$1]=(IDX$1+256).toString(16).substring(1);}function v4$1(){if(!BUFFER$1||IDX$1+16>SIZE){BUFFER$1=random(SIZE);IDX$1=0;}var i=0,tmp,out='';for(;i<16;i++){tmp=BUFFER$1[IDX$1+i];if(i==6)out+=HEX$1[tmp&15|64];else if(i==8)out+=HEX$1[tmp&63|128];else out+=HEX$1[tmp];if(i&1&&i>1&&i<11)out+='-';}IDX$1+=16;return out;}
    
    var IDX=256,HEX=[],BUFFER;while(IDX--)HEX[IDX]=(IDX+256).toString(16).substring(1);function v4(){var i=0,num,out='';if(!BUFFER||IDX+16>256){BUFFER=Array(i=256);while(i--)BUFFER[i]=256*Math.random()|0;i=IDX=0;}for(;i<16;i++){num=BUFFER[IDX+i];if(i==6)out+=HEX[num&15|64];else if(i==8)out+=HEX[num&63|128];else out+=HEX[num];if(i&1&&i>1&&i<11)out+='-';}IDX++;return out;}
    
    const hasCrypto$1=()=>!isNullOrUndefined(globalThis.crypto)&&isFunction(globalThis.crypto.getRandomValues);
    
    const generateUUID=()=>{if(hasCrypto$1()){return v4$1();}return v4();};
    
    const isErrRetryable=details=>{let isRetryableNWFailure=false;if(details?.error&&details?.xhr){const xhrStatus=details.xhr.status;// same as in v1.1
    isRetryableNWFailure=xhrStatus===429||xhrStatus>=500&&xhrStatus<600;}return isRetryableNWFailure;};
    
    const EVENT_PAYLOAD_SIZE_BYTES_LIMIT=32*1024;// 32 KB
    
    const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING=(context,payloadSize,sizeLimit)=>`${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;const EVENT_PAYLOAD_SIZE_VALIDATION_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.`;const QUEUE_UTILITIES='QueueUtilities';/**
     * Utility to get the stringified event payload
     * @param event RudderEvent object
     * @param logger Logger instance
     * @returns stringified event payload. Empty string if error occurs.
     */const getDeliveryPayload=(event,logger)=>stringifyWithoutCircular(event,true,undefined,logger);const getDMTDeliveryPayload=(dmtRequestPayload,logger)=>stringifyWithoutCircular(dmtRequestPayload,true,undefined,logger);/**
     * Utility to validate final payload size before sending to server
     * @param event RudderEvent object
     * @param logger Logger instance
     */const validateEventPayloadSize=(event,logger)=>{const payloadStr=getDeliveryPayload(event,logger);if(payloadStr){const payloadSize=payloadStr.length;if(payloadSize>EVENT_PAYLOAD_SIZE_BYTES_LIMIT){logger?.warn(EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(QUEUE_UTILITIES,payloadSize,EVENT_PAYLOAD_SIZE_BYTES_LIMIT));}}else {logger?.warn(EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(QUEUE_UTILITIES));}};/**
     * Mutates the event and return final event for delivery
     * Updates certain parameters like sentAt timestamp, integrations config etc.
     * @param event RudderEvent object
     * @returns Final event ready to be delivered
     */const getFinalEventForDeliveryMutator=(event,currentTime)=>{const finalEvent=clone(event);// Update sentAt timestamp to the latest timestamp
    finalEvent.sentAt=currentTime;return finalEvent;};
    
    const ENCRYPTION_PREFIX_V3='RS_ENC_v3_';
    
    const encrypt$1=value=>`${ENCRYPTION_PREFIX_V3}${toBase64(value)}`;const decrypt$1=value=>{if(value.startsWith(ENCRYPTION_PREFIX_V3)){return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));}return value;};
    
    const BEACON_PLUGIN_EVENTS_QUEUE_DEBUG=context=>`${context}${LOG_CONTEXT_SEPARATOR}Sending events to data plane.`;const BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to convert events batch object to string.`;const BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to convert events batch object to Blob.`;const BEACON_QUEUE_SEND_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to send events batch data to the browser's beacon queue. The events will be dropped.`;const BEACON_QUEUE_DELIVERY_ERROR=url=>`Failed to send events batch data to the browser's beacon queue for URL ${url}.`;
    
    const DEFAULT_BEACON_QUEUE_MAX_SIZE=10;const DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL_MS=10*60*1000;// 10 minutes
    // Limit of the Beacon transfer mechanism on the browsers
    const MAX_BATCH_PAYLOAD_SIZE_BYTES=64*1024;// 64 KB
    const DEFAULT_BEACON_QUEUE_OPTIONS={maxItems:DEFAULT_BEACON_QUEUE_MAX_SIZE,flushQueueInterval:DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL_MS};const DATA_PLANE_API_VERSION$1='v1';const QUEUE_NAME$3='rudder_beacon';const BEACON_QUEUE_PLUGIN='BeaconQueuePlugin';
    
    /**
     * Utility to get the stringified event payload as Blob
     * @param events RudderEvent object array
     * @param logger Logger instance
     * @returns stringified events payload as Blob, undefined if error occurs.
     */const getBatchDeliveryPayload$1=(events,currentTime,logger)=>{const data={batch:events,sentAt:currentTime};try{const blobPayload=stringifyWithoutCircular(data,true);const blobOptions={type:'text/plain'};if(blobPayload){return new Blob([blobPayload],blobOptions);}logger?.error(BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN));}catch(err){logger?.error(BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN),err);}return undefined;};const getNormalizedBeaconQueueOptions=queueOpts=>mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS,queueOpts);const getDeliveryUrl$1=(dataplaneUrl,writeKey)=>{const dpUrl=new URL(dataplaneUrl);return new URL(removeDuplicateSlashes([dpUrl.pathname,'/','beacon','/',DATA_PLANE_API_VERSION$1,'/',`batch?writeKey=${writeKey}`].join('')),dpUrl).href;};
    
    const QueueStatuses={IN_PROGRESS:'inProgress',QUEUE:'queue',RECLAIM_START:'reclaimStart',RECLAIM_END:'reclaimEnd',ACK:'ack',BATCH_QUEUE:'batchQueue'};
    
    let ScheduleModes=/*#__PURE__*/function(ScheduleModes){ScheduleModes[ScheduleModes["ASAP"]=1]="ASAP";ScheduleModes[ScheduleModes["RESCHEDULE"]=2]="RESCHEDULE";ScheduleModes[ScheduleModes["ABANDON"]=3]="ABANDON";return ScheduleModes;}({});const DEFAULT_CLOCK_LATE_FACTOR=2;const DEFAULT_CLOCK={setTimeout(fn,ms){return globalThis.setTimeout(fn,ms);},clearTimeout(id){return globalThis.clearTimeout(id);},Date:globalThis.Date,clockLateFactor:DEFAULT_CLOCK_LATE_FACTOR};class Schedule{constructor(){this.tasks={};this.nextId=1;this.clock=DEFAULT_CLOCK;}now(){return +new this.clock.Date();}run(task,timeout,mode){const id=(this.nextId+1).toString();this.tasks[id]=this.clock.setTimeout(this.handle(id,task,timeout,mode||ScheduleModes.ASAP),timeout);return id;}handle(id,callback,timeout,mode){const start=this.now();return ()=>{delete this.tasks[id];const elapsedTimeoutTime=start+timeout*(this.clock.clockLateFactor||DEFAULT_CLOCK_LATE_FACTOR);const currentTime=this.now();const notCompletedOrTimedOut=mode>=ScheduleModes.RESCHEDULE&&elapsedTimeoutTime<currentTime;if(notCompletedOrTimedOut){if(mode===ScheduleModes.RESCHEDULE){this.run(callback,timeout,mode);}return undefined;}return callback();};}cancel(id){if(this.tasks[id]){this.clock.clearTimeout(this.tasks[id]);delete this.tasks[id];}}cancelAll(){Object.values(this.tasks).forEach(this.clock.clearTimeout);this.tasks={};}}
    
    const RETRY_QUEUE_PROCESS_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Process function threw an error.`;const RETRY_QUEUE_ENTRY_REMOVE_ERROR=(context,entry,attempt)=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to remove local storage entry "${entry}" (attempt: ${attempt}.`;
    
    const DEFAULT_MIN_RETRY_DELAY_MS=1000;const DEFAULT_MAX_RETRY_DELAY_MS=30000;const DEFAULT_BACKOFF_FACTOR=2;const DEFAULT_BACKOFF_JITTER=0;const DEFAULT_MAX_RETRY_ATTEMPTS=Infinity;const DEFAULT_MAX_ITEMS=Infinity;const DEFAULT_ACK_TIMER_MS=1000;const DEFAULT_RECLAIM_TIMER_MS=3000;const DEFAULT_RECLAIM_TIMEOUT_MS=10000;const DEFAULT_RECLAIM_WAIT_MS=500;const MIN_TIMER_SCALE_FACTOR=1;const MAX_TIMER_SCALE_FACTOR=10;const DEFAULT_MAX_BATCH_SIZE_BYTES=512*1024;// 512 KB; this is also the max size of a batch
    const DEFAULT_MAX_BATCH_ITEMS=100;const DEFAULT_BATCH_FLUSH_INTERVAL_MS=60*1000;// 1 minutes
    
    const sortByTime=(a,b)=>a.time-b.time;const RETRY_QUEUE='RetryQueue';/**
     * Constructs a RetryQueue backed by localStorage
     *
     * @constructor
     * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
     * @param {Object} [opts] Optional argument to override `maxItems`, `maxAttempts`, `minRetryDelay, `maxRetryDelay`, `backoffFactor` and `backoffJitter`.
     * @param {QueueProcessCallback} fn The function to call in order to process an item added to the queue
     */class RetryQueue{constructor(name,options,queueProcessCb,storeManager,storageType=LOCAL_STORAGE,logger,queueBatchItemsSizeCalculatorCb){this.storeManager=storeManager;this.logger=logger;this.name=name;this.id=generateUUID();this.processQueueCb=queueProcessCb;this.batchSizeCalcCb=queueBatchItemsSizeCalculatorCb;this.maxItems=options.maxItems||DEFAULT_MAX_ITEMS;this.maxAttempts=options.maxAttempts||DEFAULT_MAX_RETRY_ATTEMPTS;this.batch={enabled:false};this.configureBatchMode(options);this.backoff={minRetryDelay:options.minRetryDelay||DEFAULT_MIN_RETRY_DELAY_MS,maxRetryDelay:options.maxRetryDelay||DEFAULT_MAX_RETRY_DELAY_MS,factor:options.backoffFactor||DEFAULT_BACKOFF_FACTOR,jitter:options.backoffJitter||DEFAULT_BACKOFF_JITTER};// Limit the timer scale factor to the minimum value
    let timerScaleFactor=Math.max(options.timerScaleFactor??MIN_TIMER_SCALE_FACTOR,MIN_TIMER_SCALE_FACTOR);// Limit the timer scale factor to the maximum value
    timerScaleFactor=Math.min(timerScaleFactor,MAX_TIMER_SCALE_FACTOR);// painstakingly tuned. that's why they're not "easily" configurable
    this.timeouts={ackTimer:Math.round(timerScaleFactor*DEFAULT_ACK_TIMER_MS),reclaimTimer:Math.round(timerScaleFactor*DEFAULT_RECLAIM_TIMER_MS),reclaimTimeout:Math.round(timerScaleFactor*DEFAULT_RECLAIM_TIMEOUT_MS),reclaimWait:Math.round(timerScaleFactor*DEFAULT_RECLAIM_WAIT_MS)};this.schedule=new Schedule();this.processId='0';// Set up our empty queues
    this.store=this.storeManager.setStore({id:this.id,name:this.name,validKeys:QueueStatuses,type:storageType});this.setDefaultQueueEntries();// bind recurring tasks for ease of use
    this.ack=this.ack.bind(this);this.checkReclaim=this.checkReclaim.bind(this);this.processHead=this.processHead.bind(this);this.flushBatch=this.flushBatch.bind(this);// Attach visibility change listener to flush the queue
    this.attachListeners();this.scheduleTimeoutActive=false;}setDefaultQueueEntries(){this.setStorageEntry(QueueStatuses.IN_PROGRESS,{});this.setStorageEntry(QueueStatuses.QUEUE,[]);this.setStorageEntry(QueueStatuses.BATCH_QUEUE,[]);}configureBatchMode(options){this.batchingInProgress=false;if(!isObjectLiteralAndNotNull(options.batch)){return;}const batchOptions=options.batch;this.batch.enabled=batchOptions.enabled===true;if(this.batch.enabled){// Set upper cap on the batch payload size
    this.batch.maxSize=Math.min(batchOptions.maxSize??DEFAULT_MAX_BATCH_SIZE_BYTES,DEFAULT_MAX_BATCH_SIZE_BYTES);this.batch.maxItems=batchOptions.maxItems??DEFAULT_MAX_BATCH_ITEMS;this.batch.flushInterval=batchOptions.flushInterval??DEFAULT_BATCH_FLUSH_INTERVAL_MS;}}attachListeners(){if(this.batch.enabled){globalThis.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){this.flushBatch();}});}}getStorageEntry(name){return this.store.get(name);}// TODO: fix the type of different queues to be the same if possible
    setStorageEntry(name,value){if(isNullOrUndefined(value)){this.store.remove(name);}else {this.store.set(name,value);}}/**
       * Stops processing the queue
       */stop(){this.schedule.cancelAll();this.scheduleTimeoutActive=false;}/**
       * Starts processing the queue
       */start(){if(this.scheduleTimeoutActive){this.stop();}this.scheduleTimeoutActive=true;this.scheduleFlushBatch();this.ack();this.checkReclaim();this.processHead();}/**
       * Configures the timeout handler for flushing the batch queue
       */scheduleFlushBatch(){if(this.batch.enabled&&this.batch?.flushInterval){if(this.flushBatchTaskId){this.schedule.cancel(this.flushBatchTaskId);}this.flushBatchTaskId=this.schedule.run(this.flushBatch,this.batch.flushInterval,ScheduleModes.ASAP);}}/**
       * Flushes the batch queue
       */flushBatch(){if(!this.batchingInProgress){this.batchingInProgress=true;let batchQueue=this.getStorageEntry(QueueStatuses.BATCH_QUEUE)??[];if(batchQueue.length>0){batchQueue=batchQueue.slice(-batchQueue.length);const batchEntry=this.genQueueItem(batchQueue.map(queueItem=>queueItem.item));this.setStorageEntry(QueueStatuses.BATCH_QUEUE,[]);this.pushToMainQueue(batchEntry);}this.batchingInProgress=false;// Re-schedule the flush task
    this.scheduleFlushBatch();}}/**
       * Decides whether to retry. Overridable.
       *
       * @param {Object} item The item being processed
       * @param {Number} attemptNumber The attemptNumber (1 for first retry)
       * @return {Boolean} Whether to requeue the message
       */shouldRetry(item,attemptNumber){return attemptNumber<=this.maxAttempts;}/**
       * Calculates the delay (in ms) for a retry attempt
       *
       * @param {Number} attemptNumber The attemptNumber (1 for first retry)
       * @return {Number} The delay in milliseconds to wait before attempting a retry
       */getDelay(attemptNumber){let ms=this.backoff.minRetryDelay*this.backoff.factor**attemptNumber;if(this.backoff.jitter){const rand=Math.random();const deviation=Math.floor(rand*this.backoff.jitter*ms);if(Math.floor(rand*10)<5){ms-=deviation;}else {ms+=deviation;}}return Number(Math.min(ms,this.backoff.maxRetryDelay).toPrecision(1));}enqueue(entry){let curEntry;if(this.batch.enabled){curEntry=this.handleNewItemForBatch(entry);}else {curEntry=entry;}// when batching is enabled, `curEntry` could be `undefined` if the batch criteria is not met
    if(curEntry){this.pushToMainQueue(curEntry);}}/**
       * Handles a new item added to the retry queue when batching is enabled
       * @param entry New item added to the retry queue
       * @returns Undefined or batch entry object
       */handleNewItemForBatch(entry){let curEntry;let batchQueue=this.getStorageEntry(QueueStatuses.BATCH_QUEUE)??[];if(!this.batchingInProgress){this.batchingInProgress=true;batchQueue=batchQueue.slice(-batchQueue.length);batchQueue.push(entry);const batchDispatchInfo=this.getBatchDispatchInfo(batchQueue);// if batch criteria is met, queue the batch events to the main queue and clear batch queue
    if(batchDispatchInfo.criteriaMet||batchDispatchInfo.criteriaExceeded){let batchItems;if(batchDispatchInfo.criteriaExceeded){batchItems=batchQueue.slice(0,batchQueue.length-1).map(queueItem=>queueItem.item);batchQueue=[entry];}else {batchItems=batchQueue.map(queueItem=>queueItem.item);batchQueue=[];}// Don't make any batch request if there are no items
    if(batchItems.length>0){curEntry=this.genQueueItem(batchItems);}// re-attach the timeout handler
    this.scheduleFlushBatch();}this.batchingInProgress=false;}else {batchQueue.push(entry);}// update the batch queue
    this.setStorageEntry(QueueStatuses.BATCH_QUEUE,batchQueue);return curEntry;}pushToMainQueue(curEntry){let queue=this.getStorageEntry(QueueStatuses.QUEUE)??[];queue=queue.slice(-(this.maxItems-1));queue.push(curEntry);queue=queue.sort(sortByTime);this.setStorageEntry(QueueStatuses.QUEUE,queue);if(this.scheduleTimeoutActive){this.processHead();}}/**
       * Adds an item to the queue
       *
       * @param {Object} itemData The item to process
       */addItem(itemData){this.enqueue(this.genQueueItem(itemData));}/**
       * Generates a queue item
       * @param itemData Queue item data
       * @returns Queue item
       */genQueueItem(itemData){return {item:itemData,attemptNumber:0,time:this.schedule.now(),id:generateUUID()};}/**
       * Adds an item to the retry queue
       *
       * @param {Object} itemData The item to retry
       * @param {Number} attemptNumber The attempt number (1 for first retry)
       * @param {Error} [error] The error from previous attempt, if there was one
       * @param {String} [id] The id of the queued message used for tracking duplicate entries
       */requeue(itemData,attemptNumber,error,id){if(this.shouldRetry(itemData,attemptNumber)){this.enqueue({item:itemData,attemptNumber,time:this.schedule.now()+this.getDelay(attemptNumber),id:id??generateUUID()});}}/**
       * Returns the information about whether the batch criteria is met or exceeded
       * @param batchItems Prospective batch items
       * @returns Batch dispatch info
       */getBatchDispatchInfo(batchItems){let lengthCriteriaMet=false;let lengthCriteriaExceeded=false;const configuredBatchMaxItems=this.batch?.maxItems;if(isDefined(configuredBatchMaxItems)){lengthCriteriaMet=batchItems.length===configuredBatchMaxItems;lengthCriteriaExceeded=batchItems.length>configuredBatchMaxItems;}if(lengthCriteriaMet||lengthCriteriaExceeded){return {criteriaMet:lengthCriteriaMet,criteriaExceeded:lengthCriteriaExceeded};}let sizeCriteriaMet=false;let sizeCriteriaExceeded=false;const configuredBatchMaxSize=this.batch?.maxSize;if(isDefined(configuredBatchMaxSize)&&isDefined(this.batchSizeCalcCb)){const curBatchSize=this.batchSizeCalcCb(batchItems.map(queueItem=>queueItem.item));sizeCriteriaMet=curBatchSize===configuredBatchMaxSize;sizeCriteriaExceeded=curBatchSize>configuredBatchMaxSize;}return {criteriaMet:sizeCriteriaMet,criteriaExceeded:sizeCriteriaExceeded};}processHead(){// cancel the scheduled task if it exists
    this.schedule.cancel(this.processId);// Pop the head off the queue
    let queue=this.getStorageEntry(QueueStatuses.QUEUE)??[];const inProgress=this.getStorageEntry(QueueStatuses.IN_PROGRESS)??{};const now=this.schedule.now();const toRun=[];// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const processItemCallback=(el,id)=>(err,res)=>{const inProgress=this.getStorageEntry(QueueStatuses.IN_PROGRESS)??{};delete inProgress[id];this.setStorageEntry(QueueStatuses.IN_PROGRESS,inProgress);if(err){this.requeue(el.item,el.attemptNumber+1,err,el.id);}};const enqueueItem=(el,id)=>{toRun.push({item:el.item,done:processItemCallback(el,id),attemptNumber:el.attemptNumber});};let inProgressSize=Object.keys(inProgress).length;// eslint-disable-next-line no-plusplus
    while(queue.length>0&&queue[0].time<=now&&inProgressSize++<this.maxItems){const el=queue.shift();if(el){const id=generateUUID();// Save this to the in progress map
    inProgress[id]={item:el.item,attemptNumber:el.attemptNumber,time:this.schedule.now()};enqueueItem(el,id);}}this.setStorageEntry(QueueStatuses.QUEUE,queue);this.setStorageEntry(QueueStatuses.IN_PROGRESS,inProgress);toRun.forEach(el=>{// TODO: handle processQueueCb timeout
    try{const willBeRetried=this.shouldRetry(el.item,el.attemptNumber+1);this.processQueueCb(el.item,el.done,el.attemptNumber,this.maxAttempts,willBeRetried);}catch(err){this.logger?.error(RETRY_QUEUE_PROCESS_ERROR(RETRY_QUEUE),err);}});// re-read the queue in case the process function finished immediately or added another item
    queue=this.getStorageEntry(QueueStatuses.QUEUE)??[];this.schedule.cancel(this.processId);if(queue.length>0){const nextProcessExecutionTime=queue[0].time-now;this.processId=this.schedule.run(this.processHead,nextProcessExecutionTime,ScheduleModes.ASAP);}}// Ack continuously to prevent other tabs from claiming our queue
    ack(){this.setStorageEntry(QueueStatuses.ACK,this.schedule.now());if(this.reclaimStartVal!=null){this.reclaimStartVal=null;this.setStorageEntry(QueueStatuses.RECLAIM_START,null);}if(this.reclaimEndVal!=null){this.reclaimEndVal=null;this.setStorageEntry(QueueStatuses.RECLAIM_END,null);}this.schedule.run(this.ack,this.timeouts.ackTimer,ScheduleModes.ASAP);}reclaim(id){const other=this.storeManager.setStore({id,name:this.name,validKeys:QueueStatuses,type:LOCAL_STORAGE});const our={queue:this.getStorageEntry(QueueStatuses.QUEUE)??[]};const their={inProgress:other.get(QueueStatuses.IN_PROGRESS)??{},batchQueue:other.get(QueueStatuses.BATCH_QUEUE)??[],queue:other.get(QueueStatuses.QUEUE)??[]};const trackMessageIds=[];const addConcatQueue=(queue,incrementAttemptNumberBy)=>{const concatIterator=el=>{const id=el.id??generateUUID();if(trackMessageIds.includes(id));else {our.queue.push({item:el.item,attemptNumber:el.attemptNumber+incrementAttemptNumberBy,time:this.schedule.now(),id});trackMessageIds.push(id);}};if(Array.isArray(queue)){queue.forEach(concatIterator);}else if(queue){Object.values(queue).forEach(concatIterator);}};// add their queue to ours, resetting run-time to immediate and copying the attempt#
    addConcatQueue(their.queue,0);// Process batch queue items
    if(this.batch.enabled){their.batchQueue.forEach(el=>{const id=el.id??generateUUID();if(trackMessageIds.includes(id));else {this.enqueue(el);trackMessageIds.push(id);}});}else {// if batching is not enabled in the current instance, add those items to the main queue directly
    addConcatQueue(their.batchQueue,0);}// if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#
    addConcatQueue(their.inProgress,1);our.queue=our.queue.sort(sortByTime);this.setStorageEntry(QueueStatuses.QUEUE,our.queue);// remove all keys one by on next tick to avoid NS_ERROR_STORAGE_BUSY error
    this.clearQueueEntries(other,1);// process the new items we claimed
    this.processHead();}// eslint-disable-next-line class-methods-use-this
    clearQueueEntries(other,localStorageBackoff){this.removeStorageEntry(other,0,localStorageBackoff);}removeStorageEntry(store,entryIdx,backoff,attempt=1){const maxAttempts=2;const queueEntryKeys=Object.keys(QueueStatuses);const entry=QueueStatuses[queueEntryKeys[entryIdx]];globalThis.setTimeout(()=>{try{store.remove(entry);// clear the next entry
    if(entryIdx+1<queueEntryKeys.length){this.removeStorageEntry(store,entryIdx+1,backoff);}}catch(err){const storageBusyErr='NS_ERROR_STORAGE_BUSY';const isLocalStorageBusy=err.name===storageBusyErr||err.code===storageBusyErr||err.code===0x80630001;if(isLocalStorageBusy&&attempt<maxAttempts){// Try clearing the same entry again with some extra delay
    this.removeStorageEntry(store,entryIdx,backoff+40,attempt+1);}else {this.logger?.error(RETRY_QUEUE_ENTRY_REMOVE_ERROR(RETRY_QUEUE,entry,attempt),err);}// clear the next entry after we've exhausted our attempts
    if(attempt===maxAttempts&&entryIdx+1<queueEntryKeys.length){this.removeStorageEntry(store,entryIdx+1,backoff);}}},backoff);}checkReclaim(){const createReclaimStartTask=store=>()=>{if(store.get(QueueStatuses.RECLAIM_END)!==this.id){return;}if(store.get(QueueStatuses.RECLAIM_START)!==this.id){return;}this.reclaim(store.id);};const createReclaimEndTask=store=>()=>{if(store.get(QueueStatuses.RECLAIM_START)!==this.id){return;}store.set(QueueStatuses.RECLAIM_END,this.id);this.schedule.run(createReclaimStartTask(store),this.timeouts.reclaimWait,ScheduleModes.ABANDON);};const tryReclaim=store=>{store.set(QueueStatuses.RECLAIM_START,this.id);store.set(QueueStatuses.ACK,this.schedule.now());this.schedule.run(createReclaimEndTask(store),this.timeouts.reclaimWait,ScheduleModes.ABANDON);};const findOtherQueues=name=>{const res=[];const storageEngine=this.store.getOriginalEngine();let storageKeys=[];// 'keys' API is not supported by all the core SDK versions
    // Hence, we need this backward compatibility check
    if(isFunction(storageEngine.keys)){storageKeys=storageEngine.keys();}else {for(let i=0;i<storageEngine.length;i++){const key=storageEngine.key(i);if(key){storageKeys.push(key);}}}storageKeys.forEach(k=>{const keyParts=k?k.split('.'):[];if(keyParts.length>=3&&keyParts[0]===name&&keyParts[1]!==this.id&&keyParts[2]===QueueStatuses.ACK){res.push(this.storeManager.setStore({id:keyParts[1],name,validKeys:QueueStatuses,type:LOCAL_STORAGE}));}});return res;};findOtherQueues(this.name).forEach(store=>{if(this.schedule.now()-store.get(QueueStatuses.ACK)<this.timeouts.reclaimTimeout){return;}tryReclaim(store);});this.schedule.run(this.checkReclaim,this.timeouts.reclaimTimer,ScheduleModes.RESCHEDULE);}clear(){this.schedule.cancelAll();this.setDefaultQueueEntries();}}
    
    const pluginName$e='BeaconQueue';const BeaconQueue=()=>({name:pluginName$e,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$e];},dataplaneEventsQueue:{/**
         * Initialize the queue for delivery
         * @param state Application state
         * @param httpClient http client instance
         * @param storeManager Store Manager instance
         * @param errorHandler Error handler instance
         * @param logger Logger instance
         * @returns BeaconItemsQueue instance
         */init(state,httpClient,storeManager,errorHandler,logger){const writeKey=state.lifecycle.writeKey.value;const dataplaneUrl=state.lifecycle.activeDataplaneUrl.value;const url=getDeliveryUrl$1(dataplaneUrl,writeKey);const finalQOpts=getNormalizedBeaconQueueOptions(state.loadOptions.value.beaconQueueOptions??{});const queueProcessCallback=(itemData,done)=>{logger?.debug(BEACON_PLUGIN_EVENTS_QUEUE_DEBUG(BEACON_QUEUE_PLUGIN));const currentTime=getCurrentTimeFormatted();const finalEvents=itemData.map(queueItemData=>getFinalEventForDeliveryMutator(queueItemData.event,currentTime));const data=getBatchDeliveryPayload$1(finalEvents,currentTime,logger);if(data){try{const isEnqueuedInBeacon=navigator.sendBeacon(url,data);if(!isEnqueuedInBeacon){logger?.error(BEACON_QUEUE_SEND_ERROR(BEACON_QUEUE_PLUGIN));}done(null,isEnqueuedInBeacon);}catch(err){errorHandler?.onError(err,BEACON_QUEUE_PLUGIN,BEACON_QUEUE_DELIVERY_ERROR(url));// Remove the item from queue
    done(null);}}else {// Mark the item as done so that it can be removed from the queue
    done(null);}};const eventsQueue=new RetryQueue(`${QUEUE_NAME$3}_${writeKey}`,{batch:{enabled:true,flushInterval:finalQOpts.flushQueueInterval,maxSize:MAX_BATCH_PAYLOAD_SIZE_BYTES,// set the hard limit
    maxItems:finalQOpts.maxItems}},queueProcessCallback,storeManager,LOCAL_STORAGE,logger,itemData=>{const currentTime=getCurrentTimeFormatted();const events=itemData.map(queueItemData=>queueItemData.event);// type casting to Blob as we know that the event has already been validated prior to enqueue
    return getBatchDeliveryPayload$1(events,currentTime,logger).size;});return eventsQueue;},/**
         * Add event to the queue for delivery
         * @param state Application state
         * @param eventsQueue IQueue instance
         * @param event RudderEvent object
         * @param errorHandler Error handler instance
         * @param logger Logger instance
         * @returns none
         */enqueue(state,eventsQueue,event,errorHandler,logger){// sentAt is only added here for the validation step
    // It'll be updated to the latest timestamp during actual delivery
    event.sentAt=getCurrentTimeFormatted();validateEventPayloadSize(event,logger);eventsQueue.addItem({event});}}});
    
    const BUGSNAG_API_KEY_VALIDATION_ERROR=apiKey=>`The Bugsnag API key (${apiKey}) is invalid or not provided.`;const BUGSNAG_SDK_URL_ERROR='The Bugsnag SDK URL is invalid. Failed to load the Bugsnag SDK.';
    
    const API_KEY='0d96a60df267f4a13f808bbaa54e535c';// Potential PII or sensitive data
    const APP_STATE_EXCLUDE_KEYS=['userId','userTraits','groupId','groupTraits','anonymousId','config','instance',// destination instance objects
    'eventBuffer',// pre-load event buffer (may contain PII)
    'traits'];
    
    const isApiKeyValid=apiKey=>{const isAPIKeyValid=!(apiKey.startsWith('{{')||apiKey.endsWith('}}')||apiKey.length===0);return isAPIKeyValid;};const getAppStateForMetadata=state=>{const stateStr=stringifyWithoutCircular(state,false,APP_STATE_EXCLUDE_KEYS);return stateStr!==null?JSON.parse(stateStr):undefined;};
    
    const pluginName$d='Bugsnag';const Bugsnag=()=>({name:pluginName$d,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$d];},errorReportingProvider:{init:(state,externalSrcLoader,logger)=>new Promise((resolve,reject)=>{// If API key token is not parsed or invalid, don't proceed to initialize the client
    if(!isApiKeyValid(API_KEY)){reject(new Error(BUGSNAG_API_KEY_VALIDATION_ERROR(API_KEY)));return;}// If SDK URL is empty, don't proceed to initialize the client
    // eslint-disable-next-line no-constant-condition
    {reject(new Error(BUGSNAG_SDK_URL_ERROR));return;}}),notify:(client,error,state,logger)=>{client?.notify(error,{metaData:{state:getAppStateForMetadata(state)}});},breadcrumb:(client,message,logger)=>{client?.leaveBreadcrumb(message);}}});
    
    const CUSTOM_CONSENT_MANAGER_PLUGIN='CustomConsentManagerPlugin';
    
    const DESTINATION_CONSENT_STATUS_ERROR$2=`Failed to determine the consent status for the destination. Please check the destination configuration and try again.`;
    
    const pluginName$c='CustomConsentManager';const CustomConsentManager=()=>({name:pluginName$c,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$c];},consentManager:{init(state,logger){// Nothing to initialize
    },updateConsentsInfo(state,storeManager,logger){// Nothing to update. Already provided by the user
    },isDestinationConsented(state,destConfig,errorHandler,logger){if(!state.consents.initialized.value){return true;}const allowedConsentIds=state.consents.data.value.allowedConsentIds;try{const{consentManagement}=destConfig;// If the destination does not have consent management config, events should be sent.
    if(!consentManagement){return true;}// Get the corresponding consents for the destination
    const cmpConfig=consentManagement.find(c=>c.provider===state.consents.provider.value);// If there are no consents configured for the destination for the current provider, events should be sent.
    if(!cmpConfig?.consents){return true;}const configuredConsents=cmpConfig.consents.map(c=>c.consent.trim()).filter(n=>n);const resolutionStrategy=cmpConfig.resolutionStrategy??state.consents.resolutionStrategy.value;// match the configured consents with user provided consents as per
    // the configured resolution strategy
    const matchPredicate=consent=>allowedConsentIds.includes(consent);switch(resolutionStrategy){case'or':return configuredConsents.some(matchPredicate)||configuredConsents.length===0;case'and':default:return configuredConsents.every(matchPredicate);}}catch(err){errorHandler?.onError(err,CUSTOM_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR$2);return true;}}}});
    
    const DIR_NAME$1d='AdobeAnalytics';const DISPLAY_NAME$1d='Adobe Analytics';
    
    const DIR_NAME$1c='Amplitude';const DISPLAY_NAME$1c='Amplitude';
    
    const DIR_NAME$1b='Appcues';const DISPLAY_NAME$1b='Appcues';
    
    const DIR_NAME$1a='BingAds';const DISPLAY_NAME$1a='Bing Ads';
    
    const DIR_NAME$19='Braze';const DISPLAY_NAME$19='Braze';
    
    const DIR_NAME$18='Bugsnag';const DISPLAY_NAME$18='Bugsnag';
    
    const DIR_NAME$17='Chartbeat';const DISPLAY_NAME$17='Chartbeat';
    
    const DIR_NAME$16='Clevertap';const DISPLAY_NAME$16='CleverTap';
    
    const DIR_NAME$15='Comscore';const DISPLAY_NAME$15='Comscore';
    
    const DIR_NAME$14='Criteo';const DISPLAY_NAME$14='Criteo';
    
    const DIR_NAME$13='CustomerIO';const DISPLAY_NAME$13='Customer IO';
    
    const DIR_NAME$12='Drip';const DISPLAY_NAME$12='Drip';
    
    const DIR_NAME$11='FacebookPixel';const DISPLAY_NAME$11='Facebook Pixel';
    
    const DIR_NAME$10='Fullstory';const DISPLAY_NAME$10='Fullstory';
    
    const DIR_NAME$$='GA';const DISPLAY_NAME$$='Google Analytics';
    
    const DIR_NAME$_='GA4';const DISPLAY_NAME$_='Google Analytics 4 (GA4)';
    
    const DIR_NAME$Z='GoogleAds';const DISPLAY_NAME$Z='Google Ads';
    
    const DIR_NAME$Y='GoogleOptimize';const DISPLAY_NAME$Y='Google Optimize';
    
    const DIR_NAME$X='GoogleTagManager';const DISPLAY_NAME$X='Google Tag Manager';
    
    const DIR_NAME$W='Heap';const DISPLAY_NAME$W='Heap.io';
    
    const DIR_NAME$V='Hotjar';const DISPLAY_NAME$V='Hotjar';
    
    const DIR_NAME$U='HubSpot';const DISPLAY_NAME$U='HubSpot';
    
    const DIR_NAME$T='INTERCOM';const DISPLAY_NAME$T='Intercom';
    
    const DIR_NAME$S='Keen';const DISPLAY_NAME$S='Keen';
    
    const DIR_NAME$R='Kissmetrics';const DISPLAY_NAME$R='Kiss Metrics';
    
    const DIR_NAME$Q='Klaviyo';const DISPLAY_NAME$Q='Klaviyo';
    
    const DIR_NAME$P='LaunchDarkly';const DISPLAY_NAME$P='LaunchDarkly';
    
    const DIR_NAME$O='LinkedInInsightTag';const DISPLAY_NAME$O='Linkedin Insight Tag';
    
    const DIR_NAME$N='Lotame';const DISPLAY_NAME$N='Lotame';
    
    const DIR_NAME$M='Lytics';const DISPLAY_NAME$M='Lytics';
    
    const DIR_NAME$L='Mixpanel';const DISPLAY_NAME$L='Mixpanel';
    
    const DIR_NAME$K='MoEngage';const DISPLAY_NAME$K='MoEngage';
    
    const DIR_NAME$J='Optimizely';const DISPLAY_NAME$J='Optimizely Web';
    
    const DIR_NAME$I='Pendo';const DISPLAY_NAME$I='Pendo';
    
    const DIR_NAME$H='PinterestTag';const DISPLAY_NAME$H='Pinterest Tag';
    
    const DIR_NAME$G='PostAffiliatePro';const DISPLAY_NAME$G='Post Affiliate Pro';
    
    const DIR_NAME$F='Posthog';const DISPLAY_NAME$F='PostHog';
    
    const DIR_NAME$E='ProfitWell';const DISPLAY_NAME$E='ProfitWell';
    
    const DIR_NAME$D='Qualtrics';const DISPLAY_NAME$D='Qualtrics';
    
    const DIR_NAME$C='QuantumMetric';const DISPLAY_NAME$C='Quantum Metric';
    
    const DIR_NAME$B='RedditPixel';const DISPLAY_NAME$B='Reddit Pixel';
    
    const DIR_NAME$A='Sentry';const DISPLAY_NAME$A='Sentry';
    
    const DIR_NAME$z='SnapPixel';const DISPLAY_NAME$z='Snap Pixel';
    
    const DIR_NAME$y='TVSquared';const DISPLAY_NAME$y='TVSquared';
    
    const DIR_NAME$x='VWO';const DISPLAY_NAME$x='VWO';
    
    const DIR_NAME$w='GA360';const DISPLAY_NAME$w='Google Analytics 360';
    
    const DIR_NAME$v='Adroll';const DISPLAY_NAME$v='Adroll';
    
    const DIR_NAME$u='DCMFloodlight';const DISPLAY_NAME$u='DCM Floodlight';
    
    const DIR_NAME$t='Matomo';const DISPLAY_NAME$t='Matomo';
    
    const DIR_NAME$s='Vero';const DISPLAY_NAME$s='Vero';
    
    const DIR_NAME$r='Mouseflow';const DISPLAY_NAME$r='Mouseflow';
    
    const DIR_NAME$q='Rockerbox';const DISPLAY_NAME$q='Rockerbox';
    
    const DIR_NAME$p='ConvertFlow';const DISPLAY_NAME$p='ConvertFlow';
    
    const DIR_NAME$o='SnapEngage';const DISPLAY_NAME$o='SnapEngage';
    
    const DIR_NAME$n='LiveChat';const DISPLAY_NAME$n='LiveChat';
    
    const DIR_NAME$m='Shynet';const DISPLAY_NAME$m='Shynet';
    
    const DIR_NAME$l='Woopra';const DISPLAY_NAME$l='Woopra';
    
    const DIR_NAME$k='RollBar';const DISPLAY_NAME$k='RollBar';
    
    const DIR_NAME$j='QuoraPixel';const DISPLAY_NAME$j='Quora Pixel';
    
    const DIR_NAME$i='June';const DISPLAY_NAME$i='June';
    
    const DIR_NAME$h='Engage';const DISPLAY_NAME$h='Engage';
    
    const DIR_NAME$g='Iterable';const DISPLAY_NAME$g='Iterable';
    
    const DIR_NAME$f='YandexMetrica';const DISPLAY_NAME$f='Yandex.Metrica';
    
    const DIR_NAME$e='Refiner';const DISPLAY_NAME$e='Refiner';
    
    const DIR_NAME$d='Qualaroo';const DISPLAY_NAME$d='Qualaroo';
    
    const DIR_NAME$c='Podsights';const DISPLAY_NAME$c='Podsights';
    
    const DIR_NAME$b='Axeptio';const DISPLAY_NAME$b='Axeptio';
    
    const DIR_NAME$a='Satismeter';const DISPLAY_NAME$a='Satismeter';
    
    const DIR_NAME$9='MicrosoftClarity';const DISPLAY_NAME$9='Microsoft Clarity';
    
    const DIR_NAME$8='Sendinblue';const DISPLAY_NAME$8='Sendinblue';
    
    const DIR_NAME$7='Olark';const DISPLAY_NAME$7='Olark';
    
    const DIR_NAME$6='Lemnisk';const DISPLAY_NAME$6='Lemnisk';
    
    const DIR_NAME$5='TiktokAds';const DISPLAY_NAME$5='TikTok Ads';
    
    const DIR_NAME$4='ActiveCampaign';const DISPLAY_NAME$4='Active Campaign';
    
    const DIR_NAME$3='Sprig';const DISPLAY_NAME$3='Sprig';
    
    const DIR_NAME$2='SpotifyPixel';const DISPLAY_NAME$2='Spotify Pixel';
    
    const DIR_NAME$1='CommandBar';const DISPLAY_NAME$1='CommandBar';
    
    const DIR_NAME='Ninetailed';const DISPLAY_NAME='Ninetailed';
    
    // map of the destination display names to the destination directory names
    const destDisplayNamesToFileNamesMap={[DISPLAY_NAME$U]:DIR_NAME$U,[DISPLAY_NAME$$]:DIR_NAME$$,[DISPLAY_NAME$V]:DIR_NAME$V,[DISPLAY_NAME$Z]:DIR_NAME$Z,[DISPLAY_NAME$x]:DIR_NAME$x,[DISPLAY_NAME$X]:DIR_NAME$X,[DISPLAY_NAME$19]:DIR_NAME$19,[DISPLAY_NAME$T]:DIR_NAME$T,[DISPLAY_NAME$S]:DIR_NAME$S,[DISPLAY_NAME$R]:DIR_NAME$R,[DISPLAY_NAME$13]:DIR_NAME$13,[DISPLAY_NAME$17]:DIR_NAME$17,[DISPLAY_NAME$15]:DIR_NAME$15,[DISPLAY_NAME$11]:DIR_NAME$11,[DISPLAY_NAME$N]:DIR_NAME$N,[DISPLAY_NAME$J]:DIR_NAME$J,[DISPLAY_NAME$18]:DIR_NAME$18,[DISPLAY_NAME$10]:DIR_NAME$10,[DISPLAY_NAME$y]:DIR_NAME$y,[DISPLAY_NAME$_]:DIR_NAME$_,[DISPLAY_NAME$K]:DIR_NAME$K,[DISPLAY_NAME$1c]:DIR_NAME$1c,[DISPLAY_NAME$I]:DIR_NAME$I,[DISPLAY_NAME$M]:DIR_NAME$M,[DISPLAY_NAME$1b]:DIR_NAME$1b,[DISPLAY_NAME$F]:DIR_NAME$F,[DISPLAY_NAME$Q]:DIR_NAME$Q,[DISPLAY_NAME$16]:DIR_NAME$16,[DISPLAY_NAME$1a]:DIR_NAME$1a,[DISPLAY_NAME$H]:DIR_NAME$H,[DISPLAY_NAME$1d]:DIR_NAME$1d,[DISPLAY_NAME$O]:DIR_NAME$O,[DISPLAY_NAME$B]:DIR_NAME$B,[DISPLAY_NAME$12]:DIR_NAME$12,[DISPLAY_NAME$W]:DIR_NAME$W,[DISPLAY_NAME$14]:DIR_NAME$14,[DISPLAY_NAME$L]:DIR_NAME$L,[DISPLAY_NAME$D]:DIR_NAME$D,[DISPLAY_NAME$E]:DIR_NAME$E,[DISPLAY_NAME$A]:DIR_NAME$A,[DISPLAY_NAME$C]:DIR_NAME$C,[DISPLAY_NAME$z]:DIR_NAME$z,[DISPLAY_NAME$G]:DIR_NAME$G,[DISPLAY_NAME$Y]:DIR_NAME$Y,[DISPLAY_NAME$P]:DIR_NAME$P,[DISPLAY_NAME$w]:DIR_NAME$w,[DISPLAY_NAME$v]:DIR_NAME$v,[DISPLAY_NAME$u]:DIR_NAME$u,[DISPLAY_NAME$t]:DIR_NAME$t,[DISPLAY_NAME$s]:DIR_NAME$s,[DISPLAY_NAME$r]:DIR_NAME$r,[DISPLAY_NAME$q]:DIR_NAME$q,[DISPLAY_NAME$p]:DIR_NAME$p,[DISPLAY_NAME$o]:DIR_NAME$o,[DISPLAY_NAME$n]:DIR_NAME$n,[DISPLAY_NAME$m]:DIR_NAME$m,[DISPLAY_NAME$l]:DIR_NAME$l,[DISPLAY_NAME$k]:DIR_NAME$k,[DISPLAY_NAME$j]:DIR_NAME$j,[DISPLAY_NAME$i]:DIR_NAME$i,[DISPLAY_NAME$h]:DIR_NAME$h,[DISPLAY_NAME$g]:DIR_NAME$g,[DISPLAY_NAME$f]:DIR_NAME$f,[DISPLAY_NAME$e]:DIR_NAME$e,[DISPLAY_NAME$d]:DIR_NAME$d,[DISPLAY_NAME$c]:DIR_NAME$c,[DISPLAY_NAME$b]:DIR_NAME$b,[DISPLAY_NAME$a]:DIR_NAME$a,[DISPLAY_NAME$9]:DIR_NAME$9,[DISPLAY_NAME$8]:DIR_NAME$8,[DISPLAY_NAME$7]:DIR_NAME$7,[DISPLAY_NAME$6]:DIR_NAME$6,[DISPLAY_NAME$5]:DIR_NAME$5,[DISPLAY_NAME$4]:DIR_NAME$4,[DISPLAY_NAME$3]:DIR_NAME$3,[DISPLAY_NAME$2]:DIR_NAME$2,[DISPLAY_NAME$1]:DIR_NAME$1,[DISPLAY_NAME]:DIR_NAME};
    
    const DEFAULT_INTEGRATIONS_CONFIG={All:true};
    
    const isDestIntgConfigTruthy=destIntgConfig=>!isUndefined(destIntgConfig)&&Boolean(destIntgConfig)===true;const isDestIntgConfigFalsy=destIntgConfig=>!isUndefined(destIntgConfig)&&Boolean(destIntgConfig)===false;/**
     * Filters the destinations that should not be loaded or forwarded events to based on the integration options (load or events API)
     * @param intgOpts Integration options object
     * @param destinations Destinations array
     * @returns Destinations array filtered based on the integration options
     */const filterDestinations=(intgOpts,destinations)=>{const allOptVal=intgOpts.All??true;return destinations.filter(dest=>{const destDisplayName=dest.displayName;let isDestEnabled;if(allOptVal){isDestEnabled=true;if(isDestIntgConfigFalsy(intgOpts[destDisplayName])){isDestEnabled=false;}}else {isDestEnabled=false;if(isDestIntgConfigTruthy(intgOpts[destDisplayName])){isDestEnabled=true;}}return isDestEnabled;});};
    
    const READY_CHECK_TIMEOUT_MS=11*1000;// 11 seconds
    const SCRIPT_LOAD_TIMEOUT_MS=10*1000;// 10 seconds
    const DEVICE_MODE_DESTINATIONS_PLUGIN='DeviceModeDestinationsPlugin';
    
    const DESTINATION_NOT_SUPPORTED_ERROR=destUserFriendlyId=>`Destination ${destUserFriendlyId} is not supported.`;const DESTINATION_SDK_LOAD_ERROR=(context,destUserFriendlyId)=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to load script for destination ${destUserFriendlyId}.`;const DESTINATION_INIT_ERROR=destUserFriendlyId=>`Failed to initialize destination ${destUserFriendlyId}.`;const DESTINATION_INTEGRATIONS_DATA_ERROR=destUserFriendlyId=>`Failed to get integrations data for destination ${destUserFriendlyId}.`;const DESTINATION_READY_TIMEOUT_ERROR=(timeout,destUserFriendlyId)=>`A timeout of ${timeout} ms occurred while trying to check the ready status for "${destUserFriendlyId}" destination.`;
    
    /**
     * Determines if the destination SDK code is evaluated
     * @param destSDKIdentifier The name of the global globalThis object that contains the destination SDK
     * @param sdkTypeName The name of the destination SDK type
     * @param logger Logger instance
     * @returns true if the destination SDK code is evaluated, false otherwise
     */const isDestinationSDKMounted=(destSDKIdentifier,sdkTypeName,logger)=>Boolean(globalThis[destSDKIdentifier]&&globalThis[destSDKIdentifier][sdkTypeName]&&globalThis[destSDKIdentifier][sdkTypeName].prototype&&typeof globalThis[destSDKIdentifier][sdkTypeName].prototype.constructor!=='undefined');const createDestinationInstance=(destSDKIdentifier,sdkTypeName,dest,state)=>{const rAnalytics=globalThis.rudderanalytics;const analytics=rAnalytics.getAnalyticsInstance(state.lifecycle.writeKey.value);return new globalThis[destSDKIdentifier][sdkTypeName](clone(dest.config),{loadIntegration:state.nativeDestinations.loadIntegration.value,logLevel:state.lifecycle.logLevel.value,loadOnlyIntegrations:state.consents.postConsent.value?.integrations??state.nativeDestinations.loadOnlyIntegrations.value,page:(category,name,properties,options,callback)=>analytics.page(pageArgumentsToCallOptions(category,name,properties,options,callback)),track:(event,properties,options,callback)=>analytics.track(trackArgumentsToCallOptions(event,properties,options,callback)),identify:(userId,traits,options,callback)=>analytics.identify(identifyArgumentsToCallOptions(userId,traits,options,callback)),alias:(to,from,options,callback)=>analytics.alias(aliasArgumentsToCallOptions(to,from,options,callback)),group:(groupId,traits,options,callback)=>analytics.group(groupArgumentsToCallOptions(groupId,traits,options,callback)),getAnonymousId:()=>analytics.getAnonymousId(),getUserId:()=>analytics.getUserId(),getUserTraits:()=>analytics.getUserTraits(),getGroupId:()=>analytics.getGroupId(),getGroupTraits:()=>analytics.getGroupTraits(),getSessionId:()=>analytics.getSessionId()},{shouldApplyDeviceModeTransformation:dest.shouldApplyDeviceModeTransformation,propagateEventsUntransformedOnError:dest.propagateEventsUntransformedOnError,destinationId:dest.id});};const isDestinationReady=dest=>new Promise((resolve,reject)=>{const instance=dest.instance;let handleNumber;const checkReady=()=>{if(instance.isLoaded()&&(!instance.isReady||instance.isReady())){resolve(true);}else {handleNumber=globalThis.requestAnimationFrame(checkReady);}};checkReady();setTimeout(()=>{globalThis.cancelAnimationFrame(handleNumber);reject(new Error(DESTINATION_READY_TIMEOUT_ERROR(READY_CHECK_TIMEOUT_MS,dest.userFriendlyId)));},READY_CHECK_TIMEOUT_MS);});/**
     * Extracts the integration config, if any, from the given destination
     * and merges it with the current integrations config
     * @param dest Destination object
     * @param curDestIntgConfig Current destinations integration config
     * @param logger Logger object
     * @returns Combined destinations integrations config
     */const getCumulativeIntegrationsConfig=(dest,curDestIntgConfig,errorHandler)=>{let integrationsConfig=curDestIntgConfig;if(isFunction(dest.instance?.getDataForIntegrationsObject)){try{integrationsConfig=mergeDeepRight(curDestIntgConfig,dest.instance?.getDataForIntegrationsObject());}catch(err){errorHandler?.onError(err,DEVICE_MODE_DESTINATIONS_PLUGIN,DESTINATION_INTEGRATIONS_DATA_ERROR(dest.userFriendlyId));}}return integrationsConfig;};const initializeDestination=(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger)=>{try{const initializedDestination=clone(dest);const destInstance=createDestinationInstance(destSDKIdentifier,sdkTypeName,dest,state);initializedDestination.instance=destInstance;destInstance.init();isDestinationReady(initializedDestination).then(()=>{// Collect the integrations data for the hybrid mode destinations
    if(isHybridModeDestination(initializedDestination)){state.nativeDestinations.integrationsConfig.value=getCumulativeIntegrationsConfig(initializedDestination,state.nativeDestinations.integrationsConfig.value,errorHandler);}state.nativeDestinations.initializedDestinations.value=[...state.nativeDestinations.initializedDestinations.value,initializedDestination];}).catch(err=>{state.nativeDestinations.failedDestinations.value=[...state.nativeDestinations.failedDestinations.value,dest];// The error message is already formatted in the isDestinationReady function
    logger?.error(err);});}catch(err){state.nativeDestinations.failedDestinations.value=[...state.nativeDestinations.failedDestinations.value,dest];errorHandler?.onError(err,DEVICE_MODE_DESTINATIONS_PLUGIN,DESTINATION_INIT_ERROR(dest.userFriendlyId));}};
    
    const pluginName$b='DeviceModeDestinations';const DeviceModeDestinations=()=>({name:pluginName$b,initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$b];},nativeDestinations:{setActiveDestinations(state,pluginsManager,errorHandler,logger){// Normalize the integration options from the load API call
    state.nativeDestinations.loadOnlyIntegrations.value=clone(state.loadOptions.value.integrations)??DEFAULT_INTEGRATIONS_CONFIG;state.nativeDestinations.loadIntegration.value=state.loadOptions.value.loadIntegration;// Filter destination that doesn't have mapping config-->Integration names
    const configSupportedDestinations=state.nativeDestinations.configuredDestinations.value.filter(configDest=>{if(destDisplayNamesToFileNamesMap[configDest.displayName]){return true;}errorHandler?.onError(new Error(DESTINATION_NOT_SUPPORTED_ERROR(configDest.userFriendlyId)),DEVICE_MODE_DESTINATIONS_PLUGIN);return false;});// Filter destinations that are disabled through load or consent API options
    const destinationsToLoad=filterDestinations(state.consents.postConsent.value?.integrations??state.nativeDestinations.loadOnlyIntegrations.value,configSupportedDestinations);const consentedDestinations=destinationsToLoad.filter(dest=>// if consent manager is not configured, then default to load the destination
    pluginsManager.invokeSingle(`consentManager.isDestinationConsented`,state,dest.config,errorHandler,logger)??true);state.nativeDestinations.activeDestinations.value=consentedDestinations;},load(state,externalSrcLoader,errorHandler,logger,externalScriptOnLoad){const integrationsCDNPath=state.lifecycle.integrationsCDNPath.value;const activeDestinations=state.nativeDestinations.activeDestinations.value;activeDestinations.forEach(dest=>{const sdkName=destDisplayNamesToFileNamesMap[dest.displayName];const destSDKIdentifier=`${sdkName}_RS`;// this is the name of the object loaded on the window
    const sdkTypeName=sdkName;if(sdkTypeName&&!isDestinationSDKMounted(destSDKIdentifier,sdkTypeName)){const destSdkURL=`${integrationsCDNPath}/${sdkName}.min.js`;externalSrcLoader.loadJSFile({url:destSdkURL,id:dest.userFriendlyId,callback:externalScriptOnLoad??(id=>{if(!id){logger?.error(DESTINATION_SDK_LOAD_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN,dest.userFriendlyId));state.nativeDestinations.failedDestinations.value=[...state.nativeDestinations.failedDestinations.value,dest];}else {initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger);}}),timeout:SCRIPT_LOAD_TIMEOUT_MS});}else if(sdkTypeName){initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger);}else {logger?.error(DESTINATION_SDK_LOAD_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN,dest.displayName));}});}}});
    
    const DEFAULT_TRANSFORMATION_QUEUE_OPTIONS={minRetryDelay:500,backoffFactor:2,maxAttempts:3};const REQUEST_TIMEOUT_MS$1=10*1000;// 10 seconds
    const QUEUE_NAME$2='rudder';const DMT_PLUGIN='DeviceModeTransformationPlugin';
    
    const DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR=(context,displayName,reason,action)=>`${context}${LOG_CONTEXT_SEPARATOR}Event transformation unsuccessful for destination "${displayName}". Reason: ${reason}. ${action}.`;const DMT_REQUEST_FAILED_ERROR=(context,displayName,status,action)=>`${context}${LOG_CONTEXT_SEPARATOR}[Destination: ${displayName}].Transformation request failed with status: ${status}. Retries exhausted. ${action}.`;const DMT_EXCEPTION=displayName=>`[Destination:${displayName}].`;const DMT_SERVER_ACCESS_DENIED_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}Transformation server access is denied. The configuration data seems to be out of sync. Sending untransformed event to the destination.`;
    
    /**
     * A helper function that will take rudderEvent and generate
     * a batch payload that will be sent to transformation server
     *
     */const createPayload=(event,destinationIds,token)=>{const orderNo=Date.now();const payload={metadata:{'Custom-Authorization':token},batch:[{orderNo,destinationIds,event}]};return payload;};const sendTransformedEventToDestinations=(state,pluginsManager,destinationIds,result,status,event,errorHandler,logger)=>{const NATIVE_DEST_EXT_POINT='destinationsEventsQueue.enqueueEventToDestination';const ACTION_TO_SEND_UNTRANSFORMED_EVENT='Sending untransformed event';const ACTION_TO_DROP_EVENT='Dropping the event';const destinations=state.nativeDestinations.initializedDestinations.value.filter(d=>d&&destinationIds.includes(d.id));destinations.forEach(dest=>{try{const eventsToSend=[];switch(status){case 200:{const response=JSON.parse(result);const destTransformedResult=response.transformedBatch.find(e=>e.id===dest.id);destTransformedResult?.payload.forEach(tEvent=>{if(tEvent.status==='200'){eventsToSend.push(tEvent.event);}else {let reason='Unknown';if(tEvent.status==='410'){reason='Transformation is not available';}let action=ACTION_TO_DROP_EVENT;if(dest.propagateEventsUntransformedOnError===true){action=ACTION_TO_SEND_UNTRANSFORMED_EVENT;eventsToSend.push(event);logger?.warn(DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(DMT_PLUGIN,dest.displayName,reason,action));}else {logger?.error(DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(DMT_PLUGIN,dest.displayName,reason,action));}}});break;}// Transformation server access denied
    case 404:{logger?.warn(DMT_SERVER_ACCESS_DENIED_WARNING(DMT_PLUGIN));eventsToSend.push(event);break;}default:{if(dest.propagateEventsUntransformedOnError===true){logger?.warn(DMT_REQUEST_FAILED_ERROR(DMT_PLUGIN,dest.displayName,status,ACTION_TO_SEND_UNTRANSFORMED_EVENT));eventsToSend.push(event);}else {logger?.error(DMT_REQUEST_FAILED_ERROR(DMT_PLUGIN,dest.displayName,status,ACTION_TO_DROP_EVENT));}break;}}eventsToSend?.forEach(tEvent=>{if(isNonEmptyObject(tEvent)){pluginsManager.invokeSingle(NATIVE_DEST_EXT_POINT,state,tEvent,dest,errorHandler,logger);}});}catch(e){errorHandler?.onError(e,DMT_PLUGIN,DMT_EXCEPTION(dest.displayName));}});};
    
    const pluginName$a='DeviceModeTransformation';const DeviceModeTransformation=()=>({name:pluginName$a,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$a];},transformEvent:{init(state,pluginsManager,httpClient,storeManager,errorHandler,logger){const writeKey=state.lifecycle.writeKey.value;httpClient.setAuthHeader(writeKey);const eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
    `${QUEUE_NAME$2}_${writeKey}`,DEFAULT_TRANSFORMATION_QUEUE_OPTIONS,(item,done,attemptNumber,maxRetryAttempts)=>{const payload=createPayload(item.event,item.destinationIds,item.token);httpClient.getAsyncData({url:`${state.lifecycle.dataPlaneUrl.value}/transform`,options:{method:'POST',data:getDMTDeliveryPayload(payload),sendRawData:true},isRawResponse:true,timeout:REQUEST_TIMEOUT_MS$1,callback:(result,details)=>{// null means item will not be requeued
    const queueErrResp=isErrRetryable(details)?details:null;if(!queueErrResp||attemptNumber===maxRetryAttempts){sendTransformedEventToDestinations(state,pluginsManager,item.destinationIds,result,details?.xhr?.status,item.event,errorHandler,logger);}done(queueErrResp,result);}});},storeManager,MEMORY_STORAGE);return eventsQueue;},enqueue(state,eventsQueue,event,destinations){const destinationIds=destinations.map(d=>d.id);eventsQueue.addItem({event,destinationIds,token:state.session.authToken.value});}}});
    
    const INVALID_SOURCE_CONFIG_ERROR=`Invalid source configuration or source id.`;
    
    const pluginName$9='ErrorReporting';const ErrorReporting=()=>({name:pluginName$9,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$9];},errorReporting:{init:(state,pluginEngine,externalSrcLoader,logger)=>{if(!state.source.value?.config||!state.source.value?.id){return Promise.reject(new Error(INVALID_SOURCE_CONFIG_ERROR));}return pluginEngine.invokeSingle('errorReportingProvider.init',state,externalSrcLoader,logger);},notify:(pluginEngine,client,error,state,logger)=>{pluginEngine.invokeSingle('errorReportingProvider.notify',client,error,state,logger);},breadcrumb:(pluginEngine,client,message,logger)=>{pluginEngine.invokeSingle('errorReportingProvider.breadcrumb',client,message,logger);}}});
    
    const externallyLoadedSessionStorageKeys={segment:'ajs_anonymous_id'};
    
    const getSegmentAnonymousId=getStorageEngine=>{let anonymousId;/**
       * First check the local storage for anonymousId
       * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
       */const lsEngine=getStorageEngine(LOCAL_STORAGE);if(lsEngine?.isEnabled){anonymousId=lsEngine.getItem(externallyLoadedSessionStorageKeys.segment);}// If anonymousId is not present in local storage and find it in cookies
    const csEngine=getStorageEngine(COOKIE_STORAGE);if(!anonymousId&&csEngine?.isEnabled){anonymousId=csEngine.getItem(externallyLoadedSessionStorageKeys.segment);}return anonymousId;};
    
    const pluginName$8='ExternalAnonymousId';const ExternalAnonymousId=()=>({name:pluginName$8,initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$8];},storage:{getAnonymousId(getStorageEngine,options){let anonymousId;if(options?.autoCapture?.enabled&&options.autoCapture.source){const source=options.autoCapture.source.toLowerCase();if(!Object.keys(externallyLoadedSessionStorageKeys).includes(source)){return anonymousId;}// eslint-disable-next-line sonarjs/no-small-switch
    switch(source){case'segment':anonymousId=getSegmentAnonymousId(getStorageEngine);break;}}return anonymousId;}}});
    
    const AMP_LINKER_ANONYMOUS_ID_KEY='rs_amp_id';
    
    /* eslint-disable no-bitwise */ /**
     * generate crc table
     *
     * @params none
     * @returns array of CRC table
     */const makeCRCTable=()=>{const crcTable=[];let c;for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++){c=c&1?0xedb88320^c>>>1:c>>>1;}crcTable[n]=c;}return crcTable;};/**
     * This is utility function for crc32 algorithm
     *
     * @param {string} str
     * @returns {number} crc32
     */const crc32=str=>{const crcTable=makeCRCTable();let crc=0^-1;for(let i=0;i<str.length;i++){// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    crc=crc>>>8^crcTable[(crc^str.charCodeAt(i))&0xff];}return (crc^-1)>>>0;};
    
    /**
     * An interface to fetch user device details.
     */const USER_INTERFACE={/**
       * @returns {string} user language
       */getUserLanguage:()=>navigator?.language,/**
       * @returns {string} userAgent
       */getUserAgent:()=>navigator?.userAgent};
    
    /**
     * This is utility function for decoding from base 64 to utf8
     *
     * @param {string} str base64
     *
     * @returns {string} utf8
     */const b64DecodeUnicode=str=>// Going backwards: from bytestream, to percent-encoding, to original string.
    decodeURIComponent(globalThis.atob(str).split('').map(c=>{const percentEncodingChar=`00${c.charCodeAt(0).toString(16)}`;return `%${percentEncodingChar.slice(-2)}`;}).join(''));/**
     * This is utility function for decoding from base 64 to utf8
     *
     * @param {string} data
     *
     * @return {string}
     */const decode$1=(data='')=>{const decodedData=data.endsWith('..')?data.substring(0,data.length-2):data;return b64DecodeUnicode(decodedData);};
    
    const KEY_VALIDATOR=/^[\w.-]+$/;const CHECKSUM_OFFSET_MAX_MIN=1;const VALID_VERSION=1;const DELIMITER='*';/**
     * Parse the linker param value to version checksum and serializedParams
     *
     * @param {string} value
     *
     * @return {?Object}
     */const parseLinkerParamValue=value=>{const parts=value.split(DELIMITER);const isEven=parts.length%2===0;if(parts.length<4||!isEven){// Format <version>*<checksum>*<key1>*<value1>
    // Note: linker makes sure there's at least one pair of non empty key value
    // Make sure there is at least three delimiters.
    return null;}const version=Number(parts.shift());if(version!==VALID_VERSION){return null;}const checksum=parts.shift();const serializedIds=parts.join(DELIMITER);return {checksum:checksum??'',serializedIds};};/**
     * Deserialize the serializedIds and return keyValue pairs.
     *
     * @param {string} serializedIds
     *
     * @return {!Object<string, string>}
     */const deserialize=serializedIds=>{if(!serializedIds){return {};}const keyValuePairs={};const params=serializedIds.split(DELIMITER);for(let i=0;i<params.length;i+=2){const key=params[i];const valid=KEY_VALIDATOR.test(key);if(valid){keyValuePairs[key]=decode$1(params[i+1]);}}return keyValuePairs;};/**
     * Generates a semi-unique value for page visitor.
     *
     * @return {string}
     */const getFingerprint=(userAgent,language)=>{const date=new Date();const timezone=date.getTimezoneOffset();return [userAgent,timezone,language].join(DELIMITER);};/**
     * Rounded time used to check if t2 - t1 is within our time tolerance.
     * Timestamp in minutes, floored.
     *
     * @return {number}
     */const getMinSinceEpoch=()=>Math.floor(Date.now()/60000);/**
     * Create a unique checksum hashing the fingerprint and a few other values.
     *
     * @param {string} serializedIds
     * @param {number=} optOffsetMin
     * @param {string} userAgent
     * @param {string} language
     *
     * @return {string}
     */const getCheckSum=(serializedIds,optOffsetMin,userAgent,language)=>{const fingerprint=getFingerprint(userAgent,language);const offset=optOffsetMin||0;const timestamp=getMinSinceEpoch()-offset;const crc=crc32([fingerprint,timestamp,serializedIds].join(DELIMITER));// Encoded to base36 for fewer bytes.
    return crc.toString(36);};/**
     * Check if the checksum is valid with time offset tolerance.
     *
     * @param {string} serializedIds
     * @param {string} checksum
     *
     * @return {boolean}
     */const isCheckSumValid=(serializedIds,checksum)=>{const userAgent=USER_INTERFACE.getUserAgent();const language=USER_INTERFACE.getUserLanguage();for(let i=0;i<=CHECKSUM_OFFSET_MAX_MIN;i+=1){const calculateCheckSum=getCheckSum(serializedIds,i,userAgent,language);if(calculateCheckSum===checksum){return true;}}return false;};/**
     * AMP Linker Parser (works for Rudder, GA or any other linker created by following Google's linker standard.)
     *
     * @param {string} value
     *
     * @return {?Object<string, string>}
     */const parseLinker=value=>{const linkerObj=parseLinkerParamValue(value);if(!linkerObj){return null;}const{checksum,serializedIds}=linkerObj;if(!serializedIds||!checksum||!isCheckSumValid(serializedIds,checksum)){return null;}return deserialize(serializedIds);};
    
    const pluginName$7='GoogleLinker';const GoogleLinker=()=>({name:pluginName$7,initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$7];},userSession:{anonymousIdGoogleLinker(rudderAmpLinkerParam){if(!rudderAmpLinkerParam){return null;}const parsedAnonymousIdObj=rudderAmpLinkerParam?parseLinker(rudderAmpLinkerParam):null;return parsedAnonymousIdObj?parsedAnonymousIdObj[AMP_LINKER_ANONYMOUS_ID_KEY]:null;}}});
    
    const KETCH_CONSENT_COOKIE_READ_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to read the consent cookie.`;const KETCH_CONSENT_COOKIE_PARSE_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to parse the consent cookie.`;const DESTINATION_CONSENT_STATUS_ERROR$1=`Failed to determine the consent status for the destination. Please check the destination configuration and try again.`;
    
    const KETCH_CONSENT_MANAGER_PLUGIN='KetchConsentManagerPlugin';const KETCH_CONSENT_COOKIE_NAME_V1='_ketch_consent_v1_';
    
    /**
     * Gets the consent data from the Ketch's consent cookie
     * @param storeManager Store manager instance
     * @param logger Logger instance
     * @returns Consent data from the consent cookie
     */const getKetchConsentData=(storeManager,logger)=>{let rawConsentCookieData=null;try{// Create a data store instance to read the consent cookie
    const dataStore=storeManager?.setStore({id:KETCH_CONSENT_MANAGER_PLUGIN,name:KETCH_CONSENT_MANAGER_PLUGIN,type:COOKIE_STORAGE});rawConsentCookieData=dataStore?.engine.getItem(KETCH_CONSENT_COOKIE_NAME_V1);}catch(err){logger?.error(KETCH_CONSENT_COOKIE_READ_ERROR(KETCH_CONSENT_MANAGER_PLUGIN),err);return undefined;}if(isNullOrUndefined(rawConsentCookieData)){return undefined;}// Decode and parse the cookie data to JSON
    let consentCookieData;try{consentCookieData=JSON.parse(fromBase64(rawConsentCookieData));}catch(err){logger?.error(KETCH_CONSENT_COOKIE_PARSE_ERROR(KETCH_CONSENT_MANAGER_PLUGIN),err);return undefined;}if(!consentCookieData){return undefined;}// Convert the cookie data to consent data
    const consentPurposes={};Object.entries(consentCookieData).forEach(pEntry=>{const purposeCode=pEntry[0];const purposeValue=pEntry[1];consentPurposes[purposeCode]=purposeValue?.status==='granted';});return consentPurposes;};/**
     * Gets the consent data in the format expected by the application state
     * @param ketchConsentData Consent data derived from the consent cookie
     * @returns Consent data
     */const getConsentData=ketchConsentData=>{const allowedConsentIds=[];const deniedConsentIds=[];if(ketchConsentData){Object.entries(ketchConsentData).forEach(e=>{const purposeCode=e[0];const isConsented=e[1];if(isConsented){allowedConsentIds.push(purposeCode);}else {deniedConsentIds.push(purposeCode);}});}return {allowedConsentIds,deniedConsentIds};};const updateConsentStateFromData=(state,ketchConsentData)=>{const consentData=getConsentData(ketchConsentData);state.consents.initialized.value=isDefined(ketchConsentData);state.consents.data.value=consentData;};
    
    const pluginName$6='KetchConsentManager';const KetchConsentManager=()=>({name:pluginName$6,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$6];},consentManager:{init(state,logger){// getKetchUserConsentedPurposes returns current ketch opted-in purposes
    // This will be helpful for debugging
    globalThis.getKetchUserConsentedPurposes=()=>state.consents.data.value.allowedConsentIds?.slice();// getKetchUserDeniedPurposes returns current ketch opted-out purposes
    // This will be helpful for debugging
    globalThis.getKetchUserDeniedPurposes=()=>state.consents.data.value.deniedConsentIds?.slice();// updateKetchConsent callback function to update current consent purpose state
    // this will be called from ketch rudderstack plugin
    globalThis.updateKetchConsent=ketchConsentData=>{updateConsentStateFromData(state,ketchConsentData);};},updateConsentsInfo(state,storeManager,logger){// retrieve consent data and update the state
    let ketchConsentData;if(!isUndefined(globalThis.ketchConsent)){ketchConsentData=globalThis.ketchConsent;}else {ketchConsentData=getKetchConsentData(storeManager,logger);}updateConsentStateFromData(state,ketchConsentData);},isDestinationConsented(state,destConfig,errorHandler,logger){if(!state.consents.initialized.value){return true;}const allowedConsentIds=state.consents.data.value.allowedConsentIds;try{const{ketchConsentPurposes,consentManagement}=destConfig;const matchPredicate=consent=>allowedConsentIds.includes(consent);// Generic consent management
    if(consentManagement){// Get the corresponding consents for the destination
    const cmpConsents=consentManagement.find(c=>c.provider===state.consents.provider.value)?.consents;// If there are no consents configured for the destination for the current provider, events should be sent.
    if(!cmpConsents){return true;}const configuredConsents=cmpConsents.map(c=>c.consent.trim()).filter(n=>n);// match the configured consents with user provided consents as per
    // the configured resolution strategy
    switch(state.consents.resolutionStrategy.value){case'or':return configuredConsents.some(matchPredicate)||configuredConsents.length===0;case'and':default:return configuredConsents.every(matchPredicate);}// Legacy cookie consent management
    // TODO: To be removed once the source config API is updated to support generic consent management
    }else if(ketchConsentPurposes){const configuredConsents=ketchConsentPurposes.map(p=>p.purpose.trim()).filter(n=>n);// Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
    return configuredConsents.some(matchPredicate)||configuredConsents.length===0;}// If there are no consents configured for the destination for the current provider, events should be sent.
    return true;}catch(err){errorHandler?.onError(err,KETCH_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR$1);return true;}}}});
    
    const DEFAULT_QUEUE_OPTIONS={maxItems:100};const QUEUE_NAME$1='rudder_destinations_events';const NATIVE_DESTINATION_QUEUE_PLUGIN='NativeDestinationQueuePlugin';
    
    const DESTINATION_EVENT_FILTERING_WARNING=(context,eventName,destUserFriendlyId)=>`${context}${LOG_CONTEXT_SEPARATOR}The "${eventName}" track event has been filtered for the "${destUserFriendlyId}" destination.`;const DESTINATION_EVENT_FORWARDING_ERROR=destUserFriendlyId=>`Failed to forward event to destination "${destUserFriendlyId}".`;
    
    const getNormalizedQueueOptions$1=queueOpts=>mergeDeepRight(DEFAULT_QUEUE_OPTIONS,queueOpts);const isValidEventName=eventName=>eventName&&typeof eventName==='string';const isEventDenyListed=(eventType,eventName,dest)=>{if(eventType!=='track'){return false;}const{blacklistedEvents,whitelistedEvents,eventFilteringOption}=dest.config;switch(eventFilteringOption){// Blacklist is chosen for filtering events
    case'blacklistedEvents':{if(!isValidEventName(eventName)){return false;}const trimmedEventName=eventName.trim();if(Array.isArray(blacklistedEvents)){return blacklistedEvents.some(eventObj=>eventObj.eventName.trim()===trimmedEventName);}return false;}// Whitelist is chosen for filtering events
    case'whitelistedEvents':{if(!isValidEventName(eventName)){return true;}const trimmedEventName=eventName.trim();if(Array.isArray(whitelistedEvents)){return !whitelistedEvents.some(eventObj=>eventObj.eventName.trim()===trimmedEventName);}return true;}case'disable':default:return false;}};const sendEventToDestination=(item,dest,errorHandler,logger)=>{const methodName=item.type.toString();try{// Destinations expect the event to be wrapped under the `message` key
    // This will remain until we update the destinations to accept the event directly
    dest.instance?.[methodName]?.({message:item});}catch(err){errorHandler?.onError(err,NATIVE_DESTINATION_QUEUE_PLUGIN,DESTINATION_EVENT_FORWARDING_ERROR(dest.userFriendlyId));}};
    
    const pluginName$5='NativeDestinationQueue';const NativeDestinationQueue=()=>({name:pluginName$5,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$5];},destinationsEventsQueue:{/**
         * Initialize the queue for delivery to destinations
         * @param state Application state
         * @param pluginsManager PluginsManager instance
         * @param storeManager StoreManager instance
         * @param errorHandler Error handler instance
         * @param logger Logger instance
         * @returns IQueue instance
         */init(state,pluginsManager,storeManager,dmtQueue,errorHandler,logger){const finalQOpts=getNormalizedQueueOptions$1(state.loadOptions.value.destinationsQueueOptions);const writeKey=state.lifecycle.writeKey.value;const eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
    `${QUEUE_NAME$1}_${writeKey}`,finalQOpts,(rudderEvent,done)=>{const destinationsToSend=filterDestinations(rudderEvent.integrations,state.nativeDestinations.initializedDestinations.value);// list of destinations which are enable for DMT
    const destWithTransformationEnabled=[];const clonedRudderEvent=clone(rudderEvent);destinationsToSend.forEach(dest=>{try{const sendEvent=!isEventDenyListed(clonedRudderEvent.type,clonedRudderEvent.event,dest);if(!sendEvent){logger?.warn(DESTINATION_EVENT_FILTERING_WARNING(NATIVE_DESTINATION_QUEUE_PLUGIN,clonedRudderEvent.event,dest.userFriendlyId));return;}if(dest.shouldApplyDeviceModeTransformation){destWithTransformationEnabled.push(dest);}else {sendEventToDestination(clonedRudderEvent,dest,errorHandler,logger);}}catch(e){errorHandler?.onError(e,NATIVE_DESTINATION_QUEUE_PLUGIN);}});if(destWithTransformationEnabled.length>0){pluginsManager.invokeSingle('transformEvent.enqueue',state,dmtQueue,clonedRudderEvent,destWithTransformationEnabled,errorHandler,logger);}// Mark success always
    done(null);},storeManager,MEMORY_STORAGE);// TODO: This seems to not work as expected. Need to investigate
    // effect(() => {
    //   if (state.nativeDestinations.clientDestinationsReady.value === true) {
    //     eventsQueue.start();
    //   }
    // });
    return eventsQueue;},/**
         * Add event to the queue for delivery to destinations
         * @param state Application state
         * @param eventsQueue IQueue instance
         * @param event RudderEvent object
         * @param errorHandler Error handler instance
         * @param logger Logger instance
         * @returns none
         */enqueue(state,eventsQueue,event,errorHandler,logger){eventsQueue.addItem(event);},/**
         * This extension point is used to directly send the transformed event to the destination
         * @param state Application state
         * @param event RudderEvent Object
         * @param destination Destination Object
         * @param errorHandler Error handler instance
         * @param logger Logger instance
         */enqueueEventToDestination(state,event,destination,errorHandler,logger){sendEventToDestination(event,destination,errorHandler);}}});
    
    const ONETRUST_ACCESS_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack SDK.`;const DESTINATION_CONSENT_STATUS_ERROR=`Failed to determine the consent status for the destination. Please check the destination configuration and try again.`;
    
    const ONETRUST_CONSENT_MANAGER_PLUGIN='OneTrustConsentManagerPlugin';
    
    const pluginName$4='OneTrustConsentManager';const OneTrustConsentManager=()=>({name:pluginName$4,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$4];},consentManager:{init(state,logger){// Nothing to initialize
    },updateConsentsInfo(state,storeManager,logger){if(!globalThis.OneTrust||!globalThis.OnetrustActiveGroups){logger?.error(ONETRUST_ACCESS_ERROR(ONETRUST_CONSENT_MANAGER_PLUGIN));state.consents.initialized.value=false;return;}// Get the groups (cookie categorization), user has created in OneTrust account.
    const oneTrustAllGroupsInfo=globalThis.OneTrust.GetDomainData().Groups;// OneTrustConsentManager SDK populates a data layer object OnetrustActiveGroups with
    // the cookie categories Ids that the user has consented to.
    // Eg: ',C0001,C0003,'
    // We split it and save it as an array.
    const allowedConsentIds=globalThis.OnetrustActiveGroups.split(',').filter(n=>n);const deniedConsentIds=[];oneTrustAllGroupsInfo.forEach(({CustomGroupId})=>{if(!allowedConsentIds.includes(CustomGroupId)){deniedConsentIds.push(CustomGroupId);}});state.consents.initialized.value=true;state.consents.data.value={allowedConsentIds,deniedConsentIds};},isDestinationConsented(state,destConfig,errorHandler,logger){if(!state.consents.initialized.value){return true;}const allowedConsentIds=state.consents.data.value.allowedConsentIds;try{// mapping of the destination with the consent group name
    const{oneTrustCookieCategories,consentManagement}=destConfig;const matchPredicate=consent=>allowedConsentIds.includes(consent);// Generic consent management
    if(consentManagement){// Get the corresponding consents for the destination
    const cmpConsents=consentManagement.find(c=>c.provider===state.consents.provider.value)?.consents;// If there are no consents configured for the destination for the current provider, events should be sent.
    if(!cmpConsents){return true;}const configuredConsents=cmpConsents.map(c=>c.consent.trim()).filter(n=>n);// match the configured consents with user provided consents as per
    // the configured resolution strategy
    switch(state.consents.resolutionStrategy.value){case'or':return configuredConsents.some(matchPredicate)||configuredConsents.length===0;case'and':default:return configuredConsents.every(matchPredicate);}// Legacy cookie consent management
    // TODO: To be removed once the source config API is updated to support generic consent management
    }else if(oneTrustCookieCategories){// Change the structure of oneTrustConsentGroup as an array and filter values if empty string
    // Eg:
    // ["Performance Cookies", "Functional Cookies"]
    const configuredConsents=oneTrustCookieCategories.map(c=>c.oneTrustCookieCategory.trim()).filter(n=>n);// Check if all the destination's mapped cookie categories are consented by the user in the browser.
    return configuredConsents.every(matchPredicate);}// If there are no consents configured for the destination for the current provider, events should be sent.
    return true;}catch(err){errorHandler?.onError(err,ONETRUST_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR);return true;}}}});
    
    const pluginName$3='StorageEncryption';const StorageEncryption=()=>({name:pluginName$3,initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$3];},storage:{encrypt(value){return encrypt$1(value);},decrypt(value){return decrypt$1(value);}}});
    
    /* eslint-disable no-use-before-define */const crypto$1=(typeof globalThis!='undefined'?globalThis:void 0)?.crypto||(typeof global!='undefined'?global:void 0)?.crypto||(typeof window!='undefined'?window:void 0)?.crypto||(typeof self!='undefined'?self:void 0)?.crypto||(typeof frames!='undefined'?frames:void 0)?.[0]?.crypto;let randomWordArray;if(crypto$1){randomWordArray=nBytes=>{const words=[];for(let i=0,rcache;i<nBytes;i+=4){words.push(crypto$1.getRandomValues(new Uint32Array(1))[0]);}return new WordArray(words,nBytes);};}else {// Because there is no global crypto property in this context, cryptographically unsafe Math.random() is used.
    randomWordArray=nBytes=>{const words=[];const r=m_w=>{let _m_w=m_w;let _m_z=0x3ade68b1;const mask=0xffffffff;return ()=>{_m_z=0x9069*(_m_z&0xFFFF)+(_m_z>>0x10)&mask;_m_w=0x4650*(_m_w&0xFFFF)+(_m_w>>0x10)&mask;let result=(_m_z<<0x10)+_m_w&mask;result/=0x100000000;result+=0.5;return result*(Math.random()>0.5?1:-1);};};for(let i=0,rcache;i<nBytes;i+=4){const _r=r((rcache||Math.random())*0x100000000);rcache=_r()*0x3ade67b7;words.push(_r()*0x100000000|0);}return new WordArray(words,nBytes);};}/**
     * Base class for inheritance.
     */class Base{/**
       * Extends this object and runs the init method.
       * Arguments to create() will be passed to init().
       *
       * @return {Object} The new object.
       *
       * @static
       *
       * @example
       *
       *     var instance = MyType.create();
       */static create(...args){return new this(...args);}/**
       * Copies properties into this object.
       *
       * @param {Object} properties The properties to mix in.
       *
       * @example
       *
       *     MyType.mixIn({
       *         field: 'value'
       *     });
       */mixIn(properties){return Object.assign(this,properties);}/**
       * Creates a copy of this object.
       *
       * @return {Object} The clone.
       *
       * @example
       *
       *     var clone = instance.clone();
       */clone(){const clone=new this.constructor();Object.assign(clone,this);return clone;}}/**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */class WordArray extends Base{/**
       * Initializes a newly created word array.
       *
       * @param {Array} words (Optional) An array of 32-bit words.
       * @param {number} sigBytes (Optional) The number of significant bytes in the words.
       *
       * @example
       *
       *     var wordArray = CryptoJS.lib.WordArray.create();
       *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
       *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
       */constructor(words=[],sigBytes=words.length*4){super();let typedArray=words;// Convert buffers to uint8
    if(typedArray instanceof ArrayBuffer){typedArray=new Uint8Array(typedArray);}// Convert other array views to uint8
    if(typedArray instanceof Int8Array||typedArray instanceof Uint8ClampedArray||typedArray instanceof Int16Array||typedArray instanceof Uint16Array||typedArray instanceof Int32Array||typedArray instanceof Uint32Array||typedArray instanceof Float32Array||typedArray instanceof Float64Array){typedArray=new Uint8Array(typedArray.buffer,typedArray.byteOffset,typedArray.byteLength);}// Handle Uint8Array
    if(typedArray instanceof Uint8Array){// Shortcut
    const typedArrayByteLength=typedArray.byteLength;// Extract bytes
    const _words=[];for(let i=0;i<typedArrayByteLength;i+=1){_words[i>>>2]|=typedArray[i]<<24-i%4*8;}// Initialize this word array
    this.words=_words;this.sigBytes=typedArrayByteLength;}else {// Else call normal init
    this.words=words;this.sigBytes=sigBytes;}}/**
       * Creates a word array filled with random bytes.
       *
       * @param {number} nBytes The number of random bytes to generate.
       *
       * @return {WordArray} The random word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.lib.WordArray.random(16);
       */static random=randomWordArray;/**
       * Converts this word array to a string.
       *
       * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
       *
       * @return {string} The stringified word array.
       *
       * @example
       *
       *     var string = wordArray + '';
       *     var string = wordArray.toString();
       *     var string = wordArray.toString(CryptoJS.enc.Utf8);
       */toString(encoder=Hex){return encoder.stringify(this);}/**
       * Concatenates a word array to this word array.
       *
       * @param {WordArray} wordArray The word array to append.
       *
       * @return {WordArray} This word array.
       *
       * @example
       *
       *     wordArray1.concat(wordArray2);
       */concat(wordArray){// Shortcuts
    const thisWords=this.words;const thatWords=wordArray.words;const thisSigBytes=this.sigBytes;const thatSigBytes=wordArray.sigBytes;// Clamp excess bits
    this.clamp();// Concat
    if(thisSigBytes%4){// Copy one byte at a time
    for(let i=0;i<thatSigBytes;i+=1){const thatByte=thatWords[i>>>2]>>>24-i%4*8&0xff;thisWords[thisSigBytes+i>>>2]|=thatByte<<24-(thisSigBytes+i)%4*8;}}else {// Copy one word at a time
    for(let i=0;i<thatSigBytes;i+=4){thisWords[thisSigBytes+i>>>2]=thatWords[i>>>2];}}this.sigBytes+=thatSigBytes;// Chainable
    return this;}/**
       * Removes insignificant bits.
       *
       * @example
       *
       *     wordArray.clamp();
       */clamp(){// Shortcuts
    const{words,sigBytes}=this;// Clamp
    words[sigBytes>>>2]&=0xffffffff<<32-sigBytes%4*8;words.length=Math.ceil(sigBytes/4);}/**
       * Creates a copy of this word array.
       *
       * @return {WordArray} The clone.
       *
       * @example
       *
       *     var clone = wordArray.clone();
       */clone(){const clone=super.clone.call(this);clone.words=this.words.slice(0);return clone;}}/**
     * Hex encoding strategy.
     */const Hex={/**
       * Converts a word array to a hex string.
       *
       * @param {WordArray} wordArray The word array.
       *
       * @return {string} The hex string.
       *
       * @static
       *
       * @example
       *
       *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
       */stringify(wordArray){// Shortcuts
    const{words,sigBytes}=wordArray;// Convert
    const hexChars=[];for(let i=0;i<sigBytes;i+=1){const bite=words[i>>>2]>>>24-i%4*8&0xff;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&0x0f).toString(16));}return hexChars.join('');},/**
       * Converts a hex string to a word array.
       *
       * @param {string} hexStr The hex string.
       *
       * @return {WordArray} The word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
       */parse(hexStr){// Shortcut
    const hexStrLength=hexStr.length;// Convert
    const words=[];for(let i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<24-i%8*4;}return new WordArray(words,hexStrLength/2);}};/**
     * Latin1 encoding strategy.
     */const Latin1={/**
       * Converts a word array to a Latin1 string.
       *
       * @param {WordArray} wordArray The word array.
       *
       * @return {string} The Latin1 string.
       *
       * @static
       *
       * @example
       *
       *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
       */stringify(wordArray){// Shortcuts
    const{words,sigBytes}=wordArray;// Convert
    const latin1Chars=[];for(let i=0;i<sigBytes;i+=1){const bite=words[i>>>2]>>>24-i%4*8&0xff;latin1Chars.push(String.fromCharCode(bite));}return latin1Chars.join('');},/**
       * Converts a Latin1 string to a word array.
       *
       * @param {string} latin1Str The Latin1 string.
       *
       * @return {WordArray} The word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
       */parse(latin1Str){// Shortcut
    const latin1StrLength=latin1Str.length;// Convert
    const words=[];for(let i=0;i<latin1StrLength;i+=1){words[i>>>2]|=(latin1Str.charCodeAt(i)&0xff)<<24-i%4*8;}return new WordArray(words,latin1StrLength);}};/**
     * UTF-8 encoding strategy.
     */const Utf8={/**
       * Converts a word array to a UTF-8 string.
       *
       * @param {WordArray} wordArray The word array.
       *
       * @return {string} The UTF-8 string.
       *
       * @static
       *
       * @example
       *
       *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
       */stringify(wordArray){try{return decodeURIComponent(escape(Latin1.stringify(wordArray)));}catch(e){throw new Error('Malformed UTF-8 data');}},/**
       * Converts a UTF-8 string to a word array.
       *
       * @param {string} utf8Str The UTF-8 string.
       *
       * @return {WordArray} The word array.
       *
       * @static
       *
       * @example
       *
       *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
       */parse(utf8Str){return Latin1.parse(unescape(encodeURIComponent(utf8Str)));}};/**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize
     *
     *     The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */class BufferedBlockAlgorithm extends Base{constructor(){super();this._minBufferSize=0;}/**
       * Resets this block algorithm's data buffer to its initial state.
       *
       * @example
       *
       *     bufferedBlockAlgorithm.reset();
       */reset(){// Initial values
    this._data=new WordArray();this._nDataBytes=0;}/**
       * Adds new data to this block algorithm's buffer.
       *
       * @param {WordArray|string} data
       *
       *     The data to append. Strings are converted to a WordArray using UTF-8.
       *
       * @example
       *
       *     bufferedBlockAlgorithm._append('data');
       *     bufferedBlockAlgorithm._append(wordArray);
       */_append(data){let m_data=data;// Convert string to WordArray, else assume WordArray already
    if(typeof m_data==='string'){m_data=Utf8.parse(m_data);}// Append
    this._data.concat(m_data);this._nDataBytes+=m_data.sigBytes;}/**
       * Processes available data blocks.
       *
       * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
       *
       * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
       *
       * @return {WordArray} The processed data.
       *
       * @example
       *
       *     var processedData = bufferedBlockAlgorithm._process();
       *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
       */_process(doFlush){let processedWords;// Shortcuts
    const{_data:data,blockSize}=this;const dataWords=data.words;const dataSigBytes=data.sigBytes;const blockSizeBytes=blockSize*4;// Count blocks ready
    let nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){// Round up to include partial blocks
    nBlocksReady=Math.ceil(nBlocksReady);}else {// Round down to include only full blocks,
    // less the number of blocks that must remain in the buffer
    nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0);}// Count words ready
    const nWordsReady=nBlocksReady*blockSize;// Count bytes ready
    const nBytesReady=Math.min(nWordsReady*4,dataSigBytes);// Process blocks
    if(nWordsReady){for(let offset=0;offset<nWordsReady;offset+=blockSize){// Perform concrete-algorithm logic
    this._doProcessBlock(dataWords,offset);}// Remove processed words
    processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady;}// Return processed words
    return new WordArray(processedWords,nBytesReady);}/**
       * Creates a copy of this object.
       *
       * @return {Object} The clone.
       *
       * @example
       *
       *     var clone = bufferedBlockAlgorithm.clone();
       */clone(){const clone=super.clone.call(this);clone._data=this._data.clone();return clone;}}/**
     * Abstract hasher template.
     *
     * @property {number} blockSize
     *
     *     The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */class Hasher extends BufferedBlockAlgorithm{constructor(cfg){super();this.blockSize=512/32;/**
         * Configuration options.
         */this.cfg=Object.assign(new Base(),cfg);// Set initial values
    this.reset();}/**
       * Creates a shortcut function to a hasher's object interface.
       *
       * @param {Hasher} SubHasher The hasher to create a helper for.
       *
       * @return {Function} The shortcut function.
       *
       * @static
       *
       * @example
       *
       *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
       */static _createHelper(SubHasher){return (message,cfg)=>new SubHasher(cfg).finalize(message);}/**
       * Creates a shortcut function to the HMAC's object interface.
       *
       * @param {Hasher} SubHasher The hasher to use in this HMAC helper.
       *
       * @return {Function} The shortcut function.
       *
       * @static
       *
       * @example
       *
       *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
       */static _createHmacHelper(SubHasher){return (message,key)=>new HMAC(SubHasher,key).finalize(message);}/**
       * Resets this hasher to its initial state.
       *
       * @example
       *
       *     hasher.reset();
       */reset(){// Reset data buffer
    super.reset.call(this);// Perform concrete-hasher logic
    this._doReset();}/**
       * Updates this hasher with a message.
       *
       * @param {WordArray|string} messageUpdate The message to append.
       *
       * @return {Hasher} This hasher.
       *
       * @example
       *
       *     hasher.update('message');
       *     hasher.update(wordArray);
       */update(messageUpdate){// Append
    this._append(messageUpdate);// Update the hash
    this._process();// Chainable
    return this;}/**
       * Finalizes the hash computation.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} messageUpdate (Optional) A final message update.
       *
       * @return {WordArray} The hash.
       *
       * @example
       *
       *     var hash = hasher.finalize();
       *     var hash = hasher.finalize('message');
       *     var hash = hasher.finalize(wordArray);
       */finalize(messageUpdate){// Final message update
    if(messageUpdate){this._append(messageUpdate);}// Perform concrete-hasher logic
    const hash=this._doFinalize();return hash;}}/**
     * HMAC algorithm.
     */class HMAC extends Base{/**
       * Initializes a newly created HMAC.
       *
       * @param {Hasher} SubHasher The hash algorithm to use.
       * @param {WordArray|string} key The secret key.
       *
       * @example
       *
       *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
       */constructor(SubHasher,key){super();const hasher=new SubHasher();this._hasher=hasher;// Convert string to WordArray, else assume WordArray already
    let _key=key;if(typeof _key==='string'){_key=Utf8.parse(_key);}// Shortcuts
    const hasherBlockSize=hasher.blockSize;const hasherBlockSizeBytes=hasherBlockSize*4;// Allow arbitrary length keys
    if(_key.sigBytes>hasherBlockSizeBytes){_key=hasher.finalize(key);}// Clamp excess bits
    _key.clamp();// Clone key for inner and outer pads
    const oKey=_key.clone();this._oKey=oKey;const iKey=_key.clone();this._iKey=iKey;// Shortcuts
    const oKeyWords=oKey.words;const iKeyWords=iKey.words;// XOR keys with pad constants
    for(let i=0;i<hasherBlockSize;i+=1){oKeyWords[i]^=0x5c5c5c5c;iKeyWords[i]^=0x36363636;}oKey.sigBytes=hasherBlockSizeBytes;iKey.sigBytes=hasherBlockSizeBytes;// Set initial values
    this.reset();}/**
       * Resets this HMAC to its initial state.
       *
       * @example
       *
       *     hmacHasher.reset();
       */reset(){// Shortcut
    const hasher=this._hasher;// Reset
    hasher.reset();hasher.update(this._iKey);}/**
       * Updates this HMAC with a message.
       *
       * @param {WordArray|string} messageUpdate The message to append.
       *
       * @return {HMAC} This HMAC instance.
       *
       * @example
       *
       *     hmacHasher.update('message');
       *     hmacHasher.update(wordArray);
       */update(messageUpdate){this._hasher.update(messageUpdate);// Chainable
    return this;}/**
       * Finalizes the HMAC computation.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} messageUpdate (Optional) A final message update.
       *
       * @return {WordArray} The HMAC.
       *
       * @example
       *
       *     var hmac = hmacHasher.finalize();
       *     var hmac = hmacHasher.finalize('message');
       *     var hmac = hmacHasher.finalize(wordArray);
       */finalize(messageUpdate){// Shortcut
    const hasher=this._hasher;// Compute HMAC
    const innerHash=hasher.finalize(messageUpdate);hasher.reset();const hmac=hasher.finalize(this._oKey.clone().concat(innerHash));return hmac;}}
    
    const parseLoop=(base64Str,base64StrLength,reverseMap)=>{const words=[];let nBytes=0;for(let i=0;i<base64StrLength;i+=1){if(i%4){const bits1=reverseMap[base64Str.charCodeAt(i-1)]<<i%4*2;const bits2=reverseMap[base64Str.charCodeAt(i)]>>>6-i%4*2;const bitsCombined=bits1|bits2;words[nBytes>>>2]|=bitsCombined<<24-nBytes%4*8;nBytes+=1;}}return WordArray.create(words,nBytes);};/**
     * Base64 encoding strategy.
     */const Base64={/**
       * Converts a word array to a Base64 string.
       *
       * @param {WordArray} wordArray The word array.
       *
       * @return {string} The Base64 string.
       *
       * @static
       *
       * @example
       *
       *     const base64String = CryptoJS.enc.Base64.stringify(wordArray);
       */stringify(wordArray){// Shortcuts
    const{words,sigBytes}=wordArray;const map=this._map;// Clamp excess bits
    wordArray.clamp();// Convert
    const base64Chars=[];for(let i=0;i<sigBytes;i+=3){const byte1=words[i>>>2]>>>24-i%4*8&0xff;const byte2=words[i+1>>>2]>>>24-(i+1)%4*8&0xff;const byte3=words[i+2>>>2]>>>24-(i+2)%4*8&0xff;const triplet=byte1<<16|byte2<<8|byte3;for(let j=0;j<4&&i+j*0.75<sigBytes;j+=1){base64Chars.push(map.charAt(triplet>>>6*(3-j)&0x3f));}}// Add padding
    const paddingChar=map.charAt(64);if(paddingChar){while(base64Chars.length%4){base64Chars.push(paddingChar);}}return base64Chars.join('');},/**
       * Converts a Base64 string to a word array.
       *
       * @param {string} base64Str The Base64 string.
       *
       * @return {WordArray} The word array.
       *
       * @static
       *
       * @example
       *
       *     const wordArray = CryptoJS.enc.Base64.parse(base64String);
       */parse(base64Str){// Shortcuts
    let base64StrLength=base64Str.length;const map=this._map;let reverseMap=this._reverseMap;if(!reverseMap){this._reverseMap=[];reverseMap=this._reverseMap;for(let j=0;j<map.length;j+=1){reverseMap[map.charCodeAt(j)]=j;}}// Ignore padding
    const paddingChar=map.charAt(64);if(paddingChar){const paddingIndex=base64Str.indexOf(paddingChar);if(paddingIndex!==-1){base64StrLength=paddingIndex;}}// Convert
    return parseLoop(base64Str,base64StrLength,reverseMap);},_map:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='};
    
    const T=[];// Compute constants
    for(let i=0;i<64;i+=1){T[i]=Math.abs(Math.sin(i+1))*0x100000000|0;}const FF=(a,b,c,d,x,s,t)=>{const n=a+(b&c|~b&d)+x+t;return (n<<s|n>>>32-s)+b;};const GG=(a,b,c,d,x,s,t)=>{const n=a+(b&d|c&~d)+x+t;return (n<<s|n>>>32-s)+b;};const HH=(a,b,c,d,x,s,t)=>{const n=a+(b^c^d)+x+t;return (n<<s|n>>>32-s)+b;};const II=(a,b,c,d,x,s,t)=>{const n=a+(c^(b|~d))+x+t;return (n<<s|n>>>32-s)+b;};/**
     * MD5 hash algorithm.
     */class MD5Algo extends Hasher{_doReset(){this._hash=new WordArray([0x67452301,0xefcdab89,0x98badcfe,0x10325476]);}_doProcessBlock(M,offset){const _M=M;// Swap endian
    for(let i=0;i<16;i+=1){// Shortcuts
    const offset_i=offset+i;const M_offset_i=M[offset_i];_M[offset_i]=(M_offset_i<<8|M_offset_i>>>24)&0x00ff00ff|(M_offset_i<<24|M_offset_i>>>8)&0xff00ff00;}// Shortcuts
    const H=this._hash.words;const M_offset_0=_M[offset+0];const M_offset_1=_M[offset+1];const M_offset_2=_M[offset+2];const M_offset_3=_M[offset+3];const M_offset_4=_M[offset+4];const M_offset_5=_M[offset+5];const M_offset_6=_M[offset+6];const M_offset_7=_M[offset+7];const M_offset_8=_M[offset+8];const M_offset_9=_M[offset+9];const M_offset_10=_M[offset+10];const M_offset_11=_M[offset+11];const M_offset_12=_M[offset+12];const M_offset_13=_M[offset+13];const M_offset_14=_M[offset+14];const M_offset_15=_M[offset+15];// Working varialbes
    let a=H[0];let b=H[1];let c=H[2];let d=H[3];// Computation
    a=FF(a,b,c,d,M_offset_0,7,T[0]);d=FF(d,a,b,c,M_offset_1,12,T[1]);c=FF(c,d,a,b,M_offset_2,17,T[2]);b=FF(b,c,d,a,M_offset_3,22,T[3]);a=FF(a,b,c,d,M_offset_4,7,T[4]);d=FF(d,a,b,c,M_offset_5,12,T[5]);c=FF(c,d,a,b,M_offset_6,17,T[6]);b=FF(b,c,d,a,M_offset_7,22,T[7]);a=FF(a,b,c,d,M_offset_8,7,T[8]);d=FF(d,a,b,c,M_offset_9,12,T[9]);c=FF(c,d,a,b,M_offset_10,17,T[10]);b=FF(b,c,d,a,M_offset_11,22,T[11]);a=FF(a,b,c,d,M_offset_12,7,T[12]);d=FF(d,a,b,c,M_offset_13,12,T[13]);c=FF(c,d,a,b,M_offset_14,17,T[14]);b=FF(b,c,d,a,M_offset_15,22,T[15]);a=GG(a,b,c,d,M_offset_1,5,T[16]);d=GG(d,a,b,c,M_offset_6,9,T[17]);c=GG(c,d,a,b,M_offset_11,14,T[18]);b=GG(b,c,d,a,M_offset_0,20,T[19]);a=GG(a,b,c,d,M_offset_5,5,T[20]);d=GG(d,a,b,c,M_offset_10,9,T[21]);c=GG(c,d,a,b,M_offset_15,14,T[22]);b=GG(b,c,d,a,M_offset_4,20,T[23]);a=GG(a,b,c,d,M_offset_9,5,T[24]);d=GG(d,a,b,c,M_offset_14,9,T[25]);c=GG(c,d,a,b,M_offset_3,14,T[26]);b=GG(b,c,d,a,M_offset_8,20,T[27]);a=GG(a,b,c,d,M_offset_13,5,T[28]);d=GG(d,a,b,c,M_offset_2,9,T[29]);c=GG(c,d,a,b,M_offset_7,14,T[30]);b=GG(b,c,d,a,M_offset_12,20,T[31]);a=HH(a,b,c,d,M_offset_5,4,T[32]);d=HH(d,a,b,c,M_offset_8,11,T[33]);c=HH(c,d,a,b,M_offset_11,16,T[34]);b=HH(b,c,d,a,M_offset_14,23,T[35]);a=HH(a,b,c,d,M_offset_1,4,T[36]);d=HH(d,a,b,c,M_offset_4,11,T[37]);c=HH(c,d,a,b,M_offset_7,16,T[38]);b=HH(b,c,d,a,M_offset_10,23,T[39]);a=HH(a,b,c,d,M_offset_13,4,T[40]);d=HH(d,a,b,c,M_offset_0,11,T[41]);c=HH(c,d,a,b,M_offset_3,16,T[42]);b=HH(b,c,d,a,M_offset_6,23,T[43]);a=HH(a,b,c,d,M_offset_9,4,T[44]);d=HH(d,a,b,c,M_offset_12,11,T[45]);c=HH(c,d,a,b,M_offset_15,16,T[46]);b=HH(b,c,d,a,M_offset_2,23,T[47]);a=II(a,b,c,d,M_offset_0,6,T[48]);d=II(d,a,b,c,M_offset_7,10,T[49]);c=II(c,d,a,b,M_offset_14,15,T[50]);b=II(b,c,d,a,M_offset_5,21,T[51]);a=II(a,b,c,d,M_offset_12,6,T[52]);d=II(d,a,b,c,M_offset_3,10,T[53]);c=II(c,d,a,b,M_offset_10,15,T[54]);b=II(b,c,d,a,M_offset_1,21,T[55]);a=II(a,b,c,d,M_offset_8,6,T[56]);d=II(d,a,b,c,M_offset_15,10,T[57]);c=II(c,d,a,b,M_offset_6,15,T[58]);b=II(b,c,d,a,M_offset_13,21,T[59]);a=II(a,b,c,d,M_offset_4,6,T[60]);d=II(d,a,b,c,M_offset_11,10,T[61]);c=II(c,d,a,b,M_offset_2,15,T[62]);b=II(b,c,d,a,M_offset_9,21,T[63]);// Intermediate hash value
    H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;}/* eslint-ensable no-param-reassign */_doFinalize(){// Shortcuts
    const data=this._data;const dataWords=data.words;const nBitsTotal=this._nDataBytes*8;const nBitsLeft=data.sigBytes*8;// Add padding
    dataWords[nBitsLeft>>>5]|=0x80<<24-nBitsLeft%32;const nBitsTotalH=Math.floor(nBitsTotal/0x100000000);const nBitsTotalL=nBitsTotal;dataWords[(nBitsLeft+64>>>9<<4)+15]=(nBitsTotalH<<8|nBitsTotalH>>>24)&0x00ff00ff|(nBitsTotalH<<24|nBitsTotalH>>>8)&0xff00ff00;dataWords[(nBitsLeft+64>>>9<<4)+14]=(nBitsTotalL<<8|nBitsTotalL>>>24)&0x00ff00ff|(nBitsTotalL<<24|nBitsTotalL>>>8)&0xff00ff00;data.sigBytes=(dataWords.length+1)*4;// Hash final blocks
    this._process();// Shortcuts
    const hash=this._hash;const H=hash.words;// Swap endian
    for(let i=0;i<4;i+=1){// Shortcut
    const H_i=H[i];H[i]=(H_i<<8|H_i>>>24)&0x00ff00ff|(H_i<<24|H_i>>>8)&0xff00ff00;}// Return final computed hash
    return hash;}clone(){const clone=super.clone.call(this);clone._hash=this._hash.clone();return clone;}}
    
    /**
     * This key derivation function is meant to conform with EVP_BytesToKey.
     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
     */class EvpKDFAlgo extends Base{/**
       * Initializes a newly created key derivation function.
       *
       * @param {Object} cfg (Optional) The configuration options to use for the derivation.
       *
       * @example
       *
       *     const kdf = CryptoJS.algo.EvpKDF.create();
       *     const kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
       *     const kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
       */constructor(cfg){super();/**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
         * @property {number} iterations The number of iterations to perform. Default: 1
         */this.cfg=Object.assign(new Base(),{keySize:128/32,hasher:MD5Algo,iterations:1},cfg);}/**
       * Derives a key from a password.
       *
       * @param {WordArray|string} password The password.
       * @param {WordArray|string} salt A salt.
       *
       * @return {WordArray} The derived key.
       *
       * @example
       *
       *     const key = kdf.compute(password, salt);
       */compute(password,salt){let block;// Shortcut
    const{cfg}=this;// Init hasher
    const hasher=cfg.hasher.create();// Initial values
    const derivedKey=WordArray.create();// Shortcuts
    const derivedKeyWords=derivedKey.words;const{keySize,iterations}=cfg;// Generate key
    while(derivedKeyWords.length<keySize){if(block){hasher.update(block);}block=hasher.update(password).finalize(salt);hasher.reset();// Iterations
    for(let i=1;i<iterations;i+=1){block=hasher.finalize(block);hasher.reset();}derivedKey.concat(block);}derivedKey.sigBytes=keySize*4;return derivedKey;}}
    
    const ObjectAssign=typeof Object.assign!=="function"?function(target){if(target==null){throw new TypeError('Cannot convert undefined or null to object');}target=Object(target);for(let index=1;index<arguments.length;index++){const source=arguments[index];if(source!=null){for(const key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}}return target;}:Object.assign;/**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */class Cipher extends BufferedBlockAlgorithm{/**
       * Initializes a newly created cipher.
       *
       * @param {number} xformMode Either the encryption or decryption transormation mode constant.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @example
       *
       *     const cipher = CryptoJS.algo.AES.create(
       *       CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray }
       *     );
       */constructor(xformMode,key,cfg){super();/**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */this.cfg=ObjectAssign(new Base(),cfg);// Store transform mode and key
    this._xformMode=xformMode;this._key=key;// Set initial values
    this.reset();}/**
       * Creates this cipher in encryption mode.
       *
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {Cipher} A cipher instance.
       *
       * @static
       *
       * @example
       *
       *     const cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
       */static createEncryptor(key,cfg){return this.create(this._ENC_XFORM_MODE,key,cfg);}/**
       * Creates this cipher in decryption mode.
       *
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {Cipher} A cipher instance.
       *
       * @static
       *
       * @example
       *
       *     const cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
       */static createDecryptor(key,cfg){return this.create(this._DEC_XFORM_MODE,key,cfg);}/**
       * Creates shortcut functions to a cipher's object interface.
       *
       * @param {Cipher} cipher The cipher to create a helper for.
       *
       * @return {Object} An object with encrypt and decrypt shortcut functions.
       *
       * @static
       *
       * @example
       *
       *     const AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
       */static _createHelper(SubCipher){const selectCipherStrategy=key=>{if(typeof key==='string'){return PasswordBasedCipher;}return SerializableCipher;};return {encrypt(message,key,cfg){return selectCipherStrategy(key).encrypt(SubCipher,message,key,cfg);},decrypt(ciphertext,key,cfg){return selectCipherStrategy(key).decrypt(SubCipher,ciphertext,key,cfg);}};}/**
       * Resets this cipher to its initial state.
       *
       * @example
       *
       *     cipher.reset();
       */reset(){// Reset data buffer
    super.reset.call(this);// Perform concrete-cipher logic
    this._doReset();}/**
       * Adds data to be encrypted or decrypted.
       *
       * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
       *
       * @return {WordArray} The data after processing.
       *
       * @example
       *
       *     const encrypted = cipher.process('data');
       *     const encrypted = cipher.process(wordArray);
       */process(dataUpdate){// Append
    this._append(dataUpdate);// Process available blocks
    return this._process();}/**
       * Finalizes the encryption or decryption process.
       * Note that the finalize operation is effectively a destructive, read-once operation.
       *
       * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
       *
       * @return {WordArray} The data after final processing.
       *
       * @example
       *
       *     const encrypted = cipher.finalize();
       *     const encrypted = cipher.finalize('data');
       *     const encrypted = cipher.finalize(wordArray);
       */finalize(dataUpdate){// Final data update
    if(dataUpdate){this._append(dataUpdate);}// Perform concrete-cipher logic
    const finalProcessedData=this._doFinalize();return finalProcessedData;}}Cipher._ENC_XFORM_MODE=1;Cipher._DEC_XFORM_MODE=2;Cipher.keySize=128/32;Cipher.ivSize=128/32;/**
     * Abstract base block cipher mode template.
     */class BlockCipherMode extends Base{/**
       * Initializes a newly created mode.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @example
       *
       *     const mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
       */constructor(cipher,iv){super();this._cipher=cipher;this._iv=iv;}/**
       * Creates this mode for encryption.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @static
       *
       * @example
       *
       *     const mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
       */static createEncryptor(cipher,iv){return this.Encryptor.create(cipher,iv);}/**
       * Creates this mode for decryption.
       *
       * @param {Cipher} cipher A block cipher instance.
       * @param {Array} iv The IV words.
       *
       * @static
       *
       * @example
       *
       *     const mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
       */static createDecryptor(cipher,iv){return this.Decryptor.create(cipher,iv);}}function xorBlock(words,offset,blockSize){const _words=words;let block;// Shortcut
    const iv=this._iv;// Choose mixing block
    if(iv){block=iv;// Remove IV for subsequent blocks
    this._iv=undefined;}else {block=this._prevBlock;}// XOR blocks
    for(let i=0;i<blockSize;i+=1){_words[offset+i]^=block[i];}}/**
     * Cipher Block Chaining mode.
     */ /**
     * Abstract base CBC mode.
     */class CBC extends BlockCipherMode{}/**
     * CBC encryptor.
     */CBC.Encryptor=class extends CBC{/**
       * Processes the data block at offset.
       *
       * @param {Array} words The data words to operate on.
       * @param {number} offset The offset where the block starts.
       *
       * @example
       *
       *     mode.processBlock(data.words, offset);
       */processBlock(words,offset){// Shortcuts
    const cipher=this._cipher;const{blockSize}=cipher;// XOR and encrypt
    xorBlock.call(this,words,offset,blockSize);cipher.encryptBlock(words,offset);// Remember this block to use with next block
    this._prevBlock=words.slice(offset,offset+blockSize);}};/**
     * CBC decryptor.
     */CBC.Decryptor=class extends CBC{/**
       * Processes the data block at offset.
       *
       * @param {Array} words The data words to operate on.
       * @param {number} offset The offset where the block starts.
       *
       * @example
       *
       *     mode.processBlock(data.words, offset);
       */processBlock(words,offset){// Shortcuts
    const cipher=this._cipher;const{blockSize}=cipher;// Remember this block to use with next block
    const thisBlock=words.slice(offset,offset+blockSize);// Decrypt and XOR
    cipher.decryptBlock(words,offset);xorBlock.call(this,words,offset,blockSize);// This block becomes the previous block
    this._prevBlock=thisBlock;}};/**
     * PKCS #5/7 padding strategy.
     */const Pkcs7={/**
       * Pads data using the algorithm defined in PKCS #5/7.
       *
       * @param {WordArray} data The data to pad.
       * @param {number} blockSize The multiple that the data should be padded to.
       *
       * @static
       *
       * @example
       *
       *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
       */pad(data,blockSize){// Shortcut
    const blockSizeBytes=blockSize*4;// Count padding bytes
    const nPaddingBytes=blockSizeBytes-data.sigBytes%blockSizeBytes;// Create padding word
    const paddingWord=nPaddingBytes<<24|nPaddingBytes<<16|nPaddingBytes<<8|nPaddingBytes;// Create padding
    const paddingWords=[];for(let i=0;i<nPaddingBytes;i+=4){paddingWords.push(paddingWord);}const padding=WordArray.create(paddingWords,nPaddingBytes);// Add padding
    data.concat(padding);},/**
       * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
       *
       * @param {WordArray} data The data to unpad.
       *
       * @static
       *
       * @example
       *
       *     CryptoJS.pad.Pkcs7.unpad(wordArray);
       */unpad(data){const _data=data;// Get number of padding bytes from last byte
    const nPaddingBytes=_data.words[_data.sigBytes-1>>>2]&0xff;// Remove padding
    _data.sigBytes-=nPaddingBytes;}};/**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize
     *
     *    The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */class BlockCipher extends Cipher{constructor(xformMode,key,cfg){/**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */super(xformMode,key,ObjectAssign({mode:CBC,padding:Pkcs7},cfg));this.blockSize=128/32;}reset(){let modeCreator;// Reset cipher
    super.reset.call(this);// Shortcuts
    const{cfg}=this;const{iv,mode}=cfg;// Reset block mode
    if(this._xformMode===this.constructor._ENC_XFORM_MODE){modeCreator=mode.createEncryptor;}else/* if (this._xformMode == this._DEC_XFORM_MODE) */{modeCreator=mode.createDecryptor;// Keep at least one block in the buffer for unpadding
    this._minBufferSize=1;}this._mode=modeCreator.call(mode,this,iv&&iv.words);this._mode.__creator=modeCreator;}_doProcessBlock(words,offset){this._mode.processBlock(words,offset);}_doFinalize(){let finalProcessedBlocks;// Shortcut
    const{padding}=this.cfg;// Finalize
    if(this._xformMode===this.constructor._ENC_XFORM_MODE){// Pad data
    padding.pad(this._data,this.blockSize);// Process final blocks
    finalProcessedBlocks=this._process(!!'flush');}else/* if (this._xformMode == this._DEC_XFORM_MODE) */{// Process final blocks
    finalProcessedBlocks=this._process(!!'flush');// Unpad data
    padding.unpad(finalProcessedBlocks);}return finalProcessedBlocks;}}/**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher} algorithm The cipher algorithm.
     * @property {Mode} mode The block mode used in the ciphering operation.
     * @property {Padding} padding The padding scheme used in the ciphering operation.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter
     *    The default formatting strategy to convert this cipher params object to a string.
     */class CipherParams extends Base{/**
       * Initializes a newly created cipher params object.
       *
       * @param {Object} cipherParams An object with any of the possible cipher parameters.
       *
       * @example
       *
       *     var cipherParams = CryptoJS.lib.CipherParams.create({
       *         ciphertext: ciphertextWordArray,
       *         key: keyWordArray,
       *         iv: ivWordArray,
       *         salt: saltWordArray,
       *         algorithm: CryptoJS.algo.AES,
       *         mode: CryptoJS.mode.CBC,
       *         padding: CryptoJS.pad.PKCS7,
       *         blockSize: 4,
       *         formatter: CryptoJS.format.OpenSSL
       *     });
       */constructor(cipherParams){super();this.mixIn(cipherParams);}/**
       * Converts this cipher params object to a string.
       *
       * @param {Format} formatter (Optional) The formatting strategy to use.
       *
       * @return {string} The stringified cipher params.
       *
       * @throws Error If neither the formatter nor the default formatter is set.
       *
       * @example
       *
       *     var string = cipherParams + '';
       *     var string = cipherParams.toString();
       *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
       */toString(formatter){return (formatter||this.formatter).stringify(this);}}/**
     * OpenSSL formatting strategy.
     */const OpenSSLFormatter={/**
       * Converts a cipher params object to an OpenSSL-compatible string.
       *
       * @param {CipherParams} cipherParams The cipher params object.
       *
       * @return {string} The OpenSSL-compatible string.
       *
       * @static
       *
       * @example
       *
       *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
       */stringify(cipherParams){let wordArray;// Shortcuts
    const{ciphertext,salt}=cipherParams;// Format
    if(salt){wordArray=WordArray.create([0x53616c74,0x65645f5f]).concat(salt).concat(ciphertext);}else {wordArray=ciphertext;}return wordArray.toString(Base64);},/**
       * Converts an OpenSSL-compatible string to a cipher params object.
       *
       * @param {string} openSSLStr The OpenSSL-compatible string.
       *
       * @return {CipherParams} The cipher params object.
       *
       * @static
       *
       * @example
       *
       *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
       */parse(openSSLStr){let salt;// Parse base64
    const ciphertext=Base64.parse(openSSLStr);// Shortcut
    const ciphertextWords=ciphertext.words;// Test for salt
    if(ciphertextWords[0]===0x53616c74&&ciphertextWords[1]===0x65645f5f){// Extract salt
    salt=WordArray.create(ciphertextWords.slice(2,4));// Remove salt from ciphertext
    ciphertextWords.splice(0,4);ciphertext.sigBytes-=16;}return CipherParams.create({ciphertext,salt});}};/**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */class SerializableCipher extends Base{/**
       * Encrypts a message.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {WordArray|string} message The message to encrypt.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {CipherParams} A cipher params object.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       .encrypt(CryptoJS.algo.AES, message, key);
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
       */static encrypt(cipher,message,key,cfg){// Apply config defaults
    const _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Encrypt
    const encryptor=cipher.createEncryptor(key,_cfg);const ciphertext=encryptor.finalize(message);// Shortcut
    const cipherCfg=encryptor.cfg;// Create and return serializable cipher params
    return CipherParams.create({ciphertext,key,iv:cipherCfg.iv,algorithm:cipher,mode:cipherCfg.mode,padding:cipherCfg.padding,blockSize:encryptor.blockSize,formatter:_cfg.format});}/**
       * Decrypts serialized ciphertext.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
       * @param {WordArray} key The key.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {WordArray} The plaintext.
       *
       * @static
       *
       * @example
       *
       *     var plaintext = CryptoJS.lib.SerializableCipher
       *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, key,
       *         { iv: iv, format: CryptoJS.format.OpenSSL });
       *     var plaintext = CryptoJS.lib.SerializableCipher
       *       .decrypt(CryptoJS.algo.AES, ciphertextParams, key,
       *         { iv: iv, format: CryptoJS.format.OpenSSL });
       */static decrypt(cipher,ciphertext,key,cfg){let _ciphertext=ciphertext;// Apply config defaults
    const _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Convert string to CipherParams
    _ciphertext=this._parse(_ciphertext,_cfg.format);// Decrypt
    const plaintext=cipher.createDecryptor(key,_cfg).finalize(_ciphertext.ciphertext);return plaintext;}/**
       * Converts serialized ciphertext to CipherParams,
       * else assumed CipherParams already and returns ciphertext unchanged.
       *
       * @param {CipherParams|string} ciphertext The ciphertext.
       * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
       *
       * @return {CipherParams} The unserialized ciphertext.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.SerializableCipher
       *       ._parse(ciphertextStringOrParams, format);
       */static _parse(ciphertext,format){if(typeof ciphertext==='string'){return format.parse(ciphertext,this);}return ciphertext;}}/**
     * Configuration options.
     *
     * @property {Formatter} format
     *
     *    The formatting strategy to convert cipher param objects to and from a string.
     *    Default: OpenSSL
     */SerializableCipher.cfg=ObjectAssign(new Base(),{format:OpenSSLFormatter});/**
     * OpenSSL key derivation function.
     */const OpenSSLKdf={/**
       * Derives a key and IV from a password.
       *
       * @param {string} password The password to derive from.
       * @param {number} keySize The size in words of the key to generate.
       * @param {number} ivSize The size in words of the IV to generate.
       * @param {WordArray|string} salt
       *     (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
       *
       * @return {CipherParams} A cipher params object with the key, IV, and salt.
       *
       * @static
       *
       * @example
       *
       *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
       *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
       */execute(password,keySize,ivSize,salt,hasher){let _salt=salt;// Generate random salt
    if(!_salt){_salt=WordArray.random(64/8);}// Derive key and IV
    let key;if(!hasher){key=EvpKDFAlgo.create({keySize:keySize+ivSize}).compute(password,_salt);}else {key=EvpKDFAlgo.create({keySize:keySize+ivSize,hasher}).compute(password,_salt);}// Separate key and IV
    const iv=WordArray.create(key.words.slice(keySize),ivSize*4);key.sigBytes=keySize*4;// Return params
    return CipherParams.create({key,iv,salt:_salt});}};/**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */class PasswordBasedCipher extends SerializableCipher{/**
       * Encrypts a message using a password.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {WordArray|string} message The message to encrypt.
       * @param {string} password The password.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {CipherParams} A cipher params object.
       *
       * @static
       *
       * @example
       *
       *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
       *       .encrypt(CryptoJS.algo.AES, message, 'password');
       *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
       *       .encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
       */static encrypt(cipher,message,password,cfg){// Apply config defaults
    const _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Derive key and other params
    const derivedParams=_cfg.kdf.execute(password,cipher.keySize,cipher.ivSize,_cfg.salt,_cfg.hasher);// Add IV to config
    _cfg.iv=derivedParams.iv;// Encrypt
    const ciphertext=SerializableCipher.encrypt.call(this,cipher,message,derivedParams.key,_cfg);// Mix in derived params
    ciphertext.mixIn(derivedParams);return ciphertext;}/**
       * Decrypts serialized ciphertext using a password.
       *
       * @param {Cipher} cipher The cipher algorithm to use.
       * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
       * @param {string} password The password.
       * @param {Object} cfg (Optional) The configuration options to use for this operation.
       *
       * @return {WordArray} The plaintext.
       *
       * @static
       *
       * @example
       *
       *     var plaintext = CryptoJS.lib.PasswordBasedCipher
       *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password',
       *         { format: CryptoJS.format.OpenSSL });
       *     var plaintext = CryptoJS.lib.PasswordBasedCipher
       *       .decrypt(CryptoJS.algo.AES, ciphertextParams, 'password',
       *         { format: CryptoJS.format.OpenSSL });
       */static decrypt(cipher,ciphertext,password,cfg){let _ciphertext=ciphertext;// Apply config defaults
    const _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Convert string to CipherParams
    _ciphertext=this._parse(_ciphertext,_cfg.format);// Derive key and other params
    const derivedParams=_cfg.kdf.execute(password,cipher.keySize,cipher.ivSize,_ciphertext.salt,_cfg.hasher);// Add IV to config
    _cfg.iv=derivedParams.iv;// Decrypt
    const plaintext=SerializableCipher.decrypt.call(this,cipher,_ciphertext,derivedParams.key,_cfg);return plaintext;}}/**
     * Configuration options.
     *
     * @property {KDF} kdf
     *     The key derivation function to use to generate a key and IV from a password.
     *     Default: OpenSSL
     */PasswordBasedCipher.cfg=ObjectAssign(SerializableCipher.cfg,{kdf:OpenSSLKdf});
    
    const _SBOX=[];const INV_SBOX=[];const _SUB_MIX_0=[];const _SUB_MIX_1=[];const _SUB_MIX_2=[];const _SUB_MIX_3=[];const INV_SUB_MIX_0=[];const INV_SUB_MIX_1=[];const INV_SUB_MIX_2=[];const INV_SUB_MIX_3=[];// Compute lookup tables
    // Compute double table
    const d=[];for(let i=0;i<256;i+=1){if(i<128){d[i]=i<<1;}else {d[i]=i<<1^0x11b;}}// Walk GF(2^8)
    let x=0;let xi=0;for(let i=0;i<256;i+=1){// Compute sbox
    let sx=xi^xi<<1^xi<<2^xi<<3^xi<<4;sx=sx>>>8^sx&0xff^0x63;_SBOX[x]=sx;INV_SBOX[sx]=x;// Compute multiplication
    const x2=d[x];const x4=d[x2];const x8=d[x4];// Compute sub bytes, mix columns tables
    let t=d[sx]*0x101^sx*0x1010100;_SUB_MIX_0[x]=t<<24|t>>>8;_SUB_MIX_1[x]=t<<16|t>>>16;_SUB_MIX_2[x]=t<<8|t>>>24;_SUB_MIX_3[x]=t;// Compute inv sub bytes, inv mix columns tables
    t=x8*0x1010101^x4*0x10001^x2*0x101^x*0x1010100;INV_SUB_MIX_0[sx]=t<<24|t>>>8;INV_SUB_MIX_1[sx]=t<<16|t>>>16;INV_SUB_MIX_2[sx]=t<<8|t>>>24;INV_SUB_MIX_3[sx]=t;// Compute next counter
    if(!x){xi=1;x=xi;}else {x=x2^d[d[d[x8^x2]]];xi^=d[d[xi]];}}// Precomputed Rcon lookup
    const RCON=[0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];/**
     * AES block cipher algorithm.
     */class AESAlgo extends BlockCipher{_doReset(){let t;// Skip reset of nRounds has been set before and key did not change
    if(this._nRounds&&this._keyPriorReset===this._key){return;}// Shortcuts
    this._keyPriorReset=this._key;const key=this._keyPriorReset;const keyWords=key.words;const keySize=key.sigBytes/4;// Compute number of rounds
    this._nRounds=keySize+6;const nRounds=this._nRounds;// Compute number of key schedule rows
    const ksRows=(nRounds+1)*4;// Compute key schedule
    this._keySchedule=[];const keySchedule=this._keySchedule;for(let ksRow=0;ksRow<ksRows;ksRow+=1){if(ksRow<keySize){keySchedule[ksRow]=keyWords[ksRow];}else {t=keySchedule[ksRow-1];if(!(ksRow%keySize)){// Rot word
    t=t<<8|t>>>24;// Sub word
    t=_SBOX[t>>>24]<<24|_SBOX[t>>>16&0xff]<<16|_SBOX[t>>>8&0xff]<<8|_SBOX[t&0xff];// Mix Rcon
    t^=RCON[ksRow/keySize|0]<<24;}else if(keySize>6&&ksRow%keySize===4){// Sub word
    t=_SBOX[t>>>24]<<24|_SBOX[t>>>16&0xff]<<16|_SBOX[t>>>8&0xff]<<8|_SBOX[t&0xff];}keySchedule[ksRow]=keySchedule[ksRow-keySize]^t;}}// Compute inv key schedule
    this._invKeySchedule=[];const invKeySchedule=this._invKeySchedule;for(let invKsRow=0;invKsRow<ksRows;invKsRow+=1){const ksRow=ksRows-invKsRow;if(invKsRow%4){t=keySchedule[ksRow];}else {t=keySchedule[ksRow-4];}if(invKsRow<4||ksRow<=4){invKeySchedule[invKsRow]=t;}else {invKeySchedule[invKsRow]=INV_SUB_MIX_0[_SBOX[t>>>24]]^INV_SUB_MIX_1[_SBOX[t>>>16&0xff]]^INV_SUB_MIX_2[_SBOX[t>>>8&0xff]]^INV_SUB_MIX_3[_SBOX[t&0xff]];}}}encryptBlock(M,offset){this._doCryptBlock(M,offset,this._keySchedule,_SUB_MIX_0,_SUB_MIX_1,_SUB_MIX_2,_SUB_MIX_3,_SBOX);}decryptBlock(M,offset){const _M=M;// Swap 2nd and 4th rows
    let t=_M[offset+1];_M[offset+1]=_M[offset+3];_M[offset+3]=t;this._doCryptBlock(_M,offset,this._invKeySchedule,INV_SUB_MIX_0,INV_SUB_MIX_1,INV_SUB_MIX_2,INV_SUB_MIX_3,INV_SBOX);// Inv swap 2nd and 4th rows
    t=_M[offset+1];_M[offset+1]=_M[offset+3];_M[offset+3]=t;}_doCryptBlock(M,offset,keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX){const _M=M;// Shortcut
    const nRounds=this._nRounds;// Get input, add round key
    let s0=_M[offset]^keySchedule[0];let s1=_M[offset+1]^keySchedule[1];let s2=_M[offset+2]^keySchedule[2];let s3=_M[offset+3]^keySchedule[3];// Key schedule row counter
    let ksRow=4;// Rounds
    for(let round=1;round<nRounds;round+=1){// Shift rows, sub bytes, mix columns, add round key
    const t0=SUB_MIX_0[s0>>>24]^SUB_MIX_1[s1>>>16&0xff]^SUB_MIX_2[s2>>>8&0xff]^SUB_MIX_3[s3&0xff]^keySchedule[ksRow];ksRow+=1;const t1=SUB_MIX_0[s1>>>24]^SUB_MIX_1[s2>>>16&0xff]^SUB_MIX_2[s3>>>8&0xff]^SUB_MIX_3[s0&0xff]^keySchedule[ksRow];ksRow+=1;const t2=SUB_MIX_0[s2>>>24]^SUB_MIX_1[s3>>>16&0xff]^SUB_MIX_2[s0>>>8&0xff]^SUB_MIX_3[s1&0xff]^keySchedule[ksRow];ksRow+=1;const t3=SUB_MIX_0[s3>>>24]^SUB_MIX_1[s0>>>16&0xff]^SUB_MIX_2[s1>>>8&0xff]^SUB_MIX_3[s2&0xff]^keySchedule[ksRow];ksRow+=1;// Update state
    s0=t0;s1=t1;s2=t2;s3=t3;}// Shift rows, sub bytes, add round key
    const t0=(SBOX[s0>>>24]<<24|SBOX[s1>>>16&0xff]<<16|SBOX[s2>>>8&0xff]<<8|SBOX[s3&0xff])^keySchedule[ksRow];ksRow+=1;const t1=(SBOX[s1>>>24]<<24|SBOX[s2>>>16&0xff]<<16|SBOX[s3>>>8&0xff]<<8|SBOX[s0&0xff])^keySchedule[ksRow];ksRow+=1;const t2=(SBOX[s2>>>24]<<24|SBOX[s3>>>16&0xff]<<16|SBOX[s0>>>8&0xff]<<8|SBOX[s1&0xff])^keySchedule[ksRow];ksRow+=1;const t3=(SBOX[s3>>>24]<<24|SBOX[s0>>>16&0xff]<<16|SBOX[s1>>>8&0xff]<<8|SBOX[s2&0xff])^keySchedule[ksRow];ksRow+=1;// Set output
    _M[offset]=t0;_M[offset+1]=t1;_M[offset+2]=t2;_M[offset+3]=t3;}}AESAlgo.keySize=256/32;/**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
     */const AES=BlockCipher._createHelper(AESAlgo);
    
    const ENCRYPTION_PREFIX_V1='RudderEncrypt:';const ENCRYPTION_KEY_V1='Rudder';
    
    const encrypt=value=>`${ENCRYPTION_PREFIX_V1}${AES.encrypt(value,ENCRYPTION_KEY_V1).toString()}`;const decrypt=value=>{if(value.startsWith(ENCRYPTION_PREFIX_V1)){return AES.decrypt(value.substring(ENCRYPTION_PREFIX_V1.length),ENCRYPTION_KEY_V1).toString(Utf8);}return value;};
    
    const pluginName$2='StorageEncryptionLegacy';const StorageEncryptionLegacy=()=>({name:pluginName$2,initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$2];},storage:{encrypt(value){return encrypt(value);},decrypt(value){return decrypt(value);}}});
    
    const STORAGE_MIGRATION_ERROR=key=>`Failed to retrieve or parse data for ${key} from storage.`;
    
    const STORAGE_MIGRATOR_PLUGIN='StorageMigratorPlugin';
    
    const pluginName$1='StorageMigrator';const StorageMigrator=()=>({name:pluginName$1,initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName$1];},storage:{migrate(key,storageEngine,errorHandler,logger){try{const storedVal=storageEngine.getItem(key);if(isNullOrUndefined(storedVal)){return null;}let decryptedVal=decrypt(storedVal);// The value is not encrypted using legacy encryption
    // Try latest
    if(decryptedVal===storedVal){decryptedVal=decrypt$1(storedVal);}if(isNullOrUndefined(decryptedVal)){return null;}// storejs that is used in localstorage engine already deserializes json strings but swallows errors
    return JSON.parse(decryptedVal);}catch(err){errorHandler?.onError(err,STORAGE_MIGRATOR_PLUGIN,STORAGE_MIGRATION_ERROR(key));return null;}}}});
    
    const DEFAULT_RETRY_QUEUE_OPTIONS={maxRetryDelay:360000,minRetryDelay:1000,backoffFactor:2,maxAttempts:10,maxItems:100};const REQUEST_TIMEOUT_MS=30*1000;// 30 seconds
    const DATA_PLANE_API_VERSION='v1';const QUEUE_NAME='rudder';const XHR_QUEUE_PLUGIN='XhrQueuePlugin';
    
    const EVENT_DELIVERY_FAILURE_ERROR_PREFIX=(context,url)=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to deliver event(s) to ${url}.`;
    
    const getBatchDeliveryPayload=(events,currentTime,logger)=>{const batchPayload={batch:events,sentAt:currentTime};return stringifyWithoutCircular(batchPayload,true,undefined,logger);};const getNormalizedQueueOptions=queueOpts=>mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS,queueOpts);const getDeliveryUrl=(dataplaneUrl,endpoint)=>{const dpUrl=new URL(dataplaneUrl);return new URL(removeDuplicateSlashes([dpUrl.pathname,'/',DATA_PLANE_API_VERSION,'/',endpoint].join('')),dpUrl).href;};const getBatchDeliveryUrl=dataplaneUrl=>getDeliveryUrl(dataplaneUrl,'batch');const logErrorOnFailure=(details,url,willBeRetried,attemptNumber,maxRetryAttempts,logger)=>{if(isUndefined(details?.error)||isUndefined(logger)){return;}const isRetryableFailure=isErrRetryable(details);let errMsg=EVENT_DELIVERY_FAILURE_ERROR_PREFIX(XHR_QUEUE_PLUGIN,url);const dropMsg=`The event(s) will be dropped.`;if(isRetryableFailure){if(willBeRetried){errMsg=`${errMsg} It/they will be retried.`;if(attemptNumber>0){errMsg=`${errMsg} Retry attempt ${attemptNumber} of ${maxRetryAttempts}.`;}}else {errMsg=`${errMsg} Retries exhausted (${maxRetryAttempts}). ${dropMsg}`;}}else {errMsg=`${errMsg} ${dropMsg}`;}logger?.error(errMsg);};const getRequestInfo=(itemData,state,logger)=>{let data;let headers;let url;const currentTime=getCurrentTimeFormatted();if(Array.isArray(itemData)){const finalEvents=itemData.map(queueItemData=>getFinalEventForDeliveryMutator(queueItemData.event,currentTime));data=getBatchDeliveryPayload(finalEvents,currentTime,logger);headers=itemData[0]?clone(itemData[0].headers):{};url=getBatchDeliveryUrl(state.lifecycle.activeDataplaneUrl.value);}else {const{url:eventUrl,event,headers:eventHeaders}=itemData;const finalEvent=getFinalEventForDeliveryMutator(event,currentTime);data=getDeliveryPayload(finalEvent,logger);headers=clone(eventHeaders);url=eventUrl;}return {data,headers,url};};
    
    const pluginName='XhrQueue';const XhrQueue=()=>({name:pluginName,deps:[],initialize:state=>{state.plugins.loadedPlugins.value=[...state.plugins.loadedPlugins.value,pluginName];},dataplaneEventsQueue:{/**
         * Initialize the queue for delivery
         * @param state Application state
         * @param httpClient http client instance
         * @param storeManager Store Manager instance
         * @param errorHandler Error handler instance
         * @param logger Logger instance
         * @returns RetryQueue instance
         */init(state,httpClient,storeManager,errorHandler,logger){const writeKey=state.lifecycle.writeKey.value;httpClient.setAuthHeader(writeKey);const finalQOpts=getNormalizedQueueOptions(state.loadOptions.value.queueOptions);const eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
    `${QUEUE_NAME}_${writeKey}`,finalQOpts,(itemData,done,attemptNumber,maxRetryAttempts,willBeRetried)=>{const{data,url,headers}=getRequestInfo(itemData,state,logger);httpClient.getAsyncData({url,options:{method:'POST',headers,data:data,sendRawData:true},isRawResponse:true,timeout:REQUEST_TIMEOUT_MS,callback:(result,details)=>{// null means item will not be requeued
    const queueErrResp=isErrRetryable(details)?details:null;logErrorOnFailure(details,url,willBeRetried,attemptNumber,maxRetryAttempts,logger);done(queueErrResp,result);}});},storeManager,LOCAL_STORAGE,logger,itemData=>{const currentTime=getCurrentTimeFormatted();const events=itemData.map(queueItemData=>queueItemData.event);// type casting to string as we know that the event has already been validated prior to enqueue
    return getBatchDeliveryPayload(events,currentTime,logger)?.length;});return eventsQueue;},/**
         * Add event to the queue for delivery
         * @param state Application state
         * @param eventsQueue RetryQueue instance
         * @param event RudderEvent object
         * @param errorHandler Error handler instance
         * @param logger Logger instance
         * @returns none
         */enqueue(state,eventsQueue,event,errorHandler,logger){// sentAt is only added here for the validation step
    // It'll be updated to the latest timestamp during actual delivery
    event.sentAt=getCurrentTimeFormatted();validateEventPayloadSize(event,logger);const dataplaneUrl=state.lifecycle.activeDataplaneUrl.value;const url=getDeliveryUrl(dataplaneUrl,event.type);// Other default headers are added by the HttpClient
    // Auth header is added during initialization
    const headers={// To maintain event ordering while using the HTTP API as per is documentation,
    // make sure to include anonymousId as a header
    AnonymousId:toBase64(event.anonymousId)};eventsQueue.addItem({url,headers,event});}}});
    
    /**
     * Map plugin names to direct code imports from plugins package
     */const getBundledBuildPluginImports=()=>({BeaconQueue,Bugsnag,CustomConsentManager,DeviceModeDestinations,DeviceModeTransformation,ErrorReporting,ExternalAnonymousId,GoogleLinker,KetchConsentManager,NativeDestinationQueue,OneTrustConsentManager,StorageEncryption,StorageEncryptionLegacy,StorageMigrator,XhrQueue});
    
    /**
     * Map of mandatory plugin names and direct imports
     */const getMandatoryPluginsMap=()=>({});/**
     * Map of optional plugin names and direct imports for legacy builds
     */const getOptionalPluginsMap=()=>{return getBundledBuildPluginImports();};/**
     * Map of optional plugin names and dynamic imports for modern builds
     */const getRemotePluginsMap=activePluginNames=>{{return {};}};const pluginsInventory={...getMandatoryPluginsMap(),...getOptionalPluginsMap()};const remotePluginsInventory=activePluginNames=>({...getRemotePluginsMap()});
    
    // TODO: add retry mechanism for getting remote plugins
    // TODO: add timeout error mechanism for marking remote plugins that failed to load as failed in state
    class PluginsManager{constructor(engine,errorHandler,logger){this.engine=engine;this.errorHandler=errorHandler;this.logger=logger;this.onError=this.onError.bind(this);}/**
       * Orchestrate the plugin loading and registering
       */init(){state.lifecycle.status.value='pluginsLoading';// Expose pluginsCDNPath to global object, so it can be used in the promise that determines
    this.setActivePlugins();this.registerLocalPlugins();this.registerRemotePlugins();this.attachEffects();}/**
       * Update state based on plugin loaded status
       */ // eslint-disable-next-line class-methods-use-this
    attachEffects(){O(()=>{const isAllPluginsReady=state.plugins.activePlugins.value.length===0||state.plugins.loadedPlugins.value.length+state.plugins.failedPlugins.value.length===state.plugins.totalPluginsToLoad.value;if(isAllPluginsReady){n(()=>{state.plugins.ready.value=true;// TODO: decide what to do if a plugin fails to load for any reason.
    //  Should we stop here or should we progress?
    state.lifecycle.status.value='pluginsReady';});}});}/**
       * Determine the list of plugins that should be loaded based on sourceConfig & load options
       */ // eslint-disable-next-line class-methods-use-this
    getPluginsToLoadBasedOnConfig(){// This contains the default plugins if load option has been omitted by user
    let pluginsToLoadFromConfig=state.plugins.pluginsToLoadFromConfig.value;if(!pluginsToLoadFromConfig){return [];}// Error reporting related plugins
    const supportedErrReportingProviderPluginNames=Object.values(ErrorReportingProvidersToPluginNameMap);if(state.reporting.errorReportingProviderPluginName.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>!(pluginName!==state.reporting.errorReportingProviderPluginName.value&&supportedErrReportingProviderPluginNames.includes(pluginName)));}else {pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>!(pluginName==='ErrorReporting'||supportedErrReportingProviderPluginNames.includes(pluginName)));}// Cloud mode (dataplane) events delivery plugins
    if(state.loadOptions.value.useBeacon===true&&state.capabilities.isBeaconAvailable.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>pluginName!=='XhrQueue');}else {if(state.loadOptions.value.useBeacon===true){this.logger?.warn(UNSUPPORTED_BEACON_API_WARNING(PLUGINS_MANAGER));}pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>pluginName!=='BeaconQueue');}// Enforce default cloud mode event delivery queue plugin is none exists
    if(!pluginsToLoadFromConfig.includes('XhrQueue')&&!pluginsToLoadFromConfig.includes('BeaconQueue')){pluginsToLoadFromConfig.push('XhrQueue');}// Device mode destinations related plugins
    if(getNonCloudDestinations(state.nativeDestinations.configuredDestinations.value??[]).length===0){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>!['DeviceModeDestinations','DeviceModeTransformation','NativeDestinationQueue'].includes(pluginName));}// Consent Management related plugins
    const supportedConsentManagerPlugins=Object.values(ConsentManagersToPluginNameMap);let filterCondition=pluginName=>!(pluginName!==state.consents.activeConsentManagerPluginName.value&&supportedConsentManagerPlugins.includes(pluginName));if(!state.consents.enabled.value){filterCondition=pluginName=>!supportedConsentManagerPlugins.includes(pluginName);}pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(filterCondition);// Storage encryption related plugins
    const supportedStorageEncryptionPlugins=Object.values(StorageEncryptionVersionsToPluginNameMap);pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>!(pluginName!==state.storage.encryptionPluginName.value&&supportedStorageEncryptionPlugins.includes(pluginName)));// Storage migrator related plugins
    if(!state.storage.migrate.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>pluginName!=='StorageMigrator');}return [...Object.keys(getMandatoryPluginsMap()),...pluginsToLoadFromConfig];}/**
       * Determine the list of plugins that should be activated
       */setActivePlugins(){const pluginsToLoad=this.getPluginsToLoadBasedOnConfig();// Merging available mandatory and optional plugin name list
    const availablePlugins=[...Object.keys(pluginsInventory),...pluginNamesList];const activePlugins=[];const failedPlugins=[];pluginsToLoad.forEach(pluginName=>{if(availablePlugins.includes(pluginName)){activePlugins.push(pluginName);}else {failedPlugins.push(pluginName);}});if(failedPlugins.length>0){this.onError(new Error(`Ignoring loading of unknown plugins: ${failedPlugins.join(',')}. Mandatory plugins: ${Object.keys(getMandatoryPluginsMap()).join(',')}. Load option plugins: ${state.plugins.pluginsToLoadFromConfig.value.join(',')}`));}n(()=>{state.plugins.totalPluginsToLoad.value=pluginsToLoad.length;state.plugins.activePlugins.value=activePlugins;state.plugins.failedPlugins.value=failedPlugins;});}/**
       * Register plugins that are direct imports to PluginEngine
       */registerLocalPlugins(){Object.values(pluginsInventory).forEach(localPlugin=>{if(isFunction(localPlugin)&&state.plugins.activePlugins.value.includes(localPlugin().name)){this.register([localPlugin()]);}});}/**
       * Register plugins that are dynamic imports to PluginEngine
       */registerRemotePlugins(){const remotePluginsList=remotePluginsInventory(state.plugins.activePlugins.value);Promise.all(Object.keys(remotePluginsList).map(async remotePluginKey=>{await remotePluginsList[remotePluginKey]().then(remotePluginModule=>this.register([remotePluginModule.default()])).catch(err=>{// TODO: add retry here if dynamic import fails
    state.plugins.failedPlugins.value=[...state.plugins.failedPlugins.value,remotePluginKey];this.onError(err,remotePluginKey);});})).catch(err=>{this.onError(err);});}/**
       * Extension point invoke that allows multiple plugins to be registered to it with error handling
       */invokeMultiple(extPoint,...args){try{return this.engine.invokeMultiple(extPoint,...args);}catch(e){this.onError(e,extPoint);return [];}}/**
       * Extension point invoke that allows a single plugin to be registered to it with error handling
       */invokeSingle(extPoint,...args){try{return this.engine.invokeSingle(extPoint,...args);}catch(e){this.onError(e,extPoint);return null;}}/**
       * Plugin engine register with error handling
       */register(plugins){plugins.forEach(plugin=>{try{this.engine.register(plugin,state);}catch(e){state.plugins.failedPlugins.value=[...state.plugins.failedPlugins.value,plugin.name];this.onError(e);}});}// TODO: Implement reset API instead
    unregisterLocalPlugins(){Object.values(pluginsInventory).forEach(localPlugin=>{try{this.engine.unregister(localPlugin().name);}catch(e){this.onError(e);}});}/**
       * Handle errors
       */onError(error,customMessage){if(this.errorHandler){this.errorHandler.onError(error,PLUGINS_MANAGER,customMessage);}else {throw error;}}}
    
    /**
     * Utility to parse XHR JSON response
     */const responseTextToJson=(responseText,onError)=>{try{return JSON.parse(responseText||'');}catch(err){const error=getMutatedError(err,'Failed to parse response data');if(isFunction(onError)){onError(error);}else {throw error;}}return undefined;};
    
    const DEFAULT_XHR_REQUEST_OPTIONS={headers:{Accept:'application/json','Content-Type':'application/json;charset=UTF-8'},method:'GET'};/**
     * Utility to create request configuration based on default options
     */const createXhrRequestOptions=(url,options,basicAuthHeader)=>{const requestOptions=mergeDeepRight(DEFAULT_XHR_REQUEST_OPTIONS,options||{});if(basicAuthHeader){requestOptions.headers=mergeDeepRight(requestOptions.headers,{Authorization:basicAuthHeader});}requestOptions.url=url;return requestOptions;};/**
     * Utility implementation of XHR, fetch cannot be used as it requires explicit
     * origin allowed values and not wildcard for CORS requests with credentials and
     * this is not supported by our sourceConfig API
     */const xhrRequest=(options,timeout=DEFAULT_XHR_TIMEOUT_MS,logger)=>new Promise((resolve,reject)=>{let payload;if(options.sendRawData===true){payload=options.data;}else {payload=stringifyWithoutCircular(options.data,false,[],logger);if(isNull(payload)){reject({error:new Error(XHR_PAYLOAD_PREP_ERROR),undefined,options});// return and don't process further if the payload could not be stringified
    return;}}const xhr=new XMLHttpRequest();// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const xhrReject=e=>{reject({error:new Error(XHR_DELIVERY_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,xhr.status,xhr.statusText,options.url)),xhr,options});};const xhrError=e=>{reject({error:new Error(XHR_REQUEST_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,e,options.url)),xhr,options});};xhr.ontimeout=xhrError;xhr.onerror=xhrError;xhr.onload=()=>{if(xhr.status>=200&&xhr.status<400){resolve({response:xhr.responseText,xhr,options});}else {xhrReject();}};xhr.open(options.method,options.url);// The timeout property may be set only in the time interval between a call to the open method
    // and the first call to the send method in legacy browsers
    xhr.timeout=timeout;Object.keys(options.headers).forEach(headerName=>{if(options.headers[headerName]){xhr.setRequestHeader(headerName,options.headers[headerName]);}});try{xhr.send(payload);}catch(err){reject({error:getMutatedError(err,XHR_SEND_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,options.url)),xhr,options});}});
    
    /**
     * Service to handle data communication with APIs
     */class HttpClient{hasErrorHandler=false;constructor(errorHandler,logger){this.errorHandler=errorHandler;this.logger=logger;this.hasErrorHandler=Boolean(this.errorHandler);this.onError=this.onError.bind(this);}/**
       * Implement requests in a blocking way
       */async getData(config){const{url,options,timeout,isRawResponse}=config;try{const data=await xhrRequest(createXhrRequestOptions(url,options,this.basicAuthHeader),timeout,this.logger);return {data:isRawResponse?data.response:responseTextToJson(data.response,this.onError),details:data};}catch(reason){this.onError(reason.error??reason);return {data:undefined,details:reason};}}/**
       * Implement requests in a non-blocking way
       */getAsyncData(config){const{callback,url,options,timeout,isRawResponse}=config;const isFireAndForget=!isFunction(callback);xhrRequest(createXhrRequestOptions(url,options,this.basicAuthHeader),timeout,this.logger).then(data=>{if(!isFireAndForget){callback(isRawResponse?data.response:responseTextToJson(data.response,this.onError),data);}}).catch(data=>{this.onError(data.error??data);if(!isFireAndForget){callback(undefined,data);}});}/**
       * Handle errors
       */onError(error){if(this.hasErrorHandler){this.errorHandler?.onError(error,HTTP_CLIENT);}else {throw error;}}/**
       * Set basic authentication header (eg writekey)
       */setAuthHeader(value,noBtoa=false){const authVal=noBtoa?value:toBase64(`${value}:`);this.basicAuthHeader=`Basic ${authVal}`;}/**
       * Clear basic authentication header
       */resetAuthHeader(){this.basicAuthHeader=undefined;}}const defaultHttpClient=new HttpClient(defaultErrorHandler,defaultLogger);
    
    const STORAGE_TEST_COOKIE='test_rudder_cookie';const STORAGE_TEST_LOCAL_STORAGE='test_rudder_ls';const STORAGE_TEST_SESSION_STORAGE='test_rudder_ss';const STORAGE_TEST_TOP_LEVEL_DOMAIN='__tld__';const CLIENT_DATA_STORE_COOKIE='clientDataInCookie';const CLIENT_DATA_STORE_LS='clientDataInLocalStorage';const CLIENT_DATA_STORE_MEMORY='clientDataInMemory';const CLIENT_DATA_STORE_SESSION='clientDataInSessionStorage';const USER_SESSION_KEYS=['userId','userTraits','anonymousId','groupId','groupTraits','initialReferrer','initialReferringDomain','sessionInfo','authToken'];
    
    const storageClientDataStoreNameMap={[COOKIE_STORAGE]:CLIENT_DATA_STORE_COOKIE,[LOCAL_STORAGE]:CLIENT_DATA_STORE_LS,[MEMORY_STORAGE]:CLIENT_DATA_STORE_MEMORY,[SESSION_STORAGE]:CLIENT_DATA_STORE_SESSION};
    
    const detectAdBlockers=(errorHandler,logger)=>{// Apparently, '?view=ad' is a query param that is blocked by majority of adblockers
    // Use source config URL here as it is very unlikely to be blocked by adblockers
    // Only the extra query param should make it vulnerable to adblockers
    // This will work even if the users proxies it.
    // The edge case where this doesn't work is when HEAD method is not allowed by the server (user's)
    const baseUrl=new URL(state.lifecycle.sourceConfigUrl.value);const url=`${baseUrl.origin}${baseUrl.pathname}?view=ad`;const httpClient=new HttpClient(errorHandler,logger);httpClient.setAuthHeader(state.lifecycle.writeKey.value);httpClient.getAsyncData({url,options:{// We actually don't need the response from the request, so we are using HEAD
    method:'HEAD',headers:{'Content-Type':undefined}},isRawResponse:true,callback:(result,details)=>{// not ad blocked if the request is successful or it is not internally redirected on the client side
    // Often adblockers instead of blocking the request, they redirect it to an internal URL
    state.capabilities.isAdBlocked.value=details?.error!==undefined||details?.xhr?.responseURL!==url;}});};
    
    const hasCrypto=()=>!isNullOrUndefined(globalThis.crypto)&&isFunction(globalThis.crypto.getRandomValues);const hasUAClientHints=()=>!isNullOrUndefined(globalThis.navigator.userAgentData);const hasBeacon=()=>!isNullOrUndefined(globalThis.navigator.sendBeacon)&&isFunction(globalThis.navigator.sendBeacon);const isIE11=()=>Boolean(globalThis.navigator.userAgent.match(/Trident.*rv:11\./));
    
    const getUserAgentClientHint=(callback,level='none')=>{if(level==='none'){callback(undefined);}if(level==='default'){callback(navigator.userAgentData);}if(level==='full'){navigator.userAgentData?.getHighEntropyValues(['architecture','bitness','brands','mobile','model','platform','platformVersion','uaFullVersion','fullVersionList','wow64']).then(ua=>{callback(ua);}).catch(()=>{callback();});}};
    
    const isDatasetAvailable=()=>{const testElement=globalThis.document.createElement('div');testElement.setAttribute('data-a-b','c');return testElement.dataset?testElement.dataset.aB==='c':false;};const legacyJSEngineRequiredPolyfills={// Ideally, we should separate the checks for URL and URLSearchParams but
    // the polyfill service serves them under the same feature name, "URL".
    URL:()=>!isFunction(globalThis.URL)||!isFunction(globalThis.URLSearchParams),Promise:()=>!isFunction(globalThis.Promise),'Number.isNaN':()=>!isFunction(globalThis.Number.isNaN),'Number.isInteger':()=>!isFunction(globalThis.Number.isInteger),'Array.from':()=>!isFunction(globalThis.Array.from),'Array.prototype.find':()=>!isFunction(globalThis.Array.prototype.find),'Array.prototype.includes':()=>!isFunction(globalThis.Array.prototype.includes),'String.prototype.endsWith':()=>!isFunction(globalThis.String.prototype.endsWith),'String.prototype.startsWith':()=>!isFunction(globalThis.String.prototype.startsWith),'String.prototype.includes':()=>!isFunction(globalThis.String.prototype.includes),'String.prototype.replaceAll':()=>!isFunction(globalThis.String.prototype.replaceAll),'String.fromCodePoint':()=>!isFunction(globalThis.String.fromCodePoint),'Object.entries':()=>!isFunction(globalThis.Object.entries),'Object.values':()=>!isFunction(globalThis.Object.values),'Object.assign':()=>!isFunction(globalThis.Object.assign),'Element.prototype.dataset':()=>!isDatasetAvailable(),// Ideally, we should separate the checks for TextEncoder and TextDecoder but
    // the polyfill service serves them under the same feature name, "TextEncoder".
    TextEncoder:()=>!isFunction(globalThis.TextEncoder)||!isFunction(globalThis.TextDecoder),requestAnimationFrame:()=>!isFunction(globalThis.requestAnimationFrame)||!isFunction(globalThis.cancelAnimationFrame),CustomEvent:()=>!isFunction(globalThis.CustomEvent),'navigator.sendBeacon':()=>!isFunction(globalThis.navigator.sendBeacon),// Note, the polyfill service serves both ArrayBuffer and Uint8Array under the same feature name, "ArrayBuffer".
    ArrayBuffer:()=>!isFunction(globalThis.Uint8Array)};const isLegacyJSEngine=()=>{const requiredCapabilitiesList=Object.keys(legacyJSEngineRequiredPolyfills);let needsPolyfill=false;/* eslint-disable-next-line unicorn/no-for-loop */for(let i=0;i<requiredCapabilitiesList.length;i++){const isCapabilityMissing=legacyJSEngineRequiredPolyfills[requiredCapabilitiesList[i]];if(isFunction(isCapabilityMissing)&&isCapabilityMissing()){needsPolyfill=true;break;}}return needsPolyfill;};
    
    const getScreenDetails=()=>{let screenDetails={density:0,width:0,height:0,innerWidth:0,innerHeight:0};screenDetails={width:globalThis.screen.width,height:globalThis.screen.height,density:globalThis.devicePixelRatio,innerWidth:globalThis.innerWidth,innerHeight:globalThis.innerHeight};return screenDetails;};
    
    const isStorageQuotaExceeded=e=>{const matchingNames=['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED'];// [everything except Firefox, Firefox]
    const matchingCodes=[22,1014];// [everything except Firefox, Firefox]
    const isQuotaExceededError=matchingNames.includes(e.name)||matchingCodes.includes(e.code);return e instanceof DOMException&&isQuotaExceededError;};// TODO: also check for SecurityErrors
    //  https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions
    const isStorageAvailable=(type=LOCAL_STORAGE,storageInstance,logger)=>{let storage;let testData;try{switch(type){case MEMORY_STORAGE:return true;case COOKIE_STORAGE:storage=storageInstance;testData=STORAGE_TEST_COOKIE;break;case LOCAL_STORAGE:storage=storageInstance??globalThis.localStorage;testData=STORAGE_TEST_LOCAL_STORAGE;// was STORAGE_TEST_LOCAL_STORAGE in ours and generateUUID() in segment retry one
    break;case SESSION_STORAGE:storage=storageInstance??globalThis.sessionStorage;testData=STORAGE_TEST_SESSION_STORAGE;break;default:return false;}if(!storage){return false;}storage.setItem(testData,'true');if(storage.getItem(testData)){storage.removeItem(testData);return true;}return false;}catch(err){const msgPrefix=STORAGE_UNAVAILABILITY_ERROR_PREFIX(CAPABILITIES_MANAGER,type);let reason='unavailable';if(isStorageQuotaExceeded(err)){reason='full';}logger?.warn(`${msgPrefix}${reason}.`,err);return false;}};
    
    /**
     * Encode.
     */const encode=(value,logger)=>{try{return encodeURIComponent(value);}catch(err){logger?.error(COOKIE_DATA_ENCODING_ERROR,err);return undefined;}};/**
     * Decode
     */const decode=value=>{try{return decodeURIComponent(value);}catch(err){// Do nothing as non-RS SDK cookies may not be URI encoded
    return undefined;}};/**
     * Parse cookie `str`
     */const parse=str=>{const obj={};const pairs=str.split(/\s*;\s*/);let pair;if(!pairs[0]){return obj;}// TODO: Decode only the cookies that are needed by the SDK
    pairs.forEach(pairItem=>{pair=pairItem.split('=');const keyName=pair[0]?decode(pair[0]):undefined;if(keyName){obj[keyName]=pair[1]?decode(pair[1]):undefined;}});return obj;};/**
     * Set cookie `name` to `value`
     */const set=(name,value,optionsConfig,logger)=>{const options={...optionsConfig}||{};let cookieString=`${encode(name,logger)}=${encode(value,logger)}`;if(isNull(value)){options.maxage=-1;}if(options.maxage){options.expires=new Date(+new Date()+options.maxage);}if(options.path){cookieString+=`; path=${options.path}`;}if(options.domain){cookieString+=`; domain=${options.domain}`;}if(options.expires){cookieString+=`; expires=${options.expires.toUTCString()}`;}if(options.samesite){cookieString+=`; samesite=${options.samesite}`;}if(options.secure){cookieString+=`; secure`;}globalThis.document.cookie=cookieString;};/**
     * Return all cookies
     */const all=()=>{const cookieStringValue=globalThis.document.cookie;return parse(cookieStringValue);};/**
     * Get cookie `name`
     */const get=name=>all()[name];/**
     * Set or get cookie `name` with `value` and `options` object
     */ // eslint-disable-next-line func-names
    const cookie=function(name,value,options,logger){switch(arguments.length){case 4:case 3:case 2:return set(name,value,options,logger);case 1:if(name){return get(name);}return all();default:return all();}};
    
    const legacyGetHostname=href=>{const l=document.createElement('a');l.href=href;return l.hostname;};/**
     * Levels returns all levels of the given url
     *
     * The method returns an empty array when the hostname is an ip.
     */const levelsFunc=url=>{// This is called before the polyfills load thus new URL cannot be used
    const host=typeof globalThis.URL!=='function'?legacyGetHostname(url):new URL(url).hostname;const parts=host?.split('.')??[];const last=parts[parts.length-1];const levels=[];// Ip address.
    if(parts.length===4&&last&&last===parseInt(last,10).toString()){return levels;}// Localhost.
    if(parts.length<=1){// Fix to support localhost
    if(parts[0]&&parts[0].indexOf('localhost')!==-1){return ['localhost'];}return levels;}// Create levels.
    for(let i=parts.length-2;i>=0;i-=1){levels.push(parts.slice(i).join('.'));}return levels;};/**
     * Get the top domain.
     *
     * The function constructs the levels of domain and attempts to set a global
     * cookie on each one when it succeeds it returns the top level domain.
     *
     * The method returns an empty string when the hostname is an ip.
     */const domain=url=>{const levels=levelsFunc(url);// Lookup the real top level one.
    // eslint-disable-next-line unicorn/no-for-loop
    for(let i=0;i<levels.length;i+=1){const domain=levels[i];const cname=STORAGE_TEST_TOP_LEVEL_DOMAIN;const opts={domain:`${domain.indexOf('localhost')!==-1?'':'.'}${domain}`};// Set cookie on domain
    cookie(cname,1,opts);// If successful
    if(cookie(cname)){// Remove cookie from domain
    cookie(cname,null,opts);return domain;}}return '';};
    
    const getDefaultCookieOptions=()=>{const topDomain=domain(globalThis.location.href);return {maxage:DEFAULT_COOKIE_MAX_AGE_MS,path:'/',domain:!topDomain||topDomain==='.'?undefined:topDomain,samesite:'Lax',enabled:true};};const getDefaultLocalStorageOptions=()=>({enabled:true});const getDefaultSessionStorageOptions=()=>({enabled:true});const getDefaultInMemoryStorageOptions=()=>({enabled:true});
    
    /**
     * A storage utility to persist values in cookies via Storage interface
     */class CookieStorage{static globalSingleton=null;isSupportAvailable=true;isEnabled=true;length=0;constructor(options={},logger){if(CookieStorage.globalSingleton){// eslint-disable-next-line no-constructor-return
    return CookieStorage.globalSingleton;}this.options=getDefaultCookieOptions();this.logger=logger;this.configure(options);CookieStorage.globalSingleton=this;}configure(options){this.options=mergeDeepRight(this.options??{},options);if(options.sameDomainCookiesOnly){delete this.options.domain;}this.isSupportAvailable=isStorageAvailable(COOKIE_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}setItem(key,value){cookie(key,value,this.options,this.logger);this.length=Object.keys(cookie()).length;return true;}// eslint-disable-next-line class-methods-use-this
    getItem(key){const value=cookie(key);return isUndefined(value)?null:value;}removeItem(key){const result=this.setItem(key,null);this.length=Object.keys(cookie()).length;return result;}// eslint-disable-next-line class-methods-use-this
    clear(){// Not implemented
    // getting a list of all cookie storage keys and remove all values
    // sounds risky to do as it will take on all top domain cookies
    // better to explicitly clear specific ones if needed
    }key(index){const curKeys=this.keys();return curKeys[index]??null;}// eslint-disable-next-line class-methods-use-this
    keys(){return Object.keys(cookie());}}
    
    /**
     * A storage utility to retain values in memory via Storage interface
     */class InMemoryStorage{isEnabled=true;length=0;data={};constructor(options,logger){this.options=getDefaultInMemoryStorageOptions();this.logger=logger;this.configure(options??{});}configure(options){this.options=mergeDeepRight(this.options,options);this.isEnabled=Boolean(this.options.enabled);return this.options;}setItem(key,value){this.data[key]=value;this.length=Object.keys(this.data).length;return value;}getItem(key){if(key in this.data){return this.data[key];}return null;}removeItem(key){if(key in this.data){delete this.data[key];}this.length=Object.keys(this.data).length;return null;}clear(){this.data={};this.length=0;}key(index){const curKeys=this.keys();return curKeys[index]??null;}keys(){return Object.keys(this.data);}}const defaultInMemoryStorage=new InMemoryStorage({},defaultLogger);
    
    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
    
    function getDefaultExportFromCjs (x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }
    
    var store$1 = {exports: {}};
    
    (function(module,exports){(function(global,factory){module.exports=factory();})(commonjsGlobal,function(){function isJSON(obj){obj=JSON.stringify(obj);if(!/^\{[\s\S]*\}$/.test(obj)){return false;}return true;}function stringify(val){return val===undefined||typeof val==="function"?val+'':JSON.stringify(val);}function deserialize(value){if(typeof value!=='string'){return undefined;}try{return JSON.parse(value);}catch(e){return value;}}function isFunction(value){return {}.toString.call(value)==="[object Function]";}function isArray(value){return Object.prototype.toString.call(value)==="[object Array]";}// https://github.com/jaywcjlove/store.js/pull/8
    // Error: QuotaExceededError
    function dealIncognito(storage){var _KEY='_Is_Incognit',_VALUE='yes';try{// NOTE: set default storage when not passed in
    if(!storage){storage=window.localStorage;}storage.setItem(_KEY,_VALUE);storage.removeItem(_KEY);}catch(e){var inMemoryStorage={};inMemoryStorage._data={};inMemoryStorage.setItem=function(id,val){return inMemoryStorage._data[id]=String(val);};inMemoryStorage.getItem=function(id){return inMemoryStorage._data.hasOwnProperty(id)?inMemoryStorage._data[id]:undefined;};inMemoryStorage.removeItem=function(id){return delete inMemoryStorage._data[id];};inMemoryStorage.clear=function(){return inMemoryStorage._data={};};storage=inMemoryStorage;}finally{if(storage.getItem(_KEY)===_VALUE)storage.removeItem(_KEY);}return storage;}// deal QuotaExceededError if user use incognito mode in browser
    var storage=dealIncognito();function Store(){if(!(this instanceof Store)){return new Store();}}Store.prototype={set:function set(key,val){if(key&&!isJSON(key)){storage.setItem(key,stringify(val));}else if(isJSON(key)){for(var a in key)this.set(a,key[a]);}return this;},get:function get(key){// Return all entries if no key
    if(key===undefined){var ret={};this.forEach(function(key,val){return ret[key]=val;});return ret;}if(key.charAt(0)==='?'){return this.has(key.substr(1));}var args=arguments;if(args.length>1){var dt={};for(var i=0,len=args.length;i<len;i++){var value=deserialize(storage.getItem(args[i]));if(this.has(args[i])){dt[args[i]]=value;}}return dt;}return deserialize(storage.getItem(key));},clear:function clear(){storage.clear();return this;},remove:function remove(key){var val=this.get(key);storage.removeItem(key);return val;},has:function has(key){return {}.hasOwnProperty.call(this.get(),key);},keys:function keys(){var d=[];this.forEach(function(k){d.push(k);});return d;},forEach:function forEach(callback){for(var i=0,len=storage.length;i<len;i++){var key=storage.key(i);callback(key,this.get(key));}return this;},search:function search(str){var arr=this.keys(),dt={};for(var i=0,len=arr.length;i<len;i++){if(arr[i].indexOf(str)>-1)dt[arr[i]]=this.get(arr[i]);}return dt;},length:storage.length};var _Store=null;function store(key,data){var argm=arguments;var dt=null;if(!_Store)_Store=Store();if(argm.length===0)return _Store.get();if(argm.length===1){if(typeof key==="string")return _Store.get(key);if(isJSON(key))return _Store.set(key);}if(argm.length===2&&typeof key==="string"){if(!data)return _Store.remove(key);if(data&&typeof data==="string")return _Store.set(key,data);if(data&&isFunction(data)){dt=null;dt=data(key,_Store.get(key));store.set(key,dt);}}if(argm.length===2&&isArray(key)&&isFunction(data)){for(var i=0,len=key.length;i<len;i++){dt=data(key[i],_Store.get(key[i]));store.set(key[i],dt);}}return store;}for(var a in Store.prototype)store[a]=Store.prototype[a];return store;});})(store$1);var storeExports=store$1.exports;const store = /*@__PURE__*/getDefaultExportFromCjs(storeExports);
    
    //  check if the get, set overloads and search methods are used at all
    //  if we do, ensure we provide types to support overloads as per storejs docs
    //  https://www.npmjs.com/package/storejs
    /**
     * A storage utility to persist values in localstorage via Storage interface
     */class LocalStorage{isSupportAvailable=true;isEnabled=true;length=0;constructor(options={},logger){this.options=getDefaultLocalStorageOptions();this.logger=logger;this.configure(options);}configure(options){this.options=mergeDeepRight(this.options,options);this.isSupportAvailable=isStorageAvailable(LOCAL_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}setItem(key,value){store.set(key,value);this.length=store.keys().length;}// eslint-disable-next-line class-methods-use-this
    getItem(key){const value=store.get(key);return isUndefined(value)?null:value;}removeItem(key){store.remove(key);this.length=store.keys().length;}clear(){store.clear();this.length=0;}key(index){const curKeys=this.keys();return curKeys[index]??null;}// eslint-disable-next-line class-methods-use-this
    keys(){return store.keys();}}const defaultLocalStorage=new LocalStorage({},defaultLogger);
    
    /**
     * A storage utility to persist values in SessionStorage via Storage interface
     */class SessionStorage{isSupportAvailable=true;isEnabled=true;length=0;store=globalThis.sessionStorage;constructor(options={},logger){this.options=getDefaultSessionStorageOptions();this.logger=logger;this.configure(options);}configure(options){this.options=mergeDeepRight(this.options,options);this.isSupportAvailable=isStorageAvailable(SESSION_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}setItem(key,value){this.store.setItem(key,value);this.length=this.store.length;}getItem(key){const value=this.store.getItem(key);return isUndefined(value)?null:value;}removeItem(key){this.store.removeItem(key);this.length=this.store.length;}clear(){this.store.clear();this.length=0;}key(index){return this.store.key(index);}keys(){const keys=[];for(let i=0;i<this.store.length;i+=1){const key=this.store.key(i);if(key!==null){keys.push(key);}}return keys;}}const defaultSessionStorage=new SessionStorage({},defaultLogger);
    
    /**
     * A utility to retrieve the storage singleton instance by type
     */const getStorageEngine=type=>{switch(type){case LOCAL_STORAGE:return defaultLocalStorage;case SESSION_STORAGE:return defaultSessionStorage;case MEMORY_STORAGE:return defaultInMemoryStorage;case COOKIE_STORAGE:return new CookieStorage({},defaultLogger);default:return defaultInMemoryStorage;}};/**
     * Configure cookie storage singleton
     */const configureCookieStorageEngine=options=>{new CookieStorage({},defaultLogger).configure(options);};/**
     * Configure local storage singleton
     */const configureLocalStorageEngine=options=>{defaultLocalStorage.configure(options);};/**
     * Configure in memory storage singleton
     */const configureInMemoryStorageEngine=options=>{defaultInMemoryStorage.configure(options);};/**
     * Configure session storage singleton
     */const configureSessionStorageEngine=options=>{defaultSessionStorage.configure(options);};/**
     * Configure all storage singleton instances
     */const configureStorageEngines=(cookieStorageOptions={},localStorageOptions={},inMemoryStorageOptions={},sessionStorageOptions={})=>{configureCookieStorageEngine(cookieStorageOptions);configureLocalStorageEngine(localStorageOptions);configureInMemoryStorageEngine(inMemoryStorageOptions);configureSessionStorageEngine(sessionStorageOptions);};
    
    /**
     * Store Implementation with dedicated storage
     */class Store{hasErrorHandler=false;constructor(config,engine,pluginsManager){this.id=config.id;this.name=config.name;this.isEncrypted=config.isEncrypted??false;this.validKeys=config.validKeys??{};this.engine=engine??getStorageEngine(LOCAL_STORAGE);this.noKeyValidation=Object.keys(this.validKeys).length===0;this.noCompoundKey=config.noCompoundKey;this.originalEngine=this.engine;this.errorHandler=config.errorHandler??defaultErrorHandler;this.hasErrorHandler=Boolean(this.errorHandler);this.logger=config.logger??defaultLogger;this.pluginsManager=pluginsManager;}/**
       * Ensure the key is valid and with correct format
       */createValidKey(key){const{name,id,validKeys,noKeyValidation,noCompoundKey}=this;if(noKeyValidation){return noCompoundKey?key:[name,id,key].join('.');}// validate and return undefined if invalid key
    let compoundKey;Object.values(validKeys).forEach(validKeyName=>{if(validKeyName===key){compoundKey=noCompoundKey?key:[name,id,key].join('.');}});return compoundKey;}/**
       * Switch to inMemoryEngine, bringing any existing data with.
       */swapQueueStoreToInMemoryEngine(){const{name,id,validKeys,noCompoundKey}=this;const inMemoryStorage=getStorageEngine(MEMORY_STORAGE);// grab existing data, but only for this page's queue instance, not all
    // better to keep other queues in localstorage to be flushed later
    // than to pull them into memory and remove them from durable storage
    Object.keys(validKeys).forEach(key=>{const value=this.get(validKeys[key]);const validKey=noCompoundKey?key:[name,id,key].join('.');inMemoryStorage.setItem(validKey,value);// TODO: are we sure we want to drop clientData
    //  if cookies are not available and localstorage is full?
    this.remove(key);});this.engine=inMemoryStorage;}/**
       * Set value by key.
       */set(key,value){const validKey=this.createValidKey(key);if(!validKey){return;}try{// storejs that is used in localstorage engine already stringifies json
    this.engine.setItem(validKey,this.encrypt(stringifyWithoutCircular(value,false,[],this.logger)));}catch(err){if(isStorageQuotaExceeded(err)){this.logger?.warn(STORAGE_QUOTA_EXCEEDED_WARNING(`Store ${this.id}`));// switch to inMemory engine
    this.swapQueueStoreToInMemoryEngine();// and save it there
    this.set(key,value);}else {this.onError(getMutatedError(err,STORE_DATA_SAVE_ERROR(key)));}}}/**
       * Get by Key.
       */get(key){const validKey=this.createValidKey(key);try{if(!validKey){return null;}const str=this.decrypt(this.engine.getItem(validKey));if(isNullOrUndefined(str)){return null;}// storejs that is used in localstorage engine already deserializes json strings but swallows errors
    return JSON.parse(str);}catch(err){this.onError(new Error(`${STORE_DATA_FETCH_ERROR(key)}: ${err.message}`));return null;}}/**
       * Remove by Key.
       */remove(key){const validKey=this.createValidKey(key);if(validKey){this.engine.removeItem(validKey);}}/**
       * Get original engine
       */getOriginalEngine(){return this.originalEngine;}/**
       * Decrypt values
       */decrypt(value){if(isNullOrUndefined(value)){return null;}return this.crypto(value,'decrypt');}/**
       * Encrypt value
       */encrypt(value){return this.crypto(value,'encrypt');}/**
       * Extension point to use with encryption plugins
       */crypto(value,mode){const noEncryption=!this.isEncrypted||!value||typeof value!=='string'||trim(value)==='';if(noEncryption){return value;}const extensionPointName=`storage.${mode}`;const formattedValue=this.pluginsManager?this.pluginsManager.invokeSingle(extensionPointName,value):value;return typeof formattedValue==='undefined'?value:formattedValue??'';}/**
       * Handle errors
       */onError(error){if(this.hasErrorHandler){this.errorHandler?.onError(error,`Store ${this.id}`);}else {throw error;}}}
    
    const getStorageTypeFromPreConsentIfApplicable=(state,sessionKey)=>{let overriddenStorageType;if(state.consents.preConsent.value.enabled){switch(state.consents.preConsent.value.storage?.strategy){case'none':overriddenStorageType=NO_STORAGE;break;case'session':if(sessionKey!=='sessionInfo'){overriddenStorageType=NO_STORAGE;}break;case'anonymousId':if(sessionKey!=='anonymousId'){overriddenStorageType=NO_STORAGE;}break;}}return overriddenStorageType;};
    
    /**
     * A service to manage stores & available storage client configurations
     */class StoreManager{stores={};isInitialized=false;hasErrorHandler=false;constructor(pluginsManager,errorHandler,logger){this.errorHandler=errorHandler;this.logger=logger;this.hasErrorHandler=Boolean(this.errorHandler);this.pluginsManager=pluginsManager;this.onError=this.onError.bind(this);}/**
       * Configure available storage client instances
       */init(){if(this.isInitialized){return;}const loadOptions=state.loadOptions.value;const config={cookieStorageOptions:{samesite:loadOptions.sameSiteCookie,secure:loadOptions.secureCookie,domain:loadOptions.setCookieDomain,sameDomainCookiesOnly:loadOptions.sameDomainCookiesOnly,enabled:true},localStorageOptions:{enabled:true},inMemoryStorageOptions:{enabled:true},sessionStorageOptions:{enabled:true}};configureStorageEngines(removeUndefinedValues(mergeDeepRight(config.cookieStorageOptions??{},state.storage.cookie?.value??{})),removeUndefinedValues(config.localStorageOptions),removeUndefinedValues(config.inMemoryStorageOptions),removeUndefinedValues(config.sessionStorageOptions));this.initClientDataStores();this.isInitialized=true;}/**
       * Create store to persist data used by the SDK like session, used details etc
       */initClientDataStores(){this.initializeStorageState();// TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
    // TODO: should we pass the keys for all in order to validate or leave free as v1.1?
    // Initializing all the enabled store because previous user data might be in different storage
    // that needs auto migration
    const storageTypes=[MEMORY_STORAGE,LOCAL_STORAGE,COOKIE_STORAGE,SESSION_STORAGE];storageTypes.forEach(storageType=>{if(getStorageEngine(storageType)?.isEnabled){this.setStore({id:storageClientDataStoreNameMap[storageType],name:storageClientDataStoreNameMap[storageType],isEncrypted:true,noCompoundKey:true,type:storageType});}});}initializeStorageState(){let globalStorageType=state.storage.type.value;let entriesOptions=state.loadOptions.value.storage?.entries;// Use the storage options from post consent if anything is defined
    const postConsentStorageOpts=state.consents.postConsent.value.storage;if(isDefined(postConsentStorageOpts?.type)||isDefined(postConsentStorageOpts?.entries)){globalStorageType=postConsentStorageOpts?.type;entriesOptions=postConsentStorageOpts?.entries;}let trulyAnonymousTracking=true;let storageEntries={};USER_SESSION_KEYS.forEach(sessionKey=>{const key=sessionKey;const storageKey=sessionKey;const configuredStorageType=entriesOptions?.[key]?.type;const preConsentStorageType=getStorageTypeFromPreConsentIfApplicable(state,sessionKey);// Storage type precedence order: pre-consent strategy > entry type > global type > default
    const storageType=preConsentStorageType??configuredStorageType??globalStorageType??DEFAULT_STORAGE_TYPE;const finalStorageType=this.getResolvedStorageTypeForEntry(storageType,sessionKey);if(finalStorageType!==NO_STORAGE){trulyAnonymousTracking=false;}storageEntries={...storageEntries,[sessionKey]:{type:finalStorageType,key:USER_SESSION_STORAGE_KEYS[storageKey]}};});n(()=>{state.storage.type.value=globalStorageType;state.storage.entries.value=storageEntries;state.storage.trulyAnonymousTracking.value=trulyAnonymousTracking;});}getResolvedStorageTypeForEntry(storageType,sessionKey){let finalStorageType=storageType;switch(storageType){case LOCAL_STORAGE:if(!getStorageEngine(LOCAL_STORAGE)?.isEnabled){finalStorageType=MEMORY_STORAGE;}break;case SESSION_STORAGE:if(!getStorageEngine(SESSION_STORAGE)?.isEnabled){finalStorageType=MEMORY_STORAGE;}break;case MEMORY_STORAGE:case NO_STORAGE:break;case COOKIE_STORAGE:default:// First try setting the storage to cookie else to local storage
    if(getStorageEngine(COOKIE_STORAGE)?.isEnabled){finalStorageType=COOKIE_STORAGE;}else if(getStorageEngine(LOCAL_STORAGE)?.isEnabled){finalStorageType=LOCAL_STORAGE;}else if(getStorageEngine(SESSION_STORAGE)?.isEnabled){finalStorageType=SESSION_STORAGE;}else {finalStorageType=MEMORY_STORAGE;}break;}if(finalStorageType!==storageType){this.logger?.warn(STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER,sessionKey,storageType,finalStorageType));}return finalStorageType;}/**
       * Create a new store
       */setStore(storeConfig){const storageEngine=getStorageEngine(storeConfig.type);this.stores[storeConfig.id]=new Store(storeConfig,storageEngine,this.pluginsManager);return this.stores[storeConfig.id];}/**
       * Retrieve a store
       */getStore(id){return this.stores[id];}/**
       * Handle errors
       */onError(error){if(this.hasErrorHandler){this.errorHandler?.onError(error,STORE_MANAGER);}else {throw error;}}}
    
    /**
     * Removes trailing slash from url
     * @param url
     * @returns url
     */const removeTrailingSlashes=url=>url&&url.endsWith('/')?removeTrailingSlashes(url.substring(0,url.length-1)):url;/**
     * Checks if provided url is valid or not
     * @param url
     * @returns true if `url` is valid and false otherwise
     */const isValidUrl=url=>{try{const validUrl=new URL(url);return Boolean(validUrl);}catch(err){return false;}};/**
     * Get the referring domain from the referrer URL
     * @param referrer Page referrer
     * @returns Page referring domain
     */const getReferringDomain=referrer=>{let referringDomain='';try{const url=new URL(referrer);referringDomain=url.host;}catch(error){// Do nothing
    }return referringDomain;};/**
     * Extracts UTM parameters from the URL
     * @param url Page URL
     * @returns UTM parameters
     */const extractUTMParameters=url=>{const result={};try{const urlObj=new URL(url);const UTM_PREFIX='utm_';urlObj.searchParams.forEach((value,sParam)=>{if(sParam.startsWith(UTM_PREFIX)){let utmParam=sParam.substring(UTM_PREFIX.length);// Not sure why we're doing this
    if(utmParam==='campaign'){utmParam='name';}result[utmParam]=value;}});}catch(error){// Do nothing
    }return result;};/**
     * To get the URL until the hash
     * @param url The input URL
     * @returns URL until the hash
     */const getUrlWithoutHash=url=>{let urlWithoutHash=url;try{const urlObj=new URL(url);urlWithoutHash=urlObj.origin+urlObj.pathname+urlObj.search;}catch(error){// Do nothing
    }return urlWithoutHash;};
    
    const validateWriteKey=writeKey=>{if(!isString(writeKey)||writeKey.trim().length===0){throw new Error(WRITE_KEY_VALIDATION_ERROR(writeKey));}};const validateDataPlaneUrl=dataPlaneUrl=>{if(dataPlaneUrl&&!isValidUrl(dataPlaneUrl)){throw new Error(DATA_PLANE_URL_VALIDATION_ERROR(dataPlaneUrl));}};const validateLoadArgs=(writeKey,dataPlaneUrl)=>{validateWriteKey(writeKey);validateDataPlaneUrl(dataPlaneUrl);};const isValidSourceConfig=res=>isObjectLiteralAndNotNull(res)&&isObjectLiteralAndNotNull(res.source)&&!isNullOrUndefined(res.source.id)&&isObjectLiteralAndNotNull(res.source.config)&&Array.isArray(res.source.destinations);const isValidStorageType=storageType=>typeof storageType==='string'&&SUPPORTED_STORAGE_TYPES.includes(storageType);
    
    /**
     * Plugins to be loaded in the plugins loadOption is not defined
     */const defaultOptionalPluginsList=['BeaconQueue','Bugsnag','CustomConsentManager','DeviceModeDestinations','DeviceModeTransformation','ErrorReporting','ExternalAnonymousId','GoogleLinker','KetchConsentManager','NativeDestinationQueue','OneTrustConsentManager','StorageEncryption','StorageEncryptionLegacy','StorageMigrator','XhrQueue'];
    
    /**
     * A function to check given value is a number or not
     * @param num input value
     * @returns boolean
     */const isNumber=num=>typeof num==='number'&&!Number.isNaN(num);/**
     * A function to check given number has minimum length or not
     * @param minimumLength     minimum length
     * @param num               input number
     * @returns boolean
     */const hasMinLength=(minimumLength,num)=>num.toString().length>=minimumLength;/**
     * A function to check given value is a positive integer or not
     * @param num input value
     * @returns boolean
     */const isPositiveInteger=num=>isNumber(num)&&num>=0&&Number.isInteger(num);
    
    const normalizeLoadOptions=(loadOptionsFromState,loadOptions)=>{// TODO: Maybe add warnings for invalid values
    const normalizedLoadOpts=clone(loadOptions);if(!isString(normalizedLoadOpts.setCookieDomain)){delete normalizedLoadOpts.setCookieDomain;}const cookieSameSiteValues=['Strict','Lax','None'];if(!cookieSameSiteValues.includes(normalizedLoadOpts.sameSiteCookie)){delete normalizedLoadOpts.sameSiteCookie;}normalizedLoadOpts.secureCookie=normalizedLoadOpts.secureCookie===true;const uaChTrackLevels=['none','default','full'];if(!uaChTrackLevels.includes(normalizedLoadOpts.uaChTrackLevel)){delete normalizedLoadOpts.uaChTrackLevel;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.integrations)){delete normalizedLoadOpts.integrations;}normalizedLoadOpts.plugins=normalizedLoadOpts.plugins??defaultOptionalPluginsList;normalizedLoadOpts.useGlobalIntegrationsConfigInEvents=normalizedLoadOpts.useGlobalIntegrationsConfigInEvents===true;normalizedLoadOpts.bufferDataPlaneEventsUntilReady=normalizedLoadOpts.bufferDataPlaneEventsUntilReady===true;normalizedLoadOpts.sendAdblockPage=normalizedLoadOpts.sendAdblockPage===true;if(!isObjectLiteralAndNotNull(normalizedLoadOpts.sendAdblockPageOptions)){delete normalizedLoadOpts.sendAdblockPageOptions;}if(!isDefined(normalizedLoadOpts.loadIntegration)){delete normalizedLoadOpts.loadIntegration;}else {normalizedLoadOpts.loadIntegration=normalizedLoadOpts.loadIntegration===true;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.storage)){delete normalizedLoadOpts.storage;}else {normalizedLoadOpts.storage=removeUndefinedAndNullValues(normalizedLoadOpts.storage);normalizedLoadOpts.storage.migrate=normalizedLoadOpts.storage?.migrate===true;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.beaconQueueOptions)){delete normalizedLoadOpts.beaconQueueOptions;}else {normalizedLoadOpts.beaconQueueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.beaconQueueOptions);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.destinationsQueueOptions)){delete normalizedLoadOpts.destinationsQueueOptions;}else {normalizedLoadOpts.destinationsQueueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.destinationsQueueOptions);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.queueOptions)){delete normalizedLoadOpts.queueOptions;}else {normalizedLoadOpts.queueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.queueOptions);}normalizedLoadOpts.lockIntegrationsVersion=normalizedLoadOpts.lockIntegrationsVersion===true;if(!isNumber(normalizedLoadOpts.dataPlaneEventsBufferTimeout)){delete normalizedLoadOpts.dataPlaneEventsBufferTimeout;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.storage?.cookie)){delete normalizedLoadOpts.storage?.cookie;}else {normalizedLoadOpts.storage.cookie=removeUndefinedAndNullValues(normalizedLoadOpts.storage?.cookie);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.preConsent)){delete normalizedLoadOpts.preConsent;}else {normalizedLoadOpts.preConsent=removeUndefinedAndNullValues(normalizedLoadOpts.preConsent);}const mergedLoadOptions=mergeDeepRight(loadOptionsFromState,normalizedLoadOpts);return mergedLoadOptions;};const getSourceConfigURL=(configUrl,writeKey,lockIntegrationsVersion,logger)=>{const defSearchParams=new URLSearchParams({p:MODULE_TYPE,v:APP_VERSION,build:BUILD_TYPE,writeKey,lockIntegrationsVersion:lockIntegrationsVersion.toString()});let origin=DEFAULT_CONFIG_BE_URL;let searchParams=defSearchParams;let pathname='/sourceConfig/';let hash='';// Ideally, this check is not required but URL polyfill
    // doesn't seem to throw errors for empty URLs
    // TODO: Need to improve this check to find out if the URL is valid or not
    if(configUrl){try{const configUrlInstance=new URL(configUrl);if(!removeTrailingSlashes(configUrlInstance.pathname).endsWith('/sourceConfig')){configUrlInstance.pathname=`${removeTrailingSlashes(configUrlInstance.pathname)}/sourceConfig/`;}configUrlInstance.pathname=removeDuplicateSlashes(configUrlInstance.pathname);defSearchParams.forEach((value,key)=>{if(configUrlInstance.searchParams.get(key)===null){configUrlInstance.searchParams.set(key,value);}});origin=configUrlInstance.origin;pathname=configUrlInstance.pathname;searchParams=configUrlInstance.searchParams;hash=configUrlInstance.hash;}catch(err){logger?.warn(INVALID_CONFIG_URL_WARNING(CONFIG_MANAGER,configUrl));}}return `${origin}${pathname}?${searchParams}${hash}`;};
    
    /**
     * A function to filter enabled destinations and map to required properties only
     * @param destinations
     *
     * @returns Destination[]
     */const filterEnabledDestination=destinations=>{const nativeDestinations=[];destinations.forEach(destination=>{if(destination.enabled&&!destination.deleted){nativeDestinations.push({id:destination.id,displayName:destination.destinationDefinition.displayName,config:destination.config,shouldApplyDeviceModeTransformation:destination.shouldApplyDeviceModeTransformation||false,propagateEventsUntransformedOnError:destination.propagateEventsUntransformedOnError||false,userFriendlyId:`${destination.destinationDefinition.displayName.replaceAll(' ','-')}___${destination.id}`});}});return nativeDestinations;};
    
    const DEFAULT_REGION='US';/**
     * A function to get url from source config response
     * @param {array} urls    An array of objects containing urls
     * @returns
     */const getDefaultUrlOfRegion=urls=>{let url;if(Array.isArray(urls)&&urls.length>0){const obj=urls.find(elem=>elem.default===true);if(obj&&isValidUrl(obj.url)){return obj.url;}}return url;};const validateResidencyServerRegion=(residencyServerRegion,logger)=>{const residencyServerRegions=['US','EU'];if(residencyServerRegion&&!residencyServerRegions.includes(residencyServerRegion)){logger?.warn(UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING(CONFIG_MANAGER,residencyServerRegion,DEFAULT_REGION));return undefined;}return residencyServerRegion;};/**
     * A function to determine the dataPlaneUrl
     * @param {Object} dataplanes An object containing dataPlaneUrl for different region
     * @param {String} serverUrl dataPlaneUrl provided in the load call
     * @param {String} residencyServerRegion User provided residency server region
     * @param {Logger} logger logger instance
     * @returns The data plane URL string to use
     */const resolveDataPlaneUrl=(dataplanes,serverUrl,residencyServerRegion,logger)=>{// Check if dataPlanes object is present in source config
    if(dataplanes&&Object.keys(dataplanes).length>0){const region=validateResidencyServerRegion(residencyServerRegion,logger)??DEFAULT_REGION;const regionUrlArr=dataplanes[region]||dataplanes[DEFAULT_REGION];const defaultUrl=getDefaultUrlOfRegion(regionUrlArr);if(defaultUrl){return defaultUrl;}}// return the dataPlaneUrl provided in load API(if available)
    if(serverUrl){return serverUrl;}// return undefined if data plane url can not be determined
    return undefined;};
    
    /**
     * Determines if the SDK is running inside a chrome extension
     * @returns boolean
     */const isSDKRunningInChromeExtension=()=>!!(window.chrome&&window.chrome.runtime&&window.chrome.runtime.id);
    
    const DEFAULT_PRE_CONSENT_STORAGE_STRATEGY='none';const DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE='immediate';
    
    const isErrorReportingEnabled=sourceConfig=>sourceConfig?.statsCollection?.errors?.enabled===true;const getErrorReportingProviderNameFromConfig=sourceConfig=>sourceConfig?.statsCollection?.errors?.provider;const isMetricsReportingEnabled=sourceConfig=>sourceConfig?.statsCollection?.metrics?.enabled===true;
    
    /**
     * Validates and normalizes the consent options provided by the user
     * @param options Consent options provided by the user
     * @returns Validated and normalized consent options
     */const getValidPostConsentOptions=options=>{const validOptions={sendPageEvent:false,trackConsent:false,discardPreConsentEvents:false};if(isObjectLiteralAndNotNull(options)){const clonedOptions=clone(options);validOptions.storage=clonedOptions.storage;if(isDefined(clonedOptions.integrations)){validOptions.integrations=isObjectLiteralAndNotNull(clonedOptions.integrations)?clonedOptions.integrations:DEFAULT_INTEGRATIONS_CONFIG;}validOptions.discardPreConsentEvents=clonedOptions.discardPreConsentEvents===true;validOptions.sendPageEvent=clonedOptions.sendPageEvent===true;validOptions.trackConsent=clonedOptions.trackConsent===true;if(isNonEmptyObject(clonedOptions.consentManagement)){// Override enabled value with the current state value
    validOptions.consentManagement=mergeDeepRight(clonedOptions.consentManagement,{enabled:state.consents.enabled.value});}}return validOptions;};/**
     * Validates if the input is a valid consents data
     * @param value Input consents data
     * @returns true if the input is a valid consents data else false
     */const isValidConsentsData=value=>isNonEmptyObject(value)||Array.isArray(value);/**
     * Retrieves the corresponding provider and plugin name of the selected consent manager from the supported consent managers
     * @param consentManagementOpts consent management options
     * @param logger logger instance
     * @returns Corresponding provider and plugin name of the selected consent manager from the supported consent managers
     */const getConsentManagerInfo=(consentManagementOpts,logger)=>{let{provider}=consentManagementOpts;const consentManagerPluginName=provider?ConsentManagersToPluginNameMap[provider]:undefined;if(provider&&!consentManagerPluginName){logger?.error(UNSUPPORTED_CONSENT_MANAGER_ERROR(CONFIG_MANAGER,provider,ConsentManagersToPluginNameMap));// Reset the provider value
    provider=undefined;}return {provider,consentManagerPluginName};};/**
     * Validates and converts the consent management options into a normalized format
     * @param consentManagementOpts Consent management options provided by the user
     * @param logger logger instance
     * @returns An object containing the consent manager plugin name, initialized, enabled and consents data
     */const getConsentManagementData=(consentManagementOpts,logger)=>{let consentManagerPluginName;let allowedConsentIds=[];let deniedConsentIds=[];let initialized=false;let provider;let enabled=consentManagementOpts?.enabled===true;if(isNonEmptyObject(consentManagementOpts)&&enabled){// Get the corresponding plugin name of the selected consent manager from the supported consent managers
    ({provider,consentManagerPluginName}=getConsentManagerInfo(consentManagementOpts,logger));if(isValidConsentsData(consentManagementOpts.allowedConsentIds)){allowedConsentIds=consentManagementOpts.allowedConsentIds;initialized=true;}if(isValidConsentsData(consentManagementOpts.deniedConsentIds)){deniedConsentIds=consentManagementOpts.deniedConsentIds;initialized=true;}}const consentsData={allowedConsentIds,deniedConsentIds};// Enable consent management only if consent manager is supported
    enabled=enabled&&Boolean(consentManagerPluginName);return {provider,consentManagerPluginName,initialized,enabled,consentsData};};
    
    /**
     * Determines the SDK url
     * @returns sdkURL
     */const getSDKUrl=()=>{const scripts=document.getElementsByTagName('script');let sdkURL;const scriptList=Array.prototype.slice.call(scripts);scriptList.some(script=>{const curScriptSrc=removeTrailingSlashes(script.getAttribute('src'));if(curScriptSrc){const urlMatches=curScriptSrc.match(/^.*rsa?(\.min)?\.js$/);if(urlMatches){sdkURL=curScriptSrc;return true;}}return false;});return sdkURL;};/**
     * Updates the reporting state variables from the source config data
     * @param res Source config
     * @param logger Logger instance
     */const updateReportingState=(res,logger)=>{state.reporting.isErrorReportingEnabled.value=isErrorReportingEnabled(res.source.config)&&!isSDKRunningInChromeExtension();state.reporting.isMetricsReportingEnabled.value=isMetricsReportingEnabled(res.source.config);if(state.reporting.isErrorReportingEnabled.value){const errReportingProvider=getErrorReportingProviderNameFromConfig(res.source.config);// Get the corresponding plugin name of the selected error reporting provider from the supported error reporting providers
    const errReportingProviderPlugin=errReportingProvider?ErrorReportingProvidersToPluginNameMap[errReportingProvider]:undefined;if(!isUndefined(errReportingProvider)&&!errReportingProviderPlugin){// set the default error reporting provider
    logger?.warn(UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING(CONFIG_MANAGER,errReportingProvider,ErrorReportingProvidersToPluginNameMap,DEFAULT_ERROR_REPORTING_PROVIDER));}state.reporting.errorReportingProviderPluginName.value=errReportingProviderPlugin??ErrorReportingProvidersToPluginNameMap[DEFAULT_ERROR_REPORTING_PROVIDER];}};const updateStorageStateFromLoadOptions=logger=>{const storageOptsFromLoad=state.loadOptions.value.storage;let storageType=storageOptsFromLoad?.type;if(isDefined(storageType)&&!isValidStorageType(storageType)){logger?.warn(STORAGE_TYPE_VALIDATION_WARNING(CONFIG_MANAGER,storageType,DEFAULT_STORAGE_TYPE));storageType=DEFAULT_STORAGE_TYPE;}let storageEncryptionVersion=storageOptsFromLoad?.encryption?.version;const encryptionPluginName=storageEncryptionVersion&&StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];if(!isUndefined(storageEncryptionVersion)&&isUndefined(encryptionPluginName)){// set the default encryption plugin
    logger?.warn(UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING(CONFIG_MANAGER,storageEncryptionVersion,StorageEncryptionVersionsToPluginNameMap,DEFAULT_STORAGE_ENCRYPTION_VERSION));storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}else if(isUndefined(storageEncryptionVersion)){storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}// Allow migration only if the configured encryption version is the default encryption version
    const configuredMigrationValue=storageOptsFromLoad?.migrate;const finalMigrationVal=configuredMigrationValue&&storageEncryptionVersion===DEFAULT_STORAGE_ENCRYPTION_VERSION;if(configuredMigrationValue===true&&finalMigrationVal!==configuredMigrationValue){logger?.warn(STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(CONFIG_MANAGER,storageEncryptionVersion,DEFAULT_STORAGE_ENCRYPTION_VERSION));}n(()=>{state.storage.type.value=storageType;state.storage.cookie.value=storageOptsFromLoad?.cookie;state.storage.encryptionPluginName.value=StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];state.storage.migrate.value=finalMigrationVal;});};const updateConsentsStateFromLoadOptions=logger=>{const{provider,consentManagerPluginName,initialized,enabled,consentsData}=getConsentManagementData(state.loadOptions.value.consentManagement,logger);// Pre-consent
    const preConsentOpts=state.loadOptions.value.preConsent;let storageStrategy=preConsentOpts?.storage?.strategy??DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;const StorageStrategies=['none','session','anonymousId'];if(isDefined(storageStrategy)&&!StorageStrategies.includes(storageStrategy)){storageStrategy=DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;logger?.warn(UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY(CONFIG_MANAGER,preConsentOpts?.storage?.strategy,DEFAULT_PRE_CONSENT_STORAGE_STRATEGY));}let eventsDeliveryType=preConsentOpts?.events?.delivery??DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;const deliveryTypes=['immediate','buffer'];if(isDefined(eventsDeliveryType)&&!deliveryTypes.includes(eventsDeliveryType)){eventsDeliveryType=DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;logger?.warn(UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE(CONFIG_MANAGER,preConsentOpts?.events?.delivery,DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE));}n(()=>{state.consents.activeConsentManagerPluginName.value=consentManagerPluginName;state.consents.initialized.value=initialized;state.consents.enabled.value=enabled;state.consents.data.value=consentsData;state.consents.provider.value=provider;state.consents.preConsent.value={// Only enable pre-consent if it is explicitly enabled and
    // if it is not already initialized and
    // if consent management is enabled
    enabled:state.loadOptions.value.preConsent?.enabled===true&&initialized===false&&enabled===true,storage:{strategy:storageStrategy},events:{delivery:eventsDeliveryType}};});};/**
     * Determines the consent management state variables from the source config data
     * @param resp Source config response
     * @param logger Logger instance
     */const updateConsentsState=resp=>{let resolutionStrategy=state.consents.resolutionStrategy.value;let cmpMetadata;if(isObjectLiteralAndNotNull(resp.consentManagementMetadata)){if(state.consents.provider.value){resolutionStrategy=resp.consentManagementMetadata.providers.find(p=>p.provider===state.consents.provider.value)?.resolutionStrategy??state.consents.resolutionStrategy.value;}cmpMetadata=resp.consentManagementMetadata;}// If the provider is custom, then the resolution strategy is not applicable
    if(state.consents.provider.value==='custom'){resolutionStrategy=undefined;}n(()=>{state.consents.metadata.value=clone(cmpMetadata);state.consents.resolutionStrategy.value=resolutionStrategy;});};
    
    /**
     * A function that determines integration SDK loading path
     * @param requiredVersion
     * @param lockIntegrationsVersion
     * @param customIntegrationsCDNPath
     * @returns
     */const getIntegrationsCDNPath=(requiredVersion,lockIntegrationsVersion,customIntegrationsCDNPath)=>{let integrationsCDNPath='';// Get the CDN base URL from the user provided URL if any
    if(customIntegrationsCDNPath){integrationsCDNPath=removeTrailingSlashes(customIntegrationsCDNPath);if(!integrationsCDNPath||integrationsCDNPath&&!isValidUrl(integrationsCDNPath)){throw new Error(INTG_CDN_BASE_URL_ERROR);}return integrationsCDNPath;}// Get the base path from the SDK script tag src attribute or use the default path
    const sdkURL=getSDKUrl();integrationsCDNPath=sdkURL&&isString(sdkURL)?sdkURL.split('/').slice(0,-1).concat(CDN_INT_DIR).join('/'):DEST_SDK_BASE_URL;// If version is not locked it will always get the latest version of the integrations
    if(lockIntegrationsVersion){integrationsCDNPath=integrationsCDNPath.replace(CDN_ARCH_VERSION_DIR,requiredVersion);}return integrationsCDNPath;};/**
     * A function that determines plugins SDK loading path
     * @param customPluginsCDNPath
     * @returns
     */const getPluginsCDNPath=customPluginsCDNPath=>{let pluginsCDNPath='';// Get the CDN base URL from the user provided URL if any
    if(customPluginsCDNPath){pluginsCDNPath=removeTrailingSlashes(customPluginsCDNPath);if(!pluginsCDNPath||pluginsCDNPath&&!isValidUrl(pluginsCDNPath)){throw new Error(PLUGINS_CDN_BASE_URL_ERROR);}return pluginsCDNPath;}// Get the base path from the SDK script tag src attribute or use the default path
    const sdkURL=getSDKUrl();pluginsCDNPath=sdkURL&&isString(sdkURL)?sdkURL.split('/').slice(0,-1).concat(CDN_PLUGINS_DIR).join('/'):PLUGINS_BASE_URL;return pluginsCDNPath;};
    
    class ConfigManager{hasErrorHandler=false;constructor(httpClient,errorHandler,logger){this.errorHandler=errorHandler;this.logger=logger;this.httpClient=httpClient;this.hasErrorHandler=Boolean(this.errorHandler);this.onError=this.onError.bind(this);this.processConfig=this.processConfig.bind(this);}attachEffects(){O(()=>{this.logger?.setMinLogLevel(state.lifecycle.logLevel.value);});}/**
       * A function to validate, construct and store loadOption, lifecycle, source and destination
       * config related information in global state
       */init(){this.attachEffects();validateLoadArgs(state.lifecycle.writeKey.value,state.lifecycle.dataPlaneUrl.value);const lockIntegrationsVersion=state.loadOptions.value.lockIntegrationsVersion;// determine the path to fetch integration SDK from
    const intgCdnUrl=getIntegrationsCDNPath(APP_VERSION,lockIntegrationsVersion,state.loadOptions.value.destSDKBaseURL);// determine the path to fetch remote plugins from
    const pluginsCDNPath=getPluginsCDNPath(state.loadOptions.value.pluginsSDKBaseURL);updateStorageStateFromLoadOptions(this.logger);updateConsentsStateFromLoadOptions(this.logger);// set application lifecycle state in global state
    n(()=>{state.lifecycle.integrationsCDNPath.value=intgCdnUrl;state.lifecycle.pluginsCDNPath.value=pluginsCDNPath;if(state.loadOptions.value.logLevel){state.lifecycle.logLevel.value=state.loadOptions.value.logLevel;}state.lifecycle.sourceConfigUrl.value=getSourceConfigURL(state.loadOptions.value.configUrl,state.lifecycle.writeKey.value,lockIntegrationsVersion,this.logger);});this.getConfig();}/**
       * Handle errors
       */onError(error,customMessage,shouldAlwaysThrow){if(this.hasErrorHandler){this.errorHandler?.onError(error,CONFIG_MANAGER,customMessage,shouldAlwaysThrow);}else {throw error;}}/**
       * A callback function that is executed once we fetch the source config response.
       * Use to construct and store information that are dependent on the sourceConfig.
       */processConfig(response,details){// TODO: add retry logic with backoff based on rejectionDetails.xhr.status
    // We can use isErrRetryable utility method
    if(!response){this.onError(SOURCE_CONFIG_FETCH_ERROR(details?.error));return;}let res;try{if(isString(response)){res=JSON.parse(response);}else {res=response;}}catch(err){this.onError(err,SOURCE_CONFIG_RESOLUTION_ERROR,true);return;}if(!isValidSourceConfig(res)){this.onError(new Error(SOURCE_CONFIG_RESOLUTION_ERROR),undefined,true);return;}// set the values in state for reporting slice
    updateReportingState(res,this.logger);// determine the dataPlane url
    const dataPlaneUrl=resolveDataPlaneUrl(res.source.dataplanes,state.lifecycle.dataPlaneUrl.value,state.loadOptions.value.residencyServer,this.logger);if(!dataPlaneUrl){this.onError(new Error(DATA_PLANE_URL_ERROR),undefined,true);return;}const nativeDestinations=res.source.destinations.length>0?filterEnabledDestination(res.source.destinations):[];// set in the state --> source, destination, lifecycle, reporting
    n(()=>{// set source related information in state
    state.source.value={config:res.source.config,id:res.source.id};// set device mode destination related information in state
    state.nativeDestinations.configuredDestinations.value=nativeDestinations;// set the desired optional plugins
    state.plugins.pluginsToLoadFromConfig.value=state.loadOptions.value.plugins??[];updateConsentsState(res);// set application lifecycle state
    // Cast to string as we are sure that the value is not undefined
    state.lifecycle.activeDataplaneUrl.value=removeTrailingSlashes(dataPlaneUrl);state.lifecycle.status.value='configured';});}/**
       * A function to fetch source config either from /sourceConfig endpoint
       * or from getSourceConfig load option
       * @returns
       */getConfig(){const sourceConfigFunc=state.loadOptions.value.getSourceConfig;if(sourceConfigFunc){if(!isFunction(sourceConfigFunc)){throw new Error(SOURCE_CONFIG_OPTION_ERROR);}// fetch source config from the function
    const res=sourceConfigFunc();if(res instanceof Promise){res.then(pRes=>this.processConfig(pRes)).catch(err=>{this.onError(err,'SourceConfig');});}else {this.processConfig(res);}}else {// fetch source config from config url API
    this.httpClient.getAsyncData({url:state.lifecycle.sourceConfigUrl.value,options:{headers:{'Content-Type':undefined}},callback:this.processConfig});}}}
    
    /**
     * To get the timezone of the user
     *
     * @returns string
     */const getTimezone=()=>{const timezone=new Date().toString().match(/([A-Z]+[+-]\d+)/);return timezone&&timezone[1]?timezone[1]:'NA';};
    
    /**
     * Get the referrer URL
     * @returns The referrer URL
     */const getReferrer=()=>document?.referrer||'$direct';/**
     * To get the canonical URL of the page
     * @returns canonical URL
     */const getCanonicalUrl=()=>{const tags=document.getElementsByTagName('link');let canonicalUrl='';for(let i=0;tags[i];i+=1){const tag=tags[i];if(tag.getAttribute('rel')==='canonical'&&!canonicalUrl){canonicalUrl=tag.getAttribute('href')??'';break;}}return canonicalUrl;};const getUserAgent=()=>{if(isUndefined(globalThis.navigator)){return null;}let{userAgent}=globalThis.navigator;const{brave}=globalThis.navigator;// For supporting Brave browser detection,
    // add "Brave/<version>" to the user agent with the version value from the Chrome component
    if(brave&&Object.getPrototypeOf(brave).isBrave){// Example:
    // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36
    const matchedArr=userAgent.match(/(chrome)\/([\w.]+)/i);if(matchedArr){userAgent=`${userAgent} Brave/${matchedArr[2]}`;}}return userAgent;};const getLanguage=()=>{if(isUndefined(globalThis.navigator)){return null;}return globalThis.navigator.language??globalThis.navigator.browserLanguage;};/**
     * Default page properties
     * @returns Default page properties
     */const getDefaultPageProperties=()=>{const canonicalUrl=getCanonicalUrl();let path=globalThis.location.pathname;const{href:tabUrl}=globalThis.location;let pageUrl=tabUrl;const{search}=globalThis.location;// If valid canonical url is provided use this as page url.
    if(canonicalUrl){try{const urlObj=new URL(canonicalUrl);// If existing, query params of canonical url will be used instead of the location.search ones
    if(urlObj.search===''){pageUrl=canonicalUrl+search;}else {pageUrl=canonicalUrl;}path=urlObj.pathname;}catch(err){// Do nothing
    }}const url=getUrlWithoutHash(pageUrl);const{title}=document;const referrer=getReferrer();return {path,referrer,referring_domain:getReferringDomain(referrer),search,title,url,tab_url:tabUrl};};
    
    const POLYFILL_URL='';const POLYFILL_LOAD_TIMEOUT=10*1000;// 10 seconds
    const POLYFILL_SCRIPT_ID='rudderstackPolyfill';
    
    class CapabilitiesManager{constructor(errorHandler,logger){this.logger=logger;this.errorHandler=errorHandler;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.onError=this.onError.bind(this);this.onReady=this.onReady.bind(this);}init(){try{this.prepareBrowserCapabilities();this.attachWindowListeners();}catch(err){this.onError(err);}}/**
       * Detect supported capabilities and set values in state
       */ // eslint-disable-next-line class-methods-use-this
    detectBrowserCapabilities(){n(()=>{// Storage related details
    state.capabilities.storage.isCookieStorageAvailable.value=isStorageAvailable(COOKIE_STORAGE,getStorageEngine(COOKIE_STORAGE),this.logger);state.capabilities.storage.isLocalStorageAvailable.value=isStorageAvailable(LOCAL_STORAGE,undefined,this.logger);state.capabilities.storage.isSessionStorageAvailable.value=isStorageAvailable(SESSION_STORAGE,undefined,this.logger);// Browser feature detection details
    state.capabilities.isBeaconAvailable.value=hasBeacon();state.capabilities.isUaCHAvailable.value=hasUAClientHints();state.capabilities.isCryptoAvailable.value=hasCrypto();state.capabilities.isIE11.value=isIE11();state.capabilities.isOnline.value=globalThis.navigator.onLine;// Get page context details
    state.context.userAgent.value=getUserAgent();state.context.locale.value=getLanguage();state.context.screen.value=getScreenDetails();state.context.timezone.value=getTimezone();if(hasUAClientHints()){getUserAgentClientHint(uach=>{state.context['ua-ch'].value=uach;},state.loadOptions.value.uaChTrackLevel);}});// Ad blocker detection
    O(()=>{if(state.loadOptions.value.sendAdblockPage===true&&state.lifecycle.sourceConfigUrl.value!==undefined){detectAdBlockers(this.errorHandler,this.logger);}});}/**
       * Detect if polyfills are required and then load script from polyfill URL
       */prepareBrowserCapabilities(){state.capabilities.isLegacyDOM.value=isLegacyJSEngine();let polyfillUrl=state.loadOptions.value.polyfillURL??POLYFILL_URL;const shouldLoadPolyfill=state.loadOptions.value.polyfillIfRequired&&state.capabilities.isLegacyDOM.value&&Boolean(polyfillUrl);if(shouldLoadPolyfill){const isDefaultPolyfillService=polyfillUrl!==state.loadOptions.value.polyfillURL;if(isDefaultPolyfillService){// write key specific callback
    // NOTE: we're not putting this into RudderStackGlobals as providing the property path to the callback function in the polyfill URL is not possible
    const polyfillCallbackName=`RS_polyfillCallback_${state.lifecycle.writeKey.value}`;const polyfillCallback=()=>{this.onReady();// Remove the entry from window so we don't leave room for calling it again
    delete globalThis[polyfillCallbackName];};globalThis[polyfillCallbackName]=polyfillCallback;polyfillUrl=`${polyfillUrl}&callback=${polyfillCallbackName}`;}this.externalSrcLoader?.loadJSFile({url:polyfillUrl,id:POLYFILL_SCRIPT_ID,async:true,timeout:POLYFILL_LOAD_TIMEOUT,callback:scriptId=>{if(!scriptId){this.onError(new Error(POLYFILL_SCRIPT_LOAD_ERROR(POLYFILL_SCRIPT_ID,polyfillUrl)));}else if(!isDefaultPolyfillService){this.onReady();}}});}else {this.onReady();}}/**
       * Attach listeners to window to observe event that update capabilities state values
       */attachWindowListeners(){globalThis.addEventListener('offline',()=>{state.capabilities.isOnline.value=false;});globalThis.addEventListener('online',()=>{state.capabilities.isOnline.value=true;});globalThis.addEventListener('resize',debounce(()=>{state.context.screen.value=getScreenDetails();},this));}/**
       * Set the lifecycle status to next phase
       */ // eslint-disable-next-line class-methods-use-this
    onReady(){this.detectBrowserCapabilities();state.lifecycle.status.value='browserCapabilitiesReady';}/**
       * Handles error
       * @param error The error object
       */onError(error){if(this.errorHandler){this.errorHandler.onError(error,CAPABILITIES_MANAGER);}else {throw error;}}}
    
    const CHANNEL='web';// These are the top-level elements in the standard RudderStack event spec
    const TOP_LEVEL_ELEMENTS=['integrations','anonymousId','originalTimestamp'];// Reserved elements in the context of standard RudderStack event spec
    // Typically, these elements are not allowed to be overridden by the user
    const CONTEXT_RESERVED_ELEMENTS=['library','consentManagement','userAgent','ua-ch','screen'];// Reserved elements in the standard RudderStack event spec
    const RESERVED_ELEMENTS=['id','anonymous_id','user_id','sent_at','timestamp','received_at','original_timestamp','event','event_text','channel','context_ip','context_request_ip','context_passed_ip','group_id','previous_id'];
    
    const MIN_SESSION_ID_LENGTH=10;/**
     * A function to validate current session and return true/false depending on that
     * @returns boolean
     */const hasSessionExpired=expiresAt=>{const timestamp=Date.now();return Boolean(!expiresAt||timestamp>expiresAt);};/**
     * A function to generate session id
     * @returns number
     */const generateSessionId=()=>Date.now();/**
     * Function to validate user provided sessionId
     * @param {number} sessionId
     * @param logger logger
     * @returns
     */const isManualSessionIdValid=(sessionId,logger)=>{if(!sessionId||!isPositiveInteger(sessionId)||!hasMinLength(MIN_SESSION_ID_LENGTH,sessionId)){logger?.warn(INVALID_SESSION_ID_WARNING(USER_SESSION_MANAGER,sessionId,MIN_SESSION_ID_LENGTH));return false;}return true;};/**
     * A function to generate new auto tracking session
     * @param sessionTimeout current timestamp
     * @returns SessionInfo
     */const generateAutoTrackingSession=sessionTimeout=>{const timestamp=Date.now();const timeout=sessionTimeout||DEFAULT_SESSION_TIMEOUT_MS;return {id:timestamp,// set the current timestamp
    expiresAt:timestamp+timeout,// set the expiry time of the session
    timeout,sessionStart:undefined,autoTrack:true};};/**
     * A function to generate new manual tracking session
     * @param id Provided sessionId
     * @param logger Logger module
     * @returns SessionInfo
     */const generateManualTrackingSession=(id,logger)=>{const sessionId=isManualSessionIdValid(id,logger)?id:generateSessionId();return {id:sessionId,sessionStart:undefined,manualTrack:true};};const isStorageTypeValidForStoringData=storageType=>Boolean(storageType===COOKIE_STORAGE||storageType===LOCAL_STORAGE||storageType===SESSION_STORAGE||storageType===MEMORY_STORAGE);/**
     * Generate a new anonymousId
     * @returns string anonymousID
     */const generateAnonymousId=()=>generateUUID();
    
    /**
     * To get the page properties for context object
     * @param pageProps Page properties
     * @returns page properties object for context
     */const getContextPageProperties=pageProps=>{// Need to get updated page details on each event as an event to notify on SPA url changes does not seem to exist
    const curPageProps=getDefaultPageProperties();const ctxPageProps={};Object.keys(curPageProps).forEach(key=>{ctxPageProps[key]=pageProps?.[key]||curPageProps[key];});ctxPageProps.initial_referrer=pageProps?.initial_referrer||state.session.initialReferrer.value;ctxPageProps.initial_referring_domain=pageProps?.initial_referring_domain||state.session.initialReferringDomain.value;return ctxPageProps;};/**
     * Add any missing default page properties using values from options and defaults
     * @param properties Input page properties
     * @param options API options
     */const getUpdatedPageProperties=(properties,options)=>{const optionsPageProps=options?.page||{};const pageProps=properties;// Need to get updated page details on each event as an event to notify on SPA url changes does not seem to exist
    const curPageProps=getDefaultPageProperties();Object.keys(curPageProps).forEach(key=>{if(isUndefined(pageProps[key])){pageProps[key]=optionsPageProps[key]||curPageProps[key];}});if(isUndefined(pageProps.initial_referrer)){pageProps.initial_referrer=optionsPageProps.initial_referrer||state.session.initialReferrer.value;}if(isUndefined(pageProps.initial_referring_domain)){pageProps.initial_referring_domain=optionsPageProps.initial_referring_domain||state.session.initialReferringDomain.value;}return pageProps;};/**
     * Utility to check for reserved keys in the input object
     * @param obj Generic object
     * @param parentKeyPath Object's parent key path
     * @param logger Logger instance
     */const checkForReservedElementsInObject=(obj,parentKeyPath,logger)=>{if(isObjectLiteralAndNotNull(obj)){Object.keys(obj).forEach(property=>{if(RESERVED_ELEMENTS.includes(property)||RESERVED_ELEMENTS.includes(property.toLowerCase())){logger?.warn(RESERVED_KEYWORD_WARNING(EVENT_MANAGER,property,parentKeyPath,RESERVED_ELEMENTS));}});}};/**
     * Checks for reserved keys in traits, properties, and contextual traits
     * @param rudderEvent Generated rudder event
     * @param logger Logger instance
     */const checkForReservedElements=(rudderEvent,logger)=>{//  properties, traits, contextualTraits are either undefined or object
    const{properties,traits,context}=rudderEvent;const{traits:contextualTraits}=context;checkForReservedElementsInObject(properties,'properties',logger);checkForReservedElementsInObject(traits,'traits',logger);checkForReservedElementsInObject(contextualTraits,'context.traits',logger);};/**
     * Overrides the top-level event properties with data from API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */const updateTopLevelEventElements=(rudderEvent,options)=>{if(options.anonymousId&&isString(options.anonymousId)){// eslint-disable-next-line no-param-reassign
    rudderEvent.anonymousId=options.anonymousId;}if(isObjectLiteralAndNotNull(options.integrations)){// eslint-disable-next-line no-param-reassign
    rudderEvent.integrations=options.integrations;}if(options.originalTimestamp&&isString(options.originalTimestamp)){// eslint-disable-next-line no-param-reassign
    rudderEvent.originalTimestamp=options.originalTimestamp;}};/**
     * To merge the contextual information in API options with existing data
     * @param rudderContext Generated rudder event
     * @param options API options
     * @param logger Logger instance
     */const getMergedContext=(rudderContext,options,logger)=>{let context=rudderContext;Object.keys(options).forEach(key=>{if(!TOP_LEVEL_ELEMENTS.includes(key)&&!CONTEXT_RESERVED_ELEMENTS.includes(key)){if(key!=='context'){context=mergeDeepRight(context,{[key]:options[key]});}else if(!isUndefined(options[key])&&isObjectLiteralAndNotNull(options[key])){const tempContext={};Object.keys(options[key]).forEach(e=>{if(!CONTEXT_RESERVED_ELEMENTS.includes(e)){tempContext[e]=options[key][e];}});context=mergeDeepRight(context,{...tempContext});}else {logger?.warn(INVALID_CONTEXT_OBJECT_WARNING(EVENT_MANAGER));}}});return context;};/**
     * A function to determine whether SDK should use the integration option provided in load call
     * @returns boolean
     */const shouldUseGlobalIntegrationsConfigInEvents=()=>state.loadOptions.value.useGlobalIntegrationsConfigInEvents&&(isObjectLiteralAndNotNull(state.consents.postConsent.value?.integrations)||isObjectLiteralAndNotNull(state.nativeDestinations.loadOnlyIntegrations.value));/**
     * Updates rudder event object with data from the API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */const processOptions=(rudderEvent,options)=>{// Only allow object type for options
    if(isObjectLiteralAndNotNull(options)){updateTopLevelEventElements(rudderEvent,options);// eslint-disable-next-line no-param-reassign
    rudderEvent.context=getMergedContext(rudderEvent.context,options);}};/**
     * Returns the final integrations config for the event based on the global config and event's config
     * @param integrationsConfig Event's integrations config
     * @returns Final integrations config
     */const getEventIntegrationsConfig=integrationsConfig=>{let finalIntgConfig;if(shouldUseGlobalIntegrationsConfigInEvents()){finalIntgConfig=clone(state.consents.postConsent.value?.integrations??state.nativeDestinations.loadOnlyIntegrations.value);}else if(isObjectLiteralAndNotNull(integrationsConfig)){finalIntgConfig=integrationsConfig;}else {finalIntgConfig=DEFAULT_INTEGRATIONS_CONFIG;}return finalIntgConfig;};/**
     * Enrich the base event object with data from state and the API options
     * @param rudderEvent RudderEvent object
     * @param options API options
     * @param pageProps Page properties
     * @param logger logger
     * @returns Enriched RudderEvent object
     */const getEnrichedEvent=(rudderEvent,options,pageProps,logger)=>{const commonEventData={channel:CHANNEL,context:{traits:clone(state.session.userTraits.value),sessionId:state.session.sessionInfo.value.id||undefined,sessionStart:state.session.sessionInfo.value.sessionStart||undefined,// Add 'consentManagement' only if consent management is enabled
    ...(state.consents.enabled.value&&{consentManagement:{deniedConsentIds:clone(state.consents.data.value.deniedConsentIds),allowedConsentIds:clone(state.consents.data.value.allowedConsentIds),provider:state.consents.provider.value,resolutionStrategy:state.consents.resolutionStrategy.value}}),'ua-ch':state.context['ua-ch'].value,app:state.context.app.value,library:state.context.library.value,userAgent:state.context.userAgent.value,os:state.context.os.value,locale:state.context.locale.value,screen:state.context.screen.value,campaign:extractUTMParameters(globalThis.location.href),page:getContextPageProperties(pageProps),timezone:state.context.timezone.value},originalTimestamp:getCurrentTimeFormatted(),integrations:DEFAULT_INTEGRATIONS_CONFIG,messageId:generateUUID(),userId:rudderEvent.userId||state.session.userId.value};if(!isStorageTypeValidForStoringData(state.storage.entries.value.anonymousId?.type)){// Generate new anonymous id for each request
    commonEventData.anonymousId=generateAnonymousId();}else {// Type casting to string as the user session manager will take care of initializing the value
    commonEventData.anonymousId=state.session.anonymousId.value;}// set truly anonymous tracking flag
    if(state.storage.trulyAnonymousTracking.value){commonEventData.context.trulyAnonymousTracking=true;}if(rudderEvent.type==='identify'){commonEventData.context.traits=state.storage.entries.value.userTraits?.type!==NO_STORAGE?clone(state.session.userTraits.value):rudderEvent.context.traits;}if(rudderEvent.type==='group'){if(rudderEvent.groupId||state.session.groupId.value){commonEventData.groupId=rudderEvent.groupId||state.session.groupId.value;}if(rudderEvent.traits||state.session.groupTraits.value){commonEventData.traits=state.storage.entries.value.groupTraits?.type!==NO_STORAGE?clone(state.session.groupTraits.value):rudderEvent.traits;}}const processedEvent=mergeDeepRight(rudderEvent,commonEventData);// Set the default values for the event properties
    // matching with v1.1 payload
    if(processedEvent.event===undefined){processedEvent.event=null;}if(processedEvent.properties===undefined){processedEvent.properties=null;}processOptions(processedEvent,options);checkForReservedElements(processedEvent,logger);// Update the integrations config for the event
    processedEvent.integrations=getEventIntegrationsConfig(processedEvent.integrations);return processedEvent;};
    
    class RudderEventFactory{constructor(logger){this.logger=logger;}/**
       * Generate a 'page' event based on the user-input fields
       * @param category Page's category
       * @param name Page name
       * @param properties Page properties
       * @param options API options
       */generatePageEvent(category,name,properties,options){let props=properties??{};props.name=name;props.category=category;props=getUpdatedPageProperties(props,options);const pageEvent={properties:props,name,category,type:'page'};return getEnrichedEvent(pageEvent,options,props,this.logger);}/**
       * Generate a 'track' event based on the user-input fields
       * @param event The event name
       * @param properties Event properties
       * @param options API options
       */generateTrackEvent(event,properties,options){const trackEvent={properties,event,type:'track'};return getEnrichedEvent(trackEvent,options,undefined,this.logger);}/**
       * Generate an 'identify' event based on the user-input fields
       * @param userId New user ID
       * @param traits new traits
       * @param options API options
       */generateIdentifyEvent(userId,traits,options){const identifyEvent={userId,type:'identify',context:{traits}};return getEnrichedEvent(identifyEvent,options,undefined,this.logger);}/**
       * Generate an 'alias' event based on the user-input fields
       * @param to New user ID
       * @param from Old user ID
       * @param options API options
       */generateAliasEvent(to,from,options){const aliasEvent={previousId:from,type:'alias'};const enrichedEvent=getEnrichedEvent(aliasEvent,options,undefined,this.logger);// override the User ID from the API inputs
    enrichedEvent.userId=to??enrichedEvent.userId;return enrichedEvent;}/**
       * Generate a 'group' event based on the user-input fields
       * @param groupId New group ID
       * @param traits new group traits
       * @param options API options
       */generateGroupEvent(groupId,traits,options){const groupEvent={type:'group'};if(groupId){groupEvent.groupId=groupId;}if(traits){groupEvent.traits=traits;}return getEnrichedEvent(groupEvent,options,undefined,this.logger);}/**
       * Generates a new RudderEvent object based on the user-input fields
       * @param event API event parameters object
       * @returns A RudderEvent object
       */create(event){let eventObj;switch(event.type){case'page':eventObj=this.generatePageEvent(event.category,event.name,event.properties,event.options);break;case'track':eventObj=this.generateTrackEvent(event.name,event.properties,event.options);break;case'identify':eventObj=this.generateIdentifyEvent(event.userId,event.traits,event.options);break;case'alias':eventObj=this.generateAliasEvent(event.to,event.from,event.options);break;case'group':eventObj=this.generateGroupEvent(event.groupId,event.traits,event.options);break;}return eventObj;}}
    
    /**
     * A service to generate valid event payloads and queue them for processing
     */class EventManager{/**
       *
       * @param eventRepository Event repository instance
       * @param userSessionManager UserSession Manager instance
       * @param errorHandler Error handler object
       * @param logger Logger object
       */constructor(eventRepository,userSessionManager,errorHandler,logger){this.eventRepository=eventRepository;this.userSessionManager=userSessionManager;this.errorHandler=errorHandler;this.logger=logger;this.eventFactory=new RudderEventFactory(this.logger);this.onError=this.onError.bind(this);}/**
       * Initializes the event manager
       */init(){this.eventRepository.init();}resume(){this.eventRepository.resume();}/**
       * Consumes a new incoming event
       * @param event Incoming event data
       */addEvent(event){this.userSessionManager.refreshSession();const rudderEvent=this.eventFactory.create(event);if(rudderEvent){this.eventRepository.enqueue(rudderEvent,event.callback);}else {this.onError(new Error(EVENT_OBJECT_GENERATION_ERROR));}}/**
       * Handles error
       * @param error The error object
       */onError(error,customMessage,shouldAlwaysThrow){if(this.errorHandler){this.errorHandler.onError(error,EVENT_MANAGER,customMessage,shouldAlwaysThrow);}else {throw error;}}}
    
    class UserSessionManager{constructor(errorHandler,logger,pluginsManager,storeManager){this.storeManager=storeManager;this.pluginsManager=pluginsManager;this.logger=logger;this.errorHandler=errorHandler;this.onError=this.onError.bind(this);}/**
       * Initialize User session with values from storage
       */init(){this.syncStorageDataToState();// Register the effect to sync with storage
    this.registerEffects();}syncStorageDataToState(){this.migrateStorageIfNeeded();this.migrateDataFromPreviousStorage();// get the values from storage and set it again
    this.setUserId(this.getUserId());this.setUserTraits(this.getUserTraits());this.setGroupId(this.getGroupId());this.setGroupTraits(this.getGroupTraits());const{externalAnonymousIdCookieName,anonymousIdOptions}=state.loadOptions.value;let externalAnonymousId;if(isDefinedAndNotNull(externalAnonymousIdCookieName)&&typeof externalAnonymousIdCookieName==='string'){externalAnonymousId=this.getExternalAnonymousIdByCookieName(externalAnonymousIdCookieName);}this.setAnonymousId(externalAnonymousId??this.getAnonymousId(anonymousIdOptions));this.setAuthToken(this.getAuthToken());this.setInitialReferrerInfo();this.configureSessionTracking();}configureSessionTracking(){let sessionInfo=this.getSessionInfo();if(this.isPersistenceEnabledForStorageEntry('sessionInfo')){const configuredSessionTrackingInfo=this.getConfiguredSessionTrackingInfo();const persistedSessionInfo=this.getSessionInfo()??defaultSessionInfo;sessionInfo={...persistedSessionInfo,...configuredSessionTrackingInfo,autoTrack:configuredSessionTrackingInfo.autoTrack&&persistedSessionInfo.manualTrack!==true};}this.setSessionInfo(sessionInfo);}setInitialReferrerInfo(){const persistedInitialReferrer=this.getInitialReferrer();const persistedInitialReferringDomain=this.getInitialReferringDomain();if(persistedInitialReferrer&&persistedInitialReferringDomain){this.setInitialReferrer(persistedInitialReferrer);this.setInitialReferringDomain(persistedInitialReferringDomain);}else {const initialReferrer=persistedInitialReferrer||getReferrer();this.setInitialReferrer(initialReferrer);this.setInitialReferringDomain(getReferringDomain(initialReferrer));}}isPersistenceEnabledForStorageEntry(entryName){return isStorageTypeValidForStoringData(state.storage.entries.value[entryName]?.type);}migrateDataFromPreviousStorage(){const entries=state.storage.entries.value;const storageTypesForMigration=[COOKIE_STORAGE,LOCAL_STORAGE,SESSION_STORAGE];Object.keys(entries).forEach(entry=>{const key=entry;const currentStorage=entries[key]?.type;const curStore=this.storeManager?.getStore(storageClientDataStoreNameMap[currentStorage]);if(curStore){storageTypesForMigration.forEach(storage=>{const store=this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);if(store&&storage!==currentStorage){const value=store.get(USER_SESSION_STORAGE_KEYS[key]);if(isDefinedNotNullAndNotEmptyString(value)){curStore.set(USER_SESSION_STORAGE_KEYS[key],value);}store.remove(USER_SESSION_STORAGE_KEYS[key]);}});}});}migrateStorageIfNeeded(){if(!state.storage.migrate.value){return;}const persistentStoreNames=[CLIENT_DATA_STORE_COOKIE,CLIENT_DATA_STORE_LS,CLIENT_DATA_STORE_SESSION];const stores=[];persistentStoreNames.forEach(storeName=>{const store=this.storeManager?.getStore(storeName);if(store){stores.push(store);}});Object.keys(USER_SESSION_STORAGE_KEYS).forEach(storageKey=>{const storageEntry=USER_SESSION_STORAGE_KEYS[storageKey];stores.forEach(store=>{const migratedVal=this.pluginsManager?.invokeSingle('storage.migrate',storageEntry,store.engine,this.errorHandler,this.logger);// Skip setting the value if it is null or undefined
    // as those values indicate there is no need for migration or
    // migration failed
    if(!isNullOrUndefined(migratedVal)){store.set(storageEntry,migratedVal);}});});}getConfiguredSessionTrackingInfo(){let autoTrack=state.loadOptions.value.sessions?.autoTrack!==false;// Do not validate any further if autoTrack is disabled
    if(!autoTrack){return {autoTrack};}let timeout;const configuredSessionTimeout=state.loadOptions.value.sessions?.timeout;if(!isPositiveInteger(configuredSessionTimeout)){this.logger?.warn(TIMEOUT_NOT_NUMBER_WARNING(USER_SESSION_MANAGER,configuredSessionTimeout,DEFAULT_SESSION_TIMEOUT_MS));timeout=DEFAULT_SESSION_TIMEOUT_MS;}else {timeout=configuredSessionTimeout;}if(timeout===0){this.logger?.warn(TIMEOUT_ZERO_WARNING(USER_SESSION_MANAGER));autoTrack=false;}// In case user provides a timeout value greater than 0 but less than 10 seconds SDK will show a warning
    // and will proceed with it
    if(timeout>0&&timeout<MIN_SESSION_TIMEOUT_MS){this.logger?.warn(TIMEOUT_NOT_RECOMMENDED_WARNING(USER_SESSION_MANAGER,timeout,MIN_SESSION_TIMEOUT_MS));}return {timeout,autoTrack};}/**
       * Handles error
       * @param error The error object
       */onError(error){if(this.errorHandler){this.errorHandler.onError(error,USER_SESSION_MANAGER);}else {throw error;}}/**
       * A function to sync values in storage
       * @param sessionKey
       * @param value
       */syncValueToStorage(sessionKey,value){const entries=state.storage.entries.value;const storage=entries[sessionKey]?.type;const key=entries[sessionKey]?.key;if(isStorageTypeValidForStoringData(storage)){const curStore=this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);if(value&&isString(value)||isNonEmptyObject(value)){curStore?.set(key,value);}else {curStore?.remove(key);}}}/**
       * Function to update storage whenever state value changes
       */registerEffects(){// This will work as long as the user session entry key names are same as the state keys
    USER_SESSION_KEYS.forEach(sessionKey=>{O(()=>{this.syncValueToStorage(sessionKey,state.session[sessionKey].value);});});}/**
       * Sets anonymous id in the following precedence:
       *
       * 1. anonymousId: Id directly provided to the function.
       * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
       *    using parseLinker util.
       * 3. generateUUID: A new unique id is generated and assigned.
       */setAnonymousId(anonymousId,rudderAmpLinkerParam){let finalAnonymousId=anonymousId;if(this.isPersistenceEnabledForStorageEntry('anonymousId')){if(!finalAnonymousId&&rudderAmpLinkerParam){const linkerPluginsResult=this.pluginsManager?.invokeSingle('userSession.anonymousIdGoogleLinker',rudderAmpLinkerParam);finalAnonymousId=linkerPluginsResult;}finalAnonymousId=finalAnonymousId||generateAnonymousId();}else {finalAnonymousId=DEFAULT_USER_SESSION_VALUES.anonymousId;}state.session.anonymousId.value=finalAnonymousId;}/**
       * Fetches anonymousId
       * @param options option to fetch it from external source
       * @returns anonymousId
       */getAnonymousId(options){const storage=state.storage.entries.value.anonymousId?.type;// fetch the anonymousId from storage
    if(isStorageTypeValidForStoringData(storage)){let persistedAnonymousId=this.getEntryValue('anonymousId');if(!persistedAnonymousId&&options){// fetch anonymousId from external source
    const autoCapturedAnonymousId=this.pluginsManager?.invokeSingle('storage.getAnonymousId',getStorageEngine,options);persistedAnonymousId=autoCapturedAnonymousId;}state.session.anonymousId.value=persistedAnonymousId||generateAnonymousId();}return state.session.anonymousId.value;}getEntryValue(sessionKey){const entries=state.storage.entries.value;const storageType=entries[sessionKey]?.type;if(isStorageTypeValidForStoringData(storageType)){const store=this.storeManager?.getStore(storageClientDataStoreNameMap[storageType]);const storageKey=entries[sessionKey]?.key;return store?.get(storageKey)??null;}return null;}getExternalAnonymousIdByCookieName(key){const storageEngine=getStorageEngine(COOKIE_STORAGE);if(storageEngine?.isEnabled){return storageEngine.getItem(key)??null;}return null;}/**
       * Fetches User Id
       * @returns
       */getUserId(){return this.getEntryValue('userId');}/**
       * Fetches User Traits
       * @returns
       */getUserTraits(){return this.getEntryValue('userTraits');}/**
       * Fetches Group Id
       * @returns
       */getGroupId(){return this.getEntryValue('groupId');}/**
       * Fetches Group Traits
       * @returns
       */getGroupTraits(){return this.getEntryValue('groupTraits');}/**
       * Fetches Initial Referrer
       * @returns
       */getInitialReferrer(){return this.getEntryValue('initialReferrer');}/**
       * Fetches Initial Referring domain
       * @returns
       */getInitialReferringDomain(){return this.getEntryValue('initialReferringDomain');}/**
       * Fetches session tracking information from storage
       * @returns
       */getSessionInfo(){return this.getEntryValue('sessionInfo');}/**
       * Fetches auth token from storage
       * @returns
       */getAuthToken(){return this.getEntryValue('authToken');}/**
       * If session is active it returns the sessionId
       * @returns
       */getSessionId(){const sessionInfo=state.session.sessionInfo.value;if(sessionInfo.autoTrack&&!hasSessionExpired(sessionInfo.expiresAt)||sessionInfo.manualTrack){return sessionInfo.id??null;}return null;}/**
       * A function to update current session info after each event call
       */refreshSession(){let sessionInfo=state.session.sessionInfo.value;if(sessionInfo.autoTrack||sessionInfo.manualTrack){if(sessionInfo.autoTrack){this.startOrRenewAutoTracking();}// Re-assigning the variable with the same value intentionally as
    // startOrRenewAutoTracking() will update the sessionInfo value
    sessionInfo=state.session.sessionInfo.value;if(sessionInfo.sessionStart===undefined){state.session.sessionInfo.value={...sessionInfo,sessionStart:true};}else if(sessionInfo.sessionStart){state.session.sessionInfo.value={...sessionInfo,sessionStart:false};}}}/**
       * Reset state values
       * @param resetAnonymousId
       * @param noNewSessionStart
       * @returns
       */reset(resetAnonymousId,noNewSessionStart){const{session}=state;const{manualTrack,autoTrack}=session.sessionInfo.value;n(()=>{session.userId.value=DEFAULT_USER_SESSION_VALUES.userId;session.userTraits.value=DEFAULT_USER_SESSION_VALUES.userTraits;session.groupId.value=DEFAULT_USER_SESSION_VALUES.groupId;session.groupTraits.value=DEFAULT_USER_SESSION_VALUES.groupTraits;session.authToken.value=DEFAULT_USER_SESSION_VALUES.authToken;if(resetAnonymousId){// This will generate a new anonymous ID
    this.setAnonymousId();}if(noNewSessionStart){return;}if(autoTrack){session.sessionInfo.value=DEFAULT_USER_SESSION_VALUES.sessionInfo;this.startOrRenewAutoTracking();}else if(manualTrack){this.startManualTrackingInternal();}});}setSessionInfo(sessionInfo){state.session.sessionInfo.value=this.isPersistenceEnabledForStorageEntry('sessionInfo')?sessionInfo:DEFAULT_USER_SESSION_VALUES.sessionInfo;// If auto session tracking is enabled start the session tracking
    if(state.session.sessionInfo.value.autoTrack){this.startOrRenewAutoTracking();}}/**
       * Set user Id
       * @param userId
       */setUserId(userId){state.session.userId.value=this.isPersistenceEnabledForStorageEntry('userId')&&userId?userId:DEFAULT_USER_SESSION_VALUES.userId;}/**
       * Set user traits
       * @param traits
       */setUserTraits(traits){state.session.userTraits.value=this.isPersistenceEnabledForStorageEntry('userTraits')&&traits?mergeDeepRight(state.session.userTraits.value??{},traits):DEFAULT_USER_SESSION_VALUES.userTraits;}/**
       * Set group Id
       * @param groupId
       */setGroupId(groupId){state.session.groupId.value=this.isPersistenceEnabledForStorageEntry('groupId')&&groupId?groupId:DEFAULT_USER_SESSION_VALUES.groupId;}/**
       * Set group traits
       * @param traits
       */setGroupTraits(traits){state.session.groupTraits.value=this.isPersistenceEnabledForStorageEntry('groupTraits')&&traits?mergeDeepRight(state.session.groupTraits.value??{},traits):DEFAULT_USER_SESSION_VALUES.groupTraits;}/**
       * Set initial referrer
       * @param referrer
       */setInitialReferrer(referrer){state.session.initialReferrer.value=this.isPersistenceEnabledForStorageEntry('initialReferrer')&&referrer?referrer:DEFAULT_USER_SESSION_VALUES.initialReferrer;}/**
       * Set initial referring domain
       * @param {String} referringDomain
       */setInitialReferringDomain(referringDomain){state.session.initialReferringDomain.value=this.isPersistenceEnabledForStorageEntry('initialReferringDomain')&&referringDomain?referringDomain:DEFAULT_USER_SESSION_VALUES.initialReferringDomain;}/**
       * A function to check for existing session details and depending on that create a new session
       */startOrRenewAutoTracking(){const sessionInfo=state.session.sessionInfo.value;if(hasSessionExpired(sessionInfo.expiresAt)){state.session.sessionInfo.value=generateAutoTrackingSession(sessionInfo.timeout);}else {const timestamp=Date.now();const timeout=sessionInfo.timeout;state.session.sessionInfo.value=mergeDeepRight(sessionInfo,{expiresAt:timestamp+timeout// set the expiry time of the session
    });}}/**
       * A function method to start a manual session
       * @param {number} id     session identifier
       * @returns
       */start(id){state.session.sessionInfo.value=generateManualTrackingSession(id,this.logger);}/**
       * An internal function to start manual session
       */startManualTrackingInternal(){this.start(Date.now());}/**
       * A public method to end an ongoing session.
       */end(){state.session.sessionInfo.value={};}/**
       * Set auth token
       * @param userId
       */setAuthToken(token){state.session.authToken.value=this.isPersistenceEnabledForStorageEntry('authToken')&&token?token:DEFAULT_USER_SESSION_VALUES.authToken;}}
    
    const DATA_PLANE_QUEUE_EXT_POINT_PREFIX='dataplaneEventsQueue';const DESTINATIONS_QUEUE_EXT_POINT_PREFIX='destinationsEventsQueue';const DMT_EXT_POINT_PREFIX='transformEvent';
    
    /**
     * Filters and returns the user supplied integrations config that should take preference over the destination specific integrations config
     * @param eventIntgConfig User supplied integrations config at event level
     * @param destinationsIntgConfig Cumulative integrations config from all destinations
     * @returns Filtered user supplied integrations config
     */const getOverriddenIntegrationOptions=(eventIntgConfig,destinationsIntgConfig)=>Object.keys(eventIntgConfig).filter(intgName=>eventIntgConfig[intgName]!==true||!destinationsIntgConfig[intgName]).reduce((obj,key)=>{const retVal=clone(obj);retVal[key]=eventIntgConfig[key];return retVal;},{});/**
     * Returns the event object with final integrations config
     * @param event RudderEvent object
     * @param state Application state
     * @returns Mutated event with final integrations config
     */const getFinalEvent=(event,state)=>{const finalEvent=clone(event);// Merge the destination specific integrations config with the event's integrations config
    // In general, the preference is given to the event's integrations config
    const eventIntgConfig=event.integrations??DEFAULT_INTEGRATIONS_CONFIG;const destinationsIntgConfig=state.nativeDestinations.integrationsConfig.value;const overriddenIntgOpts=getOverriddenIntegrationOptions(eventIntgConfig,destinationsIntgConfig);finalEvent.integrations=mergeDeepRight(destinationsIntgConfig,overriddenIntgOpts);return finalEvent;};const shouldBufferEventsForPreConsent=state=>state.consents.preConsent.value.enabled&&state.consents.preConsent.value.events?.delivery==='buffer'&&(state.consents.preConsent.value.storage?.strategy==='session'||state.consents.preConsent.value.storage?.strategy==='none');
    
    /**
     * Event repository class responsible for queuing events for further processing and delivery
     */class EventRepository{/**
       *
       * @param pluginsManager Plugins manager instance
       * @param storeManager Store Manager instance
       * @param errorHandler Error handler object
       * @param logger Logger object
       */constructor(pluginsManager,storeManager,errorHandler,logger){this.pluginsManager=pluginsManager;this.errorHandler=errorHandler;this.logger=logger;this.httpClient=new HttpClient(errorHandler,logger);this.storeManager=storeManager;this.onError=this.onError.bind(this);}/**
       * Initializes the event repository
       */init(){try{this.dataplaneEventsQueue=this.pluginsManager.invokeSingle(`${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.init`,state,this.httpClient,this.storeManager,this.errorHandler,this.logger);}catch(e){this.onError(e,DATAPLANE_PLUGIN_INITIALIZE_ERROR);}try{this.dmtEventsQueue=this.pluginsManager.invokeSingle(`${DMT_EXT_POINT_PREFIX}.init`,state,this.pluginsManager,this.httpClient,this.storeManager,this.errorHandler,this.logger);}catch(e){this.onError(e,DMT_PLUGIN_INITIALIZE_ERROR);}try{this.destinationsEventsQueue=this.pluginsManager.invokeSingle(`${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.init`,state,this.pluginsManager,this.storeManager,this.dmtEventsQueue,this.errorHandler,this.logger);}catch(e){this.onError(e,NATIVE_DEST_PLUGIN_INITIALIZE_ERROR);}// Start the queue once the client destinations are ready
    O(()=>{if(state.nativeDestinations.clientDestinationsReady.value===true){this.destinationsEventsQueue?.start();this.dmtEventsQueue?.start();}});const bufferEventsBeforeConsent=shouldBufferEventsForPreConsent(state);// Start the queue processing only when the destinations are ready or hybrid mode destinations exist
    // However, events will be enqueued for now.
    // At the time of processing the events, the integrations config data from destinations
    // is merged into the event object
    let timeoutId;O(()=>{const shouldBufferDpEvents=state.loadOptions.value.bufferDataPlaneEventsUntilReady===true&&state.nativeDestinations.clientDestinationsReady.value===false;const hybridDestExist=state.nativeDestinations.activeDestinations.value.some(dest=>isHybridModeDestination(dest));if((hybridDestExist===false||shouldBufferDpEvents===false)&&!bufferEventsBeforeConsent&&this.dataplaneEventsQueue?.scheduleTimeoutActive!==true){globalThis.clearTimeout(timeoutId);this.dataplaneEventsQueue?.start();}});// Force start the data plane events queue processing after a timeout
    if(state.loadOptions.value.bufferDataPlaneEventsUntilReady===true){timeoutId=globalThis.setTimeout(()=>{if(this.dataplaneEventsQueue?.scheduleTimeoutActive!==true){this.dataplaneEventsQueue?.start();}},state.loadOptions.value.dataPlaneEventsBufferTimeout);}}resume(){if(this.dataplaneEventsQueue?.scheduleTimeoutActive!==true){if(state.consents.postConsent.value.discardPreConsentEvents){this.dataplaneEventsQueue?.clear();this.destinationsEventsQueue?.clear();}this.dataplaneEventsQueue?.start();}}/**
       * Enqueues the event for processing
       * @param event RudderEvent object
       * @param callback API callback function
       */enqueue(event,callback){let dpQEvent;try{dpQEvent=getFinalEvent(event,state);this.pluginsManager.invokeSingle(`${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.enqueue`,state,this.dataplaneEventsQueue,dpQEvent,this.errorHandler,this.logger);}catch(e){this.onError(e,DATAPLANE_PLUGIN_ENQUEUE_ERROR);}try{const dQEvent=clone(event);this.pluginsManager.invokeSingle(`${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.enqueue`,state,this.destinationsEventsQueue,dQEvent,this.errorHandler,this.logger);}catch(e){this.onError(e,NATIVE_DEST_PLUGIN_ENQUEUE_ERROR);}// Invoke the callback if it exists
    try{// Using the event sent to the data plane queue here
    // to ensure the mutated (if any) event is sent to the callback
    callback?.(dpQEvent);}catch(error){this.onError(error,API_CALLBACK_INVOKE_ERROR);}}/**
       * Handles error
       * @param error The error object
       * @param customMessage a message
       * @param shouldAlwaysThrow if it should throw or use logger
       */onError(error,customMessage,shouldAlwaysThrow){if(this.errorHandler){this.errorHandler.onError(error,EVENT_REPOSITORY,customMessage,shouldAlwaysThrow);}else {throw error;}}}
    
    const dispatchSDKEvent=event=>{const customEvent=new CustomEvent(event,{detail:{analyticsInstance:globalThis.rudderanalytics},bubbles:true,cancelable:true,composed:true});globalThis.document.dispatchEvent(customEvent);};
    
    /*
     * Analytics class with lifecycle based on state ad user triggered events
     */class Analytics{/**
       * Initialize services and components or use default ones if singletons
       */constructor(){this.preloadBuffer=new BufferQueue();this.initialized=false;this.errorHandler=defaultErrorHandler;this.logger=defaultLogger;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.capabilitiesManager=new CapabilitiesManager(this.errorHandler,this.logger);this.httpClient=defaultHttpClient;}/**
       * Start application lifecycle if not already started
       */load(writeKey,dataPlaneUrl,loadOptions={}){if(state.lifecycle.status.value){return;}let clonedDataPlaneUrl=clone(dataPlaneUrl);let clonedLoadOptions=clone(loadOptions);// dataPlaneUrl is not provided
    if(isObjectAndNotNull(dataPlaneUrl)){clonedLoadOptions=dataPlaneUrl;clonedDataPlaneUrl=undefined;}// Set initial state values
    n(()=>{state.lifecycle.writeKey.value=writeKey;state.lifecycle.dataPlaneUrl.value=clonedDataPlaneUrl;state.loadOptions.value=normalizeLoadOptions(state.loadOptions.value,clonedLoadOptions);state.lifecycle.status.value='mounted';});// set log level as early as possible
    if(state.loadOptions.value.logLevel){this.logger?.setMinLogLevel(state.loadOptions.value.logLevel);}// Expose state to global objects
    setExposedGlobal('state',state,writeKey);// Configure initial config of any services or components here
    // State application lifecycle
    this.startLifecycle();}// Start lifecycle methods
    /**
       * Orchestrate the lifecycle of the application phases/status
       */startLifecycle(){O(()=>{try{switch(state.lifecycle.status.value){case'mounted':this.onMounted();break;case'browserCapabilitiesReady':this.onBrowserCapabilitiesReady();break;case'configured':this.onConfigured();break;case'pluginsLoading':break;case'pluginsReady':this.onPluginsReady();break;case'initialized':this.onInitialized();break;case'loaded':this.onLoaded();break;case'destinationsLoading':break;case'destinationsReady':this.onDestinationsReady();break;case'ready':this.onReady();break;case'readyExecuted':default:break;}}catch(err){const issue='Failed to load the SDK';this.errorHandler.onError(getMutatedError(err,issue),ANALYTICS_CORE);}});}onBrowserCapabilitiesReady(){// initialize the preloaded events enqueuing
    retrievePreloadBufferEvents(this);this.prepareInternalServices();this.loadConfig();}onLoaded(){this.processBufferedEvents();// Short-circuit the life cycle and move to the ready state if pre-consent behavior is enabled
    if(state.consents.preConsent.value.enabled===true){state.lifecycle.status.value='ready';}else {this.loadDestinations();}}/**
       * Load browser polyfill if required
       */onMounted(){this.capabilitiesManager.init();}/**
       * Enqueue in SDK preload buffer events, used from preloadBuffer component
       */enqueuePreloadBufferEvents(bufferedEvents){if(Array.isArray(bufferedEvents)){bufferedEvents.forEach(bufferedEvent=>this.preloadBuffer.enqueue(clone(bufferedEvent)));}}/**
       * Process the buffer preloaded events by passing their arguments to the respective facade methods
       */processDataInPreloadBuffer(){while(this.preloadBuffer.size()>0){const eventToProcess=this.preloadBuffer.dequeue();if(eventToProcess){consumePreloadBufferedEvent([...eventToProcess],this);}}}prepareInternalServices(){this.pluginsManager=new PluginsManager(defaultPluginEngine,this.errorHandler,this.logger);this.storeManager=new StoreManager(this.pluginsManager,this.errorHandler,this.logger);this.configManager=new ConfigManager(this.httpClient,this.errorHandler,this.logger);this.userSessionManager=new UserSessionManager(this.errorHandler,this.logger,this.pluginsManager,this.storeManager);this.eventRepository=new EventRepository(this.pluginsManager,this.storeManager,this.errorHandler,this.logger);this.eventManager=new EventManager(this.eventRepository,this.userSessionManager,this.errorHandler,this.logger);}/**
       * Load configuration
       */loadConfig(){if(state.lifecycle.writeKey.value){this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);}this.configManager?.init();}/**
       * Initialize the storage and event queue
       */onPluginsReady(){this.errorHandler.init(this.externalSrcLoader);// Initialize storage
    this.storeManager?.init();this.userSessionManager?.init();// Initialize the appropriate consent manager plugin
    if(state.consents.enabled.value&&!state.consents.initialized.value){this.pluginsManager?.invokeSingle(`consentManager.init`,state,this.logger);if(state.consents.preConsent.value.enabled===false){this.pluginsManager?.invokeSingle(`consentManager.updateConsentsInfo`,state,this.storeManager,this.logger);}}// Initialize event manager
    this.eventManager?.init();// Mark the SDK as initialized
    state.lifecycle.status.value='initialized';}/**
       * Load plugins
       */onConfigured(){this.pluginsManager?.init();// TODO: are we going to enable custom plugins to be passed as load options?
    // registerCustomPlugins(state.loadOptions.value.customPlugins);
    }/**
       * Trigger onLoaded callback if any is provided in config & emit initialised event
       */onInitialized(){// Process any preloaded events
    this.processDataInPreloadBuffer();// TODO: we need to avoid passing the window object to the callback function
    // as this will prevent us from supporting multiple SDK instances in the same page
    // Execute onLoaded callback if provided in load options
    if(isFunction(state.loadOptions.value.onLoaded)){state.loadOptions.value.onLoaded(globalThis.rudderanalytics);}// Set lifecycle state
    n(()=>{state.lifecycle.loaded.value=true;state.lifecycle.status.value='loaded';});this.initialized=true;// Emit an event to use as substitute to the onLoaded callback
    dispatchSDKEvent('RSA_Initialised');}/**
       * Emit ready event
       */ // eslint-disable-next-line class-methods-use-this
    onReady(){state.lifecycle.status.value='readyExecuted';state.eventBuffer.readyCallbacksArray.value.forEach(callback=>{try{callback();}catch(err){this.errorHandler.onError(err,ANALYTICS_CORE,READY_CALLBACK_INVOKE_ERROR);}});// Emit an event to use as substitute to the ready callback
    dispatchSDKEvent('RSA_Ready');}/**
       * Consume preloaded events buffer
       */processBufferedEvents(){// This logic has been intentionally implemented without a simple
    // for-loop as the individual events that are processed may
    // add more events to the buffer (this is needed for the consent API)
    let bufferedEvents=state.eventBuffer.toBeProcessedArray.value;while(bufferedEvents.length>0){const bufferedEvent=bufferedEvents.shift();state.eventBuffer.toBeProcessedArray.value=bufferedEvents;if(bufferedEvent){const methodName=bufferedEvent[0];if(isFunction(this[methodName])){// Send additional arg 'true' to indicate that this is a buffered invocation
    this[methodName](...bufferedEvent.slice(1),true);}}bufferedEvents=state.eventBuffer.toBeProcessedArray.value;}}/**
       * Load device mode destinations
       */loadDestinations(){if(state.nativeDestinations.clientDestinationsReady.value){return;}// Set in state the desired activeDestinations to inject in DOM
    this.pluginsManager?.invokeSingle('nativeDestinations.setActiveDestinations',state,this.pluginsManager,this.errorHandler,this.logger);const totalDestinationsToLoad=state.nativeDestinations.activeDestinations.value.length;if(totalDestinationsToLoad===0){state.lifecycle.status.value='destinationsReady';return;}// Start loading native integration scripts and create instances
    state.lifecycle.status.value='destinationsLoading';this.pluginsManager?.invokeSingle('nativeDestinations.load',state,this.externalSrcLoader,this.errorHandler,this.logger);// Progress to next lifecycle phase if all native destinations are initialized or failed
    O(()=>{const areAllDestinationsReady=totalDestinationsToLoad===0||state.nativeDestinations.initializedDestinations.value.length+state.nativeDestinations.failedDestinations.value.length===totalDestinationsToLoad;if(areAllDestinationsReady){n(()=>{state.lifecycle.status.value='destinationsReady';state.nativeDestinations.clientDestinationsReady.value=true;});}});}/**
       * Move to the ready state
       */ // eslint-disable-next-line class-methods-use-this
    onDestinationsReady(){// May be do any destination specific actions here
    // Mark the ready status if not already done
    if(state.lifecycle.status.value!=='ready'){state.lifecycle.status.value='ready';}}// End lifecycle methods
    // Start consumer exposed methods
    ready(callback,isBufferedInvocation=false){const type='ready';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,callback]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);if(!isFunction(callback)){this.logger.error(READY_API_CALLBACK_ERROR(READY_API));return;}/**
         * If destinations are loaded or no integration is available for loading
         * execute the callback immediately else push the callbacks to a queue that
         * will be executed after loading completes
         */if(state.lifecycle.status.value==='readyExecuted'){try{callback();}catch(err){this.errorHandler.onError(err,ANALYTICS_CORE,READY_CALLBACK_INVOKE_ERROR);}}else {state.eventBuffer.readyCallbacksArray.value=[...state.eventBuffer.readyCallbacksArray.value,callback];}}page(payload,isBufferedInvocation=false){const type='page';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;this.eventManager?.addEvent({type:'page',category:payload.category,name:payload.name,properties:payload.properties,options:payload.options,callback:payload.callback});// TODO: Maybe we should alter the behavior to send the ad-block page event even if the SDK is still loaded. It'll be pushed into the to be processed queue.
    // Send automatic ad blocked page event if ad-blockers are detected on the page
    // Check page category to avoid infinite loop
    if(state.capabilities.isAdBlocked.value===true&&payload.category!==ADBLOCK_PAGE_CATEGORY){this.page(pageArgumentsToCallOptions(ADBLOCK_PAGE_CATEGORY,ADBLOCK_PAGE_NAME,{// 'title' is intentionally omitted as it does not make sense
    // in v3 implementation
    path:ADBLOCK_PAGE_PATH},state.loadOptions.value.sendAdblockPageOptions));}}track(payload,isBufferedInvocation=false){const type='track';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;this.eventManager?.addEvent({type,name:payload.name||undefined,properties:payload.properties,options:payload.options,callback:payload.callback});}identify(payload,isBufferedInvocation=false){const type='identify';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;const shouldResetSession=Boolean(payload.userId&&state.session.userId.value&&payload.userId!==state.session.userId.value);if(shouldResetSession){this.reset();}// `null` value indicates that previous user ID needs to be retained
    if(!isNull(payload.userId)){this.userSessionManager?.setUserId(payload.userId);}this.userSessionManager?.setUserTraits(payload.traits);this.eventManager?.addEvent({type,userId:payload.userId,traits:payload.traits,options:payload.options,callback:payload.callback});}alias(payload,isBufferedInvocation=false){const type='alias';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;const previousId=payload.from??this.userSessionManager?.getUserId()??this.userSessionManager?.getAnonymousId();this.eventManager?.addEvent({type,to:payload.to,from:previousId,options:payload.options,callback:payload.callback});}group(payload,isBufferedInvocation=false){const type='group';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;// `null` value indicates that previous group ID needs to be retained
    if(!isNull(payload.groupId)){this.userSessionManager?.setGroupId(payload.groupId);}this.userSessionManager?.setGroupTraits(payload.traits);this.eventManager?.addEvent({type,groupId:payload.groupId,traits:payload.traits,options:payload.options,callback:payload.callback});}reset(resetAnonymousId,isBufferedInvocation=false){const type='reset';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,resetAnonymousId]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation, resetAnonymousId: ${resetAnonymousId}`);this.userSessionManager?.reset(resetAnonymousId);}getAnonymousId(options){return this.userSessionManager?.getAnonymousId(options);}setAnonymousId(anonymousId,rudderAmpLinkerParam,isBufferedInvocation=false){const type='setAnonymousId';// Buffering is needed as setting the anonymous ID may require invoking the GoogleLinker plugin
    if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,anonymousId,rudderAmpLinkerParam]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);this.userSessionManager?.setAnonymousId(anonymousId,rudderAmpLinkerParam);}// eslint-disable-next-line class-methods-use-this
    getUserId(){return state.session.userId.value;}// eslint-disable-next-line class-methods-use-this
    getUserTraits(){return state.session.userTraits.value;}// eslint-disable-next-line class-methods-use-this
    getGroupId(){return state.session.groupId.value;}// eslint-disable-next-line class-methods-use-this
    getGroupTraits(){return state.session.groupTraits.value;}startSession(sessionId,isBufferedInvocation=false){const type='startSession';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,sessionId]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);this.userSessionManager?.start(sessionId);}endSession(isBufferedInvocation=false){const type='endSession';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);this.userSessionManager?.end();}// eslint-disable-next-line class-methods-use-this
    getSessionId(){const sessionId=this.userSessionManager?.getSessionId();return sessionId??null;}consent(options,isBufferedInvocation=false){const type='consent';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,options]];return;}this.errorHandler.leaveBreadcrumb(`New consent invocation`);n(()=>{state.consents.preConsent.value={...state.consents.preConsent.value,enabled:false};state.consents.postConsent.value=getValidPostConsentOptions(options);const{initialized,consentsData}=getConsentManagementData(state.consents.postConsent.value.consentManagement,this.logger);state.consents.initialized.value=initialized||state.consents.initialized.value;state.consents.data.value=consentsData;});// Update consents data in state
    if(state.consents.enabled.value&&!state.consents.initialized.value){this.pluginsManager?.invokeSingle(`consentManager.updateConsentsInfo`,state,this.storeManager,this.logger);}// Re-init store manager
    this.storeManager?.initializeStorageState();// Re-init user session manager
    this.userSessionManager?.syncStorageDataToState();// Resume event manager to process the events to destinations
    this.eventManager?.resume();this.loadDestinations();this.sendTrackingEvents(isBufferedInvocation);}sendTrackingEvents(isBufferedInvocation){// If isBufferedInvocation is true, then the tracking events will be added to the end of the
    // events buffer array so that any other preload events (mainly from query string API) will be processed first.
    if(state.consents.postConsent.value.trackConsent){const trackOptions=trackArgumentsToCallOptions(CONSENT_TRACK_EVENT_NAME);if(isBufferedInvocation){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,['track',trackOptions]];}else {this.track(trackOptions);}}if(state.consents.postConsent.value.sendPageEvent){const pageOptions=pageArgumentsToCallOptions();if(isBufferedInvocation){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,['page',pageOptions]];}else {this.page(pageOptions);}}}setAuthToken(token){this.userSessionManager?.setAuthToken(token);}// End consumer exposed methods
    }
    
    /*
     * RudderAnalytics facade singleton that is exposed as global object and will:
     * expose overloaded methods
     * handle multiple Analytics instances
     * consume SDK preload event buffer
     */class RudderAnalytics{static globalSingleton=null;analyticsInstances={};defaultAnalyticsKey='';logger=defaultLogger;// Singleton with constructor bind methods
    constructor(){if(RudderAnalytics.globalSingleton){// START-NO-SONAR-SCAN
    // eslint-disable-next-line no-constructor-return
    return RudderAnalytics.globalSingleton;// END-NO-SONAR-SCAN
    }defaultErrorHandler.attachErrorListeners();this.setDefaultInstanceKey=this.setDefaultInstanceKey.bind(this);this.getAnalyticsInstance=this.getAnalyticsInstance.bind(this);this.load=this.load.bind(this);this.ready=this.ready.bind(this);this.triggerBufferedLoadEvent=this.triggerBufferedLoadEvent.bind(this);this.page=this.page.bind(this);this.track=this.track.bind(this);this.identify=this.identify.bind(this);this.alias=this.alias.bind(this);this.group=this.group.bind(this);this.reset=this.reset.bind(this);this.getAnonymousId=this.getAnonymousId.bind(this);this.setAnonymousId=this.setAnonymousId.bind(this);this.getUserId=this.getUserId.bind(this);this.getUserTraits=this.getUserTraits.bind(this);this.getGroupId=this.getGroupId.bind(this);this.getGroupTraits=this.getGroupTraits.bind(this);this.startSession=this.startSession.bind(this);this.endSession=this.endSession.bind(this);this.getSessionId=this.getSessionId.bind(this);this.setAuthToken=this.setAuthToken.bind(this);this.consent=this.consent.bind(this);RudderAnalytics.globalSingleton=this;// start loading if a load event was buffered or wait for explicit load call
    this.triggerBufferedLoadEvent();// Assign to global "rudderanalytics" object after processing the preload buffer (if any exists)
    // for CDN bundling IIFE exports covers this but for npm ESM and CJS bundling has to be done explicitly
    globalThis.rudderanalytics=this;}/**
       * Set instance to use if no specific writeKey is provided in methods
       * automatically for the first created instance
       * TODO: to support multiple analytics instances in the near future
       */setDefaultInstanceKey(writeKey){if(writeKey){this.defaultAnalyticsKey=writeKey;}}/**
       * Retrieve an existing analytics instance
       */getAnalyticsInstance(writeKey){const instanceId=writeKey??this.defaultAnalyticsKey;const analyticsInstanceExists=Boolean(this.analyticsInstances[instanceId]);if(!analyticsInstanceExists){this.analyticsInstances[instanceId]=new Analytics();}return this.analyticsInstances[instanceId];}/**
       * Create new analytics instance and trigger application lifecycle start
       */load(writeKey,dataPlaneUrl,loadOptions){if(!isString(writeKey)){this.logger.error(WRITE_KEY_NOT_A_STRING_ERROR(RS_APP,writeKey));return;}if(this.analyticsInstances[writeKey]){return;}this.setDefaultInstanceKey(writeKey);this.analyticsInstances[writeKey]=new Analytics();this.getAnalyticsInstance(writeKey).load(writeKey,dataPlaneUrl,loadOptions);}/**
       * Trigger load event in buffer queue if exists and stores the
       * remaining preloaded events array in global object
       */triggerBufferedLoadEvent(){const preloadedEventsArray=Array.isArray(globalThis.rudderanalytics)?globalThis.rudderanalytics:[];// The array will be mutated in the below method
    promotePreloadedConsentEventsToTop(preloadedEventsArray);// Get any load method call that is buffered if any
    // BTW, load method is also removed from the array
    // So, the Analytics object can directly consume the remaining events
    const loadEvent=getPreloadedLoadEvent(preloadedEventsArray);// Set the final preloaded events array in global object
    setExposedGlobal(GLOBAL_PRELOAD_BUFFER,clone(preloadedEventsArray));// Process load method if present in the buffered requests
    if(loadEvent.length>0){// Remove the event name from the Buffered Event array and keep only arguments
    loadEvent.shift();// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.load.apply(null,loadEvent);}}/**
       * Get ready callback arguments and forward to ready call
       */ready(callback){this.getAnalyticsInstance().ready(callback);}/**
       * Process page arguments and forward to page call
       */page(category,name,properties,options,callback){this.getAnalyticsInstance().page(pageArgumentsToCallOptions(category,name,properties,options,callback));}/**
       * Process track arguments and forward to page call
       */track(event,properties,options,callback){this.getAnalyticsInstance().track(trackArgumentsToCallOptions(event,properties,options,callback));}/**
       * Process identify arguments and forward to page call
       */identify(userId,traits,options,callback){this.getAnalyticsInstance().identify(identifyArgumentsToCallOptions(userId,traits,options,callback));}/**
       * Process alias arguments and forward to page call
       */alias(to,from,options,callback){this.getAnalyticsInstance().alias(aliasArgumentsToCallOptions(to,from,options,callback));}/**
       * Process group arguments and forward to page call
       */group(groupId,traits,options,callback){if(arguments.length===0){this.logger.error(EMPTY_GROUP_CALL_ERROR(RS_APP));return;}this.getAnalyticsInstance().group(groupArgumentsToCallOptions(groupId,traits,options,callback));}reset(resetAnonymousId){this.getAnalyticsInstance().reset(resetAnonymousId);}getAnonymousId(options){return this.getAnalyticsInstance().getAnonymousId(options);}setAnonymousId(anonymousId,rudderAmpLinkerParam){this.getAnalyticsInstance().setAnonymousId(anonymousId,rudderAmpLinkerParam);}getUserId(){return this.getAnalyticsInstance().getUserId();}getUserTraits(){return this.getAnalyticsInstance().getUserTraits();}getGroupId(){return this.getAnalyticsInstance().getGroupId();}getGroupTraits(){return this.getAnalyticsInstance().getGroupTraits();}startSession(sessionId){return this.getAnalyticsInstance().startSession(sessionId);}endSession(){return this.getAnalyticsInstance().endSession();}getSessionId(){return this.getAnalyticsInstance().getSessionId();}setAuthToken(token){return this.getAnalyticsInstance().setAuthToken(token);}consent(options){return this.getAnalyticsInstance().consent(options);}}
    

    //=====================================================================================

    console.log("This prints to the console of the page (injected only if the page url matched)");

    const rudderanalytics = new RudderAnalytics();

    const initialiseRudderstack = () => {
        rudderanalytics.load(
          "2L8Fl7ryPss3Zku133Pj5ox7NeP",
          "https://rudderstacpn.dataplane.rudderstack.com",
          {
              integrations: {
                  All: false
              },
              plugins: [
                  'StorageEncryption',
                  'XhrQueue',
              ]
          }
        );

        rudderanalytics.ready(() => {
            console.log("we are all set!!!");
        });

        rudderanalytics.setDefaultInstanceKey("<writeKey>");
    }


    const testEvents = () => {
        rudderanalytics.page();

        rudderanalytics.identify(
            "moumita123",
            {email: "name@domain.com"},
            {
                page: {
                    path: "",
                    referrer: "",
                    search: "",
                    title: "",
                    url: "",
                },
            },
            () => {
                console.log("in identify call");
            }
        );

        rudderanalytics.track(
            "test track event GA3",
            {
                revenue: 30,
                currency: "USD",
                user_actual_id: 12345,
            },
            () => {
                console.log("in track call");
            }
        );
    };

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value} = obj;

        if (type === "track") {
            testEvents(value);
        }
    });

    initialiseRudderstack();
})();
