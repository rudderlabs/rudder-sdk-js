// util function to convert the input to string type
function convertToString(input) {
  if (input) {
    if (typeof input === 'string') {
      return input;
    }

    return String(input);
  }
  return '';
}

// convert string to words
function toWords(input) {
  const regex =
    /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

  return convertToString(input).match(regex);
}

// convert the input array to camel case
function toCamelCase(inputArray) {
  let result = '';
  if (!inputArray) return result;

  for (let i = 0, len = inputArray.length; i < len; i += 1) {
    const currentStr = inputArray[i];

    let tempStr = currentStr.toLowerCase();

    if (i !== 0) {
      // convert first letter to upper case (the word is in lowercase)
      tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
    }
    result += tempStr;
  }
  return result;
}

// this function call all other functions

function camelcase(input) {
  const words = toWords(input);

  return toCamelCase(words);
}

export default camelcase;
