import objectPath from 'object-path';
import { ignoredProperties } from './ignoredProperties';

class ResultsAssertions {
  // Do NOT check different value on these properties if they have value and is of correct type
  // as they are time sensitive, random ids, or they depend on client instance
  static sanitizeResultData(result, expectedResult) {
    const resultData = JSON.parse(result);
    const expectedResultData = JSON.parse(expectedResult);

    ignoredProperties.forEach((property) => {
      if (typeof objectPath.get(resultData, property.key) === property.type) {
        objectPath.set(resultData, property.key, objectPath.get(expectedResultData, property.key));
      }
    });

    return JSON.stringify(resultData, undefined, 2);
  }

  static assertResult(result, expected) {
    return result === expected ? 'success' : 'danger';
  }
}

export { ResultsAssertions };
