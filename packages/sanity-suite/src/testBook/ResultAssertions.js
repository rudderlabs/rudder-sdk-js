import objectPath from 'object-path';
import { diff } from 'deep-object-diff';
import { sortBy, prop } from 'ramda';
import { ignoredProperties } from '../ignoredProperties/ignoredProperties';
import { sourceConfigIgnoredProperties } from '../ignoredProperties/sourceConfigIgnoredProperties';

const ResultsAssertions = {
  // Do NOT check different value on these properties if they have value and is of correct type
  // as they are time sensitive, random ids, or they depend on client instance
  resultDataIgnoredPropertiesMutator(resultData, expectedResultData, ignoredPropertyList) {
    ignoredPropertyList.forEach(property => {
      if (
        // eslint-disable-next-line valid-typeof
        typeof objectPath.get(resultData, property.key) === property.type ||
        property.optional === true
      ) {
        objectPath.set(resultData, property.key, objectPath.get(expectedResultData, property.key));
      }
    });
  },

  sanitizeResultData(result, expectedResult) {
    try {
      const resultData = JSON.parse(result);
      const expectedResultData = JSON.parse(expectedResult);
      const isEventMessagePayload = Boolean(resultData.message);
      const isSourceConfigAPIPayload = Boolean(resultData.source);

      if (isEventMessagePayload) {
        ResultsAssertions.resultDataIgnoredPropertiesMutator(
          resultData,
          expectedResultData,
          ignoredProperties,
        );
      } else if (isSourceConfigAPIPayload) {
        // Sort destinations array by id
        const sortByDestId = sortBy(prop('id'));
        resultData.source.destinations = sortByDestId([].concat(resultData.source.destinations));
        expectedResultData.source.destinations = sortByDestId(
          [].concat(expectedResultData.source.destinations),
        );

        ResultsAssertions.resultDataIgnoredPropertiesMutator(
          resultData,
          expectedResultData,
          sourceConfigIgnoredProperties,
        );
      }

      return {
        resultData: JSON.stringify(resultData, undefined, 2),
        expectedResultData: JSON.stringify(expectedResultData, undefined, 2),
      };
    } catch (e) {
      console.error(e);
      return {
        resultData: JSON.stringify({}, undefined, 2),
        expectedResultData: JSON.stringify({}, undefined, 2),
      };
    }
  },

  assertResult(result, expected) {
    return result === expected ? 'success' : 'danger';
  },

  assertDeepObjectDiffResult(result, expected) {
    try {
      const resultObj = JSON.parse(result);
      const expectedObj = JSON.parse(expected);
      const comparisonDiff = diff(expectedObj, resultObj);
      const isEqual = Object.keys(comparisonDiff).length === 0;
      if (!isEqual) {
        console.error(`Error: Comparison diff: `, comparisonDiff);
      }
      return isEqual ? 'success' : 'danger';
    } catch (e) {
      console.error(`Error: Comparison diff: `, e);
      return 'danger';
    }
  },
};

export { ResultsAssertions };
