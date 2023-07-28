import objectPath from 'object-path';
import deepEqual from 'deep-equal';
import { ignoredProperties } from './ignoredProperties';

class ResultsAssertions {
  // Do NOT check different value on these properties if they have value and is of correct type
  // as they are time sensitive, random ids, or they depend on client instance
  static sanitizeResultData(result, expectedResult) {
    try {
      const resultData = JSON.parse(result);
      const expectedResultData = JSON.parse(expectedResult);

      ignoredProperties.forEach(property => {
        if (
          typeof objectPath.get(resultData, property.key) === property.type ||
          property.optional === true
        ) {
          objectPath.set(
            resultData,
            property.key,
            objectPath.get(expectedResultData, property.key),
          );
        }
      });

      return JSON.stringify(resultData, undefined, 2);
    } catch (e) {
      console.error(e);
      return JSON.stringify({}, undefined, 2);
    }
  }

  static assertResult(result, expected) {
    return result === expected ? 'success' : 'danger';
  }

  static assertDeepObjectDiffResult(result, expected) {
    try {
      const resultObj = JSON.parse(result);
      const expectedObj = JSON.parse(expected);
      return deepEqual(resultObj, expectedObj) ? 'success' : 'danger';
    } catch (e) {
      console.error(`Error: Comparison diff: ${e}`);
      return 'danger';
    }
  }
}

export { ResultsAssertions };
