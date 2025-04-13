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
     *      R.type(BigInt(123)); //=> "BigInt"
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
    
    function _nth(offset,list){var idx=offset<0?list.length+offset:offset;return _isString(list)?list.charAt(idx):list[idx];}
    
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
    var cachedCopy=map.get(value);if(cachedCopy){return cachedCopy;}map.set(value,copiedValue);for(var key in value){if(Object.prototype.hasOwnProperty.call(value,key)){copiedValue[key]=_clone(value[key],true,map);}}return copiedValue;};switch(type(value)){case 'Object':return copy(Object.create(Object.getPrototypeOf(value)));case 'Array':return copy(Array(value.length));case 'Date':return new Date(value.valueOf());case 'RegExp':return _cloneRegExp(value);case 'Int8Array':case 'Uint8Array':case 'Uint8ClampedArray':case 'Int16Array':case 'Uint16Array':case 'Int32Array':case 'Uint32Array':case 'Float32Array':case 'Float64Array':case 'BigInt64Array':case 'BigUint64Array':return value.slice();default:return value;}}function _isPrimitive(param){var type=typeof param;return param==null||type!='object'&&type!='function';}var _ObjectMap=/*#__PURE__*/function(){function _ObjectMap(){this.map={};this.length=0;}_ObjectMap.prototype.set=function(key,value){var hashedKey=this.hash(key);var bucket=this.map[hashedKey];if(!bucket){this.map[hashedKey]=bucket=[];}bucket.push([key,value]);this.length+=1;};_ObjectMap.prototype.hash=function(key){var hashedKey=[];for(var value in key){hashedKey.push(Object.prototype.toString.call(key[value]));}return hashedKey.join();};_ObjectMap.prototype.get=function(key){/**
         * depending on the number of objects to be cloned is faster to just iterate over the items in the map just because the hash function is so costly,
         * on my tests this number is 180, anything above that using the hash function is faster.
         */if(this.length<=180){for(var p in this.map){var bucket=this.map[p];for(var i=0;i<bucket.length;i+=1){var element=bucket[i];if(element[0]===key){return element[1];}}}return;}var hashedKey=this.hash(key);var bucket=this.map[hashedKey];if(!bucket){return;}for(var i=0;i<bucket.length;i+=1){var element=bucket[i];if(element[0]===key){return element[1];}}};return _ObjectMap;}();
    
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
     */var clone=/*#__PURE__*/_curry1(function clone(value){return value!=null&&typeof value.clone==='function'?value.clone():_clone(value);});
    
    function _path(pathAr,obj){var val=obj;for(var i=0;i<pathAr.length;i+=1){if(val==null){return undefined;}var p=pathAr[i];if(_isInteger(p)){val=_nth(p,val);}else {val=val[p];}}return val;}
    
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
     */var path=/*#__PURE__*/_curry2(_path);
    
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
     */// eslint-disable-next-line @typescript-eslint/ban-types
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
     * Checks if the input is a BigInt
     * @param value input value
     * @returns True if the input is a BigInt
     */const isBigInt=value=>typeof value==='bigint';/**
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
     * Determines if the input is of type error
     * @param value input value
     * @returns true if the input is of type error else false
     */const isTypeOfError=value=>{switch(Object.prototype.toString.call(value)){case '[object Error]':case '[object Exception]':case '[object DOMException]':return true;default:return value instanceof Error;}};
    
    const getValueByPath=(obj,keyPath)=>{const pathParts=keyPath.split('.');return path(pathParts,obj);};const hasValueByPath=(obj,path)=>Boolean(getValueByPath(obj,path));const isObject=value=>typeof value==='object';/**
     * Checks if the input is an object literal or built-in object type and not null
     * @param value Input value
     * @returns true if the input is an object and not null
     */const isObjectAndNotNull=value=>!isNull(value)&&isObject(value)&&!Array.isArray(value);/**
     * Checks if the input is an object literal and not null
     * @param value Input value
     * @returns true if the input is an object and not null
     */const isObjectLiteralAndNotNull=value=>!isNull(value)&&Object.prototype.toString.call(value)==='[object Object]';/**
     * Merges two arrays deeply, right-to-left
     * In the case of conflicts, the right array's values replace the left array's values in the
     * same index position
     * @param leftValue - The left array
     * @param rightValue - The right array
     * @returns The merged array
     */const mergeDeepRightObjectArrays=(leftValue,rightValue)=>{if(!Array.isArray(leftValue)||!Array.isArray(rightValue)){return clone(rightValue);}const mergedArray=clone(leftValue);rightValue.forEach((value,index)=>{mergedArray[index]=Array.isArray(value)||isObjectAndNotNull(value)?// eslint-disable-next-line @typescript-eslint/no-use-before-define
    mergeDeepRight(mergedArray[index],value):value;});return mergedArray;};/**
     * Merges two objects deeply, right-to-left.
     * In the case of conflicts, the right object's values take precedence.
     * For arrays, the right array's values replace the left array's values in the
     * same index position keeping the remaining left array's values in the resultant array.
     * @param leftObject - The left object
     * @param rightObject - The right object
     * @returns The merged object
     */const mergeDeepRight=(leftObject,rightObject)=>mergeDeepWith(mergeDeepRightObjectArrays,leftObject,rightObject);/**
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
     */const removeUndefinedAndNullValues=obj=>{const result=pickBy(isDefinedAndNotNull,obj);Object.keys(result).forEach(key=>{const value=result[key];if(isObjectLiteralAndNotNull(value)){result[key]=removeUndefinedAndNullValues(value);}});return result;};/**
     * Normalizes an object by removing undefined and null values.
     * @param val - The value to normalize
     * @returns The normalized object, or undefined if input is not a non-empty object
     * @example
     * getNormalizedObjectValue({ a: 1, b: null, c: undefined }) // returns { a: 1 }
     * getNormalizedObjectValue({}) // returns undefined
     * getNormalizedObjectValue(null) // returns undefined
     */const getNormalizedObjectValue=val=>{if(!isNonEmptyObject(val)){return undefined;}return removeUndefinedAndNullValues(val);};/**
     * Normalizes a value to a boolean, with support for a default value
     * @param val Input value
     * @param defVal Default value
     * @returns Returns the normalized boolean value
     * @example
     * getNormalizedBooleanValue(true, false) // returns true
     */const getNormalizedBooleanValue=(val,defVal)=>{if(isDefined(defVal)){return isDefined(val)?val===true:defVal;}return val===true;};
    
    const trim=value=>value.replace(/^\s+|\s+$/gm,'');const removeLeadingPeriod=value=>value.replace(/^\.+/,'');/**
     * A function to convert values to string
     * @param val input value
     * @returns stringified value
     */const tryStringify=val=>{let retVal=val;if(!isString(val)&&!isNullOrUndefined(val)){try{retVal=JSON.stringify(val);}catch(e){retVal=null;}}return retVal;};// The following text encoding and decoding is done before base64 encoding to prevent
    /**
     * Converts a bytes array to base64 encoded string
     * @param bytes bytes array to be converted to base64
     * @returns base64 encoded string
     */const bytesToBase64=bytes=>{const binString=Array.from(bytes,x=>String.fromCodePoint(x)).join('');return globalThis.btoa(binString);};/**
     * Encodes a string to base64 even with unicode characters
     * @param value input string
     * @returns base64 encoded string
     */const toBase64=value=>bytesToBase64(new TextEncoder().encode(value));
    
    //   if yes make them null instead of omitting in overloaded cases
    /*
     * Normalise the overloaded arguments of the page call facade
     */const pageArgumentsToCallOptions=(category,name,properties,options,callback)=>{const payload={category:category,name:name,properties:properties,options:options,callback:undefined};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.category=category;payload.name=name;payload.properties=properties;payload.options=undefined;payload.callback=options;}if(isFunction(properties)){payload.category=category;payload.name=name;payload.properties=undefined;payload.options=undefined;payload.callback=properties;}if(isFunction(name)){payload.category=category;payload.name=undefined;payload.properties=undefined;payload.options=undefined;payload.callback=name;}if(isFunction(category)){payload.category=undefined;payload.name=undefined;payload.properties=undefined;payload.options=undefined;payload.callback=category;}if(isObjectLiteralAndNotNull(category)){payload.name=undefined;payload.category=undefined;payload.properties=category;if(!isFunction(name)){payload.options=name;}else {payload.options=undefined;}}else if(isObjectLiteralAndNotNull(name)){payload.name=undefined;payload.properties=name;if(!isFunction(properties)){payload.options=properties;}else {payload.options=undefined;}}// if the category argument alone is provided b/w category and name,
    // use it as name and set category to undefined
    if(isString(category)&&!isString(name)){payload.category=undefined;payload.name=category;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    if(!isDefined(payload.category)){payload.category=undefined;}if(!isDefined(payload.name)){payload.name=undefined;}payload.properties=payload.properties?clone(payload.properties):{};if(isDefined(payload.options)){payload.options=clone(payload.options);}else {payload.options=undefined;}const nameForProperties=isString(payload.name)?payload.name:payload.properties.name;const categoryForProperties=isString(payload.category)?payload.category:payload.properties.category;// add name and category to properties
    payload.properties=mergeDeepRight(isObjectLiteralAndNotNull(payload.properties)?payload.properties:{},{...(nameForProperties&&{name:nameForProperties}),...(categoryForProperties&&{category:categoryForProperties})});return payload;};/*
     * Normalise the overloaded arguments of the track call facade
     */const trackArgumentsToCallOptions=(event,properties,options,callback)=>{const payload={name:event,properties:properties,options:options,callback:undefined};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.properties=properties;payload.options=undefined;payload.callback=options;}if(isFunction(properties)){payload.properties=undefined;payload.options=undefined;payload.callback=properties;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    payload.properties=isDefinedAndNotNull(payload.properties)?clone(payload.properties):{};if(isDefined(payload.options)){payload.options=clone(payload.options);}else {payload.options=undefined;}return payload;};/*
     * Normalise the overloaded arguments of the identify call facade
     */const identifyArgumentsToCallOptions=(userId,traits,options,callback)=>{const payload={userId:userId,traits:traits,options:options,callback:undefined};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.userId=userId;payload.traits=traits;payload.options=undefined;payload.callback=options;}if(isFunction(traits)){payload.userId=userId;payload.traits=undefined;payload.options=undefined;payload.callback=traits;}if(isObjectLiteralAndNotNull(userId)||isNull(userId)){// Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.userId=null;payload.traits=userId;if(!isFunction(traits)){payload.options=traits;}else {payload.options=undefined;}}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    payload.userId=tryStringify(payload.userId);if(isObjectLiteralAndNotNull(payload.traits)){payload.traits=clone(payload.traits);}else {payload.traits=undefined;}if(isDefined(payload.options)){payload.options=clone(payload.options);}else {payload.options=undefined;}return payload;};/*
     * Normalise the overloaded arguments of the alias call facade
     */const aliasArgumentsToCallOptions=(to,from,options,callback)=>{const payload={to,from:from,options:options,callback:undefined};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.to=to;payload.from=from;payload.options=undefined;payload.callback=options;}if(isFunction(from)){payload.to=to;payload.from=undefined;payload.options=undefined;payload.callback=from;}else if(isObjectLiteralAndNotNull(from)||isNull(from)){payload.to=to;payload.from=undefined;payload.options=from;}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    if(isDefined(payload.to)){payload.to=tryStringify(payload.to);}if(isDefined(payload.from)){payload.from=tryStringify(payload.from);}else {payload.from=undefined;}if(isDefined(payload.options)){payload.options=clone(payload.options);}else {payload.options=undefined;}return payload;};/*
     * Normalise the overloaded arguments of the group call facade
     */const groupArgumentsToCallOptions=(groupId,traits,options,callback)=>{const payload={groupId:groupId,traits:traits,options:options,callback:undefined};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.groupId=groupId;payload.traits=traits;payload.options=undefined;payload.callback=options;}if(isFunction(traits)){payload.groupId=groupId;payload.traits=undefined;payload.options=undefined;payload.callback=traits;}if(isObjectLiteralAndNotNull(groupId)||isNull(groupId)){// Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.groupId=null;payload.traits=groupId;if(!isFunction(traits)){payload.options=traits;}else {payload.options=undefined;}}// Rest of the code is just to clean up undefined values
    // and set some proper defaults
    // Also, to clone the incoming object type arguments
    payload.groupId=tryStringify(payload.groupId);if(isObjectLiteralAndNotNull(payload.traits)){payload.traits=clone(payload.traits);}else {payload.traits=undefined;}if(isDefined(payload.options)){payload.options=clone(payload.options);}else {payload.options=undefined;}return payload;};
    
    /**
     * Represents the options parameter for anonymousId
     *//**
     * Represents the beacon queue options parameter in loadOptions type
     *//**
     * Represents the queue options parameter in loadOptions type
     *//**
     * Represents the destinations queue options parameter in loadOptions type
     */let PageLifecycleEvents=/*#__PURE__*/function(PageLifecycleEvents){PageLifecycleEvents["LOADED"]="Page Loaded";PageLifecycleEvents["UNLOADED"]="Page Unloaded";return PageLifecycleEvents;}({});/**
     * Represents the options parameter in the load API
     */
    
    const API_SUFFIX='API';const CAPABILITIES_MANAGER='CapabilitiesManager';const CONFIG_MANAGER='ConfigManager';const EVENT_MANAGER='EventManager';const PLUGINS_MANAGER='PluginsManager';const USER_SESSION_MANAGER='UserSessionManager';const ERROR_HANDLER='ErrorHandler';const PLUGIN_ENGINE='PluginEngine';const STORE_MANAGER='StoreManager';const READY_API=`Ready${API_SUFFIX}`;const LOAD_API=`Load${API_SUFFIX}`;const EXTERNAL_SRC_LOADER='ExternalSrcLoader';const HTTP_CLIENT='HttpClient';const RSA='RudderStackAnalytics';const ANALYTICS_CORE='AnalyticsCore';
    
    function random(len){return crypto.getRandomValues(new Uint8Array(len));}
    
    var SIZE=4096,HEX$1=[],IDX$1=0,BUFFER$1;for(;IDX$1<256;IDX$1++){HEX$1[IDX$1]=(IDX$1+256).toString(16).substring(1);}function v4$1(){if(!BUFFER$1||IDX$1+16>SIZE){BUFFER$1=random(SIZE);IDX$1=0;}var i=0,tmp,out='';for(;i<16;i++){tmp=BUFFER$1[IDX$1+i];if(i==6)out+=HEX$1[tmp&15|64];else if(i==8)out+=HEX$1[tmp&63|128];else out+=HEX$1[tmp];if(i&1&&i>1&&i<11)out+='-';}IDX$1+=16;return out;}
    
    var IDX=256,HEX=[],BUFFER;while(IDX--)HEX[IDX]=(IDX+256).toString(16).substring(1);function v4(){var i=0,num,out='';if(!BUFFER||IDX+16>256){BUFFER=Array(i=256);while(i--)BUFFER[i]=256*Math.random()|0;i=IDX=0;}for(;i<16;i++){num=BUFFER[IDX+i];if(i==6)out+=HEX[num&15|64];else if(i==8)out+=HEX[num&63|128];else out+=HEX[num];if(i&1&&i>1&&i<11)out+='-';}IDX++;return out;}
    
    const hasCrypto$1=()=>!isNullOrUndefined(globalThis.crypto)&&isFunction(globalThis.crypto.getRandomValues);
    
    const generateUUID=()=>{if(hasCrypto$1()){return v4$1();}return v4();};
    
    const onPageLeave=callback=>{// To ensure the callback is only called once even if more than one events
    // are fired at once.
    let pageLeft=false;let isAccessible=false;function handleOnLeave(){if(pageLeft){return;}pageLeft=true;callback(isAccessible);// Reset pageLeft on the next tick
    // to ensure callback executes for other listeners
    // when closing an inactive browser tab.
    setTimeout(()=>{pageLeft=false;},0);}// Catches the unloading of the page (e.g., closing the tab or navigating away).
    // Includes user actions like clicking a link, entering a new URL,
    // refreshing the page, or closing the browser tab
    // Note that 'pagehide' is not supported in IE.
    // So, this is a fallback.
    globalThis.addEventListener('beforeunload',()=>{isAccessible=false;handleOnLeave();});globalThis.addEventListener('blur',()=>{isAccessible=true;handleOnLeave();});globalThis.addEventListener('focus',()=>{pageLeft=false;});// Catches the page being hidden, including scenarios like closing the tab.
    document.addEventListener('pagehide',()=>{isAccessible=document.visibilityState==='hidden';handleOnLeave();});// Catches visibility changes, such as switching tabs or minimizing the browser.
    document.addEventListener('visibilitychange',()=>{isAccessible=true;if(document.visibilityState==='hidden'){handleOnLeave();}else {pageLeft=false;}});};
    
    const getFormattedTimestamp=date=>date.toISOString();/**
     * To get the current timestamp in ISO string format
     * @returns ISO formatted timestamp string
     */const getCurrentTimeFormatted=()=>getFormattedTimestamp(new Date());
    
    const LOG_CONTEXT_SEPARATOR=':: ';const SCRIPT_ALREADY_EXISTS_ERROR=id=>`A script with the id "${id}" is already loaded. Skipping the loading of this script to prevent conflicts.`;const SCRIPT_LOAD_ERROR=(id,url)=>`Failed to load the script with the id "${id}" from URL "${url}".`;const SCRIPT_LOAD_TIMEOUT_ERROR=(id,url,timeout)=>`A timeout of ${timeout} ms occurred while trying to load the script with id "${id}" from URL "${url}".`;const CIRCULAR_REFERENCE_WARNING=(context,key)=>`${context}${LOG_CONTEXT_SEPARATOR}A circular reference has been detected in the object and the property "${key}" has been dropped from the output.`;const JSON_STRINGIFY_WARNING=`Failed to convert the value to a JSON string.`;const COOKIE_DATA_ENCODING_ERROR=`Failed to encode the cookie data.`;
    
    const JSON_STRINGIFY='JSONStringify';const BIG_INT_PLACEHOLDER='[BigInt]';const CIRCULAR_REFERENCE_PLACEHOLDER='[Circular Reference]';const getCircularReplacer=(excludeNull,excludeKeys,logger)=>{const ancestors=[];// Here we do not want to use arrow function to use "this" in function context
    // eslint-disable-next-line func-names
    return function(key,value){if(excludeKeys?.includes(key)){return undefined;}if(excludeNull&&isNullOrUndefined(value)){return undefined;}if(typeof value!=='object'||isNull(value)){return value;}// `this` is the object that value is contained in, i.e., its direct parent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    while(ancestors.length>0&&ancestors[ancestors.length-1]!==this){ancestors.pop();}if(ancestors.includes(value)){logger?.warn(CIRCULAR_REFERENCE_WARNING(JSON_STRINGIFY,key));return CIRCULAR_REFERENCE_PLACEHOLDER;}ancestors.push(value);return value;};};/**
     * Utility method for JSON stringify object excluding null values & circular references
     *
     * @param {*} value input
     * @param {boolean} excludeNull if it should exclude nul or not
     * @param {function} logger optional logger methods for warning
     * @returns string
     */const stringifyWithoutCircular=(value,excludeNull,excludeKeys,logger)=>{try{return JSON.stringify(value,getCircularReplacer(excludeNull,excludeKeys,logger));}catch(err){logger?.warn(JSON_STRINGIFY_WARNING,err);return null;}};const getReplacer=logger=>{const ancestors=[];// Array to track ancestor objects
    // Using a regular function to use `this` for the parent context
    return function replacer(key,value){if(isBigInt(value)){return BIG_INT_PLACEHOLDER;// Replace BigInt values
    }// `this` is the object that value is contained in, i.e., its direct parent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    while(ancestors.length>0&&ancestors[ancestors.length-1]!==this){ancestors.pop();// Remove ancestors that are no longer part of the chain
    }// Check for circular references (if the value is already in the ancestors)
    if(ancestors.includes(value)){return CIRCULAR_REFERENCE_PLACEHOLDER;}// Add current value to ancestors
    ancestors.push(value);return value;};};const traverseWithThis=(obj,replacer)=>{// Create a new result object or array
    const result=Array.isArray(obj)?[]:{};// Traverse object properties or array elements
    // eslint-disable-next-line no-restricted-syntax
    for(const key in obj){if(Object.hasOwnProperty.call(obj,key)){const value=obj[key];// Recursively apply the replacer and traversal
    const sanitizedValue=replacer.call(obj,key,value);// If the value is an object or array, continue traversal
    if(isObjectLiteralAndNotNull(sanitizedValue)||Array.isArray(sanitizedValue)){result[key]=traverseWithThis(sanitizedValue,replacer);}else {result[key]=sanitizedValue;}}}return result;};/**
     * Recursively traverses an object similar to JSON.stringify,
     * sanitizing BigInts and circular references
     * @param value Input object
     * @param logger Logger instance
     * @returns Sanitized value
     */const getSanitizedValue=(value,logger)=>{const replacer=getReplacer();// This is needed for registering the first ancestor
    const newValue=replacer.call(value,'',value);if(isObjectLiteralAndNotNull(value)||Array.isArray(value)){return traverseWithThis(value,replacer);}return newValue;};
    
    const MANUAL_ERROR_IDENTIFIER='[SDK DISPATCHED ERROR]';const getStacktrace=err=>{const{stack,stacktrace}=err;const operaSourceloc=err['opera#sourceloc'];const stackString=stack??stacktrace??operaSourceloc;if(!!stackString&&typeof stackString==='string'){return stackString;}return undefined;};/**
     * Get mutated error with issue prepended to error message
     * @param err Original error
     * @param issue Issue to prepend to error message
     * @returns Instance of Error with message prepended with issue
     */const getMutatedError=(err,issue)=>{let finalError=err;if(!isTypeOfError(err)){finalError=new Error(`${issue}: ${stringifyWithoutCircular(err)}`);}else {finalError.message=`${issue}: ${err.message}`;}return finalError;};const dispatchErrorEvent=error=>{if(isTypeOfError(error)){const errStack=getStacktrace(error);if(errStack){const{stack,stacktrace}=error;const operaSourceloc=error['opera#sourceloc'];switch(errStack){case stack:// eslint-disable-next-line no-param-reassign
    error.stack=`${stack}\n${MANUAL_ERROR_IDENTIFIER}`;break;case stacktrace:// eslint-disable-next-line no-param-reassign
    error.stacktrace=`${stacktrace}\n${MANUAL_ERROR_IDENTIFIER}`;break;case operaSourceloc:default:// eslint-disable-next-line no-param-reassign
    error['opera#sourceloc']=`${operaSourceloc}\n${MANUAL_ERROR_IDENTIFIER}`;break;}}}globalThis.dispatchEvent(new ErrorEvent('error',{error,bubbles:true,cancelable:true,composed:true}));};
    
    const APP_NAME='RudderLabs JavaScript SDK';const APP_VERSION='3.16.1';const APP_NAMESPACE='com.rudderlabs.javascript';const MODULE_TYPE='npm';const ADBLOCK_PAGE_CATEGORY='RudderJS-Initiated';const ADBLOCK_PAGE_NAME='ad-block page request';const ADBLOCK_PAGE_PATH='/ad-blocked';const GLOBAL_PRELOAD_BUFFER='preloadedEventsBuffer';const CONSENT_TRACK_EVENT_NAME='Consent Management Interaction';
    
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
    if(preloadedEventsArray.length>0){instance.enqueuePreloadBufferEvents(preloadedEventsArray);setExposedGlobal(GLOBAL_PRELOAD_BUFFER,[]);}};const consumePreloadBufferedEvent=(event,analyticsInstance)=>{const methodName=event.shift();let callOptions;if(isFunction(analyticsInstance[methodName])){switch(methodName){case 'page':callOptions=pageArgumentsToCallOptions(...event);break;case 'track':callOptions=trackArgumentsToCallOptions(...event);break;case 'identify':callOptions=identifyArgumentsToCallOptions(...event);break;case 'alias':callOptions=aliasArgumentsToCallOptions(...event);break;case 'group':callOptions=groupArgumentsToCallOptions(...event);break;default:analyticsInstance[methodName](...event);break;}if(callOptions){analyticsInstance[methodName](callOptions);}}};
    
    const DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS=10*1000;// 10 seconds
    
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
     */const createScriptElement=(url,id,async=true,onload=null,onerror=null,extraAttributes={})=>{const scriptElement=document.createElement('script');scriptElement.type='text/javascript';scriptElement.onload=onload;scriptElement.onerror=onerror;scriptElement.src=url;scriptElement.id=id;scriptElement.async=async;Object.keys(extraAttributes).forEach(attributeName=>{scriptElement.setAttribute(attributeName,extraAttributes[attributeName]);});scriptElement.setAttribute('data-loader',EXTERNAL_SOURCE_LOAD_ORIGIN);return scriptElement;};/**
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
     */class ExternalSrcLoader{constructor(errorHandler,logger,timeout=DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS){this.errorHandler=errorHandler;this.logger=logger;this.timeout=timeout;this.onError=this.onError.bind(this);}/**
       * Load external resource of type javascript
       */loadJSFile(config){const{url,id,timeout,async,callback,extraAttributes}=config;const isFireAndForget=!isFunction(callback);jsFileLoader(url,id,timeout||this.timeout,async,extraAttributes).then(id=>{if(!isFireAndForget){callback(id);}}).catch(err=>{this.onError(err);if(!isFireAndForget){callback();}});}/**
       * Handle errors
       */onError(error){this.errorHandler.onError(error,EXTERNAL_SRC_LOADER);}}
    
    var i=Symbol.for("preact-signals");function t(){if(!(s>1)){var i,t=false;while(void 0!==h){var r=h;h=void 0;f++;while(void 0!==r){var o=r.o;r.o=void 0;r.f&=-3;if(!(8&r.f)&&c(r))try{r.c();}catch(r){if(!t){i=r;t=true;}}r=o;}}f=0;s--;if(t)throw i;}else s--;}function r(i){if(s>0)return i();s++;try{return i();}finally{t();}}var o=void 0;var h=void 0,s=0,f=0,v=0;function e(i){if(void 0!==o){var t=i.n;if(void 0===t||t.t!==o){t={i:0,S:i,p:o.s,n:void 0,t:o,e:void 0,x:void 0,r:t};if(void 0!==o.s)o.s.n=t;o.s=t;i.n=t;if(32&o.f)i.S(t);return t;}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=o.s;t.n=void 0;o.s.n=t;o.s=t;}return t;}}}function u(i){this.v=i;this.i=0;this.n=void 0;this.t=void 0;}u.prototype.brand=i;u.prototype.h=function(){return  true;};u.prototype.S=function(i){if(this.t!==i&&void 0===i.e){i.x=this.t;if(void 0!==this.t)this.t.e=i;this.t=i;}};u.prototype.U=function(i){if(void 0!==this.t){var t=i.e,r=i.x;if(void 0!==t){t.x=r;i.e=void 0;}if(void 0!==r){r.e=t;i.x=void 0;}if(i===this.t)this.t=r;}};u.prototype.subscribe=function(i){var t=this;return E(function(){var r=t.value,n=o;o=void 0;try{i(r);}finally{o=n;}});};u.prototype.valueOf=function(){return this.value;};u.prototype.toString=function(){return this.value+"";};u.prototype.toJSON=function(){return this.value;};u.prototype.peek=function(){var i=o;o=void 0;try{return this.value;}finally{o=i;}};Object.defineProperty(u.prototype,"value",{get:function(){var i=e(this);if(void 0!==i)i.i=this.i;return this.v;},set:function(i){if(i!==this.v){if(f>100)throw new Error("Cycle detected");this.v=i;this.i++;v++;s++;try{for(var r=this.t;void 0!==r;r=r.x)r.t.N();}finally{t();}}}});function d(i){return new u(i);}function c(i){for(var t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return  true;return  false;}function a(i){for(var t=i.s;void 0!==t;t=t.n){var r=t.S.n;if(void 0!==r)t.r=r;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break;}}}function l(i){var t=i.s,r=void 0;while(void 0!==t){var o=t.p;if(-1===t.i){t.S.U(t);if(void 0!==o)o.n=t.n;if(void 0!==t.n)t.n.p=o;}else r=t;t.S.n=t.r;if(void 0!==t.r)t.r=void 0;t=o;}i.s=r;}function y(i){u.call(this,void 0);this.x=i;this.s=void 0;this.g=v-1;this.f=4;}(y.prototype=new u()).h=function(){this.f&=-3;if(1&this.f)return  false;if(32==(36&this.f))return  true;this.f&=-5;if(this.g===v)return  true;this.g=v;this.f|=1;if(this.i>0&&!c(this)){this.f&=-2;return  true;}var i=o;try{a(this);o=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}o=i;l(this);this.f&=-2;return  true;};y.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.S.S(t);}u.prototype.S.call(this,i);};y.prototype.U=function(i){if(void 0!==this.t){u.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.S.U(t);}}};y.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.N();}};Object.defineProperty(y.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var i=e(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v;}});function _(i){var r=i.u;i.u=void 0;if("function"==typeof r){s++;var n=o;o=void 0;try{r();}catch(t){i.f&=-2;i.f|=8;g(i);throw t;}finally{o=n;t();}}}function g(i){for(var t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;_(i);}function p(i){if(o!==this)throw new Error("Out-of-order effect");l(this);o=i;this.f&=-2;if(8&this.f)g(this);t();}function b(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}b.prototype.c=function(){var i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};b.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;_(this);a(this);s++;var i=o;o=this;return p.bind(this,i);};b.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=h;h=this;}};b.prototype.d=function(){this.f|=8;if(!(1&this.f))g(this);};function E(i){var t=new b(i);try{t.c();}catch(i){t.d();throw i;}return t.d.bind(t);}
    
    /**
     * A buffer queue to serve as a store for any type of data
     */class BufferQueue{constructor(){this.items=[];}enqueue(item){this.items.push(item);}dequeue(){if(this.items.length===0){return null;}return this.items.shift();}isEmpty(){return this.items.length===0;}size(){return this.items.length;}clear(){this.items=[];}}
    
    const LOG_LEVEL_MAP={LOG:0,INFO:1,DEBUG:2,WARN:3,ERROR:4,NONE:5};const DEFAULT_LOG_LEVEL='LOG';const POST_LOAD_LOG_LEVEL='ERROR';const LOG_MSG_PREFIX='RS SDK';const LOG_MSG_PREFIX_STYLE='font-weight: bold; background: black; color: white;';const LOG_MSG_STYLE='font-weight: normal;';/**
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
    
    let ErrorType=/*#__PURE__*/function(ErrorType){ErrorType["HANDLEDEXCEPTION"]="handledException";ErrorType["UNHANDLEDEXCEPTION"]="unhandledException";ErrorType["UNHANDLEDREJECTION"]="unhandledPromiseRejection";return ErrorType;}({});
    
    // default is v3
    const SUPPORTED_STORAGE_TYPES=['localStorage','memoryStorage','cookieStorage','sessionStorage','none'];const DEFAULT_STORAGE_TYPE='cookieStorage';
    
    const SOURCE_CONFIG_RESOLUTION_ERROR=`Unable to process/parse source configuration response`;const SOURCE_DISABLED_ERROR=`The source is disabled. Please enable the source in the dashboard to send events.`;const XHR_PAYLOAD_PREP_ERROR=`Failed to prepare data for the request.`;const PLUGIN_EXT_POINT_MISSING_ERROR=`Failed to invoke plugin because the extension point name is missing.`;const PLUGIN_EXT_POINT_INVALID_ERROR=`Failed to invoke plugin because the extension point name is invalid.`;const SOURCE_CONFIG_OPTION_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}The "getSourceConfig" load API option must be a function that returns valid source configuration data.`;const COMPONENT_BASE_URL_ERROR=(context,component,url)=>`${context}${LOG_CONTEXT_SEPARATOR}The base URL "${url}" for ${component} is not valid.`;// ERROR
    const UNSUPPORTED_CONSENT_MANAGER_ERROR=(context,selectedConsentManager,consentManagersToPluginNameMap)=>`${context}${LOG_CONTEXT_SEPARATOR}The consent manager "${selectedConsentManager}" is not supported. Please choose one of the following supported consent managers: "${Object.keys(consentManagersToPluginNameMap)}".`;const NON_ERROR_WARNING=(context,errStr)=>`${context}${LOG_CONTEXT_SEPARATOR}Ignoring a non-error: ${errStr}.`;const BREADCRUMB_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to log breadcrumb.`;const HANDLE_ERROR_FAILURE=context=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to handle the error.`;const PLUGIN_NAME_MISSING_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin name is missing.`;const PLUGIN_ALREADY_EXISTS_ERROR=(context,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" already exists.`;const PLUGIN_NOT_FOUND_ERROR=(context,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" not found.`;const PLUGIN_ENGINE_BUG_ERROR=(context,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" not found in plugins but found in byName. This indicates a bug in the plugin engine. Please report this issue to the development team.`;const PLUGIN_DEPS_ERROR=(context,pluginName,notExistDeps)=>`${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" could not be loaded because some of its dependencies "${notExistDeps}" do not exist.`;const PLUGIN_INVOCATION_ERROR=(context,extPoint,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}Failed to invoke the "${extPoint}" extension point of plugin "${pluginName}".`;const STORAGE_UNAVAILABILITY_ERROR_PREFIX=(context,storageType)=>`${context}${LOG_CONTEXT_SEPARATOR}The "${storageType}" storage type is `;const SOURCE_CONFIG_FETCH_ERROR='Failed to fetch the source config';const WRITE_KEY_VALIDATION_ERROR=(context,writeKey)=>`${context}${LOG_CONTEXT_SEPARATOR}The write key "${writeKey}" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.`;const DATA_PLANE_URL_VALIDATION_ERROR=(context,dataPlaneUrl)=>`${context}${LOG_CONTEXT_SEPARATOR}The data plane URL "${dataPlaneUrl}" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.`;const INVALID_CALLBACK_FN_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}The provided callback parameter is not a function.`;const XHR_DELIVERY_ERROR=(prefix,status,statusText,url,response)=>`${prefix} with status ${status} (${statusText}) for URL: ${url}. Response: ${response.trim()}`;const XHR_REQUEST_ERROR=(prefix,e,url)=>`${prefix} due to timeout or no connection (${e?e.type:''}) at the client side for URL: ${url}`;const XHR_SEND_ERROR=(prefix,url)=>`${prefix} for URL: ${url}`;const STORE_DATA_SAVE_ERROR=key=>`Failed to save the value for "${key}" to storage`;const STORE_DATA_FETCH_ERROR=key=>`Failed to retrieve or parse data for "${key}" from storage`;const DATA_SERVER_REQUEST_FAIL_ERROR=status=>`The server responded with status ${status} while setting the cookies. As a fallback, the cookies will be set client side.`;const FAILED_SETTING_COOKIE_FROM_SERVER_ERROR=key=>`The server failed to set the ${key} cookie. As a fallback, the cookies will be set client side.`;const FAILED_SETTING_COOKIE_FROM_SERVER_GLOBAL_ERROR=`Failed to set/remove cookies via server. As a fallback, the cookies will be managed client side.`;// WARNING
    const STORAGE_TYPE_VALIDATION_WARNING=(context,storageType,defaultStorageType)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage type "${storageType}" is not supported. Please choose one of the following supported types: "${SUPPORTED_STORAGE_TYPES}". The default type "${defaultStorageType}" will be used instead.`;const UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING=(context,selectedStorageEncryptionVersion,storageEncryptionVersionsToPluginNameMap,defaultVersion)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage encryption version "${selectedStorageEncryptionVersion}" is not supported. Please choose one of the following supported versions: "${Object.keys(storageEncryptionVersionsToPluginNameMap)}". The default version "${defaultVersion}" will be used instead.`;const STORAGE_DATA_MIGRATION_OVERRIDE_WARNING=(context,storageEncryptionVersion,defaultVersion)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage data migration has been disabled because the configured storage encryption version (${storageEncryptionVersion}) is not the latest (${defaultVersion}). To enable storage data migration, please update the storage encryption version to the latest version.`;const SERVER_SIDE_COOKIE_FEATURE_OVERRIDE_WARNING=(context,providedCookieDomain,currentCookieDomain)=>`${context}${LOG_CONTEXT_SEPARATOR}The provided cookie domain (${providedCookieDomain}) does not match the current webpage's domain (${currentCookieDomain}). Hence, the cookies will be set client-side.`;const RESERVED_KEYWORD_WARNING=(context,property,parentKeyPath,reservedElements)=>`${context}${LOG_CONTEXT_SEPARATOR}The "${property}" property defined under "${parentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (${reservedElements}).`;const INVALID_CONTEXT_OBJECT_WARNING=logContext=>`${logContext}${LOG_CONTEXT_SEPARATOR}Please make sure that the "context" property in the event API's "options" argument is a valid object literal with key-value pairs.`;const UNSUPPORTED_BEACON_API_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}The Beacon API is not supported by your browser. The events will be sent using XHR instead.`;const TIMEOUT_NOT_NUMBER_WARNING=(context,timeout,defaultValue)=>`${context}${LOG_CONTEXT_SEPARATOR}The session timeout value "${timeout}" is not a number. The default timeout of ${defaultValue} ms will be used instead.`;const TIMEOUT_ZERO_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}The session timeout value is 0, which disables the automatic session tracking feature. If you want to enable session tracking, please provide a positive integer value for the timeout.`;const TIMEOUT_NOT_RECOMMENDED_WARNING=(context,timeout,minTimeout)=>`${context}${LOG_CONTEXT_SEPARATOR}The session timeout value ${timeout} ms is less than the recommended minimum of ${minTimeout} ms. Please consider increasing the timeout value to ensure optimal performance and reliability.`;const INVALID_SESSION_ID_WARNING=(context,sessionId,minSessionIdLength)=>`${context}${LOG_CONTEXT_SEPARATOR}The provided session ID (${sessionId}) is either invalid, not a positive integer, or not at least "${minSessionIdLength}" digits long. A new session ID will be auto-generated instead.`;const STORAGE_QUOTA_EXCEEDED_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}The storage is either full or unavailable, so the data will not be persisted. Switching to in-memory storage.`;const STORAGE_UNAVAILABLE_WARNING=(context,entry,selectedStorageType,finalStorageType)=>`${context}${LOG_CONTEXT_SEPARATOR}The storage type "${selectedStorageType}" is not available for entry "${entry}". The SDK will initialize the entry with "${finalStorageType}" storage type instead.`;const CALLBACK_INVOKE_ERROR=context=>`${context}${LOG_CONTEXT_SEPARATOR}The callback threw an exception`;const INVALID_CONFIG_URL_WARNING=(context,configUrl)=>`${context}${LOG_CONTEXT_SEPARATOR}The provided source config URL "${configUrl}" is invalid. Using the default source config URL instead.`;const POLYFILL_SCRIPT_LOAD_ERROR=(scriptId,url)=>`Failed to load the polyfill script with ID "${scriptId}" from URL ${url}.`;const UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY=(context,selectedStrategy,defaultStrategy)=>`${context}${LOG_CONTEXT_SEPARATOR}The pre-consent storage strategy "${selectedStrategy}" is not supported. Please choose one of the following supported strategies: "none, session, anonymousId". The default strategy "${defaultStrategy}" will be used instead.`;const UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE=(context,selectedDeliveryType,defaultDeliveryType)=>`${context}${LOG_CONTEXT_SEPARATOR}The pre-consent events delivery type "${selectedDeliveryType}" is not supported. Please choose one of the following supported types: "immediate, buffer". The default type "${defaultDeliveryType}" will be used instead.`;const DEPRECATED_PLUGIN_WARNING=(context,pluginName)=>`${context}${LOG_CONTEXT_SEPARATOR}${pluginName} plugin is deprecated. Please exclude it from the load API options.`;const generateMisconfiguredPluginsWarning=(context,configurationStatus,missingPlugins,shouldAddMissingPlugins)=>{const isSinglePlugin=missingPlugins.length===1;const pluginsString=isSinglePlugin?` '${missingPlugins[0]}' plugin was`:` ['${missingPlugins.join("', '")}'] plugins were`;const baseWarning=`${context}${LOG_CONTEXT_SEPARATOR}${configurationStatus}, but${pluginsString} not configured to load.`;if(shouldAddMissingPlugins){return `${baseWarning} So, ${isSinglePlugin?'the plugin':'those plugins'} will be loaded automatically.`;}return `${baseWarning} Ignore if this was intentional. Otherwise, consider adding ${isSinglePlugin?'it':'them'} to the 'plugins' load API option.`;};const INVALID_POLYFILL_URL_WARNING=(context,customPolyfillUrl)=>`${context}${LOG_CONTEXT_SEPARATOR}The provided polyfill URL "${customPolyfillUrl}" is invalid. The default polyfill URL will be used instead.`;const BAD_COOKIES_WARNING=key=>`The cookie data for ${key} seems to be encrypted using SDK versions < v3. The data is dropped. This can potentially stem from using SDK versions < v3 on other sites or web pages that can share cookies with this webpage. We recommend using the same SDK (v3) version everywhere or avoid disabling the storage data migration.`;const PAGE_UNLOAD_ON_BEACON_DISABLED_WARNING=context=>`${context}${LOG_CONTEXT_SEPARATOR}Page Unloaded event can only be tracked when the Beacon transport is active. Please enable "useBeacon" load API option.`;const UNKNOWN_PLUGINS_WARNING=(context,unknownPlugins)=>`${context}${LOG_CONTEXT_SEPARATOR}Ignoring unknown plugins: ${unknownPlugins.join(', ')}.`;
    
    const DEFAULT_INTEGRATIONS_CONFIG={All:true};
    
    const CDN_INT_DIR='js-integrations';const CDN_PLUGINS_DIR='plugins';const URL_PATTERN=new RegExp('^(https?:\\/\\/)'+// protocol
    '('+'((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|'+// domain name
    'localhost|'+// localhost
    '((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]?)\\.){3}'+// OR IP (v4) address first 3 octets
    '(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]?))'+// last octet of IP address
    ')'+'(\\:\\d+)?'+// port
    '(\\/[-a-zA-Z\\d%_.~+]*)*'+// path
    '(\\?[;&a-zA-Z\\d%_.~+=-]*)?'+// query string
    '(\\#[-a-zA-Z\\d_]*)?$')// fragment locator
    ;
    
    const BUILD_TYPE='modern';const SDK_CDN_BASE_URL='https://cdn.rudderlabs.com';const CDN_ARCH_VERSION_DIR='v3';const DEFAULT_INTEGRATION_SDKS_URL=`${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_INT_DIR}`;const DEFAULT_PLUGINS_URL=`${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;const DEFAULT_CONFIG_BE_URL='https://api.rudderstack.com';
    
    const DEFAULT_STORAGE_ENCRYPTION_VERSION='v3';const DEFAULT_DATA_PLANE_EVENTS_TRANSPORT='xhr';const ConsentManagersToPluginNameMap={iubenda:'IubendaConsentManager',oneTrust:'OneTrustConsentManager',ketch:'KetchConsentManager',custom:'CustomConsentManager'};const StorageEncryptionVersionsToPluginNameMap={[DEFAULT_STORAGE_ENCRYPTION_VERSION]:'StorageEncryption',legacy:'StorageEncryptionLegacy'};const DataPlaneEventsTransportToPluginNameMap={[DEFAULT_DATA_PLANE_EVENTS_TRANSPORT]:'XhrQueue',beacon:'BeaconQueue'};const DEFAULT_DATA_SERVICE_ENDPOINT='rsaRequest';const METRICS_SERVICE_ENDPOINT='rsaMetrics';
    
    const defaultLoadOptions={configUrl:DEFAULT_CONFIG_BE_URL,loadIntegration:true,sessions:{autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS},sameSiteCookie:'Lax',polyfillIfRequired:true,integrations:DEFAULT_INTEGRATIONS_CONFIG,useBeacon:false,beaconQueueOptions:{},destinationsQueueOptions:{},queueOptions:{},lockIntegrationsVersion:true,lockPluginsVersion:true,uaChTrackLevel:'none',plugins:[],useGlobalIntegrationsConfigInEvents:false,bufferDataPlaneEventsUntilReady:false,dataPlaneEventsBufferTimeout:DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,storage:{encryption:{version:DEFAULT_STORAGE_ENCRYPTION_VERSION},migrate:true,cookie:{}},sendAdblockPage:false,sameDomainCookiesOnly:false,secureCookie:false,sendAdblockPageOptions:{},useServerSideCookies:false};const loadOptionsState=d(clone(defaultLoadOptions));
    
    const DEFAULT_USER_SESSION_VALUES={userId:'',userTraits:{},anonymousId:'',groupId:'',groupTraits:{},initialReferrer:'',initialReferringDomain:'',sessionInfo:{},authToken:null};const SERVER_SIDE_COOKIES_DEBOUNCE_TIME=10;// milliseconds
    
    const defaultSessionConfiguration={autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS};const sessionState={userId:d(DEFAULT_USER_SESSION_VALUES.userId),userTraits:d(DEFAULT_USER_SESSION_VALUES.userTraits),anonymousId:d(DEFAULT_USER_SESSION_VALUES.anonymousId),groupId:d(DEFAULT_USER_SESSION_VALUES.groupId),groupTraits:d(DEFAULT_USER_SESSION_VALUES.groupTraits),initialReferrer:d(DEFAULT_USER_SESSION_VALUES.initialReferrer),initialReferringDomain:d(DEFAULT_USER_SESSION_VALUES.initialReferringDomain),sessionInfo:d(DEFAULT_USER_SESSION_VALUES.sessionInfo),authToken:d(DEFAULT_USER_SESSION_VALUES.authToken)};
    
    const capabilitiesState={isOnline:d(true),storage:{isLocalStorageAvailable:d(false),isCookieStorageAvailable:d(false),isSessionStorageAvailable:d(false)},isBeaconAvailable:d(false),isLegacyDOM:d(false),isUaCHAvailable:d(false),isCryptoAvailable:d(false),isIE11:d(false),isAdBlocked:d(false)};
    
    const reportingState={isErrorReportingEnabled:d(false),isMetricsReportingEnabled:d(false),breadcrumbs:d([])};
    
    const sourceConfigState=d(undefined);
    
    const lifecycleState={activeDataplaneUrl:d(undefined),integrationsCDNPath:d(DEFAULT_INTEGRATION_SDKS_URL),pluginsCDNPath:d(DEFAULT_PLUGINS_URL),sourceConfigUrl:d(undefined),status:d(undefined),initialized:d(false),logLevel:d(POST_LOAD_LOG_LEVEL),loaded:d(false),readyCallbacks:d([]),writeKey:d(undefined),dataPlaneUrl:d(undefined)};
    
    const consentsState={enabled:d(false),initialized:d(false),data:d({}),activeConsentManagerPluginName:d(undefined),preConsent:d({enabled:false}),postConsent:d({}),resolutionStrategy:d('and'),provider:d(undefined),metadata:d(undefined)};
    
    const metricsState={retries:d(0),dropped:d(0),sent:d(0),queued:d(0),triggered:d(0),metricsServiceUrl:d(undefined)};
    
    const contextState={app:d({name:APP_NAME,namespace:APP_NAMESPACE,version:APP_VERSION,installType:MODULE_TYPE}),traits:d(null),library:d({name:APP_NAME,version:APP_VERSION,snippetVersion:globalThis.RudderSnippetVersion}),userAgent:d(null),device:d(null),network:d(null),os:d({name:'',version:''}),locale:d(null),screen:d({density:0,width:0,height:0,innerWidth:0,innerHeight:0}),'ua-ch':d(undefined),timezone:d(undefined)};
    
    const nativeDestinationsState={configuredDestinations:d([]),activeDestinations:d([]),loadOnlyIntegrations:d({}),failedDestinations:d([]),loadIntegration:d(true),initializedDestinations:d([]),clientDestinationsReady:d(false),integrationsConfig:d({})};
    
    const eventBufferState={toBeProcessedArray:d([]),readyCallbacksArray:d([])};
    
    const pluginsState={ready:d(false),loadedPlugins:d([]),failedPlugins:d([]),pluginsToLoadFromConfig:d([]),activePlugins:d([]),totalPluginsToLoad:d(0)};
    
    const storageState={encryptionPluginName:d(undefined),migrate:d(false),type:d(undefined),cookie:d(undefined),entries:d({}),trulyAnonymousTracking:d(false)};
    
    const serverSideCookiesState={isEnabledServerSideCookies:d(false),dataServiceUrl:d(undefined)};
    
    const dataPlaneEventsState={eventsQueuePluginName:d(undefined),deliveryEnabled:d(true)// Delivery should always happen
    };
    
    const autoTrackState={enabled:d(false),pageLifecycle:{enabled:d(false),visitId:d(undefined),pageLoadedTimestamp:d(undefined)}};
    
    const defaultStateValues={capabilities:capabilitiesState,consents:consentsState,context:contextState,eventBuffer:eventBufferState,lifecycle:lifecycleState,loadOptions:loadOptionsState,metrics:metricsState,nativeDestinations:nativeDestinationsState,plugins:pluginsState,reporting:reportingState,session:sessionState,source:sourceConfigState,storage:storageState,serverCookies:serverSideCookiesState,dataPlaneEvents:dataPlaneEventsState,autoTrack:autoTrackState};const state={...clone(defaultStateValues)};
    
    function getDefaultExportFromCjs (x) {
       return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }
    
    var errorStackParser$1 = {exports: {}};
    
    var stackframe$1 = {exports: {}};
    
    var stackframe=stackframe$1.exports;var hasRequiredStackframe;function requireStackframe(){if(hasRequiredStackframe)return stackframe$1.exports;hasRequiredStackframe=1;(function(module,exports){(function(root,factory){/* istanbul ignore next */{module.exports=factory();}})(stackframe,function(){function _isNumber(n){return !isNaN(parseFloat(n))&&isFinite(n);}function _capitalize(str){return str.charAt(0).toUpperCase()+str.substring(1);}function _getter(p){return function(){return this[p];};}var booleanProps=['isConstructor','isEval','isNative','isToplevel'];var numericProps=['columnNumber','lineNumber'];var stringProps=['fileName','functionName','source'];var arrayProps=['args'];var objectProps=['evalOrigin'];var props=booleanProps.concat(numericProps,stringProps,arrayProps,objectProps);function StackFrame(obj){if(!obj)return;for(var i=0;i<props.length;i++){if(obj[props[i]]!==undefined){this['set'+_capitalize(props[i])](obj[props[i]]);}}}StackFrame.prototype={getArgs:function(){return this.args;},setArgs:function(v){if(Object.prototype.toString.call(v)!=='[object Array]'){throw new TypeError('Args must be an Array');}this.args=v;},getEvalOrigin:function(){return this.evalOrigin;},setEvalOrigin:function(v){if(v instanceof StackFrame){this.evalOrigin=v;}else if(v instanceof Object){this.evalOrigin=new StackFrame(v);}else {throw new TypeError('Eval Origin must be an Object or StackFrame');}},toString:function(){var fileName=this.getFileName()||'';var lineNumber=this.getLineNumber()||'';var columnNumber=this.getColumnNumber()||'';var functionName=this.getFunctionName()||'';if(this.getIsEval()){if(fileName){return '[eval] ('+fileName+':'+lineNumber+':'+columnNumber+')';}return '[eval]:'+lineNumber+':'+columnNumber;}if(functionName){return functionName+' ('+fileName+':'+lineNumber+':'+columnNumber+')';}return fileName+':'+lineNumber+':'+columnNumber;}};StackFrame.fromString=function StackFrame$$fromString(str){var argsStartIndex=str.indexOf('(');var argsEndIndex=str.lastIndexOf(')');var functionName=str.substring(0,argsStartIndex);var args=str.substring(argsStartIndex+1,argsEndIndex).split(',');var locationString=str.substring(argsEndIndex+1);if(locationString.indexOf('@')===0){var parts=/@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString,'');var fileName=parts[1];var lineNumber=parts[2];var columnNumber=parts[3];}return new StackFrame({functionName:functionName,args:args||undefined,fileName:fileName,lineNumber:lineNumber||undefined,columnNumber:columnNumber||undefined});};for(var i=0;i<booleanProps.length;i++){StackFrame.prototype['get'+_capitalize(booleanProps[i])]=_getter(booleanProps[i]);StackFrame.prototype['set'+_capitalize(booleanProps[i])]=function(p){return function(v){this[p]=Boolean(v);};}(booleanProps[i]);}for(var j=0;j<numericProps.length;j++){StackFrame.prototype['get'+_capitalize(numericProps[j])]=_getter(numericProps[j]);StackFrame.prototype['set'+_capitalize(numericProps[j])]=function(p){return function(v){if(!_isNumber(v)){throw new TypeError(p+' must be a Number');}this[p]=Number(v);};}(numericProps[j]);}for(var k=0;k<stringProps.length;k++){StackFrame.prototype['get'+_capitalize(stringProps[k])]=_getter(stringProps[k]);StackFrame.prototype['set'+_capitalize(stringProps[k])]=function(p){return function(v){this[p]=String(v);};}(stringProps[k]);}return StackFrame;});})(stackframe$1);return stackframe$1.exports;}
    
    var errorStackParser=errorStackParser$1.exports;var hasRequiredErrorStackParser;function requireErrorStackParser(){if(hasRequiredErrorStackParser)return errorStackParser$1.exports;hasRequiredErrorStackParser=1;(function(module,exports){(function(root,factory){/* istanbul ignore next */{module.exports=factory(requireStackframe());}})(errorStackParser,function ErrorStackParser(StackFrame){var FIREFOX_SAFARI_STACK_REGEXP=/(^|@)\S+:\d+/;var CHROME_IE_STACK_REGEXP=/^\s*at .*(\S+:\d+|\(native\))/m;var SAFARI_NATIVE_CODE_REGEXP=/^(eval@)?(\[native code])?$/;return {/**
                   * Given an Error object, extract the most information from it.
                   *
                   * @param {Error} error object
                   * @return {Array} of StackFrames
                   */parse:function ErrorStackParser$$parse(error){if(typeof error.stacktrace!=='undefined'||typeof error['opera#sourceloc']!=='undefined'){return this.parseOpera(error);}else if(error.stack&&error.stack.match(CHROME_IE_STACK_REGEXP)){return this.parseV8OrIE(error);}else if(error.stack){return this.parseFFOrSafari(error);}else {throw new Error('Cannot parse given Error object');}},// Separate line and column numbers from a string of the form: (URI:Line:Column)
    extractLocation:function ErrorStackParser$$extractLocation(urlLike){// Fail-fast but return locations like "(native)"
    if(urlLike.indexOf(':')===-1){return [urlLike];}var regExp=/(.+?)(?::(\d+))?(?::(\d+))?$/;var parts=regExp.exec(urlLike.replace(/[()]/g,''));return [parts[1],parts[2]||undefined,parts[3]||undefined];},parseV8OrIE:function ErrorStackParser$$parseV8OrIE(error){var filtered=error.stack.split('\n').filter(function(line){return !!line.match(CHROME_IE_STACK_REGEXP);},this);return filtered.map(function(line){if(line.indexOf('(eval ')>-1){// Throw away eval information until we implement stacktrace.js/stackframe#8
    line=line.replace(/eval code/g,'eval').replace(/(\(eval at [^()]*)|(,.*$)/g,'');}var sanitizedLine=line.replace(/^\s+/,'').replace(/\(eval code/g,'(').replace(/^.*?\s+/,'');// capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
    // case it has spaces in it, as the string is split on \s+ later on
    var location=sanitizedLine.match(/ (\(.+\)$)/);// remove the parenthesized location from the line, if it was matched
    sanitizedLine=location?sanitizedLine.replace(location[0],''):sanitizedLine;// if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
    // because this line doesn't have function name
    var locationParts=this.extractLocation(location?location[1]:sanitizedLine);var functionName=location&&sanitizedLine||undefined;var fileName=['eval','<anonymous>'].indexOf(locationParts[0])>-1?undefined:locationParts[0];return new StackFrame({functionName:functionName,fileName:fileName,lineNumber:locationParts[1],columnNumber:locationParts[2],source:line});},this);},parseFFOrSafari:function ErrorStackParser$$parseFFOrSafari(error){var filtered=error.stack.split('\n').filter(function(line){return !line.match(SAFARI_NATIVE_CODE_REGEXP);},this);return filtered.map(function(line){// Throw away eval information until we implement stacktrace.js/stackframe#8
    if(line.indexOf(' > eval')>-1){line=line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,':$1');}if(line.indexOf('@')===-1&&line.indexOf(':')===-1){// Safari eval frames only have function names and nothing else
    return new StackFrame({functionName:line});}else {var functionNameRegex=/((.*".+"[^@]*)?[^@]*)(?:@)/;var matches=line.match(functionNameRegex);var functionName=matches&&matches[1]?matches[1]:undefined;var locationParts=this.extractLocation(line.replace(functionNameRegex,''));return new StackFrame({functionName:functionName,fileName:locationParts[0],lineNumber:locationParts[1],columnNumber:locationParts[2],source:line});}},this);},parseOpera:function ErrorStackParser$$parseOpera(e){if(!e.stacktrace||e.message.indexOf('\n')>-1&&e.message.split('\n').length>e.stacktrace.split('\n').length){return this.parseOpera9(e);}else if(!e.stack){return this.parseOpera10(e);}else {return this.parseOpera11(e);}},parseOpera9:function ErrorStackParser$$parseOpera9(e){var lineRE=/Line (\d+).*script (?:in )?(\S+)/i;var lines=e.message.split('\n');var result=[];for(var i=2,len=lines.length;i<len;i+=2){var match=lineRE.exec(lines[i]);if(match){result.push(new StackFrame({fileName:match[2],lineNumber:match[1],source:lines[i]}));}}return result;},parseOpera10:function ErrorStackParser$$parseOpera10(e){var lineRE=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;var lines=e.stacktrace.split('\n');var result=[];for(var i=0,len=lines.length;i<len;i+=2){var match=lineRE.exec(lines[i]);if(match){result.push(new StackFrame({functionName:match[3]||undefined,fileName:match[2],lineNumber:match[1],source:lines[i]}));}}return result;},// Opera 10.65+ Error.stack very similar to FF/Safari
    parseOpera11:function ErrorStackParser$$parseOpera11(error){var filtered=error.stack.split('\n').filter(function(line){return !!line.match(FIREFOX_SAFARI_STACK_REGEXP)&&!line.match(/^Error created at/);},this);return filtered.map(function(line){var tokens=line.split('@');var locationParts=this.extractLocation(tokens.pop());var functionCall=tokens.shift()||'';var functionName=functionCall.replace(/<anonymous function(: (\w+))?>/,'$2').replace(/\([^)]*\)/g,'')||undefined;var argsRaw;if(functionCall.match(/\(([^)]*)\)/)){argsRaw=functionCall.replace(/^[^(]+\(([^)]*)\)$/,'$1');}var args=argsRaw===undefined||argsRaw==='[arguments not available]'?undefined:argsRaw.split(',');return new StackFrame({functionName:functionName,args:args,fileName:locationParts[0],lineNumber:locationParts[1],columnNumber:locationParts[2],source:line});},this);}};});})(errorStackParser$1);return errorStackParser$1.exports;}
    
    var errorStackParserExports = requireErrorStackParser();
    const ErrorStackParser = /*@__PURE__*/getDefaultExportFromCjs(errorStackParserExports);
    
    const GLOBAL_CODE='global code';const normalizeFunctionName=name=>{if(isDefined(name)){return /^global code$/i.test(name)?GLOBAL_CODE:name;}return name;};/**
     * Takes a stacktrace.js style stackframe (https://github.com/stacktracejs/stackframe)
     * and returns a Bugsnag compatible stackframe (https://docs.bugsnag.com/api/error-reporting/#json-payload)
     * @param frame
     * @returns
     */const formatStackframe=frame=>{const f={file:frame.fileName,method:normalizeFunctionName(frame.functionName),lineNumber:frame.lineNumber,columnNumber:frame.columnNumber};// Some instances result in no file:
    // - non-error exception thrown from global code in FF
    // This adds one.
    if(f.lineNumber&&f.lineNumber>-1&&!f.file&&!f.method){f.file=GLOBAL_CODE;}return f;};const ensureString=str=>isString(str)?str:'';function createException(errorClass,errorMessage,msgPrefix,stacktrace){return {errorClass:ensureString(errorClass),message:`${msgPrefix}${ensureString(errorMessage)}`,type:'browserjs',stacktrace:stacktrace.reduce((accum,frame)=>{const f=formatStackframe(frame);// don't include a stackframe if none of its properties are defined
    try{if(JSON.stringify(f)==='{}')return accum;return accum.concat(f);}catch{return accum;}},[])};}const normalizeError=(maybeError,logger)=>{let error;if(isTypeOfError(maybeError)&&isString(getStacktrace(maybeError))){error=maybeError;}else {logger.warn(NON_ERROR_WARNING(ERROR_HANDLER,stringifyWithoutCircular(maybeError)));error=undefined;}return error;};const createBugsnagException=(error,msgPrefix)=>{try{const stacktrace=ErrorStackParser.parse(error);return createException(error.name,error.message,msgPrefix,stacktrace);}catch{return createException(error.name,error.message,msgPrefix,[]);}};
    
    /**
     * Utility to parse XHR JSON response
     */const responseTextToJson=(responseText,onError)=>{try{return JSON.parse(responseText||'');}catch(err){const error=getMutatedError(err,'Failed to parse response data');onError(error);}return undefined;};
    
    const FAILED_REQUEST_ERR_MSG_PREFIX='The request failed';const PLUGINS_LOAD_FAILURE_MESSAGES=[/Failed to fetch dynamically imported module: .*/];const INTEGRATIONS_LOAD_FAILURE_MESSAGES=[/Failed to load the script with the id .*/,/A timeout of \d+ ms occurred while trying to load the script with id .*/];const ERROR_MESSAGES_TO_BE_FILTERED=[new RegExp(`${FAILED_REQUEST_ERR_MSG_PREFIX}.*`),/A script with the id .* is already loaded\./];
    
    const DEFAULT_XHR_REQUEST_OPTIONS={headers:{Accept:'application/json','Content-Type':'application/json;charset=UTF-8'},method:'GET'};/**
     * Utility to create request configuration based on default options
     */const createXhrRequestOptions=(url,options,basicAuthHeader)=>{const requestOptions=mergeDeepRight(DEFAULT_XHR_REQUEST_OPTIONS,options||{});if(basicAuthHeader){requestOptions.headers=mergeDeepRight(requestOptions.headers,{Authorization:basicAuthHeader});}requestOptions.url=url;return requestOptions;};/**
     * Utility implementation of XHR, fetch cannot be used as it requires explicit
     * origin allowed values and not wildcard for CORS requests with credentials and
     * this is not supported by our sourceConfig API
     */const xhrRequest=(options,timeout=DEFAULT_XHR_TIMEOUT_MS,logger)=>new Promise((resolve,reject)=>{let payload;if(options.sendRawData===true){payload=options.data;}else {payload=stringifyWithoutCircular(options.data,false,[],logger);if(isNull(payload)){reject({error:new Error(XHR_PAYLOAD_PREP_ERROR),undefined,options});// return and don't process further if the payload could not be stringified
    return;}}const xhr=new XMLHttpRequest();// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const xhrReject=e=>{reject({error:new Error(XHR_DELIVERY_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,xhr.status,xhr.statusText,options.url,xhr.responseText)),xhr,options});};const xhrError=e=>{reject({error:new Error(XHR_REQUEST_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,e,options.url)),xhr,options});};xhr.ontimeout=xhrError;xhr.onerror=xhrError;xhr.onload=()=>{if(xhr.status>=200&&xhr.status<400){resolve({response:xhr.responseText,xhr,options});}else {xhrReject();}};xhr.open(options.method,options.url,true);if(options.withCredentials===true){xhr.withCredentials=true;}// The timeout property may be set only in the time interval between a call to the open method
    // and the first call to the send method in legacy browsers
    xhr.timeout=timeout;Object.keys(options.headers).forEach(headerName=>{if(options.headers[headerName]){xhr.setRequestHeader(headerName,options.headers[headerName]);}});try{xhr.send(payload);}catch(err){reject({error:getMutatedError(err,XHR_SEND_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,options.url)),xhr,options});}});
    
    /**
     * Service to handle data communication with APIs
     */class HttpClient{constructor(logger){this.logger=logger;this.onError=this.onError.bind(this);}init(errorHandler){this.errorHandler=errorHandler;}/**
       * Implement requests in a blocking way
       */async getData(config){const{url,options,timeout,isRawResponse}=config;try{const data=await xhrRequest(createXhrRequestOptions(url,options,this.basicAuthHeader),timeout,this.logger);return {data:isRawResponse?data.response:responseTextToJson(data.response,this.onError),details:data};}catch(reason){return {data:undefined,details:reason};}}/**
       * Implement requests in a non-blocking way
       */getAsyncData(config){const{callback,url,options,timeout,isRawResponse}=config;const isFireAndForget=!isFunction(callback);xhrRequest(createXhrRequestOptions(url,options,this.basicAuthHeader),timeout,this.logger).then(data=>{if(!isFireAndForget){callback(isRawResponse?data.response:responseTextToJson(data.response,this.onError),data);}}).catch(data=>{if(!isFireAndForget){callback(undefined,data);}});}/**
       * Handle errors
       */onError(error){this.errorHandler?.onError(error,HTTP_CLIENT);}/**
       * Set basic authentication header (eg writekey)
       */setAuthHeader(value,noBtoa=false){const authVal=noBtoa?value:toBase64(`${value}:`);this.basicAuthHeader=`Basic ${authVal}`;}/**
       * Clear basic authentication header
       */resetAuthHeader(){this.basicAuthHeader=undefined;}}const defaultHttpClient=new HttpClient(defaultLogger);
    
    const METRICS_PAYLOAD_VERSION='1';
    
    // Errors from the below scripts are NOT allowed to reach Bugsnag
    const SDK_FILE_NAME_PREFIXES=()=>['rsa'// Prefix for all the SDK scripts including plugins and module federated chunks
    ];const DEV_HOSTS=['www.test-host.com','localhost','127.0.0.1','[::1]'];// List of keys to exclude from the metadata
    // Potential PII or sensitive data
    const APP_STATE_EXCLUDE_KEYS=['userId','userTraits','groupId','groupTraits','anonymousId','config','instance',// destination instance objects
    'eventBuffer',// pre-load event buffer (may contain PII)
    'traits','authToken'];const NOTIFIER_NAME='RudderStack JavaScript SDK';const SDK_GITHUB_URL='__REPOSITORY_URL__';const SOURCE_NAME='js';
    
    const getErrInstance=(err,errorType)=>{switch(errorType){case ErrorType.UNHANDLEDEXCEPTION:{const{error}=err;return error||err;}case ErrorType.UNHANDLEDREJECTION:{return err.reason;}case ErrorType.HANDLEDEXCEPTION:default:return err;}};const createNewBreadcrumb=message=>({type:'manual',name:message,timestamp:new Date(),metaData:{}});const getReleaseStage=()=>{const host=globalThis.location.hostname;return host&&DEV_HOSTS.includes(host)?'development':'production';};const getAppStateForMetadata=state=>{const stateStr=stringifyWithoutCircular(state,false,APP_STATE_EXCLUDE_KEYS);return stateStr!==null?JSON.parse(stateStr):{};};const getURLWithoutQueryString=()=>{const url=globalThis.location.href.split('?');return url[0];};const getUserDetails=(source,session,lifecycle,autoTrack)=>({id:`${source.value?.id??lifecycle.writeKey.value}..${session.sessionInfo.value.id??'NA'}..${autoTrack.pageLifecycle.visitId.value??'NA'}`,name:source.value?.name??'NA'});const getDeviceDetails=(locale,userAgent)=>({locale:locale.value??'NA',userAgent:userAgent.value??'NA',time:new Date()});const getBugsnagErrorEvent=(exception,errorState,state)=>{const{context,lifecycle,session,source,reporting,autoTrack}=state;const{app,locale,userAgent,timezone,screen,library}=context;return {payloadVersion:'5',notifier:{name:NOTIFIER_NAME,version:app.value.version,url:SDK_GITHUB_URL},events:[{exceptions:[clone(exception)],severity:errorState.severity,unhandled:errorState.unhandled,severityReason:errorState.severityReason,app:{version:app.value.version,releaseStage:getReleaseStage(),type:app.value.installType},device:getDeviceDetails(locale,userAgent),request:{url:getURLWithoutQueryString(),clientIp:'[NOT COLLECTED]'},breadcrumbs:clone(reporting.breadcrumbs.value),context:exception.message,metaData:{app:{snippetVersion:library.value.snippetVersion},device:{...screen.value,timezone:timezone.value},// Add rest of the state groups as metadata
    // so that they show up as separate tabs in the dashboard
    ...getAppStateForMetadata(state)},user:getUserDetails(source,session,lifecycle,autoTrack)}]};};/**
     * A function to determine whether the error should be promoted to notify or not
     * @param {Error} exception
     * @returns
     */const isAllowedToBeNotified=exception=>{const errMsg=exception.message;// Filter out plugin load errors from non-RudderStack CDN URLs
    if(PLUGINS_LOAD_FAILURE_MESSAGES.some(regex=>regex.test(errMsg))){return errMsg.includes(SDK_CDN_BASE_URL);}// Filter out integration load errors from non-RudderStack CDN URLs
    if(INTEGRATIONS_LOAD_FAILURE_MESSAGES.some(regex=>regex.test(errMsg))){return errMsg.includes(SDK_CDN_BASE_URL);}return !ERROR_MESSAGES_TO_BE_FILTERED.some(e=>e.test(errMsg));};/**
     * A function to determine if the error is from Rudder SDK
     * @param {Error} exception
     * @returns
     */const isSDKError=exception=>{const errorOrigin=exception.stacktrace[0]?.file;if(!errorOrigin||typeof errorOrigin!=='string'){return false;}const srcFileName=errorOrigin.substring(errorOrigin.lastIndexOf('/')+1);const paths=errorOrigin.split('/');// extract the parent folder name from the error origin file path
    // Ex: parentFolderName will be 'sample' for url: https://example.com/sample/file.min.js
    const parentFolderName=paths[paths.length-2];return parentFolderName===CDN_INT_DIR||SDK_FILE_NAME_PREFIXES().some(prefix=>srcFileName.startsWith(prefix)&&srcFileName.endsWith('.js'));};const getErrorDeliveryPayload=(payload,state)=>{const data={version:METRICS_PAYLOAD_VERSION,message_id:generateUUID(),source:{name:SOURCE_NAME,sdk_version:state.context.app.value.version,write_key:state.lifecycle.writeKey.value,install_type:state.context.app.value.installType},errors:payload};return stringifyWithoutCircular(data);};
    
    /**
     * A service to handle errors
     */class ErrorHandler{initialized=false;// If no logger is passed errors will be thrown as unhandled error
    constructor(httpClient,logger){this.httpClient=httpClient;this.logger=logger;}/**
       * Initializes the error handler by attaching global error listeners.
       * This method should be called once after construction.
       */init(){if(this.initialized){return;}this.attachErrorListeners();this.initialized=true;}/**
       * Attach error listeners to the global window object
       */attachErrorListeners(){globalThis.addEventListener('error',event=>{this.onError(event,ERROR_HANDLER,undefined,ErrorType.UNHANDLEDEXCEPTION);});globalThis.addEventListener('unhandledrejection',event=>{this.onError(event,ERROR_HANDLER,undefined,ErrorType.UNHANDLEDREJECTION);});}/**
       * Handle errors
       * @param error - The error to handle
       * @param context - The context of where the error occurred
       * @param customMessage - The custom message of the error
       * @param errorType - The type of the error (handled or unhandled)
       */onError(error,context='',customMessage='',errorType=ErrorType.HANDLEDEXCEPTION){try{const errInstance=getErrInstance(error,errorType);const normalizedError=normalizeError(errInstance,this.logger);if(isUndefined(normalizedError)){return;}const customMsgVal=customMessage?`${customMessage} - `:'';const errorMsgPrefix=`${context}${LOG_CONTEXT_SEPARATOR}${customMsgVal}`;const bsException=createBugsnagException(normalizedError,errorMsgPrefix);const stacktrace=getStacktrace(normalizedError);const isSdkDispatched=stacktrace.includes(MANUAL_ERROR_IDENTIFIER);// Filter errors that are not originated in the SDK.
    // In case of NPM installations, the unhandled errors from the SDK cannot be identified
    // and will NOT be reported unless they occur in plugins or integrations.
    if(!isSdkDispatched&&!isSDKError(bsException)&&errorType!==ErrorType.HANDLEDEXCEPTION){return;}if(state.reporting.isErrorReportingEnabled.value&&isAllowedToBeNotified(bsException)){const errorState={severity:'error',unhandled:errorType!==ErrorType.HANDLEDEXCEPTION,severityReason:{type:errorType}};// enrich error payload
    const bugsnagPayload=getBugsnagErrorEvent(bsException,errorState,state);// send it to metrics service
    this.httpClient.getAsyncData({url:state.metrics.metricsServiceUrl.value,options:{method:'POST',data:getErrorDeliveryPayload(bugsnagPayload,state),sendRawData:true},isRawResponse:true});}// Log handled errors and errors dispatched by the SDK
    if(errorType===ErrorType.HANDLEDEXCEPTION||isSdkDispatched){this.logger.error(bsException.message);}}catch(err){// If an error occurs while handling an error, log it
    this.logger.error(HANDLE_ERROR_FAILURE(ERROR_HANDLER),err);}}/**
       * Add breadcrumbs to add insight of a user's journey before an error
       * occurred and send to external error monitoring service via a plugin
       *
       * @param {string} breadcrumb breadcrumbs message
       */leaveBreadcrumb(breadcrumb){try{state.reporting.breadcrumbs.value=[...state.reporting.breadcrumbs.value,createNewBreadcrumb(breadcrumb)];}catch(err){this.onError(err,BREADCRUMB_ERROR(ERROR_HANDLER));}}}// Note: Remember to call defaultErrorHandler.init() before using it
    const defaultErrorHandler=new ErrorHandler(defaultHttpClient,defaultLogger);
    
    //  to next or return the value if it is the last one instead of an array per
    //  plugin that is the normal invoke
    // TODO: add invoke method for extension point that we know only one plugin can be used. add invokeMultiple and invokeSingle methods
    class PluginEngine{plugins=[];byName={};cache={};config={throws:true};constructor(logger,options={}){this.config={throws:true,...options};this.logger=logger;}register(plugin,state){if(!plugin.name){const errorMessage=PLUGIN_NAME_MISSING_ERROR(PLUGIN_ENGINE);if(this.config.throws){throw new Error(errorMessage);}else {this.logger.error(errorMessage,plugin);return;}}if(this.byName[plugin.name]){const errorMessage=PLUGIN_ALREADY_EXISTS_ERROR(PLUGIN_ENGINE,plugin.name);if(this.config.throws){throw new Error(errorMessage);}else {this.logger.error(errorMessage);return;}}this.cache={};this.plugins=this.plugins.slice();let pos=this.plugins.length;this.plugins.forEach((pluginItem,index)=>{if(pluginItem.deps?.includes(plugin.name)){pos=Math.min(pos,index);}});this.plugins.splice(pos,0,plugin);this.byName[plugin.name]=plugin;if(isFunction(plugin.initialize)){plugin.initialize(state);}}unregister(name){const plugin=this.byName[name];if(!plugin){const errorMessage=PLUGIN_NOT_FOUND_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(errorMessage);}else {this.logger.error(errorMessage);return;}}const index=this.plugins.indexOf(plugin);if(index===-1){const errorMessage=PLUGIN_ENGINE_BUG_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(errorMessage);}else {this.logger.error(errorMessage);return;}}this.cache={};delete this.byName[name];this.plugins=this.plugins.slice();this.plugins.splice(index,1);}getPlugin(name){return this.byName[name];}getPlugins(extPoint){const lifeCycleName=extPoint??'.';if(!this.cache[lifeCycleName]){this.cache[lifeCycleName]=this.plugins.filter(plugin=>{if(plugin.deps?.some(dependency=>!this.byName[dependency])){// If deps not exist, then not load it.
    const notExistDeps=plugin.deps.filter(dependency=>!this.byName[dependency]);this.logger.error(PLUGIN_DEPS_ERROR(PLUGIN_ENGINE,plugin.name,notExistDeps));return false;}return lifeCycleName==='.'?true:hasValueByPath(plugin,lifeCycleName);});}return this.cache[lifeCycleName];}// This method allows to process this.plugins so that it could
    // do some unified pre-process before application starts.
    processRawPlugins(callback){callback(this.plugins);this.cache={};}invoke(extPoint,allowMultiple=true,...args){let extensionPointName=extPoint;if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_MISSING_ERROR);}const noCall=extensionPointName.startsWith('!');const throws=this.config.throws??extensionPointName.endsWith('!');// eslint-disable-next-line unicorn/better-regex
    extensionPointName=extensionPointName.replace(/(^!|!$)/g,'');if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_INVALID_ERROR);}const extensionPointNameParts=extensionPointName.split('.');extensionPointNameParts.pop();const pluginMethodPath=extensionPointNameParts.join('.');const pluginsToInvoke=allowMultiple?this.getPlugins(extensionPointName):[this.getPlugins(extensionPointName)[0]];return pluginsToInvoke.map(plugin=>{const method=getValueByPath(plugin,extensionPointName);if(!isFunction(method)||noCall){return method;}try{return method.apply(getValueByPath(plugin,pluginMethodPath),args);}catch(err){// When a plugin failed, doesn't break the app
    if(throws){throw err;}else {this.logger.error(PLUGIN_INVOCATION_ERROR(PLUGIN_ENGINE,extensionPointName,plugin.name),err);}}return null;});}invokeSingle(extPoint,...args){return this.invoke(extPoint,false,...args)[0];}invokeMultiple(extPoint,...args){return this.invoke(extPoint,true,...args);}}const defaultPluginEngine=new PluginEngine(defaultLogger,{throws:true});
    
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
     */const pluginNamesList=['BeaconQueue','CustomConsentManager','DeviceModeDestinations','DeviceModeTransformation','ExternalAnonymousId','GoogleLinker','IubendaConsentManager','KetchConsentManager','NativeDestinationQueue','OneTrustConsentManager','StorageEncryption','StorageEncryptionLegacy','StorageMigrator','XhrQueue'];const deprecatedPluginsList=['Bugsnag','ErrorReporting'];
    
    const remotesMap = {
    'rudderAnalyticsRemotePlugins':{url:()=>Promise.resolve(window.RudderStackGlobals && window.RudderStackGlobals.app && window.RudderStackGlobals.app.pluginsCDNPath ? `${window.RudderStackGlobals.app.pluginsCDNPath}/rsa-plugins.js` : `https://cdn.rudderlabs.com/v3/modern/plugins//rsa-plugins.js`),format:'esm',from:'vite'}
    };
                    
                    function merge(obj1, obj2) {
                      const mergedObj = Object.assign(obj1, obj2);
                      for (const key of Object.keys(mergedObj)) {
                        if (typeof mergedObj[key] === 'object' && typeof obj2[key] === 'object') {
                          mergedObj[key] = merge(mergedObj[key], obj2[key]);
                        }
                      }
                      return mergedObj;
                    }
    
                    const wrapShareModule = remoteFrom => {
                      return merge({
                        
                      }, (globalThis.__federation_shared__ || {})['default'] || {});
                    };
    
                    async function __federation_method_ensure(remoteId) {
                        const remote = remotesMap[remoteId];
                        if (!remote.inited) {
                            if (['esm', 'systemjs'].includes(remote.format)) {
                                // loading js with import(...)
                                return new Promise((resolve, reject) => {
                                    const getUrl = typeof remote.url === 'function' ? remote.url : () => Promise.resolve(remote.url);
                                    getUrl().then(url => {
                                        import(/* webpackIgnore: true */ /* @vite-ignore */ url).then(lib => {
                                            if (!remote.inited) {
                                                const shareScope = wrapShareModule();
                                                lib.init(shareScope);
                                                remote.lib = lib;
                                                remote.lib.init(shareScope);
                                                remote.inited = true;
                                            }
                                            resolve(remote.lib);
                                        }).catch(reject);
                                    });
                                })
                            }
                        } else {
                            return remote.lib;
                        }
                    }
    
                    function __federation_method_wrapDefault(module, need) {
                        if (!module?.default && need) {
                            let obj = Object.create(null);
                            obj.default = module;
                            obj.__esModule = true;
                            return obj;
                        }
                        return module;
                    }
    
                    function __federation_method_getRemote(remoteName, componentName) {
                        return __federation_method_ensure(remoteName).then((remote) => remote.get(componentName).then(factory => factory()));
                    }
    
    /**
     * Get the lazy loaded dynamic import for a plugin name
     */const getFederatedModuleImport=pluginName=>{switch(pluginName){case 'BeaconQueue':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./BeaconQueue").then(module=>__federation_method_wrapDefault(module, true));case 'CustomConsentManager':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./CustomConsentManager").then(module=>__federation_method_wrapDefault(module, true));case 'DeviceModeDestinations':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./DeviceModeDestinations").then(module=>__federation_method_wrapDefault(module, true));case 'DeviceModeTransformation':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./DeviceModeTransformation").then(module=>__federation_method_wrapDefault(module, true));case 'ExternalAnonymousId':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./ExternalAnonymousId").then(module=>__federation_method_wrapDefault(module, true));case 'GoogleLinker':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./GoogleLinker").then(module=>__federation_method_wrapDefault(module, true));case 'KetchConsentManager':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./KetchConsentManager").then(module=>__federation_method_wrapDefault(module, true));case 'IubendaConsentManager':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./IubendaConsentManager").then(module=>__federation_method_wrapDefault(module, true));case 'NativeDestinationQueue':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./NativeDestinationQueue").then(module=>__federation_method_wrapDefault(module, true));case 'OneTrustConsentManager':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./OneTrustConsentManager").then(module=>__federation_method_wrapDefault(module, true));case 'StorageEncryption':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./StorageEncryption").then(module=>__federation_method_wrapDefault(module, true));case 'StorageEncryptionLegacy':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./StorageEncryptionLegacy").then(module=>__federation_method_wrapDefault(module, true));case 'StorageMigrator':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./StorageMigrator").then(module=>__federation_method_wrapDefault(module, true));case 'XhrQueue':return ()=>__federation_method_getRemote("rudderAnalyticsRemotePlugins" , "./XhrQueue").then(module=>__federation_method_wrapDefault(module, true));default:return undefined;}};/**
     * Map of active plugin names to their dynamic import
     */const federatedModulesBuildPluginImports=activePluginNames=>{const remotePlugins={};activePluginNames.forEach(pluginName=>{if(pluginNamesList.includes(pluginName)){const lazyLoadImport=getFederatedModuleImport(pluginName);if(lazyLoadImport){remotePlugins[pluginName]=lazyLoadImport;}}});return remotePlugins;};
    
    /**
     * Map of mandatory plugin names and direct imports
     */const getMandatoryPluginsMap=()=>({});/**
     * Map of optional plugin names and direct imports for legacy builds
     */const getOptionalPluginsMap=()=>{{return {};}};/**
     * Map of optional plugin names and dynamic imports for modern builds
     */const getRemotePluginsMap=activePluginNames=>{return federatedModulesBuildPluginImports?.(activePluginNames)||{};};const pluginsInventory={...getMandatoryPluginsMap(),...getOptionalPluginsMap()};const remotePluginsInventory=activePluginNames=>({...getRemotePluginsMap(activePluginNames)});
    
    // TODO: add retry mechanism for getting remote plugins
    // TODO: add timeout error mechanism for marking remote plugins that failed to load as failed in state
    class PluginsManager{constructor(engine,errorHandler,logger){this.engine=engine;this.errorHandler=errorHandler;this.logger=logger;this.onError=this.onError.bind(this);}/**
       * Orchestrate the plugin loading and registering
       */init(){state.lifecycle.status.value='pluginsLoading';// Expose pluginsCDNPath to global object, so it can be used in the promise that determines
    // remote plugin cdn path to support proxied plugin remotes
    {setExposedGlobal('pluginsCDNPath',state.lifecycle.pluginsCDNPath.value);}this.setActivePlugins();this.registerLocalPlugins();this.registerRemotePlugins();this.attachEffects();}/**
       * Update state based on plugin loaded status
       */// eslint-disable-next-line class-methods-use-this
    attachEffects(){E(()=>{const isAllPluginsReady=state.plugins.activePlugins.value.length===0||state.plugins.loadedPlugins.value.length+state.plugins.failedPlugins.value.length===state.plugins.totalPluginsToLoad.value;if(isAllPluginsReady){r(()=>{state.plugins.ready.value=true;// TODO: decide what to do if a plugin fails to load for any reason.
    //  Should we stop here or should we progress?
    state.lifecycle.status.value='pluginsReady';});}});}/**
       * Determine the list of plugins that should be loaded based on sourceConfig & load options
       */// eslint-disable-next-line class-methods-use-this
    getPluginsToLoadBasedOnConfig(){// This contains the default plugins if load option has been omitted by user
    let pluginsToLoadFromConfig=state.plugins.pluginsToLoadFromConfig.value;if(!pluginsToLoadFromConfig){return [];}// Filter deprecated plugins
    pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(pluginName=>{if(deprecatedPluginsList.includes(pluginName)){this.logger.warn(DEPRECATED_PLUGIN_WARNING(PLUGINS_MANAGER,pluginName));return false;}return true;});const pluginGroupsToProcess=[{configurationStatus:()=>isDefined(state.dataPlaneEvents.eventsQueuePluginName.value),configurationStatusStr:'Data plane events delivery is enabled',activePluginName:state.dataPlaneEvents.eventsQueuePluginName.value,supportedPlugins:Object.values(DataPlaneEventsTransportToPluginNameMap),shouldAddMissingPlugins:true},{configurationStatus:()=>getNonCloudDestinations(state.nativeDestinations.configuredDestinations.value).length>0,configurationStatusStr:'Device mode destinations are connected to the source',supportedPlugins:['DeviceModeDestinations','NativeDestinationQueue']},{configurationStatus:()=>getNonCloudDestinations(state.nativeDestinations.configuredDestinations.value).some(destination=>destination.shouldApplyDeviceModeTransformation),configurationStatusStr:'Device mode transformations are enabled for at least one destination',supportedPlugins:['DeviceModeTransformation']},{configurationStatus:()=>isDefined(state.consents.activeConsentManagerPluginName.value),configurationStatusStr:'Consent management is enabled',activePluginName:state.consents.activeConsentManagerPluginName.value,supportedPlugins:Object.values(ConsentManagersToPluginNameMap)},{configurationStatus:()=>isDefined(state.storage.encryptionPluginName.value),configurationStatusStr:'Storage encryption is enabled',activePluginName:state.storage.encryptionPluginName.value,supportedPlugins:Object.values(StorageEncryptionVersionsToPluginNameMap)},{configurationStatus:()=>state.storage.migrate.value,configurationStatusStr:'Storage migration is enabled',supportedPlugins:['StorageMigrator']}];const addMissingPlugins=false;pluginGroupsToProcess.forEach(group=>{if(group.configurationStatus()){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(group.activePluginName?pluginName=>!(pluginName!==group.activePluginName&&group.supportedPlugins.includes(pluginName)):pluginName=>isDefined(pluginName)// pass through
    );this.addMissingPlugins(group,addMissingPlugins,pluginsToLoadFromConfig);}else {pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(group.basePlugins!==undefined?pluginName=>!(group.basePlugins.includes(pluginName)||group.supportedPlugins.includes(pluginName)):pluginName=>!group.supportedPlugins.includes(pluginName));}});return [...Object.keys(getMandatoryPluginsMap()),...pluginsToLoadFromConfig];}addMissingPlugins(group,addMissingPlugins,pluginsToLoadFromConfig){const shouldAddMissingPlugins=group.shouldAddMissingPlugins||addMissingPlugins;let pluginsToConfigure;if(group.activePluginName){pluginsToConfigure=[...(group.basePlugins||[]),group.activePluginName];}else {pluginsToConfigure=[...group.supportedPlugins];}const missingPlugins=pluginsToConfigure.filter(pluginName=>!pluginsToLoadFromConfig.includes(pluginName));if(missingPlugins.length>0){if(shouldAddMissingPlugins){pluginsToLoadFromConfig.push(...missingPlugins);}this.logger.warn(generateMisconfiguredPluginsWarning(PLUGINS_MANAGER,group.configurationStatusStr,missingPlugins,shouldAddMissingPlugins));}}/**
       * Determine the list of plugins that should be activated
       */setActivePlugins(){const pluginsToLoad=this.getPluginsToLoadBasedOnConfig();// Merging available mandatory and optional plugin name list
    const availablePlugins=[...Object.keys(pluginsInventory),...pluginNamesList];const activePlugins=[];const failedPlugins=[];pluginsToLoad.forEach(pluginName=>{if(availablePlugins.includes(pluginName)){activePlugins.push(pluginName);}else {failedPlugins.push(pluginName);}});if(failedPlugins.length>0){this.logger.warn(UNKNOWN_PLUGINS_WARNING(PLUGINS_MANAGER,failedPlugins));}r(()=>{state.plugins.totalPluginsToLoad.value=pluginsToLoad.length;state.plugins.activePlugins.value=activePlugins;state.plugins.failedPlugins.value=failedPlugins;});}/**
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
       */onError(error,customMessage){this.errorHandler.onError(error,PLUGINS_MANAGER,customMessage);}}
    
    const COOKIE_STORAGE='cookieStorage';const LOCAL_STORAGE='localStorage';const SESSION_STORAGE='sessionStorage';const MEMORY_STORAGE='memoryStorage';const NO_STORAGE='none';
    
    const userIdKey='rl_user_id';const userTraitsKey='rl_trait';const anonymousUserIdKey='rl_anonymous_id';const groupIdKey='rl_group_id';const groupTraitsKey='rl_group_trait';const pageInitialReferrerKey='rl_page_init_referrer';const pageInitialReferringDomainKey='rl_page_init_referring_domain';const sessionInfoKey='rl_session';const authTokenKey='rl_auth_token';const COOKIE_KEYS={userId:userIdKey,userTraits:userTraitsKey,anonymousId:anonymousUserIdKey,groupId:groupIdKey,groupTraits:groupTraitsKey,initialReferrer:pageInitialReferrerKey,initialReferringDomain:pageInitialReferringDomainKey,sessionInfo:sessionInfoKey,authToken:authTokenKey};
    
    const STORAGE_TEST_COOKIE='test_rudder_cookie';const STORAGE_TEST_LOCAL_STORAGE='test_rudder_ls';const STORAGE_TEST_SESSION_STORAGE='test_rudder_ss';const STORAGE_TEST_TOP_LEVEL_DOMAIN='__tld__';const CLIENT_DATA_STORE_COOKIE='clientDataInCookie';const CLIENT_DATA_STORE_LS='clientDataInLocalStorage';const CLIENT_DATA_STORE_MEMORY='clientDataInMemory';const CLIENT_DATA_STORE_SESSION='clientDataInSessionStorage';const USER_SESSION_KEYS=['userId','userTraits','anonymousId','groupId','groupTraits','initialReferrer','initialReferringDomain','sessionInfo','authToken'];
    
    const storageClientDataStoreNameMap={[COOKIE_STORAGE]:CLIENT_DATA_STORE_COOKIE,[LOCAL_STORAGE]:CLIENT_DATA_STORE_LS,[MEMORY_STORAGE]:CLIENT_DATA_STORE_MEMORY,[SESSION_STORAGE]:CLIENT_DATA_STORE_SESSION};
    
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
     */const set=(name,value,optionsConfig,logger)=>{const options={...(optionsConfig||{})};let cookieString=`${encode(name,logger)}=${encode(value,logger)}`;if(isNull(value)){options.maxage=-1;}if(options.maxage){options.expires=new Date(+new Date()+options.maxage);}if(options.path){cookieString+=`; path=${options.path}`;}if(options.domain){cookieString+=`; domain=${options.domain}`;}if(options.expires){cookieString+=`; expires=${options.expires.toUTCString()}`;}if(options.samesite){cookieString+=`; samesite=${options.samesite}`;}if(options.secure){cookieString+=`; secure`;}globalThis.document.cookie=cookieString;};/**
     * Return all cookies
     */const all=()=>{const cookieStringValue=globalThis.document.cookie;return parse(cookieStringValue);};/**
     * Get cookie `name`
     */const get=name=>all()[name];/**
     * Set or get cookie `name` with `value` and `options` object
     */// eslint-disable-next-line func-names
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
    
    const getDefaultCookieOptions=()=>{const topDomain=`.${domain(globalThis.location.href)}`;return {maxage:DEFAULT_COOKIE_MAX_AGE_MS,path:'/',domain:!topDomain||topDomain==='.'?undefined:topDomain,samesite:'Lax',enabled:true};};const getDefaultLocalStorageOptions=()=>({enabled:true});const getDefaultSessionStorageOptions=()=>({enabled:true});const getDefaultInMemoryStorageOptions=()=>({enabled:true});
    
    /**
     * A storage utility to retain values in memory via Storage interface
     */class InMemoryStorage{isEnabled=true;length=0;data={};constructor(logger){this.options=getDefaultInMemoryStorageOptions();this.logger=logger;}configure(options){this.options=mergeDeepRight(this.options,options??{});this.isEnabled=Boolean(this.options.enabled);return this.options;}setItem(key,value){this.data[key]=value;this.length=Object.keys(this.data).length;return value;}getItem(key){if(key in this.data){return this.data[key];}return null;}removeItem(key){if(key in this.data){delete this.data[key];}this.length=Object.keys(this.data).length;return null;}clear(){this.data={};this.length=0;}key(index){const curKeys=this.keys();return curKeys[index]??null;}keys(){return Object.keys(this.data);}}const defaultInMemoryStorage=new InMemoryStorage(defaultLogger);
    
    var store$2 = {exports: {}};
    
    var store$1=store$2.exports;var hasRequiredStore;function requireStore(){if(hasRequiredStore)return store$2.exports;hasRequiredStore=1;(function(module,exports){(function(global,factory){module.exports=factory();})(store$1,function(){function isJSON(obj){obj=JSON.stringify(obj);if(!/^\{[\s\S]*\}$/.test(obj)){return false;}return true;}function stringify(val){return val===undefined||typeof val==="function"?val+'':JSON.stringify(val);}function deserialize(value){if(typeof value!=='string'){return undefined;}try{return JSON.parse(value);}catch(e){return value;}}function isFunction(value){return {}.toString.call(value)==="[object Function]";}function isArray(value){return Object.prototype.toString.call(value)==="[object Array]";}// https://github.com/jaywcjlove/store.js/pull/8
    // Error: QuotaExceededError
    function dealIncognito(storage){var _KEY='_Is_Incognit',_VALUE='yes';try{// NOTE: set default storage when not passed in
    if(!storage){storage=window.localStorage;}storage.setItem(_KEY,_VALUE);storage.removeItem(_KEY);}catch(e){var inMemoryStorage={};inMemoryStorage._data={};inMemoryStorage.setItem=function(id,val){return inMemoryStorage._data[id]=String(val);};inMemoryStorage.getItem=function(id){return inMemoryStorage._data.hasOwnProperty(id)?inMemoryStorage._data[id]:undefined;};inMemoryStorage.removeItem=function(id){return delete inMemoryStorage._data[id];};inMemoryStorage.clear=function(){return inMemoryStorage._data={};};storage=inMemoryStorage;}finally{if(storage.getItem(_KEY)===_VALUE)storage.removeItem(_KEY);}return storage;}// deal QuotaExceededError if user use incognito mode in browser
    var storage=dealIncognito();function Store(){if(!(this instanceof Store)){return new Store();}}Store.prototype={set:function set(key,val){if(key&&!isJSON(key)){storage.setItem(key,stringify(val));}else if(isJSON(key)){for(var a in key)this.set(a,key[a]);}return this;},get:function get(key){// Return all entries if no key
    if(key===undefined){var ret={};this.forEach(function(key,val){return ret[key]=val;});return ret;}if(key.charAt(0)==='?'){return this.has(key.substr(1));}var args=arguments;if(args.length>1){var dt={};for(var i=0,len=args.length;i<len;i++){var value=deserialize(storage.getItem(args[i]));if(this.has(args[i])){dt[args[i]]=value;}}return dt;}return deserialize(storage.getItem(key));},clear:function clear(){storage.clear();return this;},remove:function remove(key){var val=this.get(key);storage.removeItem(key);return val;},has:function has(key){return {}.hasOwnProperty.call(this.get(),key);},keys:function keys(){var d=[];this.forEach(function(k){d.push(k);});return d;},forEach:function forEach(callback){for(var i=0,len=storage.length;i<len;i++){var key=storage.key(i);callback(key,this.get(key));}return this;},search:function search(str){var arr=this.keys(),dt={};for(var i=0,len=arr.length;i<len;i++){if(arr[i].indexOf(str)>-1)dt[arr[i]]=this.get(arr[i]);}return dt;},len:function len(){return storage.length;}};var _Store=null;function store(key,data){var argm=arguments;var dt=null;if(!_Store)_Store=Store();if(argm.length===0)return _Store.get();if(argm.length===1){if(typeof key==="string")return _Store.get(key);if(isJSON(key))return _Store.set(key);}if(argm.length===2&&typeof key==="string"){if(!data)return _Store.remove(key);if(data&&typeof data==="string")return _Store.set(key,data);if(data&&isFunction(data)){dt=null;dt=data(key,_Store.get(key));store.set(key,dt);}}if(argm.length===2&&isArray(key)&&isFunction(data)){for(var i=0,len=key.length;i<len;i++){dt=data(key[i],_Store.get(key[i]));store.set(key[i],dt);}}return store;}for(var a in Store.prototype)store[a]=Store.prototype[a];return store;});})(store$2);return store$2.exports;}
    
    var storeExports = requireStore();
    const store = /*@__PURE__*/getDefaultExportFromCjs(storeExports);
    
    const detectAdBlockers=httpClient=>{// Apparently, '?view=ad' is a query param that is blocked by majority of adblockers
    // Use source config URL here as it is very unlikely to be blocked by adblockers
    // Only the extra query param should make it vulnerable to adblockers
    // This will work even if the users proxies it.
    // The edge case where this doesn't work is when HEAD method is not allowed by the server (user's)
    const baseUrl=new URL(state.lifecycle.sourceConfigUrl.value);const url=`${baseUrl.origin}${baseUrl.pathname}?view=ad`;httpClient.getAsyncData({url,options:{// We actually don't need the response from the request, so we are using HEAD
    method:'HEAD',headers:{'Content-Type':undefined}},isRawResponse:true,callback:(result,details)=>{// not ad blocked if the request is successful or it is not internally redirected on the client side
    // Often adblockers instead of blocking the request, they redirect it to an internal URL
    state.capabilities.isAdBlocked.value=details?.error!==undefined||details?.xhr?.responseURL!==url;}});};
    
    const hasCrypto=()=>!isNullOrUndefined(globalThis.crypto)&&isFunction(globalThis.crypto.getRandomValues);// eslint-disable-next-line compat/compat -- We are checking for the existence of navigator.userAgentData
    const hasUAClientHints=()=>!isNullOrUndefined(globalThis.navigator.userAgentData);const hasBeacon=()=>!isNullOrUndefined(globalThis.navigator.sendBeacon)&&isFunction(globalThis.navigator.sendBeacon);const isIE11=()=>Boolean(globalThis.navigator.userAgent.match(/Trident.*rv:11\./));
    
    const getUserAgentClientHint=(callback,level='none')=>{if(level==='none'){callback(undefined);}if(level==='default'){callback(navigator.userAgentData);}if(level==='full'){navigator.userAgentData?.getHighEntropyValues(['architecture','bitness','brands','mobile','model','platform','platformVersion','uaFullVersion','fullVersionList','wow64']).then(ua=>{callback(ua);}).catch(()=>{callback();});}};
    
    const isDatasetAvailable=()=>{const testElement=globalThis.document.createElement('div');testElement.setAttribute('data-a-b','c');return testElement.dataset?testElement.dataset.aB==='c':false;};const legacyJSEngineRequiredPolyfills={// Ideally, we should separate the checks for URL and URLSearchParams but
    // the polyfill service serves them under the same feature name, "URL".
    URL:()=>!isFunction(globalThis.URL)||!isFunction(globalThis.URLSearchParams),Promise:()=>!isFunction(globalThis.Promise),'Number.isNaN':()=>!isFunction(globalThis.Number.isNaN),'Number.isInteger':()=>!isFunction(globalThis.Number.isInteger),'Array.from':()=>!isFunction(globalThis.Array.from),'Array.prototype.find':()=>!isFunction(globalThis.Array.prototype.find),'Array.prototype.includes':()=>!isFunction(globalThis.Array.prototype.includes),'String.prototype.endsWith':()=>!isFunction(globalThis.String.prototype.endsWith),'String.prototype.startsWith':()=>!isFunction(globalThis.String.prototype.startsWith),'String.prototype.includes':()=>!isFunction(globalThis.String.prototype.includes),'String.prototype.replaceAll':()=>!isFunction(globalThis.String.prototype.replaceAll),'String.fromCodePoint':()=>!isFunction(globalThis.String.fromCodePoint),'Object.entries':()=>!isFunction(globalThis.Object.entries),'Object.values':()=>!isFunction(globalThis.Object.values),'Object.assign':()=>!isFunction(globalThis.Object.assign),'Object.fromEntries':()=>!isFunction(globalThis.Object.fromEntries),'Element.prototype.dataset':()=>!isDatasetAvailable(),// Ideally, we should separate the checks for TextEncoder and TextDecoder but
    // the polyfill service serves them under the same feature name, "TextEncoder".
    TextEncoder:()=>!isFunction(globalThis.TextEncoder)||!isFunction(globalThis.TextDecoder),requestAnimationFrame:()=>!isFunction(globalThis.requestAnimationFrame)||!isFunction(globalThis.cancelAnimationFrame),CustomEvent:()=>!isFunction(globalThis.CustomEvent),'navigator.sendBeacon':()=>!isFunction(globalThis.navigator.sendBeacon),// Note, the polyfill service serves both ArrayBuffer and Uint8Array under the same feature name, "ArrayBuffer".
    ArrayBuffer:()=>!isFunction(globalThis.Uint8Array),Set:()=>!isFunction(globalThis.Set),atob:()=>!isFunction(globalThis.atob)};const isLegacyJSEngine=()=>{const requiredCapabilitiesList=Object.keys(legacyJSEngineRequiredPolyfills);let needsPolyfill=false;/* eslint-disable-next-line unicorn/no-for-loop */for(let i=0;i<requiredCapabilitiesList.length;i++){const isCapabilityMissing=legacyJSEngineRequiredPolyfills[requiredCapabilitiesList[i]];if(isFunction(isCapabilityMissing)&&isCapabilityMissing()){needsPolyfill=true;break;}}return needsPolyfill;};
    
    const getScreenDetails=()=>{let screenDetails={density:0,width:0,height:0,innerWidth:0,innerHeight:0};screenDetails={width:globalThis.screen.width,height:globalThis.screen.height,density:globalThis.devicePixelRatio,innerWidth:globalThis.innerWidth,innerHeight:globalThis.innerHeight};return screenDetails;};
    
    const isStorageQuotaExceeded=e=>{const matchingNames=['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED'];// [everything except Firefox, Firefox]
    const matchingCodes=[22,1014];// [everything except Firefox, Firefox]
    const isQuotaExceededError=matchingNames.includes(e.name)||matchingCodes.includes(e.code);return e instanceof DOMException&&isQuotaExceededError;};// TODO: also check for SecurityErrors
    //  https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions
    const isStorageAvailable=(type=LOCAL_STORAGE,storageInstance,logger)=>{let storage;let testData;const msgPrefix=STORAGE_UNAVAILABILITY_ERROR_PREFIX(CAPABILITIES_MANAGER,type);let reason='unavailable';let isAccessible=true;let errObj;try{switch(type){case MEMORY_STORAGE:return true;case COOKIE_STORAGE:storage=storageInstance;testData=STORAGE_TEST_COOKIE;break;case LOCAL_STORAGE:storage=storageInstance??globalThis.localStorage;testData=STORAGE_TEST_LOCAL_STORAGE;// was STORAGE_TEST_LOCAL_STORAGE in ours and generateUUID() in segment retry one
    break;case SESSION_STORAGE:storage=storageInstance??globalThis.sessionStorage;testData=STORAGE_TEST_SESSION_STORAGE;break;default:return false;}if(storage){storage.setItem(testData,'true');if(storage.getItem(testData)){storage.removeItem(testData);return true;}}isAccessible=false;}catch(err){isAccessible=false;errObj=err;if(isStorageQuotaExceeded(err)){reason='full';}}if(!isAccessible){logger?.warn(`${msgPrefix}${reason}.`,errObj);}// if we've have reached here, it means the storage is not available
    return false;};
    
    //  check if the get, set overloads and search methods are used at all
    //  if we do, ensure we provide types to support overloads as per storejs docs
    //  https://www.npmjs.com/package/storejs
    /**
     * A storage utility to persist values in localstorage via Storage interface
     */class LocalStorage{isSupportAvailable=true;isEnabled=true;length=0;constructor(logger){this.options=getDefaultLocalStorageOptions();this.logger=logger;}configure(options){this.options=mergeDeepRight(this.options,options??{});this.isSupportAvailable=isStorageAvailable(LOCAL_STORAGE);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}setItem(key,value){store.set(key,value);this.length=store.len();}// eslint-disable-next-line class-methods-use-this
    getItem(key){const value=store.get(key);return isUndefined(value)?null:value;}removeItem(key){store.remove(key);this.length=store.len();}clear(){store.clear();this.length=0;}key(index){const curKeys=this.keys();return curKeys[index]??null;}// eslint-disable-next-line class-methods-use-this
    keys(){return store.keys();}}const defaultLocalStorage=new LocalStorage(defaultLogger);
    
    /**
     * A storage utility to persist values in SessionStorage via Storage interface
     */class SessionStorage{isSupportAvailable=true;isEnabled=true;length=0;constructor(logger){this.options=getDefaultSessionStorageOptions();this.logger=logger;}configure(options){this.options=mergeDeepRight(this.options,options??{});this.isSupportAvailable=isStorageAvailable(SESSION_STORAGE);// when storage is blocked by the user, even accessing the property throws an error
    if(this.isSupportAvailable){this.store=globalThis.sessionStorage;}this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}setItem(key,value){if(!this.store){return;}this.store.setItem(key,value);this.length=this.store.length;}getItem(key){if(!this.store){return null;}const value=this.store.getItem(key);return isUndefined(value)?null:value;}removeItem(key){if(!this.store){return;}this.store.removeItem(key);this.length=this.store.length;}clear(){this.store?.clear();this.length=0;}key(index){return this.store?.key(index)??null;}keys(){const keys=[];if(!this.store){return keys;}for(let i=0;i<this.store.length;i+=1){const key=this.store.key(i);if(key!==null){keys.push(key);}}return keys;}}const defaultSessionStorage=new SessionStorage(defaultLogger);
    
    /**
     * A storage utility to persist values in cookies via Storage interface
     */class CookieStorage{isSupportAvailable=true;isEnabled=true;length=0;constructor(logger){this.logger=logger;}configure(options){if(!this.options){this.options=getDefaultCookieOptions();}this.options=mergeDeepRight(this.options,options??{});if(this.options.sameDomainCookiesOnly){delete this.options.domain;}this.isSupportAvailable=isStorageAvailable(COOKIE_STORAGE,this);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}setItem(key,value){cookie(key,value,this.options,this.logger);this.length=Object.keys(cookie()).length;return true;}// eslint-disable-next-line class-methods-use-this
    getItem(key){const value=cookie(key);return isUndefined(value)?null:value;}removeItem(key){const result=this.setItem(key,null);this.length=Object.keys(cookie()).length;return result;}// eslint-disable-next-line class-methods-use-this
    clear(){// Not implemented
    // getting a list of all cookie storage keys and remove all values
    // sounds risky to do as it will take on all top domain cookies
    // better to explicitly clear specific ones if needed
    }key(index){const curKeys=this.keys();return curKeys[index]??null;}// eslint-disable-next-line class-methods-use-this
    keys(){return Object.keys(cookie());}}const defaultCookieStorage=new CookieStorage(defaultLogger);
    
    /**
     * A utility to retrieve the storage singleton instance by type
     */const getStorageEngine=type=>{switch(type){case LOCAL_STORAGE:return defaultLocalStorage;case SESSION_STORAGE:return defaultSessionStorage;case MEMORY_STORAGE:return defaultInMemoryStorage;case COOKIE_STORAGE:return defaultCookieStorage;default:return defaultInMemoryStorage;}};/**
     * Configure cookie storage singleton
     */const configureCookieStorageEngine=options=>{const cookieStorageOptions=defaultCookieStorage.configure(options);// Update the state with the final cookie storage options
    state.storage.cookie.value={maxage:cookieStorageOptions.maxage,path:cookieStorageOptions.path,domain:cookieStorageOptions.domain,samesite:cookieStorageOptions.samesite,expires:cookieStorageOptions.expires,secure:cookieStorageOptions.secure};};/**
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
     */class Store{constructor(config,engine,pluginsManager){this.id=config.id;this.name=config.name;this.isEncrypted=config.isEncrypted??false;this.validKeys=config.validKeys??{};this.engine=engine;this.noKeyValidation=Object.keys(this.validKeys).length===0;this.noCompoundKey=config.noCompoundKey;this.originalEngine=this.engine;this.errorHandler=config.errorHandler;this.logger=config.logger;this.pluginsManager=pluginsManager;}/**
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
    this.engine.setItem(validKey,this.encrypt(stringifyWithoutCircular(value,false,[],this.logger)));}catch(err){if(isStorageQuotaExceeded(err)){this.logger.warn(STORAGE_QUOTA_EXCEEDED_WARNING(`Store ${this.id}`));// switch to inMemory engine
    this.swapQueueStoreToInMemoryEngine();// and save it there
    this.set(key,value);}else {this.onError(getMutatedError(err,STORE_DATA_SAVE_ERROR(key)));}}}/**
       * Get by Key.
       */get(key){const validKey=this.createValidKey(key);let decryptedValue;try{if(!validKey){return null;}decryptedValue=this.decrypt(this.engine.getItem(validKey));if(isNullOrUndefined(decryptedValue)){return null;}// storejs that is used in localstorage engine already deserializes json strings but swallows errors
    return JSON.parse(decryptedValue);}catch(err){this.onError(new Error(`${STORE_DATA_FETCH_ERROR(key)}: ${err.message}`));// A hack for warning the users of potential partial SDK version migrations
    if(isString(decryptedValue)&&decryptedValue.startsWith('RudderEncrypt:')){this.logger.warn(BAD_COOKIES_WARNING(key));}return null;}}/**
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
       */onError(error){this.errorHandler.onError(error,`Store ${this.id}`);}}
    
    const getStorageTypeFromPreConsentIfApplicable=(state,sessionKey)=>{let overriddenStorageType;if(state.consents.preConsent.value.enabled){switch(state.consents.preConsent.value.storage?.strategy){case 'none':overriddenStorageType=NO_STORAGE;break;case 'session':if(sessionKey!=='sessionInfo'){overriddenStorageType=NO_STORAGE;}break;case 'anonymousId':if(sessionKey!=='anonymousId'){overriddenStorageType=NO_STORAGE;}break;}}return overriddenStorageType;};
    
    /**
     * A service to manage stores & available storage client configurations
     */class StoreManager{stores={};isInitialized=false;constructor(pluginsManager,errorHandler,logger){this.errorHandler=errorHandler;this.logger=logger;this.pluginsManager=pluginsManager;}/**
       * Configure available storage client instances
       */init(){if(this.isInitialized){return;}const loadOptions=state.loadOptions.value;const config={cookieStorageOptions:{samesite:loadOptions.sameSiteCookie,secure:loadOptions.secureCookie,domain:loadOptions.setCookieDomain,sameDomainCookiesOnly:loadOptions.sameDomainCookiesOnly},localStorageOptions:{},inMemoryStorageOptions:{},sessionStorageOptions:{}};configureStorageEngines(removeUndefinedValues(mergeDeepRight(config.cookieStorageOptions??{},state.storage.cookie?.value??{})),removeUndefinedValues(config.localStorageOptions),removeUndefinedValues(config.inMemoryStorageOptions),removeUndefinedValues(config.sessionStorageOptions));this.initClientDataStores();this.isInitialized=true;}/**
       * Create store to persist data used by the SDK like session, used details etc
       */initClientDataStores(){this.initializeStorageState();// TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
    // TODO: should we pass the keys for all in order to validate or leave free as v1.1?
    // Initializing all the enabled store because previous user data might be in different storage
    // that needs auto migration
    const storageTypes=[MEMORY_STORAGE,LOCAL_STORAGE,COOKIE_STORAGE,SESSION_STORAGE];storageTypes.forEach(storageType=>{if(getStorageEngine(storageType)?.isEnabled){this.setStore({id:storageClientDataStoreNameMap[storageType],name:storageClientDataStoreNameMap[storageType],isEncrypted:true,noCompoundKey:true,type:storageType,errorHandler:this.errorHandler,logger:this.logger});}});}initializeStorageState(){let globalStorageType=state.storage.type.value;let entriesOptions=state.loadOptions.value.storage?.entries;// Use the storage options from post consent if anything is defined
    const postConsentStorageOpts=state.consents.postConsent.value.storage;if(isDefined(postConsentStorageOpts?.type)||isDefined(postConsentStorageOpts?.entries)){globalStorageType=postConsentStorageOpts?.type;entriesOptions=postConsentStorageOpts?.entries;}let trulyAnonymousTracking=true;let storageEntries={};USER_SESSION_KEYS.forEach(sessionKey=>{const key=sessionKey;const storageKey=sessionKey;const configuredStorageType=entriesOptions?.[key]?.type;const preConsentStorageType=getStorageTypeFromPreConsentIfApplicable(state,sessionKey);// Storage type precedence order: pre-consent strategy > entry type > global type > default
    const storageType=preConsentStorageType??configuredStorageType??globalStorageType??DEFAULT_STORAGE_TYPE;const finalStorageType=this.getResolvedStorageTypeForEntry(storageType,sessionKey);if(finalStorageType!==NO_STORAGE){trulyAnonymousTracking=false;}storageEntries={...storageEntries,[sessionKey]:{type:finalStorageType,key:COOKIE_KEYS[storageKey]}};});r(()=>{state.storage.type.value=globalStorageType;state.storage.entries.value=storageEntries;state.storage.trulyAnonymousTracking.value=trulyAnonymousTracking;});}getResolvedStorageTypeForEntry(storageType,sessionKey){let finalStorageType=storageType;switch(storageType){case LOCAL_STORAGE:if(!getStorageEngine(LOCAL_STORAGE)?.isEnabled){finalStorageType=MEMORY_STORAGE;}break;case SESSION_STORAGE:if(!getStorageEngine(SESSION_STORAGE)?.isEnabled){finalStorageType=MEMORY_STORAGE;}break;case MEMORY_STORAGE:case NO_STORAGE:break;case COOKIE_STORAGE:default:// First try setting the storage to cookie else to local storage
    if(getStorageEngine(COOKIE_STORAGE)?.isEnabled){finalStorageType=COOKIE_STORAGE;}else if(getStorageEngine(LOCAL_STORAGE)?.isEnabled){finalStorageType=LOCAL_STORAGE;}else if(getStorageEngine(SESSION_STORAGE)?.isEnabled){finalStorageType=SESSION_STORAGE;}else {finalStorageType=MEMORY_STORAGE;}break;}if(finalStorageType!==storageType){this.logger.warn(STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER,sessionKey,storageType,finalStorageType));}return finalStorageType;}/**
       * Create a new store
       */setStore(storeConfig){const storageEngine=getStorageEngine(storeConfig.type);this.stores[storeConfig.id]=new Store(storeConfig,storageEngine,this.pluginsManager);return this.stores[storeConfig.id];}/**
       * Retrieve a store
       */getStore(id){return this.stores[id];}}
    
    const isValidSourceConfig=res=>isObjectLiteralAndNotNull(res)&&isObjectLiteralAndNotNull(res.source)&&!isNullOrUndefined(res.source.id)&&isObjectLiteralAndNotNull(res.source.config)&&Array.isArray(res.source.destinations);const isValidStorageType=storageType=>typeof storageType==='string'&&SUPPORTED_STORAGE_TYPES.includes(storageType);const getTopDomain=url=>{// Create a URL object
    const urlObj=new URL(url);// Extract the host and protocol
    const{host,protocol}=urlObj;// Split the host into parts
    const parts=host.split('.');let topDomain;// Handle different cases, especially for co.uk or similar TLDs
    if(parts.length>2){// Join the last two parts for the top-level domain
    topDomain=`${parts[parts.length-2]}.${parts[parts.length-1]}`;}else {// If only two parts or less, return as it is
    topDomain=host;}return {topDomain,protocol};};const getTopDomainUrl=url=>{const{topDomain,protocol}=getTopDomain(url);return `${protocol}//${topDomain}`;};const getDataServiceUrl=(endpoint,useExactDomain)=>{const url=useExactDomain?window.location.origin:getTopDomainUrl(window.location.href);const formattedEndpoint=endpoint.startsWith('/')?endpoint.substring(1):endpoint;return `${url}/${formattedEndpoint}`;};const isWebpageTopLevelDomain=providedDomain=>{const{topDomain}=getTopDomain(window.location.href);return topDomain===providedDomain;};
    
    /**
     * A function to filter enabled destinations and map to required properties only
     * @param destinations
     *
     * @returns Destination[]
     */const filterEnabledDestination=destinations=>{const nativeDestinations=[];destinations.forEach(destination=>{if(destination.enabled&&!destination.deleted){nativeDestinations.push({id:destination.id,displayName:destination.destinationDefinition.displayName,config:destination.config,shouldApplyDeviceModeTransformation:destination.shouldApplyDeviceModeTransformation||false,propagateEventsUntransformedOnError:destination.propagateEventsUntransformedOnError||false,userFriendlyId:`${destination.destinationDefinition.displayName.replaceAll(' ','-')}___${destination.id}`});}});return nativeDestinations;};
    
    /**
     * Removes trailing slash from url
     * @param url
     * @returns url
     */const removeTrailingSlashes=url=>url?.endsWith('/')?removeTrailingSlashes(url.substring(0,url.length-1)):url;const getDomain=url=>{try{const urlObj=new URL(url);return urlObj.host;}catch(error){return null;}};/**
     * Get the referring domain from the referrer URL
     * @param referrer Page referrer
     * @returns Page referring domain
     */const getReferringDomain=referrer=>getDomain(referrer)??'';/**
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
    
    const removeDuplicateSlashes=str=>str.replace(/\/{2,}/g,'/');/**
     * Checks if provided url is valid or not
     * @param url
     * @returns true if `url` is valid and false otherwise
     */const isValidURL=url=>{if(!isString(url)){return false;}try{// If URL is supported by the browser, we can use it to validate the URL
    // Otherwise, we can at least check if the URL matches the pattern
    if(isFunction(globalThis.URL)){// eslint-disable-next-line no-new
    new URL(url);}return URL_PATTERN.test(url);}catch(e){return false;}};
    
    /**
     * Determines if the SDK is running inside a chrome extension
     * @returns boolean
     */const isSDKRunningInChromeExtension=()=>!!window.chrome?.runtime?.id;
    
    const DEFAULT_PRE_CONSENT_STORAGE_STRATEGY='none';const DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE='immediate';
    
    const isErrorReportingEnabled=sourceConfig=>sourceConfig?.statsCollection?.errors?.enabled===true;const isMetricsReportingEnabled=sourceConfig=>sourceConfig?.statsCollection?.metrics?.enabled===true;
    
    /**
     * Validates and normalizes the consent options provided by the user
     * @param options Consent options provided by the user
     * @returns Validated and normalized consent options
     */const getValidPostConsentOptions=options=>{const validOptions={sendPageEvent:false,trackConsent:false,discardPreConsentEvents:false};if(isObjectLiteralAndNotNull(options)){const clonedOptions=clone(options);validOptions.storage=clonedOptions.storage;if(isNonEmptyObject(clonedOptions.integrations)){validOptions.integrations=clonedOptions.integrations;}validOptions.discardPreConsentEvents=clonedOptions.discardPreConsentEvents===true;validOptions.sendPageEvent=clonedOptions.sendPageEvent===true;validOptions.trackConsent=clonedOptions.trackConsent===true;if(isNonEmptyObject(clonedOptions.consentManagement)){// Override enabled value with the current state value
    validOptions.consentManagement=mergeDeepRight(clonedOptions.consentManagement,{enabled:state.consents.enabled.value});}}return validOptions;};/**
     * Validates if the input is a valid consents data
     * @param value Input consents data
     * @returns true if the input is a valid consents data else false
     */const isValidConsentsData=value=>isNonEmptyObject(value)||Array.isArray(value);/**
     * Retrieves the corresponding provider and plugin name of the selected consent manager from the supported consent managers
     * @param consentManagementOpts consent management options
     * @param logger logger instance
     * @returns Corresponding provider and plugin name of the selected consent manager from the supported consent managers
     */const getConsentManagerInfo=(consentManagementOpts,logger)=>{let{provider}=consentManagementOpts;const consentManagerPluginName=provider?ConsentManagersToPluginNameMap[provider]:undefined;if(provider&&!consentManagerPluginName){logger.error(UNSUPPORTED_CONSENT_MANAGER_ERROR(CONFIG_MANAGER,provider,ConsentManagersToPluginNameMap));// Reset the provider value
    provider=undefined;}return {provider,consentManagerPluginName};};/**
     * Validates and converts the consent management options into a normalized format
     * @param consentManagementOpts Consent management options provided by the user
     * @param logger logger instance
     * @returns An object containing the consent manager plugin name, initialized, enabled and consents data
     */const getConsentManagementData=(consentManagementOpts,logger)=>{let consentManagerPluginName;let allowedConsentIds=[];let deniedConsentIds=[];let initialized=false;let provider;let enabled=consentManagementOpts?.enabled===true;if(isNonEmptyObject(consentManagementOpts)&&enabled){// Get the corresponding plugin name of the selected consent manager from the supported consent managers
    ({provider,consentManagerPluginName}=getConsentManagerInfo(consentManagementOpts,logger));if(isValidConsentsData(consentManagementOpts.allowedConsentIds)){allowedConsentIds=consentManagementOpts.allowedConsentIds;initialized=true;}if(isValidConsentsData(consentManagementOpts.deniedConsentIds)){deniedConsentIds=consentManagementOpts.deniedConsentIds;initialized=true;}}const consentsData={allowedConsentIds,deniedConsentIds};// Enable consent management only if consent manager is supported
    enabled=enabled&&Boolean(consentManagerPluginName);return {provider,consentManagerPluginName,initialized,enabled,consentsData};};
    
    /**
     * Determines the SDK URL
     * @returns sdkURL
     */const getSDKUrl=()=>{// First try the new method of getting the SDK URL
    // from the script tag
    const scriptTag=document.querySelector('script[data-rsa-write-key]');if(scriptTag&&scriptTag.dataset.rsaWriteKey===state.lifecycle.writeKey.value){return scriptTag.src;}// If the new method fails, try the old method
    // TODO: We need to remove this once all the customers upgrade to the
    // latest SDK loading snippet
    const scripts=document.getElementsByTagName('script');const sdkFileNameRegex=/(?:^|\/)rsa(\.min)?\.js$/;// eslint-disable-next-line no-restricted-syntax
    for(const script of scripts){const src=script.getAttribute('src');if(src&&sdkFileNameRegex.test(src)){return src;}}return undefined;};/**
     * Updates the reporting state variables from the source config data
     * @param res Source config
     * @param logger Logger instance
     */const updateReportingState=res=>{state.reporting.isErrorReportingEnabled.value=isErrorReportingEnabled(res.source.config)&&!isSDKRunningInChromeExtension();state.reporting.isMetricsReportingEnabled.value=isMetricsReportingEnabled(res.source.config);};const getServerSideCookiesStateData=logger=>{const{useServerSideCookies,dataServiceEndpoint,storage:storageOptsFromLoad,setCookieDomain,sameDomainCookiesOnly}=state.loadOptions.value;let cookieOptions=storageOptsFromLoad?.cookie;let sscEnabled=false;let finalDataServiceUrl;if(useServerSideCookies){sscEnabled=useServerSideCookies;const providedCookieDomain=cookieOptions.domain??setCookieDomain;/**
         * Based on the following conditions, we decide whether to use the exact domain or not to determine the data service URL:
         * 1. If the cookie domain is provided and it is not a top-level domain, then use the exact domain
         * 2. If the sameDomainCookiesOnly flag is set to true, then use the exact domain
         */const useExactDomain=isDefined(providedCookieDomain)&&!isWebpageTopLevelDomain(removeLeadingPeriod(providedCookieDomain))||sameDomainCookiesOnly;const dataServiceUrl=getDataServiceUrl(dataServiceEndpoint??DEFAULT_DATA_SERVICE_ENDPOINT,useExactDomain);if(isValidURL(dataServiceUrl)){finalDataServiceUrl=removeTrailingSlashes(dataServiceUrl);const curHost=getDomain(window.location.href);const dataServiceHost=getDomain(dataServiceUrl);// If the current host is different from the data service host, then it is a cross-site request
    // For server-side cookies to work, we need to set the SameSite=None and Secure attributes
    // One round of cookie options manipulation is taking place here
    // Based on these(setCookieDomain/storage.cookie or sameDomainCookiesOnly) two load-options, final cookie options are set in the storage module
    // TODO: Refactor the cookie options manipulation logic in one place
    if(curHost!==dataServiceHost){cookieOptions={...cookieOptions,samesite:'None',secure:true};}/**
           * If the sameDomainCookiesOnly flag is not set and the cookie domain is provided(not top level domain),
           * and the data service host is different from the provided cookie domain, then we disable server-side cookies
           * ex: provided cookie domain: 'random.com', data service host: 'sub.example.com'
           */if(!sameDomainCookiesOnly&&useExactDomain&&dataServiceHost!==removeLeadingPeriod(providedCookieDomain)){sscEnabled=false;logger.warn(SERVER_SIDE_COOKIE_FEATURE_OVERRIDE_WARNING(CONFIG_MANAGER,providedCookieDomain,dataServiceHost));}}else {sscEnabled=false;}}return {sscEnabled,cookieOptions,finalDataServiceUrl};};const updateStorageStateFromLoadOptions=logger=>{const{storage:storageOptsFromLoad}=state.loadOptions.value;let storageType=storageOptsFromLoad?.type;if(isDefined(storageType)&&!isValidStorageType(storageType)){logger.warn(STORAGE_TYPE_VALIDATION_WARNING(CONFIG_MANAGER,storageType,DEFAULT_STORAGE_TYPE));storageType=DEFAULT_STORAGE_TYPE;}let storageEncryptionVersion=storageOptsFromLoad?.encryption?.version;const encryptionPluginName=storageEncryptionVersion&&StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];if(!isUndefined(storageEncryptionVersion)&&isUndefined(encryptionPluginName)){// set the default encryption plugin
    logger.warn(UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING(CONFIG_MANAGER,storageEncryptionVersion,StorageEncryptionVersionsToPluginNameMap,DEFAULT_STORAGE_ENCRYPTION_VERSION));storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}else if(isUndefined(storageEncryptionVersion)){storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}// Allow migration only if the configured encryption version is the default encryption version
    const configuredMigrationValue=storageOptsFromLoad?.migrate;const finalMigrationVal=configuredMigrationValue&&storageEncryptionVersion===DEFAULT_STORAGE_ENCRYPTION_VERSION;if(configuredMigrationValue===true&&finalMigrationVal!==configuredMigrationValue){logger.warn(STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(CONFIG_MANAGER,storageEncryptionVersion,DEFAULT_STORAGE_ENCRYPTION_VERSION));}const{sscEnabled,finalDataServiceUrl,cookieOptions}=getServerSideCookiesStateData(logger);r(()=>{state.storage.type.value=storageType;state.storage.cookie.value=cookieOptions;state.serverCookies.isEnabledServerSideCookies.value=sscEnabled;state.serverCookies.dataServiceUrl.value=finalDataServiceUrl;state.storage.encryptionPluginName.value=StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];state.storage.migrate.value=finalMigrationVal;});};const updateConsentsStateFromLoadOptions=logger=>{const{provider,consentManagerPluginName,initialized,enabled,consentsData}=getConsentManagementData(state.loadOptions.value.consentManagement,logger);// Pre-consent
    const preConsentOpts=state.loadOptions.value.preConsent;let storageStrategy=preConsentOpts?.storage?.strategy??DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;const StorageStrategies=['none','session','anonymousId'];if(isDefined(storageStrategy)&&!StorageStrategies.includes(storageStrategy)){storageStrategy=DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;logger.warn(UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY(CONFIG_MANAGER,preConsentOpts?.storage?.strategy,DEFAULT_PRE_CONSENT_STORAGE_STRATEGY));}let eventsDeliveryType=preConsentOpts?.events?.delivery??DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;const deliveryTypes=['immediate','buffer'];if(isDefined(eventsDeliveryType)&&!deliveryTypes.includes(eventsDeliveryType)){eventsDeliveryType=DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;logger.warn(UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE(CONFIG_MANAGER,preConsentOpts?.events?.delivery,DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE));}r(()=>{state.consents.activeConsentManagerPluginName.value=consentManagerPluginName;state.consents.initialized.value=initialized;state.consents.enabled.value=enabled;state.consents.data.value=consentsData;state.consents.provider.value=provider;state.consents.preConsent.value={// Only enable pre-consent if it is explicitly enabled and
    // if it is not already initialized and
    // if consent management is enabled
    enabled:state.loadOptions.value.preConsent?.enabled===true&&initialized===false&&enabled===true,storage:{strategy:storageStrategy},events:{delivery:eventsDeliveryType}};});};/**
     * Determines the consent management state variables from the source config data
     * @param resp Source config response
     * @param logger Logger instance
     */const updateConsentsState=resp=>{let resolutionStrategy=state.consents.resolutionStrategy.value;let cmpMetadata;if(isObjectLiteralAndNotNull(resp.consentManagementMetadata)){if(state.consents.provider.value){resolutionStrategy=resp.consentManagementMetadata.providers.find(p=>p.provider===state.consents.provider.value)?.resolutionStrategy??state.consents.resolutionStrategy.value;}cmpMetadata=resp.consentManagementMetadata;}// If the provider is custom, then the resolution strategy is not applicable
    if(state.consents.provider.value==='custom'){resolutionStrategy=undefined;}r(()=>{state.consents.metadata.value=clone(cmpMetadata);state.consents.resolutionStrategy.value=resolutionStrategy;});};const updateDataPlaneEventsStateFromLoadOptions=logger=>{if(state.dataPlaneEvents.deliveryEnabled.value){const defaultEventsQueuePluginName='XhrQueue';let eventsQueuePluginName=defaultEventsQueuePluginName;if(state.loadOptions.value.useBeacon){if(state.capabilities.isBeaconAvailable.value){eventsQueuePluginName='BeaconQueue';}else {eventsQueuePluginName=defaultEventsQueuePluginName;logger.warn(UNSUPPORTED_BEACON_API_WARNING(CONFIG_MANAGER));}}r(()=>{state.dataPlaneEvents.eventsQueuePluginName.value=eventsQueuePluginName;});}};const getSourceConfigURL=(configUrl,writeKey,lockIntegrationsVersion,lockPluginsVersion,logger)=>{const defSearchParams=new URLSearchParams({p:MODULE_TYPE,v:APP_VERSION,build:BUILD_TYPE,writeKey,lockIntegrationsVersion:lockIntegrationsVersion.toString(),lockPluginsVersion:lockPluginsVersion.toString()});let origin=DEFAULT_CONFIG_BE_URL;let searchParams=defSearchParams;let pathname='/sourceConfig/';let hash='';if(isValidURL(configUrl)){const configUrlInstance=new URL(configUrl);if(!removeTrailingSlashes(configUrlInstance.pathname).endsWith('/sourceConfig')){configUrlInstance.pathname=`${removeTrailingSlashes(configUrlInstance.pathname)}/sourceConfig/`;}configUrlInstance.pathname=removeDuplicateSlashes(configUrlInstance.pathname);defSearchParams.forEach((value,key)=>{if(configUrlInstance.searchParams.get(key)===null){configUrlInstance.searchParams.set(key,value);}});origin=configUrlInstance.origin;pathname=configUrlInstance.pathname;searchParams=configUrlInstance.searchParams;hash=configUrlInstance.hash;}else {logger.warn(INVALID_CONFIG_URL_WARNING(CONFIG_MANAGER,configUrl));}return `${origin}${pathname}?${searchParams}${hash}`;};
    
    /**
     * A function that determines the base URL for the integrations or plugins SDK
     * @param componentType The type of the component (integrations or plugins)
     * @param pathSuffix The path suffix to be appended to the base URL (js-integrations or plugins)
     * @param defaultComponentUrl The default URL to be used if the user has not provided a custom URL
     * @param currentSdkVersion The current version of the SDK
     * @param lockVersion Flag to lock the version of the component
     * @param urlFromLoadOptions The URL provided by the user in the load options
     * @param logger Logger instance
     * @returns The base URL for the integrations or plugins SDK
     */const getSDKComponentBaseURL=(componentType,pathSuffix,defaultComponentUrl,currentSdkVersion,lockVersion,urlFromLoadOptions,logger)=>{let sdkComponentBaseURL;// If the user has provided a custom URL, then validate, clean up and use it
    if(urlFromLoadOptions){if(!isValidURL(urlFromLoadOptions)){logger.error(COMPONENT_BASE_URL_ERROR(CONFIG_MANAGER,componentType,urlFromLoadOptions));return null;}sdkComponentBaseURL=removeTrailingSlashes(urlFromLoadOptions);}else {sdkComponentBaseURL=defaultComponentUrl;// We can automatically determine the base URL only for CDN installations
    if(state.context.app.value.installType==='cdn'){const sdkURL=getSDKUrl();if(sdkURL){// Extract the base URL from the core SDK file URL
    // and append the path suffix to it
    sdkComponentBaseURL=sdkURL.split('/').slice(0,-1).concat(pathSuffix).join('/');}}}// If the version needs to be locked, then replace the major version in the URL
    // with the current version of the SDK
    if(lockVersion){sdkComponentBaseURL=sdkComponentBaseURL.replace(new RegExp(`/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${pathSuffix}$`),`/${currentSdkVersion}/${BUILD_TYPE}/${pathSuffix}`);}return sdkComponentBaseURL;};/**
     * A function that determines integration SDK loading path
     * @param currentSdkVersion Current SDK version
     * @param lockIntegrationsVersion Flag to lock the integrations version
     * @param integrationsUrlFromLoadOptions URL to load the integrations from as provided by the user
     * @param logger Logger instance
     * @returns
     */const getIntegrationsCDNPath=(currentSdkVersion,lockIntegrationsVersion,integrationsUrlFromLoadOptions,logger)=>getSDKComponentBaseURL('integrations',CDN_INT_DIR,DEFAULT_INTEGRATION_SDKS_URL,currentSdkVersion,lockIntegrationsVersion,integrationsUrlFromLoadOptions,logger);/**
     * A function that determines plugins SDK loading path
     * @param currentSdkVersion Current SDK version
     * @param lockPluginsVersion Flag to lock the plugins version
     * @param pluginsUrlFromLoadOptions URL to load the plugins from as provided by the user
     * @param logger Logger instance
     * @returns Final plugins CDN path
     */const getPluginsCDNPath=(currentSdkVersion,lockPluginsVersion,pluginsUrlFromLoadOptions,logger)=>getSDKComponentBaseURL('plugins',CDN_PLUGINS_DIR,DEFAULT_PLUGINS_URL,currentSdkVersion,lockPluginsVersion,pluginsUrlFromLoadOptions,logger);
    
    class ConfigManager{constructor(httpClient,errorHandler,logger){this.errorHandler=errorHandler;this.logger=logger;this.httpClient=httpClient;this.onError=this.onError.bind(this);this.processConfig=this.processConfig.bind(this);}attachEffects(){E(()=>{this.logger.setMinLogLevel(state.lifecycle.logLevel.value);});}/**
       * A function to validate, construct and store loadOption, lifecycle, source and destination
       * config related information in global state
       */init(){const{logLevel,configUrl,lockIntegrationsVersion,lockPluginsVersion,destSDKBaseURL,pluginsSDKBaseURL,integrations}=state.loadOptions.value;// determine the path to fetch integration SDK from
    const intgCdnUrl=getIntegrationsCDNPath(APP_VERSION,lockIntegrationsVersion,destSDKBaseURL,this.logger);if(isNull(intgCdnUrl)){return;}let pluginsCDNPath;{// determine the path to fetch remote plugins from
    pluginsCDNPath=getPluginsCDNPath(APP_VERSION,lockPluginsVersion,pluginsSDKBaseURL,this.logger);}if(pluginsCDNPath===null){return;}this.attachEffects();state.lifecycle.activeDataplaneUrl.value=removeTrailingSlashes(state.lifecycle.dataPlaneUrl.value);updateStorageStateFromLoadOptions(this.logger);updateConsentsStateFromLoadOptions(this.logger);updateDataPlaneEventsStateFromLoadOptions(this.logger);// set application lifecycle state in global state
    r(()=>{state.lifecycle.integrationsCDNPath.value=intgCdnUrl;state.lifecycle.pluginsCDNPath.value=pluginsCDNPath;if(logLevel){state.lifecycle.logLevel.value=logLevel;}state.lifecycle.sourceConfigUrl.value=getSourceConfigURL(configUrl,state.lifecycle.writeKey.value,lockIntegrationsVersion,lockPluginsVersion,this.logger);state.metrics.metricsServiceUrl.value=`${state.lifecycle.activeDataplaneUrl.value}/${METRICS_SERVICE_ENDPOINT}`;// Data in the loadOptions state is already normalized
    state.nativeDestinations.loadOnlyIntegrations.value=integrations;});this.getConfig();}/**
       * Handle errors
       */onError(error,customMessage){this.errorHandler.onError(error,CONFIG_MANAGER,customMessage);}/**
       * A callback function that is executed once we fetch the source config response.
       * Use to construct and store information that are dependent on the sourceConfig.
       */processConfig(response,details){// TODO: add retry logic with backoff based on rejectionDetails.xhr.status
    // We can use isErrRetryable utility method
    if(!isDefined(response)){if(isDefined(details)){this.onError(details.error,SOURCE_CONFIG_FETCH_ERROR);}else {this.onError(new Error(SOURCE_CONFIG_FETCH_ERROR));}return;}let res;try{if(isString(response)){res=JSON.parse(response);}else {res=response;}}catch(err){this.onError(err,SOURCE_CONFIG_RESOLUTION_ERROR);return;}if(!isValidSourceConfig(res)){this.onError(new Error(SOURCE_CONFIG_RESOLUTION_ERROR));return;}// Log error and abort if source is disabled
    if(res.source.enabled===false){this.logger.error(SOURCE_DISABLED_ERROR);return;}// set the values in state for reporting slice
    updateReportingState(res);const nativeDestinations=res.source.destinations.length>0?filterEnabledDestination(res.source.destinations):[];// set in the state --> source, destination, lifecycle, reporting
    r(()=>{// set source related information in state
    state.source.value={config:res.source.config,name:res.source.name,id:res.source.id,workspaceId:res.source.workspaceId};// set device mode destination related information in state
    state.nativeDestinations.configuredDestinations.value=nativeDestinations;// set the desired optional plugins
    state.plugins.pluginsToLoadFromConfig.value=state.loadOptions.value.plugins??[];updateConsentsState(res);// set application lifecycle state
    state.lifecycle.status.value='configured';});}/**
       * A function to fetch source config either from /sourceConfig endpoint
       * or from getSourceConfig load option
       * @returns
       */getConfig(){const sourceConfigFunc=state.loadOptions.value.getSourceConfig;if(sourceConfigFunc){if(!isFunction(sourceConfigFunc)){this.logger.error(SOURCE_CONFIG_OPTION_ERROR(CONFIG_MANAGER));return;}// Fetch source config from the function
    const res=sourceConfigFunc();if(res instanceof Promise){res.then(pRes=>this.processConfig(pRes)).catch(err=>{this.onError(err,'SourceConfig');});}else {this.processConfig(res);}}else {// Fetch source configuration from the configured URL
    this.httpClient.getAsyncData({url:state.lifecycle.sourceConfigUrl.value,options:{headers:{'Content-Type':undefined}},callback:this.processConfig});}}}
    
    /**
     * To get the timezone of the user
     *
     * @returns string
     */const getTimezone=()=>{// Not susceptible to super-linear backtracking
    // eslint-disable-next-line sonarjs/slow-regex
    const timezone=/([A-Z]+[+-]\d+)/.exec(new Date().toString());return timezone?.[1]?timezone[1]:'NA';};
    
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
     */const getDefaultPageProperties=()=>{const canonicalUrl=getCanonicalUrl();let path=globalThis.location.pathname;const{href:tabUrl}=globalThis.location;let pageUrl=tabUrl;const{search}=globalThis.location;// If valid canonical URL is provided use this as page URL.
    if(canonicalUrl){try{const urlObj=new URL(canonicalUrl);// If existing, query params of canonical URL will be used instead of the location.search ones
    if(urlObj.search===''){pageUrl=canonicalUrl+search;}else {pageUrl=canonicalUrl;}path=urlObj.pathname;}catch(err){// Do nothing
    }}const url=getUrlWithoutHash(pageUrl);const{title}=document;const referrer=getReferrer();return {path,referrer,referring_domain:getReferringDomain(referrer),search,title,url,tab_url:tabUrl};};
    
    // @ts-expect-error we're dynamically filling this value during build
    // eslint-disable-next-line no-constant-condition
    const POLYFILL_URL=`https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=${Object.keys(legacyJSEngineRequiredPolyfills).join('%2C')}`;const POLYFILL_LOAD_TIMEOUT=10*1000;// 10 seconds
    const POLYFILL_SCRIPT_ID='rudderstackPolyfill';
    
    class CapabilitiesManager{constructor(httpClient,errorHandler,logger){this.httpClient=httpClient;this.errorHandler=errorHandler;this.logger=logger;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.onError=this.onError.bind(this);this.onReady=this.onReady.bind(this);}init(){this.prepareBrowserCapabilities();this.attachWindowListeners();}/**
       * Detect supported capabilities and set values in state
       */// eslint-disable-next-line class-methods-use-this
    detectBrowserCapabilities(){r(()=>{// Storage related details
    state.capabilities.storage.isCookieStorageAvailable.value=isStorageAvailable(COOKIE_STORAGE,getStorageEngine(COOKIE_STORAGE),this.logger);state.capabilities.storage.isLocalStorageAvailable.value=isStorageAvailable(LOCAL_STORAGE,undefined,this.logger);state.capabilities.storage.isSessionStorageAvailable.value=isStorageAvailable(SESSION_STORAGE,undefined,this.logger);// Browser feature detection details
    state.capabilities.isBeaconAvailable.value=hasBeacon();state.capabilities.isUaCHAvailable.value=hasUAClientHints();state.capabilities.isCryptoAvailable.value=hasCrypto();state.capabilities.isIE11.value=isIE11();state.capabilities.isOnline.value=globalThis.navigator.onLine;// Get page context details
    state.context.userAgent.value=getUserAgent();state.context.locale.value=getLanguage();state.context.screen.value=getScreenDetails();state.context.timezone.value=getTimezone();if(hasUAClientHints()){getUserAgentClientHint(uach=>{state.context['ua-ch'].value=uach;},state.loadOptions.value.uaChTrackLevel);}});// Ad blocker detection
    E(()=>{if(state.loadOptions.value.sendAdblockPage===true&&state.lifecycle.sourceConfigUrl.value!==undefined){detectAdBlockers(this.httpClient);}});}/**
       * Detect if polyfills are required and then load script from polyfill URL
       */prepareBrowserCapabilities(){state.capabilities.isLegacyDOM.value=isLegacyJSEngine();const customPolyfillUrl=state.loadOptions.value.polyfillURL;let polyfillUrl=POLYFILL_URL;if(isDefinedAndNotNull(customPolyfillUrl)){if(isValidURL(customPolyfillUrl)){polyfillUrl=customPolyfillUrl;}else {this.logger.warn(INVALID_POLYFILL_URL_WARNING(CAPABILITIES_MANAGER,customPolyfillUrl));}}const shouldLoadPolyfill=state.loadOptions.value.polyfillIfRequired&&state.capabilities.isLegacyDOM.value&&isValidURL(polyfillUrl);if(shouldLoadPolyfill){const isDefaultPolyfillService=polyfillUrl!==state.loadOptions.value.polyfillURL;if(isDefaultPolyfillService){// write key specific callback
    // NOTE: we're not putting this into RudderStackGlobals as providing the property path to the callback function in the polyfill URL is not possible
    const polyfillCallbackName=`RS_polyfillCallback_${state.lifecycle.writeKey.value}`;const polyfillCallback=()=>{this.onReady();// Remove the entry from window so we don't leave room for calling it again
    delete globalThis[polyfillCallbackName];};globalThis[polyfillCallbackName]=polyfillCallback;polyfillUrl=`${polyfillUrl}&callback=${polyfillCallbackName}`;}this.externalSrcLoader.loadJSFile({url:polyfillUrl,id:POLYFILL_SCRIPT_ID,async:true,timeout:POLYFILL_LOAD_TIMEOUT,callback:scriptId=>{if(!scriptId){this.onError(new Error(POLYFILL_SCRIPT_LOAD_ERROR(POLYFILL_SCRIPT_ID,polyfillUrl)));}else if(!isDefaultPolyfillService){this.onReady();}}});}else {this.onReady();}}/**
       * Attach listeners to window to observe event that update capabilities state values
       */attachWindowListeners(){globalThis.addEventListener('offline',()=>{state.capabilities.isOnline.value=false;});globalThis.addEventListener('online',()=>{state.capabilities.isOnline.value=true;});globalThis.addEventListener('resize',debounce(()=>{state.context.screen.value=getScreenDetails();},this));}/**
       * Set the lifecycle status to next phase
       */// eslint-disable-next-line class-methods-use-this
    onReady(){this.detectBrowserCapabilities();state.lifecycle.status.value='browserCapabilitiesReady';}/**
       * Handles error
       * @param error The error object
       */onError(error){this.errorHandler.onError(error,CAPABILITIES_MANAGER);}}
    
    const CHANNEL='web';// These are the top-level elements in the standard RudderStack event spec
    const TOP_LEVEL_ELEMENTS=['integrations','anonymousId','originalTimestamp'];// Reserved elements in the context of standard RudderStack event spec
    // Typically, these elements are not allowed to be overridden by the user
    const CONTEXT_RESERVED_ELEMENTS=['library','consentManagement','userAgent','ua-ch','screen'];// Reserved elements in the standard RudderStack event spec
    const RESERVED_ELEMENTS=['id','anonymous_id','user_id','sent_at','timestamp','received_at','original_timestamp','event','event_text','channel','context_ip','context_request_ip','context_passed_ip','group_id','previous_id'];
    
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
     */const isManualSessionIdValid=(sessionId,logger)=>{if(!sessionId||!isPositiveInteger(sessionId)||!hasMinLength(MIN_SESSION_ID_LENGTH,sessionId)){logger.warn(INVALID_SESSION_ID_WARNING(USER_SESSION_MANAGER,sessionId,MIN_SESSION_ID_LENGTH));return false;}return true;};/**
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
     */const getContextPageProperties=pageProps=>{// Need to get updated page details on each event as an event to notify on SPA URL changes does not seem to exist
    const curPageProps=getDefaultPageProperties();const ctxPageProps={};Object.keys(curPageProps).forEach(key=>{ctxPageProps[key]=pageProps?.[key]||curPageProps[key];});ctxPageProps.initial_referrer=pageProps?.initial_referrer||state.session.initialReferrer.value;ctxPageProps.initial_referring_domain=pageProps?.initial_referring_domain||state.session.initialReferringDomain.value;return ctxPageProps;};/**
     * Add any missing default page properties using values from options and defaults
     * @param properties Input page properties
     * @param options API options
     */const getUpdatedPageProperties=(properties,options)=>{const optionsPageProps=options?.page||{};const pageProps=properties;// Need to get updated page details on each event as an event to notify on SPA URL changes does not seem to exist
    const curPageProps=getDefaultPageProperties();Object.keys(curPageProps).forEach(key=>{if(isUndefined(pageProps[key])){pageProps[key]=optionsPageProps[key]||curPageProps[key];}});if(isUndefined(pageProps.initial_referrer)){pageProps.initial_referrer=optionsPageProps.initial_referrer||state.session.initialReferrer.value;}if(isUndefined(pageProps.initial_referring_domain)){pageProps.initial_referring_domain=optionsPageProps.initial_referring_domain||state.session.initialReferringDomain.value;}return pageProps;};/**
     * Utility to check for reserved keys in the input object
     * @param obj Generic object
     * @param parentKeyPath Object's parent key path
     * @param logger Logger instance
     */const checkForReservedElementsInObject=(obj,parentKeyPath,logger)=>{if(isObjectLiteralAndNotNull(obj)){Object.keys(obj).forEach(property=>{if(RESERVED_ELEMENTS.includes(property)||RESERVED_ELEMENTS.includes(property.toLowerCase())){logger.warn(RESERVED_KEYWORD_WARNING(EVENT_MANAGER,property,parentKeyPath,RESERVED_ELEMENTS));}});}};/**
     * Checks for reserved keys in traits, properties, and contextual traits
     * @param rudderEvent Generated rudder event
     * @param logger Logger instance
     */const checkForReservedElements=(rudderEvent,logger)=>{//  properties, traits, contextualTraits are either undefined or object
    const{properties,traits,context}=rudderEvent;const{traits:contextualTraits}=context;checkForReservedElementsInObject(properties,'properties',logger);checkForReservedElementsInObject(traits,'traits',logger);checkForReservedElementsInObject(contextualTraits,'context.traits',logger);};/**
     * Overrides the top-level event properties with data from API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */const updateTopLevelEventElements=(rudderEvent,options)=>{if(options.anonymousId&&isString(options.anonymousId)){// eslint-disable-next-line no-param-reassign
    rudderEvent.anonymousId=options.anonymousId;}if(isNonEmptyObject(options.integrations)){// eslint-disable-next-line no-param-reassign
    rudderEvent.integrations=options.integrations;}if(options.originalTimestamp&&isString(options.originalTimestamp)){// eslint-disable-next-line no-param-reassign
    rudderEvent.originalTimestamp=options.originalTimestamp;}};/**
     * To merge the contextual information in API options with existing data
     * @param rudderContext Generated rudder event
     * @param options API options
     * @param logger Logger instance
     */const getMergedContext=(rudderContext,options,logger)=>{let context=rudderContext;Object.keys(options).forEach(key=>{if(!TOP_LEVEL_ELEMENTS.includes(key)&&!CONTEXT_RESERVED_ELEMENTS.includes(key)){if(key!=='context'){context=mergeDeepRight(context,{[key]:options[key]});}else if(!isUndefined(options[key])&&isObjectLiteralAndNotNull(options[key])){const tempContext={};Object.keys(options[key]).forEach(e=>{if(!CONTEXT_RESERVED_ELEMENTS.includes(e)){tempContext[e]=options[key][e];}});context=mergeDeepRight(context,{...tempContext});}else {logger.warn(INVALID_CONTEXT_OBJECT_WARNING(EVENT_MANAGER));}}});return context;};/**
     * Updates rudder event object with data from the API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */const processOptions=(rudderEvent,options,logger)=>{// Only allow object type for options
    if(isObjectLiteralAndNotNull(options)){updateTopLevelEventElements(rudderEvent,options);// eslint-disable-next-line no-param-reassign
    rudderEvent.context=getMergedContext(rudderEvent.context,options,logger);}};/**
     * Returns the final integrations config for the event based on the global config and event's config
     * @param integrationsConfig Event's integrations config
     * @returns Final integrations config
     */const getEventIntegrationsConfig=integrationsConfig=>{let finalIntgConfig;if(state.loadOptions.value.useGlobalIntegrationsConfigInEvents){// Prefer the integrations object from the consent API response over the load API integrations object
    finalIntgConfig=state.consents.postConsent.value.integrations??state.nativeDestinations.loadOnlyIntegrations.value;}else if(integrationsConfig){finalIntgConfig=integrationsConfig;}else {finalIntgConfig=DEFAULT_INTEGRATIONS_CONFIG;}return clone(finalIntgConfig);};/**
     * Enrich the base event object with data from state and the API options
     * @param rudderEvent RudderEvent object
     * @param options API options
     * @param pageProps Page properties
     * @param logger logger
     * @returns Enriched RudderEvent object
     */const getEnrichedEvent=(rudderEvent,options,pageProps,logger)=>{const commonEventData={channel:CHANNEL,context:{traits:clone(state.session.userTraits.value),sessionId:state.session.sessionInfo.value.id||undefined,sessionStart:state.session.sessionInfo.value.sessionStart||undefined,// Add 'consentManagement' only if consent management is enabled
    ...(state.consents.enabled.value&&{consentManagement:{deniedConsentIds:clone(state.consents.data.value.deniedConsentIds),allowedConsentIds:clone(state.consents.data.value.allowedConsentIds),provider:state.consents.provider.value,resolutionStrategy:state.consents.resolutionStrategy.value}}),'ua-ch':state.context['ua-ch'].value,app:state.context.app.value,library:state.context.library.value,userAgent:state.context.userAgent.value,os:state.context.os.value,locale:state.context.locale.value,screen:state.context.screen.value,campaign:extractUTMParameters(globalThis.location.href),page:getContextPageProperties(pageProps),timezone:state.context.timezone.value,// Add auto tracking information
    ...(state.autoTrack.enabled.value&&{autoTrack:{...(state.autoTrack.pageLifecycle.enabled.value&&{page:{visitId:state.autoTrack.pageLifecycle.visitId.value}})}})},originalTimestamp:getCurrentTimeFormatted(),messageId:generateUUID(),userId:rudderEvent.userId||state.session.userId.value};if(!isStorageTypeValidForStoringData(state.storage.entries.value.anonymousId?.type)){// Generate new anonymous id for each request
    commonEventData.anonymousId=generateAnonymousId();}else {// Type casting to string as the user session manager will take care of initializing the value
    commonEventData.anonymousId=state.session.anonymousId.value;}// set truly anonymous tracking flag
    if(state.storage.trulyAnonymousTracking.value){commonEventData.context.trulyAnonymousTracking=true;}if(rudderEvent.type==='identify'){commonEventData.context.traits=state.storage.entries.value.userTraits?.type!==NO_STORAGE?clone(state.session.userTraits.value):rudderEvent.context.traits;}if(rudderEvent.type==='group'){if(rudderEvent.groupId||state.session.groupId.value){commonEventData.groupId=rudderEvent.groupId||state.session.groupId.value;}if(rudderEvent.traits||state.session.groupTraits.value){commonEventData.traits=state.storage.entries.value.groupTraits?.type!==NO_STORAGE?clone(state.session.groupTraits.value):rudderEvent.traits;}}const processedEvent=mergeDeepRight(rudderEvent,commonEventData);// Set the default values for the event properties
    // matching with v1.1 payload
    if(processedEvent.event===undefined){processedEvent.event=null;}if(processedEvent.properties===undefined){processedEvent.properties=null;}processOptions(processedEvent,options,logger);checkForReservedElements(processedEvent,logger);// Update the integrations config for the event
    processedEvent.integrations=getEventIntegrationsConfig(processedEvent.integrations);return processedEvent;};
    
    class RudderEventFactory{constructor(logger){this.logger=logger;}/**
       * Generate a 'page' event based on the user-input fields
       * @param category Page's category
       * @param name Page name
       * @param properties Page properties
       * @param options API options
       */generatePageEvent(category,name,properties,options){let props=properties??{};props=getUpdatedPageProperties(props,options);const pageEvent={properties:props,name,category,type:'page'};return getEnrichedEvent(pageEvent,options,props,this.logger);}/**
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
       */create(event){let eventObj;switch(event.type){case 'page':eventObj=this.generatePageEvent(event.category,event.name,event.properties,event.options);break;case 'track':eventObj=this.generateTrackEvent(event.name,event.properties,event.options);break;case 'identify':eventObj=this.generateIdentifyEvent(event.userId,event.traits,event.options);break;case 'alias':eventObj=this.generateAliasEvent(event.to,event.from,event.options);break;case 'group':default:eventObj=this.generateGroupEvent(event.groupId,event.traits,event.options);break;}return eventObj;}}
    
    /**
     * A service to generate valid event payloads and queue them for processing
     */class EventManager{/**
       *
       * @param eventRepository Event repository instance
       * @param userSessionManager UserSession Manager instance
       * @param errorHandler Error handler object
       * @param logger Logger object
       */constructor(eventRepository,userSessionManager,errorHandler,logger){this.eventRepository=eventRepository;this.userSessionManager=userSessionManager;this.errorHandler=errorHandler;this.logger=logger;this.eventFactory=new RudderEventFactory(this.logger);}/**
       * Initializes the event manager
       */init(){this.eventRepository.init();}resume(){this.eventRepository.resume();}/**
       * Consumes a new incoming event
       * @param event Incoming event data
       */addEvent(event){this.userSessionManager.refreshSession();const rudderEvent=this.eventFactory.create(event);this.eventRepository.enqueue(rudderEvent,event.callback);}}
    
    class UserSessionManager{constructor(pluginsManager,storeManager,httpClient,errorHandler,logger){this.storeManager=storeManager;this.pluginsManager=pluginsManager;this.logger=logger;this.errorHandler=errorHandler;this.httpClient=httpClient;this.onError=this.onError.bind(this);this.serverSideCookieDebounceFuncs={};}/**
       * Initialize User session with values from storage
       */init(){this.syncStorageDataToState();// Register the effect to sync with storage
    this.registerEffects();}syncStorageDataToState(){this.migrateStorageIfNeeded();this.migrateDataFromPreviousStorage();// get the values from storage and set it again
    this.setUserId(this.getUserId());this.setUserTraits(this.getUserTraits());this.setGroupId(this.getGroupId());this.setGroupTraits(this.getGroupTraits());const{externalAnonymousIdCookieName,anonymousIdOptions}=state.loadOptions.value;let externalAnonymousId;if(isDefinedAndNotNull(externalAnonymousIdCookieName)&&typeof externalAnonymousIdCookieName==='string'){externalAnonymousId=this.getExternalAnonymousIdByCookieName(externalAnonymousIdCookieName);}this.setAnonymousId(externalAnonymousId??this.getAnonymousId(anonymousIdOptions));this.setAuthToken(this.getAuthToken());this.setInitialReferrerInfo();this.configureSessionTracking();}configureSessionTracking(){let sessionInfo=this.getSessionInfo();if(this.isPersistenceEnabledForStorageEntry('sessionInfo')){const configuredSessionTrackingInfo=this.getConfiguredSessionTrackingInfo();const initialSessionInfo=sessionInfo??defaultSessionConfiguration;sessionInfo={...initialSessionInfo,...configuredSessionTrackingInfo,// If manualTrack is set to true in the storage, then autoTrack should be false
    autoTrack:configuredSessionTrackingInfo.autoTrack&&initialSessionInfo.manualTrack!==true};// If both autoTrack and manualTrack are disabled, reset the session info to default values
    if(!sessionInfo.autoTrack&&sessionInfo.manualTrack!==true){sessionInfo=DEFAULT_USER_SESSION_VALUES.sessionInfo;}}else {sessionInfo=DEFAULT_USER_SESSION_VALUES.sessionInfo;}state.session.sessionInfo.value=sessionInfo;// If auto session tracking is enabled start the session tracking
    if(state.session.sessionInfo.value.autoTrack){this.startOrRenewAutoTracking(state.session.sessionInfo.value);}}setInitialReferrerInfo(){const persistedInitialReferrer=this.getInitialReferrer();const persistedInitialReferringDomain=this.getInitialReferringDomain();if(persistedInitialReferrer&&persistedInitialReferringDomain){this.setInitialReferrer(persistedInitialReferrer);this.setInitialReferringDomain(persistedInitialReferringDomain);}else {const initialReferrer=persistedInitialReferrer||getReferrer();this.setInitialReferrer(initialReferrer);this.setInitialReferringDomain(getReferringDomain(initialReferrer));}}isPersistenceEnabledForStorageEntry(entryName){return isStorageTypeValidForStoringData(state.storage.entries.value[entryName]?.type);}migrateDataFromPreviousStorage(){const entries=state.storage.entries.value;const storageTypesForMigration=[COOKIE_STORAGE,LOCAL_STORAGE,SESSION_STORAGE];Object.keys(entries).forEach(entry=>{const key=entry;const currentStorage=entries[key]?.type;const curStore=this.storeManager?.getStore(storageClientDataStoreNameMap[currentStorage]);if(curStore){storageTypesForMigration.forEach(storage=>{const store=this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);if(store&&storage!==currentStorage){const value=store.get(COOKIE_KEYS[key]);if(isDefinedNotNullAndNotEmptyString(value)){curStore.set(COOKIE_KEYS[key],value);}store.remove(COOKIE_KEYS[key]);}});}});}migrateStorageIfNeeded(){if(!state.storage.migrate.value){return;}const persistentStoreNames=[CLIENT_DATA_STORE_COOKIE,CLIENT_DATA_STORE_LS,CLIENT_DATA_STORE_SESSION];const stores=[];persistentStoreNames.forEach(storeName=>{const store=this.storeManager?.getStore(storeName);if(store){stores.push(store);}});Object.keys(COOKIE_KEYS).forEach(storageKey=>{const storageEntry=COOKIE_KEYS[storageKey];stores.forEach(store=>{const migratedVal=this.pluginsManager?.invokeSingle('storage.migrate',storageEntry,store.engine,this.errorHandler,this.logger);// Skip setting the value if it is null or undefined
    // as those values indicate there is no need for migration or
    // migration failed
    if(!isNullOrUndefined(migratedVal)){store.set(storageEntry,migratedVal);}});});}getConfiguredSessionTrackingInfo(){let autoTrack=state.loadOptions.value.sessions?.autoTrack!==false;// Do not validate any further if autoTrack is disabled
    if(!autoTrack){return {autoTrack};}let timeout;const configuredSessionTimeout=state.loadOptions.value.sessions?.timeout;if(!isPositiveInteger(configuredSessionTimeout)){this.logger.warn(TIMEOUT_NOT_NUMBER_WARNING(USER_SESSION_MANAGER,configuredSessionTimeout,DEFAULT_SESSION_TIMEOUT_MS));timeout=DEFAULT_SESSION_TIMEOUT_MS;}else {timeout=configuredSessionTimeout;}if(timeout===0){this.logger.warn(TIMEOUT_ZERO_WARNING(USER_SESSION_MANAGER));autoTrack=false;}// In case user provides a timeout value greater than 0 but less than 10 seconds SDK will show a warning
    // and will proceed with it
    if(timeout>0&&timeout<MIN_SESSION_TIMEOUT_MS){this.logger.warn(TIMEOUT_NOT_RECOMMENDED_WARNING(USER_SESSION_MANAGER,timeout,MIN_SESSION_TIMEOUT_MS));}return {timeout,autoTrack};}/**
       * Handles error
       * @param error The error object
       */onError(error,customMessage){this.errorHandler.onError(error,USER_SESSION_MANAGER,customMessage);}/**
       * A function to encrypt the cookie value and return the encrypted data
       * @param cookiesData
       * @param store
       * @returns
       */getEncryptedCookieData(cookiesData,store){const encryptedCookieData=[];cookiesData.forEach(cData=>{const encryptedValue=store?.encrypt(stringifyWithoutCircular(cData.value,false,[],this.logger));if(isDefinedAndNotNull(encryptedValue)){encryptedCookieData.push({name:cData.name,value:encryptedValue});}});return encryptedCookieData;}/**
       * A function that makes request to data service to set the cookie
       * @param encryptedCookieData
       * @param callback
       */makeRequestToSetCookie(encryptedCookieData,callback){this.httpClient?.getAsyncData({url:state.serverCookies.dataServiceUrl.value,options:{method:'POST',data:stringifyWithoutCircular({reqType:'setCookies',workspaceId:state.source.value?.workspaceId,data:{options:{maxAge:state.storage.cookie.value?.maxage,path:state.storage.cookie.value?.path,domain:state.storage.cookie.value?.domain,sameSite:state.storage.cookie.value?.samesite,secure:state.storage.cookie.value?.secure,expires:state.storage.cookie.value?.expires},cookies:encryptedCookieData}}),sendRawData:true,withCredentials:true},isRawResponse:true,callback});}/**
       * A function to make an external request to set the cookie from server side
       * @param key       cookie name
       * @param value     encrypted cookie value
       */setServerSideCookies(cookiesData,cb,store){try{// encrypt cookies values
    const encryptedCookieData=this.getEncryptedCookieData(cookiesData,store);if(encryptedCookieData.length>0){// make request to data service to set the cookie from server side
    this.makeRequestToSetCookie(encryptedCookieData,(res,details)=>{if(details?.xhr?.status===200){cookiesData.forEach(cData=>{const cookieValue=store?.get(cData.name);const before=stringifyWithoutCircular(cData.value,false,[]);const after=stringifyWithoutCircular(cookieValue,false,[]);if(after!==before){this.logger.error(FAILED_SETTING_COOKIE_FROM_SERVER_ERROR(cData.name));if(cb){cb(cData.name,cData.value);}}});}else {this.logger.error(DATA_SERVER_REQUEST_FAIL_ERROR(details?.xhr?.status));cookiesData.forEach(each=>{if(cb){cb(each.name,each.value);}});}});}}catch(e){this.onError(e,FAILED_SETTING_COOKIE_FROM_SERVER_GLOBAL_ERROR);cookiesData.forEach(each=>{if(cb){cb(each.name,each.value);}});}}/**
       * A function to sync values in storage
       * @param sessionKey
       * @param value
       */syncValueToStorage(sessionKey,value){const entries=state.storage.entries.value;const storageType=entries[sessionKey]?.type;if(isStorageTypeValidForStoringData(storageType)){const curStore=this.storeManager?.getStore(storageClientDataStoreNameMap[storageType]);const key=entries[sessionKey]?.key;if(value&&(isString(value)||isNonEmptyObject(value))){// if useServerSideCookies load option is set to true
    // set the cookie from server side
    if(state.serverCookies.isEnabledServerSideCookies.value&&storageType===COOKIE_STORAGE){if(this.serverSideCookieDebounceFuncs[sessionKey]){globalThis.clearTimeout(this.serverSideCookieDebounceFuncs[sessionKey]);}this.serverSideCookieDebounceFuncs[sessionKey]=globalThis.setTimeout(()=>{this.setServerSideCookies([{name:key,value}],(cookieName,cookieValue)=>{curStore?.set(cookieName,cookieValue);},curStore);},SERVER_SIDE_COOKIES_DEBOUNCE_TIME);}else {curStore?.set(key,value);}}else {curStore?.remove(key);}}}/**
       * Function to update storage whenever state value changes
       */registerEffects(){// This will work as long as the user session entry key names are same as the state keys
    USER_SESSION_KEYS.forEach(sessionKey=>{E(()=>{this.syncValueToStorage(sessionKey,state.session[sessionKey].value);});});}/**
       * Sets anonymous id in the following precedence:
       *
       * 1. anonymousId: Id directly provided to the function.
       * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
       *    using parseLinker util.
       * 3. generateUUID: A new unique id is generated and assigned.
       */setAnonymousId(anonymousId,rudderAmpLinkerParam){let finalAnonymousId=anonymousId;if(!isString(anonymousId)||!finalAnonymousId){finalAnonymousId=undefined;}if(this.isPersistenceEnabledForStorageEntry('anonymousId')){if(!finalAnonymousId&&rudderAmpLinkerParam){const linkerPluginsResult=this.pluginsManager?.invokeSingle('userSession.anonymousIdGoogleLinker',rudderAmpLinkerParam);finalAnonymousId=linkerPluginsResult;}finalAnonymousId=finalAnonymousId||generateAnonymousId();}else {finalAnonymousId=DEFAULT_USER_SESSION_VALUES.anonymousId;}state.session.anonymousId.value=finalAnonymousId;}/**
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
       */getSessionId(){const sessionInfo=this.getSessionInfo()??DEFAULT_USER_SESSION_VALUES.sessionInfo;if(sessionInfo.autoTrack&&!hasSessionExpired(sessionInfo.expiresAt)||sessionInfo.manualTrack){return sessionInfo.id??null;}return null;}/**
       * A function to keep the session information up to date in the state
       * before using it for building event payloads.
       */refreshSession(){let sessionInfo=this.getSessionInfo()??DEFAULT_USER_SESSION_VALUES.sessionInfo;if(sessionInfo.autoTrack||sessionInfo.manualTrack){if(sessionInfo.autoTrack){this.startOrRenewAutoTracking(sessionInfo);sessionInfo=state.session.sessionInfo.value;}// Note that if sessionStart is false, then it's an active session.
    // So, we needn't update the session info.
    //
    // For other scenarios,
    // 1. If sessionStart is undefined, then it's a new session.
    //   Mark it as sessionStart.
    // 2. If sessionStart is true, then need to flip it for the future events.
    if(sessionInfo.sessionStart===undefined){sessionInfo={...sessionInfo,sessionStart:true};}else if(sessionInfo.sessionStart){sessionInfo={...sessionInfo,sessionStart:false};}}// Always write to state (in-turn to storage) to keep the session info up to date.
    state.session.sessionInfo.value=sessionInfo;if(state.lifecycle.status.value!=='readyExecuted'){// Force update the storage as the 'effect' blocks are not getting triggered
    // when processing preload buffered requests
    this.syncValueToStorage('sessionInfo',sessionInfo);}}/**
       * Reset state values
       * @param resetAnonymousId
       * @param noNewSessionStart
       * @returns
       */reset(resetAnonymousId,noNewSessionStart){const{session}=state;const{manualTrack,autoTrack}=session.sessionInfo.value;r(()=>{session.userId.value=DEFAULT_USER_SESSION_VALUES.userId;session.userTraits.value=DEFAULT_USER_SESSION_VALUES.userTraits;session.groupId.value=DEFAULT_USER_SESSION_VALUES.groupId;session.groupTraits.value=DEFAULT_USER_SESSION_VALUES.groupTraits;session.authToken.value=DEFAULT_USER_SESSION_VALUES.authToken;if(resetAnonymousId===true){// This will generate a new anonymous ID
    this.setAnonymousId();}if(noNewSessionStart){return;}if(autoTrack){session.sessionInfo.value=DEFAULT_USER_SESSION_VALUES.sessionInfo;this.startOrRenewAutoTracking(session.sessionInfo.value);}else if(manualTrack){this.startManualTrackingInternal();}});}/**
       * Set user Id
       * @param userId
       */setUserId(userId){state.session.userId.value=this.isPersistenceEnabledForStorageEntry('userId')&&userId?userId:DEFAULT_USER_SESSION_VALUES.userId;}/**
       * Set user traits
       * @param traits
       */setUserTraits(traits){state.session.userTraits.value=this.isPersistenceEnabledForStorageEntry('userTraits')&&isObjectLiteralAndNotNull(traits)?mergeDeepRight(state.session.userTraits.value??DEFAULT_USER_SESSION_VALUES.userTraits,traits):DEFAULT_USER_SESSION_VALUES.userTraits;}/**
       * Set group Id
       * @param groupId
       */setGroupId(groupId){state.session.groupId.value=this.isPersistenceEnabledForStorageEntry('groupId')&&groupId?groupId:DEFAULT_USER_SESSION_VALUES.groupId;}/**
       * Set group traits
       * @param traits
       */setGroupTraits(traits){state.session.groupTraits.value=this.isPersistenceEnabledForStorageEntry('groupTraits')&&isObjectLiteralAndNotNull(traits)?mergeDeepRight(state.session.groupTraits.value??DEFAULT_USER_SESSION_VALUES.groupTraits,traits):DEFAULT_USER_SESSION_VALUES.groupTraits;}/**
       * Set initial referrer
       * @param referrer
       */setInitialReferrer(referrer){state.session.initialReferrer.value=this.isPersistenceEnabledForStorageEntry('initialReferrer')&&referrer?referrer:DEFAULT_USER_SESSION_VALUES.initialReferrer;}/**
       * Set initial referring domain
       * @param {String} referringDomain
       */setInitialReferringDomain(referringDomain){state.session.initialReferringDomain.value=this.isPersistenceEnabledForStorageEntry('initialReferringDomain')&&referringDomain?referringDomain:DEFAULT_USER_SESSION_VALUES.initialReferringDomain;}/**
       * A function to check for existing session details and depending on that create a new session
       */startOrRenewAutoTracking(sessionInfo){if(hasSessionExpired(sessionInfo.expiresAt)){state.session.sessionInfo.value=generateAutoTrackingSession(sessionInfo.timeout);}else {const timestamp=Date.now();const timeout=sessionInfo.timeout;state.session.sessionInfo.value=mergeDeepRight(sessionInfo,{expiresAt:timestamp+timeout// set the expiry time of the session
    });}}/**
       * A function method to start a manual session
       * @param {number} id     session identifier
       * @returns
       */start(id){state.session.sessionInfo.value=generateManualTrackingSession(id,this.logger);}/**
       * An internal function to start manual session
       */startManualTrackingInternal(){this.start(Date.now());}/**
       * A public method to end an ongoing session.
       */end(){state.session.sessionInfo.value=DEFAULT_USER_SESSION_VALUES.sessionInfo;}/**
       * Set auth token
       * @param userId
       */setAuthToken(token){state.session.authToken.value=this.isPersistenceEnabledForStorageEntry('authToken')&&token?token:DEFAULT_USER_SESSION_VALUES.authToken;}}
    
    /**
     * Plugins to be loaded in the plugins loadOption is not defined
     */const defaultOptionalPluginsList=['BeaconQueue','CustomConsentManager','DeviceModeDestinations','DeviceModeTransformation','ExternalAnonymousId','GoogleLinker','IubendaConsentManager','KetchConsentManager','NativeDestinationQueue','OneTrustConsentManager','StorageEncryption','StorageEncryptionLegacy','StorageMigrator','XhrQueue'];
    
    const normalizeLoadOptions=(loadOptionsFromState,loadOptions)=>{// TODO: Maybe add warnings for invalid values
    const normalizedLoadOpts=clone(loadOptions);if(!isString(normalizedLoadOpts.setCookieDomain)){normalizedLoadOpts.setCookieDomain=undefined;}const cookieSameSiteValues=['Strict','Lax','None'];if(!cookieSameSiteValues.includes(normalizedLoadOpts.sameSiteCookie)){normalizedLoadOpts.sameSiteCookie=undefined;}normalizedLoadOpts.secureCookie=getNormalizedBooleanValue(normalizedLoadOpts.secureCookie,loadOptionsFromState.secureCookie);normalizedLoadOpts.sameDomainCookiesOnly=getNormalizedBooleanValue(normalizedLoadOpts.sameDomainCookiesOnly,loadOptionsFromState.sameDomainCookiesOnly);const uaChTrackLevels=['none','default','full'];if(!uaChTrackLevels.includes(normalizedLoadOpts.uaChTrackLevel)){normalizedLoadOpts.uaChTrackLevel=undefined;}normalizedLoadOpts.integrations=getNormalizedObjectValue(normalizedLoadOpts.integrations);if(!Array.isArray(normalizedLoadOpts.plugins)){normalizedLoadOpts.plugins=defaultOptionalPluginsList;}normalizedLoadOpts.useGlobalIntegrationsConfigInEvents=getNormalizedBooleanValue(normalizedLoadOpts.useGlobalIntegrationsConfigInEvents,loadOptionsFromState.useGlobalIntegrationsConfigInEvents);normalizedLoadOpts.bufferDataPlaneEventsUntilReady=getNormalizedBooleanValue(normalizedLoadOpts.bufferDataPlaneEventsUntilReady,loadOptionsFromState.bufferDataPlaneEventsUntilReady);normalizedLoadOpts.sendAdblockPage=getNormalizedBooleanValue(normalizedLoadOpts.sendAdblockPage,loadOptionsFromState.sendAdblockPage);normalizedLoadOpts.useServerSideCookies=getNormalizedBooleanValue(normalizedLoadOpts.useServerSideCookies,loadOptionsFromState.useServerSideCookies);if(!isString(normalizedLoadOpts.dataServiceEndpoint)){normalizedLoadOpts.dataServiceEndpoint=undefined;}normalizedLoadOpts.sendAdblockPageOptions=getNormalizedObjectValue(normalizedLoadOpts.sendAdblockPageOptions);normalizedLoadOpts.loadIntegration=getNormalizedBooleanValue(normalizedLoadOpts.loadIntegration,loadOptionsFromState.loadIntegration);if(!isNonEmptyObject(normalizedLoadOpts.storage)){normalizedLoadOpts.storage=undefined;}else {normalizedLoadOpts.storage.migrate=getNormalizedBooleanValue(normalizedLoadOpts.storage.migrate,loadOptionsFromState.storage?.migrate);normalizedLoadOpts.storage.cookie=getNormalizedObjectValue(normalizedLoadOpts.storage.cookie);normalizedLoadOpts.storage.encryption=getNormalizedObjectValue(normalizedLoadOpts.storage.encryption);normalizedLoadOpts.storage=removeUndefinedAndNullValues(normalizedLoadOpts.storage);}normalizedLoadOpts.destinationsQueueOptions=getNormalizedObjectValue(normalizedLoadOpts.destinationsQueueOptions);normalizedLoadOpts.queueOptions=getNormalizedObjectValue(normalizedLoadOpts.queueOptions);normalizedLoadOpts.lockIntegrationsVersion=getNormalizedBooleanValue(normalizedLoadOpts.lockIntegrationsVersion,loadOptionsFromState.lockIntegrationsVersion);normalizedLoadOpts.lockPluginsVersion=getNormalizedBooleanValue(normalizedLoadOpts.lockPluginsVersion,loadOptionsFromState.lockPluginsVersion);if(!isNumber(normalizedLoadOpts.dataPlaneEventsBufferTimeout)){normalizedLoadOpts.dataPlaneEventsBufferTimeout=undefined;}normalizedLoadOpts.beaconQueueOptions=getNormalizedObjectValue(normalizedLoadOpts.beaconQueueOptions);normalizedLoadOpts.preConsent=getNormalizedObjectValue(normalizedLoadOpts.preConsent);const mergedLoadOptions=mergeDeepRight(loadOptionsFromState,removeUndefinedAndNullValues(normalizedLoadOpts));return mergedLoadOptions;};
    
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
    const destinationsIntgConfig=state.nativeDestinations.integrationsConfig.value;const overriddenIntgOpts=getOverriddenIntegrationOptions(event.integrations,destinationsIntgConfig);finalEvent.integrations=mergeDeepRight(destinationsIntgConfig,overriddenIntgOpts);return finalEvent;};const shouldBufferEventsForPreConsent=state=>state.consents.preConsent.value.enabled&&state.consents.preConsent.value.events?.delivery==='buffer'&&(state.consents.preConsent.value.storage?.strategy==='session'||state.consents.preConsent.value.storage?.strategy==='none');
    
    const safelyInvokeCallback=(callback,args,apiName,logger)=>{if(!isDefined(callback)){return;}if(isFunction(callback)){try{callback(...args);}catch(error){logger.error(CALLBACK_INVOKE_ERROR(apiName),error);}}else {logger.error(INVALID_CALLBACK_FN_ERROR(apiName));}};
    
    /**
     * Event repository class responsible for queuing events for further processing and delivery
     */class EventRepository{/**
       *
       * @param pluginsManager Plugins manager instance
       * @param storeManager Store Manager instance
       * @param errorHandler Error handler object
       * @param logger Logger object
       */constructor(pluginsManager,storeManager,httpClient,errorHandler,logger){this.pluginsManager=pluginsManager;this.errorHandler=errorHandler;this.httpClient=httpClient;this.logger=logger;this.storeManager=storeManager;}/**
       * Initializes the event repository
       */init(){this.dataplaneEventsQueue=this.pluginsManager.invokeSingle(`${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.init`,state,this.httpClient,this.storeManager,this.errorHandler,this.logger);this.dmtEventsQueue=this.pluginsManager.invokeSingle(`${DMT_EXT_POINT_PREFIX}.init`,state,this.pluginsManager,this.httpClient,this.storeManager,this.errorHandler,this.logger);this.destinationsEventsQueue=this.pluginsManager.invokeSingle(`${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.init`,state,this.pluginsManager,this.storeManager,this.dmtEventsQueue,this.errorHandler,this.logger);// Start the queue once the client destinations are ready
    E(()=>{if(state.nativeDestinations.clientDestinationsReady.value===true){this.destinationsEventsQueue?.start();this.dmtEventsQueue?.start();}});const bufferEventsBeforeConsent=shouldBufferEventsForPreConsent(state);// Start the queue processing only when the destinations are ready or hybrid mode destinations exist
    // However, events will be enqueued for now.
    // At the time of processing the events, the integrations config data from destinations
    // is merged into the event object
    let timeoutId;E(()=>{const shouldBufferDpEvents=state.loadOptions.value.bufferDataPlaneEventsUntilReady===true&&state.nativeDestinations.clientDestinationsReady.value===false;const hybridDestExist=state.nativeDestinations.activeDestinations.value.some(dest=>isHybridModeDestination(dest));if((hybridDestExist===false||shouldBufferDpEvents===false)&&!bufferEventsBeforeConsent&&this.dataplaneEventsQueue?.scheduleTimeoutActive!==true){globalThis.clearTimeout(timeoutId);this.dataplaneEventsQueue?.start();}});// Force start the data plane events queue processing after a timeout
    if(state.loadOptions.value.bufferDataPlaneEventsUntilReady===true){timeoutId=globalThis.setTimeout(()=>{if(this.dataplaneEventsQueue?.scheduleTimeoutActive!==true){this.dataplaneEventsQueue?.start();}},state.loadOptions.value.dataPlaneEventsBufferTimeout);}}resume(){if(this.dataplaneEventsQueue?.scheduleTimeoutActive!==true){if(state.consents.postConsent.value.discardPreConsentEvents){this.dataplaneEventsQueue?.clear();this.destinationsEventsQueue?.clear();}this.dataplaneEventsQueue?.start();}}/**
       * Enqueues the event for processing
       * @param event RudderEvent object
       * @param callback API callback function
       */enqueue(event,callback){const dpQEvent=getFinalEvent(event,state);this.pluginsManager.invokeSingle(`${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.enqueue`,state,this.dataplaneEventsQueue,dpQEvent,this.errorHandler,this.logger);const dQEvent=clone(event);this.pluginsManager.invokeSingle(`${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.enqueue`,state,this.destinationsEventsQueue,dQEvent,this.errorHandler,this.logger);// Invoke the callback if it exists
    const apiName=`${event.type.charAt(0).toUpperCase()}${event.type.slice(1)}${API_SUFFIX}`;safelyInvokeCallback(callback,[dpQEvent],apiName,this.logger);}}
    
    const dispatchSDKEvent=event=>{const customEvent=new CustomEvent(event,{detail:{analyticsInstance:globalThis.rudderanalytics},bubbles:true,cancelable:true,composed:true});globalThis.document.dispatchEvent(customEvent);};const isWriteKeyValid=writeKey=>isString(writeKey)&&writeKey.trim().length>0;const isDataPlaneUrlValid=dataPlaneUrl=>isValidURL(dataPlaneUrl);
    
    /*
     * Analytics class with lifecycle based on state ad user triggered events
     */class Analytics{/**
       * Initialize services and components or use default ones if singletons
       */constructor(){this.preloadBuffer=new BufferQueue();this.initialized=false;this.errorHandler=defaultErrorHandler;this.logger=defaultLogger;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.httpClient=defaultHttpClient;this.httpClient.init(this.errorHandler);this.capabilitiesManager=new CapabilitiesManager(this.httpClient,this.errorHandler,this.logger);}/**
       * Start application lifecycle if not already started
       */load(writeKey,dataPlaneUrl,loadOptions={}){if(state.lifecycle.status.value){return;}if(!isWriteKeyValid(writeKey)){this.logger.error(WRITE_KEY_VALIDATION_ERROR(ANALYTICS_CORE,writeKey));return;}if(!isDataPlaneUrlValid(dataPlaneUrl)){this.logger.error(DATA_PLANE_URL_VALIDATION_ERROR(ANALYTICS_CORE,dataPlaneUrl));return;}// Set initial state values
    r(()=>{state.lifecycle.writeKey.value=clone(writeKey);state.lifecycle.dataPlaneUrl.value=clone(dataPlaneUrl);state.loadOptions.value=normalizeLoadOptions(state.loadOptions.value,loadOptions);state.lifecycle.status.value='mounted';});// set log level as early as possible
    this.logger.setMinLogLevel(state.loadOptions.value.logLevel??POST_LOAD_LOG_LEVEL);// Expose state to global objects
    setExposedGlobal('state',state,writeKey);// Configure initial config of any services or components here
    // State application lifecycle
    this.startLifecycle();}// Start lifecycle methods
    /**
       * Orchestrate the lifecycle of the application phases/status
       */startLifecycle(){E(()=>{try{switch(state.lifecycle.status.value){case 'mounted':this.onMounted();break;case 'browserCapabilitiesReady':this.onBrowserCapabilitiesReady();break;case 'configured':this.onConfigured();break;case 'pluginsLoading':break;case 'pluginsReady':this.onPluginsReady();break;case 'initialized':this.onInitialized();break;case 'loaded':this.onLoaded();break;case 'destinationsLoading':break;case 'destinationsReady':this.onDestinationsReady();break;case 'ready':this.onReady();break;case 'readyExecuted':default:break;}}catch(err){const issue='Failed to load the SDK';this.errorHandler.onError(getMutatedError(err,issue),ANALYTICS_CORE);}});}onBrowserCapabilitiesReady(){// initialize the preloaded events enqueuing
    retrievePreloadBufferEvents(this);this.prepareInternalServices();this.loadConfig();}onLoaded(){this.processBufferedEvents();// Short-circuit the life cycle and move to the ready state if pre-consent behavior is enabled
    if(state.consents.preConsent.value.enabled===true){state.lifecycle.status.value='ready';}else {this.loadDestinations();}}/**
       * Load browser polyfill if required
       */onMounted(){this.capabilitiesManager.init();}/**
       * Enqueue in SDK preload buffer events, used from preloadBuffer component
       */enqueuePreloadBufferEvents(bufferedEvents){if(Array.isArray(bufferedEvents)){bufferedEvents.forEach(bufferedEvent=>this.preloadBuffer.enqueue(clone(bufferedEvent)));}}/**
       * Process the buffer preloaded events by passing their arguments to the respective facade methods
       */processDataInPreloadBuffer(){while(this.preloadBuffer.size()>0){const eventToProcess=this.preloadBuffer.dequeue();if(eventToProcess){consumePreloadBufferedEvent([...eventToProcess],this);}}}prepareInternalServices(){this.pluginsManager=new PluginsManager(defaultPluginEngine,this.errorHandler,this.logger);this.storeManager=new StoreManager(this.pluginsManager,this.errorHandler,this.logger);this.configManager=new ConfigManager(this.httpClient,this.errorHandler,this.logger);this.userSessionManager=new UserSessionManager(this.pluginsManager,this.storeManager,this.httpClient,this.errorHandler,this.logger);this.eventRepository=new EventRepository(this.pluginsManager,this.storeManager,this.httpClient,this.errorHandler,this.logger);this.eventManager=new EventManager(this.eventRepository,this.userSessionManager,this.errorHandler,this.logger);}/**
       * Load configuration
       */loadConfig(){if(state.lifecycle.writeKey.value){this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);}this.configManager?.init();}/**
       * Initialize the storage and event queue
       */onPluginsReady(){// Initialize storage
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
    this.processDataInPreloadBuffer();// Execute onLoaded callback if provided in load options
    const onLoadedCallbackFn=state.loadOptions.value.onLoaded;// TODO: we need to avoid passing the window object to the callback function
    // as this will prevent us from supporting multiple SDK instances in the same page
    safelyInvokeCallback(onLoadedCallbackFn,[globalThis.rudderanalytics],LOAD_API,this.logger);// Set lifecycle state
    r(()=>{state.lifecycle.loaded.value=true;state.lifecycle.status.value='loaded';});this.initialized=true;// Emit an event to use as substitute to the onLoaded callback
    dispatchSDKEvent('RSA_Initialised');}/**
       * Emit ready event
       */// eslint-disable-next-line class-methods-use-this
    onReady(){state.lifecycle.status.value='readyExecuted';state.eventBuffer.readyCallbacksArray.value.forEach(callback=>{safelyInvokeCallback(callback,[],READY_API,this.logger);});// Emit an event to use as substitute to the ready callback
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
    E(()=>{const areAllDestinationsReady=totalDestinationsToLoad===0||state.nativeDestinations.initializedDestinations.value.length+state.nativeDestinations.failedDestinations.value.length===totalDestinationsToLoad;if(areAllDestinationsReady){r(()=>{state.lifecycle.status.value='destinationsReady';state.nativeDestinations.clientDestinationsReady.value=true;});}});}/**
       * Move to the ready state
       */// eslint-disable-next-line class-methods-use-this
    onDestinationsReady(){// May be do any destination specific actions here
    // Mark the ready status if not already done
    if(state.lifecycle.status.value!=='ready'){state.lifecycle.status.value='ready';}}// End lifecycle methods
    // Start consumer exposed methods
    ready(callback,isBufferedInvocation=false){const type='ready';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,callback]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);if(!isFunction(callback)){this.logger.error(INVALID_CALLBACK_FN_ERROR(READY_API));return;}/**
         * If destinations are loaded or no integration is available for loading
         * execute the callback immediately else push the callbacks to a queue that
         * will be executed after loading completes
         */if(state.lifecycle.status.value==='readyExecuted'){safelyInvokeCallback(callback,[],READY_API,this.logger);}else {state.eventBuffer.readyCallbacksArray.value=[...state.eventBuffer.readyCallbacksArray.value,callback];}}page(payload,isBufferedInvocation=false){const type='page';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;this.eventManager?.addEvent({type:'page',category:payload.category,name:payload.name,properties:payload.properties,options:payload.options,callback:payload.callback});// TODO: Maybe we should alter the behavior to send the ad-block page event even if the SDK is still loaded. It'll be pushed into the to be processed queue.
    // Send automatic ad blocked page event if ad-blockers are detected on the page
    // Check page category to avoid infinite loop
    if(state.capabilities.isAdBlocked.value===true&&payload.category!==ADBLOCK_PAGE_CATEGORY){this.page(pageArgumentsToCallOptions(ADBLOCK_PAGE_CATEGORY,ADBLOCK_PAGE_NAME,{// 'title' is intentionally omitted as it does not make sense
    // in v3 implementation
    path:ADBLOCK_PAGE_PATH},state.loadOptions.value.sendAdblockPageOptions));}}track(payload,isBufferedInvocation=false){const type='track';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event - ${payload.name}`);state.metrics.triggered.value+=1;this.eventManager?.addEvent({type,name:payload.name||undefined,properties:payload.properties,options:payload.options,callback:payload.callback});}identify(payload,isBufferedInvocation=false){const type='identify';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;const shouldResetSession=Boolean(payload.userId&&state.session.userId.value&&payload.userId!==state.session.userId.value);if(shouldResetSession){this.reset();}// `null` value indicates that previous user ID needs to be retained
    if(!isNull(payload.userId)){this.userSessionManager?.setUserId(payload.userId);}this.userSessionManager?.setUserTraits(payload.traits);this.eventManager?.addEvent({type,userId:payload.userId,traits:payload.traits,options:payload.options,callback:payload.callback});}alias(payload,isBufferedInvocation=false){const type='alias';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;const previousId=payload.from??this.userSessionManager?.getUserId()??this.userSessionManager?.getAnonymousId();this.eventManager?.addEvent({type,to:payload.to,from:previousId,options:payload.options,callback:payload.callback});}group(payload,isBufferedInvocation=false){const type='group';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,payload]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} event`);state.metrics.triggered.value+=1;// `null` value indicates that previous group ID needs to be retained
    if(!isNull(payload.groupId)){this.userSessionManager?.setGroupId(payload.groupId);}this.userSessionManager?.setGroupTraits(payload.traits);this.eventManager?.addEvent({type,groupId:payload.groupId,traits:payload.traits,options:payload.options,callback:payload.callback});}reset(resetAnonymousId,isBufferedInvocation=false){const type='reset';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,resetAnonymousId]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation, resetAnonymousId: ${resetAnonymousId}`);this.userSessionManager?.reset(resetAnonymousId);}getAnonymousId(options){return this.userSessionManager?.getAnonymousId(options);}setAnonymousId(anonymousId,rudderAmpLinkerParam,isBufferedInvocation=false){const type='setAnonymousId';// Buffering is needed as setting the anonymous ID may require invoking the GoogleLinker plugin
    if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,anonymousId,rudderAmpLinkerParam]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);this.userSessionManager?.setAnonymousId(anonymousId,rudderAmpLinkerParam);}// eslint-disable-next-line class-methods-use-this
    getUserId(){return state.session.userId.value;}// eslint-disable-next-line class-methods-use-this
    getUserTraits(){return state.session.userTraits.value;}// eslint-disable-next-line class-methods-use-this
    getGroupId(){return state.session.groupId.value;}// eslint-disable-next-line class-methods-use-this
    getGroupTraits(){return state.session.groupTraits.value;}startSession(sessionId,isBufferedInvocation=false){const type='startSession';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,sessionId]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);this.userSessionManager?.start(sessionId);}endSession(isBufferedInvocation=false){const type='endSession';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type]];return;}this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);this.userSessionManager?.end();}// eslint-disable-next-line class-methods-use-this
    getSessionId(){const sessionId=this.userSessionManager?.getSessionId();return sessionId??null;}consent(options,isBufferedInvocation=false){const type='consent';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value=[...state.eventBuffer.toBeProcessedArray.value,[type,options]];return;}this.errorHandler.leaveBreadcrumb(`New consent invocation`);r(()=>{state.consents.preConsent.value={...state.consents.preConsent.value,enabled:false};state.consents.postConsent.value=getValidPostConsentOptions(options);const{initialized,consentsData}=getConsentManagementData(state.consents.postConsent.value.consentManagement,this.logger);state.consents.initialized.value=initialized;state.consents.data.value=consentsData;});// Update consents data in state
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
     */class RudderAnalytics{// START-NO-SONAR-SCAN
    // eslint-disable-next-line sonarjs/public-static-readonly
    static globalSingleton=null;// END-NO-SONAR-SCAN
    analyticsInstances={};defaultAnalyticsKey='';logger=(()=>defaultLogger)();// Singleton with constructor bind methods
    constructor(){try{if(RudderAnalytics.globalSingleton){// START-NO-SONAR-SCAN
    // eslint-disable-next-line no-constructor-return
    return RudderAnalytics.globalSingleton;// END-NO-SONAR-SCAN
    }RudderAnalytics.initializeGlobalResources();this.setDefaultInstanceKey=this.setDefaultInstanceKey.bind(this);this.getAnalyticsInstance=this.getAnalyticsInstance.bind(this);this.load=this.load.bind(this);this.ready=this.ready.bind(this);this.triggerBufferedLoadEvent=this.triggerBufferedLoadEvent.bind(this);this.page=this.page.bind(this);this.track=this.track.bind(this);this.identify=this.identify.bind(this);this.alias=this.alias.bind(this);this.group=this.group.bind(this);this.reset=this.reset.bind(this);this.getAnonymousId=this.getAnonymousId.bind(this);this.setAnonymousId=this.setAnonymousId.bind(this);this.getUserId=this.getUserId.bind(this);this.getUserTraits=this.getUserTraits.bind(this);this.getGroupId=this.getGroupId.bind(this);this.getGroupTraits=this.getGroupTraits.bind(this);this.startSession=this.startSession.bind(this);this.endSession=this.endSession.bind(this);this.getSessionId=this.getSessionId.bind(this);this.setAuthToken=this.setAuthToken.bind(this);this.consent=this.consent.bind(this);RudderAnalytics.globalSingleton=this;state.autoTrack.pageLifecycle.visitId.value=generateUUID();state.autoTrack.pageLifecycle.pageLoadedTimestamp.value=Date.now();// start loading if a load event was buffered or wait for explicit load call
    this.triggerBufferedLoadEvent();// Assign to global "rudderanalytics" object after processing the preload buffer (if any exists)
    // for CDN bundling IIFE exports covers this but for npm ESM and CJS bundling has to be done explicitly
    globalThis.rudderanalytics=this;}catch(error){dispatchErrorEvent(error);}}static initializeGlobalResources(){// We need to initialize the error handler first to catch any unhandled errors occurring in this module as well
    defaultErrorHandler.init();// Initialize the storage engines with default options
    defaultCookieStorage.configure();defaultLocalStorage.configure();defaultSessionStorage.configure();defaultInMemoryStorage.configure();}/**
       * Set instance to use if no specific writeKey is provided in methods
       * automatically for the first created instance
       * TODO: to support multiple analytics instances in the near future
       */setDefaultInstanceKey(writeKey){// IMP: Add try-catch block to handle any unhandled errors
    // similar to other public methods
    // if the implementation of this method goes beyond
    // this simple implementation
    if(isString(writeKey)&&writeKey){this.defaultAnalyticsKey=writeKey;}}/**
       * Retrieve an existing analytics instance
       */getAnalyticsInstance(writeKey){try{let instanceId=writeKey;if(!isString(instanceId)||!instanceId){instanceId=this.defaultAnalyticsKey;}const analyticsInstanceExists=Boolean(this.analyticsInstances[instanceId]);if(!analyticsInstanceExists){this.analyticsInstances[instanceId]=new Analytics();}return this.analyticsInstances[instanceId];}catch(error){dispatchErrorEvent(error);return undefined;}}/**
       * Loads the SDK
       * @param writeKey Source write key
       * @param dataPlaneUrl Data plane URL
       * @param loadOptions Additional options for loading the SDK
       * @returns none
       */load(writeKey,dataPlaneUrl,loadOptions){try{if(this.analyticsInstances[writeKey]){return;}this.setDefaultInstanceKey(writeKey);// Get the preloaded events array from global buffer instead of window.rudderanalytics
    // as the constructor must have already pushed the events to the global buffer
    const preloadedEventsArray=getExposedGlobal(GLOBAL_PRELOAD_BUFFER);// Track page loaded lifecycle event if enabled
    this.trackPageLifecycleEvents(preloadedEventsArray,loadOptions);// The array will be mutated in the below method
    promotePreloadedConsentEventsToTop(preloadedEventsArray);setExposedGlobal(GLOBAL_PRELOAD_BUFFER,clone(preloadedEventsArray));this.getAnalyticsInstance(writeKey)?.load(writeKey,dataPlaneUrl,getSanitizedValue(loadOptions));}catch(error){dispatchErrorEvent(error);}}/**
       * A function to track page lifecycle events like page loaded and page unloaded
       * @param preloadedEventsArray
       * @param loadOptions
       * @returns
       */trackPageLifecycleEvents(preloadedEventsArray,loadOptions){const{autoTrack,useBeacon}=loadOptions??{};const{enabled:autoTrackEnabled=false,options:autoTrackOptions={},pageLifecycle}=autoTrack??{};const{events=[PageLifecycleEvents.LOADED,PageLifecycleEvents.UNLOADED],enabled:pageLifecycleEnabled=autoTrackEnabled,options=autoTrackOptions}=pageLifecycle??{};state.autoTrack.pageLifecycle.enabled.value=pageLifecycleEnabled;// Set the autoTrack enabled state
    // if at least one of the autoTrack options is enabled
    // IMPORTANT: make sure this is done at the end as it depends on the above states
    state.autoTrack.enabled.value=autoTrackEnabled||pageLifecycleEnabled;if(!pageLifecycleEnabled){return;}this.trackPageLoadedEvent(events,options,preloadedEventsArray);this.setupPageUnloadTracking(events,useBeacon,options);}/**
       * Buffer the page loaded event in the preloaded events array
       * @param events
       * @param options
       * @param preloadedEventsArray
       */// eslint-disable-next-line class-methods-use-this
    trackPageLoadedEvent(events,options,preloadedEventsArray){if(events.length===0||events.includes(PageLifecycleEvents.LOADED)){preloadedEventsArray.unshift(['track',PageLifecycleEvents.LOADED,{},{...options,originalTimestamp:getFormattedTimestamp(new Date(state.autoTrack.pageLifecycle.pageLoadedTimestamp.value))}]);}}/**
       * Setup page unload tracking if enabled
       * @param events
       * @param useBeacon
       * @param options
       */setupPageUnloadTracking(events,useBeacon,options){if(events.length===0||events.includes(PageLifecycleEvents.UNLOADED)){if(useBeacon===true){onPageLeave(isAccessible=>{if(isAccessible===false&&state.lifecycle.loaded.value){const pageUnloadedTimestamp=Date.now();const visitDuration=pageUnloadedTimestamp-state.autoTrack.pageLifecycle.pageLoadedTimestamp.value;this.track(PageLifecycleEvents.UNLOADED,{visitDuration},{...options,originalTimestamp:getFormattedTimestamp(new Date(pageUnloadedTimestamp))});}});}else {// log warning if beacon is disabled
    this.logger.warn(PAGE_UNLOAD_ON_BEACON_DISABLED_WARNING(RSA));}}}/**
       * Trigger load event in buffer queue if exists and stores the
       * remaining preloaded events array in global object
       */triggerBufferedLoadEvent(){const preloadedEventsArray=Array.isArray(globalThis.rudderanalytics)?globalThis.rudderanalytics:[];// Get any load method call that is buffered if any
    // BTW, load method is also removed from the array
    // So, the Analytics object can directly consume the remaining events
    const loadEvent=getPreloadedLoadEvent(preloadedEventsArray);// Set the final preloaded events array in global object
    setExposedGlobal(GLOBAL_PRELOAD_BUFFER,clone([...preloadedEventsArray]));// Process load method if present in the buffered requests
    if(loadEvent.length>0){// Remove the event name from the Buffered Event array and keep only arguments
    loadEvent.shift();// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.load.apply(null,loadEvent);}}/**
       * Get ready callback arguments and forward to ready call
       */ready(callback){try{this.getAnalyticsInstance()?.ready(getSanitizedValue(callback));}catch(error){dispatchErrorEvent(error);}}/**
       * Process page arguments and forward to page call
       */// These overloads should be same as AnalyticsPageMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
    page(category,name,properties,options,callback){try{this.getAnalyticsInstance()?.page(pageArgumentsToCallOptions(getSanitizedValue(category),getSanitizedValue(name),getSanitizedValue(properties),getSanitizedValue(options),getSanitizedValue(callback)));}catch(error){dispatchErrorEvent(error);}}/**
       * Process track arguments and forward to page call
       */// These overloads should be same as AnalyticsTrackMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
    track(event,properties,options,callback){try{this.getAnalyticsInstance()?.track(trackArgumentsToCallOptions(getSanitizedValue(event),getSanitizedValue(properties),getSanitizedValue(options),getSanitizedValue(callback)));}catch(error){dispatchErrorEvent(error);}}/**
       * Process identify arguments and forward to page call
       */// These overloads should be same as AnalyticsIdentifyMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
    identify(userId,traits,options,callback){try{this.getAnalyticsInstance()?.identify(identifyArgumentsToCallOptions(getSanitizedValue(userId),getSanitizedValue(traits),getSanitizedValue(options),getSanitizedValue(callback)));}catch(error){dispatchErrorEvent(error);}}/**
       * Process alias arguments and forward to page call
       */// These overloads should be same as AnalyticsAliasMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
    alias(to,from,options,callback){try{this.getAnalyticsInstance()?.alias(aliasArgumentsToCallOptions(getSanitizedValue(to),getSanitizedValue(from),getSanitizedValue(options),getSanitizedValue(callback)));}catch(error){dispatchErrorEvent(error);}}/**
       * Process group arguments and forward to page call
       */// These overloads should be same as AnalyticsGroupMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
    group(groupId,traits,options,callback){try{this.getAnalyticsInstance()?.group(groupArgumentsToCallOptions(getSanitizedValue(groupId),getSanitizedValue(traits),getSanitizedValue(options),getSanitizedValue(callback)));}catch(error){dispatchErrorEvent(error);}}reset(resetAnonymousId){try{this.getAnalyticsInstance()?.reset(getSanitizedValue(resetAnonymousId));}catch(error){dispatchErrorEvent(error);}}getAnonymousId(options){try{return this.getAnalyticsInstance()?.getAnonymousId(getSanitizedValue(options));}catch(error){dispatchErrorEvent(error);return undefined;}}setAnonymousId(anonymousId,rudderAmpLinkerParam){try{this.getAnalyticsInstance()?.setAnonymousId(getSanitizedValue(anonymousId),getSanitizedValue(rudderAmpLinkerParam));}catch(error){dispatchErrorEvent(error);}}getUserId(){try{return this.getAnalyticsInstance()?.getUserId();}catch(error){dispatchErrorEvent(error);return undefined;}}getUserTraits(){try{return this.getAnalyticsInstance()?.getUserTraits();}catch(error){dispatchErrorEvent(error);return undefined;}}getGroupId(){try{return this.getAnalyticsInstance()?.getGroupId();}catch(error){dispatchErrorEvent(error);return undefined;}}getGroupTraits(){try{return this.getAnalyticsInstance()?.getGroupTraits();}catch(error){dispatchErrorEvent(error);return undefined;}}startSession(sessionId){try{this.getAnalyticsInstance()?.startSession(getSanitizedValue(sessionId));}catch(error){dispatchErrorEvent(error);}}endSession(){try{this.getAnalyticsInstance()?.endSession();}catch(error){dispatchErrorEvent(error);}}getSessionId(){try{return this.getAnalyticsInstance()?.getSessionId();}catch(error){dispatchErrorEvent(error);return undefined;}}setAuthToken(token){try{this.getAnalyticsInstance()?.setAuthToken(getSanitizedValue(token));}catch(error){dispatchErrorEvent(error);}}consent(options){try{this.getAnalyticsInstance()?.consent(getSanitizedValue(options));}catch(error){dispatchErrorEvent(error);}}}
    

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
