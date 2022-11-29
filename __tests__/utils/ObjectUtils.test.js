import merge from "lodash.merge";
import { mergeDeepRight, mergeDeepRightObjectArrays } from "../../src/utils/ObjectUtils";

const identifyTraitsPayloadMock = {
  firstName: "Dummy Name",
  phone: "1234567890",
  email: "dummy@email.com",
  custom_flavor: "chocolate",
  custom_date: Date.now(),
  address: [{
    label: "office",
    city: "Brussels",
    country: "Belgium"
  }, {
    label: "home",
    city: "Kolkata",
    country: "India",
    nested: {
      type: "flat"
    }
  }, {
    label: "work",
    city: "Kolkata",
    country: "India"
  }]
};

const trackTraitsOverridePayloadMock = {
  address: [{
    label: "Head office",
    city: "NYC",
    country: "Belgium"
  }, {
    label: "home",
    city: "Kolkata",
    country: "India",
    nested: {
      type: "detached house"
    }
  }]
};

const expectedMergedTraitsPayload = {
  firstName: "Dummy Name",
  phone: "1234567890",
  email: "dummy@email.com",
  custom_flavor: "chocolate",
  custom_date: Date.now(),
  address: [{
    label: "Head office",
    city: "NYC",
    country: "Belgium"
  }, {
    label: "home",
    city: "Kolkata",
    country: "India",
    nested: {
      type: "detached house"
    }
  }, {
    label: "work",
    city: "Kolkata",
    country: "India"
  }]
};

describe("Object utilities", () => {

  it("should merge right object array items", () => {
    const mergedArray = mergeDeepRightObjectArrays(identifyTraitsPayloadMock.address, trackTraitsOverridePayloadMock.address);
    expect(mergedArray).toEqual(expectedMergedTraitsPayload.address);
  });

  it("should merge right nested object properties", () => {
    const mergedArray = mergeDeepRight(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock);
    expect(mergedArray).toEqual(expectedMergedTraitsPayload);
  });

  it("should merge right nested object properties like lodash merge", () => {
    const mergedArray = mergeDeepRight(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock);
    expect(mergedArray).toEqual(merge(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock));
  });
});
