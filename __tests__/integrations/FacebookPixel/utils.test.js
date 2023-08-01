import {
    buildPayLoad, getHashedStatus
} from '../../../src/integrations/FacebookPixel/utils';

const blacklistPiiPropertiesMock = [
    {
        "blacklistPiiProperties": "BlacklistPiiPropertyHashTrue",
        "blacklistPiiHash": true
    },
    {
        "blacklistPiiProperties": "BlacklistPiiPropertyHashFalse",
        "blacklistPiiHash": false
    },
    {
        "blacklistPiiProperties": "BlacklistPiiPropertyHashTrueNonString",
        "blacklistPiiHash": true
    },
    {
        "blacklistPiiProperties": "BlacklistPiiPropertyHashFalseNonString",
        "blacklistPiiHash": false
    },
    {
        "blacklistPiiProperties": "firstName",
        "blacklistPiiHash": true
    },
    {
        "blacklistPiiProperties": "lastName",
        "blacklistPiiHash": false
    }
]

const whitelistPiiPropertiesMock = [
    {
        "whitelistlistPiiProperties": "customPiiPropertyWhiteHashFalse"
    },
    {
        "whitelistPiiProperties": "customPiiPropertyWhiteHashTrue"
    },
    {
        "whitelistPiiProperties": "email"
    },
    {
        "whitelistPiiProperties": "nonPiiWhiteListedProperty"
    }
]

const piiPropertiesObject = {
    gender: 'male',
    city: 'New York',
    country: 'USA',
    phone: '1234567890',
    state: 'NY',
    zip: '10001',
    birthday: '01/01/2000'
}

describe('buildPayLoad_function', () => {
    // Tests that payload is built correctly with default pii properties
    it('test_default_pii_properties', () => {
        let rudderElement = {
            message: {
                properties: {
                    lastName: 'Doe',
                    gender: 'male',
                    city: 'New York',
                    country: 'USA',
                    phone: '1234567890',
                    state: 'NY',
                    zip: '10001',
                    birthday: '01/01/2000'
                }
            }
        };
        const expectedPayload = {};
        expect(buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock)).toEqual(expectedPayload);
    });

    it('test_no_pii_no_whitelist_blacklist_props', () => {
        let rudderElement = {
            message: {
                properties: {
                    "prop1": "value1",
                    "prop2": "value2",
                }
            }
        };
        const expectedPayload = {
            "prop1": "value1",
            "prop2": "value2",
        };
        expect(buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock)).toEqual(expectedPayload);
    });

    // blacklist properties if hash true then but not a string value then not hashed
    it('test_custom_pii_properties_non_string_val', () => {
        let rudderElement = {
            message: {
                properties: {
                    customPiiPropertyWhiteHashFalse: 1234,
                    BlacklistPiiPropertyHashTrueNonString: 1234,
                    BlacklistPiiPropertyHashFalseNonString: 1234,
                    customPiiPropertyWhiteHashFalse: 1234,
                }
            }
        };
        const expectedPayload = {
            customPiiPropertyWhiteHashFalse: 1234,
        };
        expect(buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock)).toEqual(expectedPayload);
    });

    // whitelist properties hash true or not , is not hashed
    it('test_whitelist_pii_properties', () => {
        let rudderElement = {
            message: {
                properties: {
                    email: 'test@test.com',

                }
            }
        };
        const expectedPayload = {
            email: 'test@test.com',
        };
        expect(buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock)).toEqual(expectedPayload);
    });

    // Tests that payload is built correctly with empty message properties
    it('test_empty_message_properties', () => {
        let rudderElement = {
            message: {
                properties: {}
            }
        };
        const expectedPayload = {};
        expect(buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock)).toEqual(expectedPayload);
    });

    // Tests that payload is built correctly with empty blacklist pii properties
    it('test_empty_blacklist_pii_whitelist_pii_properties', () => {
        let rudderElement = {
            message: {
                properties: {
                    ...piiPropertiesObject,
                    email: 'test@test.com',
                    firstName: 'John',
                    lastName: 'Doe',
                }
            }
        };
        const expectedPayload = {};
        const emptyblacklistPiiPropertiesMock = [];
        const emptywhitelistPiiPropertiesMock = [];
        expect(buildPayLoad(rudderElement, emptyblacklistPiiPropertiesMock, emptywhitelistPiiPropertiesMock)).toEqual(expectedPayload);
    });

    // Tests that an empty payload returns an empty object
    it('test_empty_payload', () => {
        let rudderElement = {
            message: {
                properties: {}
            }
        };
        const result = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(result).toEqual({});
    });

    // Tests that a payload with only PII properties returns an empty object
    it('test_only_pii_properties', () => {
        let rudderElement = {
            message: {
                properties: {
                    email: 'test@test.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    ...piiPropertiesObject
                }
            }
        };
        const result = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(result).toEqual({
            "firstName": "a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da",
            "email": "test@test.com",
        });
    });

    // Tests that a payload with only date properties returns an empty object
    it('test_only_date_properties', () => {
        let rudderElement = {
            message: {
                properties: {
                    checkinDate: "2023-07-19",
                    checkoutDate: "2023-07-19",
                    departingArrivalDate: "2023-07-19",
                    departingDepartureDate: "2023-07-19",
                    returningArrivalDate: "2023-07-19",
                    returningDepartureDate: "2023-07-19",
                    travelEnd: "2023-07-19",
                    travelStart: "2023-07-19"
                }
            }
        };
        const result = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(result).toEqual({
            "checkinDate": "2023-07-19",
            "checkoutDate": "2023-07-19",
            "departingArrivalDate": "2023-07-19",
            "departingDepartureDate": "2023-07-19",
            "returningArrivalDate": "2023-07-19",
            "returningDepartureDate": "2023-07-19",
            "travelEnd": "2023-07-19",
            "travelStart": "2023-07-19",
        });
    });
    // Tests that a payload with a non-whitelisted PII property returns an empty object
    it('test_non_whitelisted_pii_property', () => {
        let rudderElement = {
            message: {
                properties: {
                    ...piiPropertiesObject,
                    firstName: 'John',
                    lastName: 'Doe',
                    ssn: '123-45-6789'
                }
            }
        };
        const result = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(result).toEqual({
            firstName: "a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da",
            ssn: '123-45-6789'
        });
    });

    // Tests that a payload with a non-string blacklisted PII property is not hashed
    it('test_non_string_blacklisted_pii_property', () => {
        let rudderElement = {
            message: {
                properties: {
                    ...piiPropertiesObject,
                    email: 'test@test.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    BlacklistPiiPropertyHashTrueNonString: 123456789,
                    BlacklistPiiPropertyHashFalseNonString: 123456789
                }
            }
        };
        const result = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(result.ssn).toBeUndefined();
    });

    // Tests that all PII properties in the blacklist are excluded from the payload or hashed if required
    it('test_pii_properties_in_blacklist_excluded_or_hashed', () => {
        let rudderElement = {
            message: {
                properties: {
                    firstName: 'John',
                    lastName: 'Doe',
                    BlacklistPiiPropertyHashTrue: 'should be hashed',
                    BlacklistPiiPropertyHashFalse: 'should not be hashed',

                },
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual({
            "firstName": "a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da",
            "BlacklistPiiPropertyHashTrue": "cde0eb46fc74cc39cb142e54bff325ea12a317c3b4521e71a7efab7121e598d7",
        });
    });

    // Tests that all PII properties in the whitelist are included in the payload
    it('test_all_pii_properties_in_whitelist_included', () => {
        let rudderElement = {
            message: {
                properties: {
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    customPiiPropertyWhiteHashFalse: 'not hashed',
                    customPiiPropertyWhiteHashTrue: 'hashed',
                },
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual({
            customPiiPropertyWhiteHashFalse: 'not hashed',
            "customPiiPropertyWhiteHashTrue": "hashed",
            "firstName": "a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da",
            "email": "test@example.com",
        });
    });

    // Tests that a payload with a non-blacklisted PII property is included in the payload
    it('test_non_blacklisted_pii_property_included', () => {
        let rudderElement = {
            message: {
                properties: {
                    city: 'San Francisco',
                    country: 'USA',
                    phone: '1234567890',
                    state: 'CA',
                },
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual({});
    });

    // Tests that a payload with a date field in the dateFields array is converted to ISO string format
    it('test_date_fields_converted_to_iso_string', () => {
        let rudderElement = {
            message: {
                properties: {
                    checkinDate: new Date('2022-01-01'),
                    checkoutDate: new Date('2022-01-02'),
                    departingArrivalDate: new Date('2022-01-03'),
                    departingDepartureDate: new Date('2022-01-04'),
                    returningArrivalDate: new Date('2022-01-05'),
                    returningDepartureDate: new Date('2022-01-06'),
                    travelEnd: new Date('2022-01-07'),
                    travelStart: new Date('2022-01-08'),
                },
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual({
            checkinDate: '2022-01-01',
            checkoutDate: '2022-01-02',
            departingArrivalDate: '2022-01-03',
            departingDepartureDate: '2022-01-04',
            returningArrivalDate: '2022-01-05',
            returningDepartureDate: '2022-01-06',
            travelEnd: '2022-01-07',
            travelStart: '2022-01-08',
        });
    });

    // Tests that the payload includes all properties when the whitelist contains non-PII properties and the blacklist only contains non-PII properties
    it('test_payload_includes_all_properties_when_whitelist_contains_non_pii_and_blacklist_only_non_pii', () => {
        let rudderElement = {
            message: {
                "properties": {
                    nonPiiWhiteListedProperty: 'non-pii-value',
                    BlacklistPiiPropertyHashTrue: 'hashed',
                    BlacklistPiiPropertyHashFalse: 'not hashed',

                }
            }
        };
        const expectedPayload = {
            "nonPiiWhiteListedProperty": "non-pii-value",
            "BlacklistPiiPropertyHashTrue": "1a06df824ed741b53c785079a6347f00eec5af82f9850775409ca69dff4068a6"
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual(expectedPayload);
    });

    // Tests that the payload includes all properties when the whitelist contains non-PII properties and the blacklist only contains non-PII properties
    it('test_payload_includes_all_properties_when_whitelist_contains_non_pii_and_blacklist_only_non_pii_absent_in_input', () => {
        let rudderElement = {
            message: {
                "properties": {
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'USA',
                    phone: '1234567890',
                    gender: 'male',
                }
            }
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual({});
    });

    // Tests that the payload includes all properties when the whitelist contains non-PII properties and the blacklist only contains PII properties that are not required to be hashed
    it('test_payload_includes_all_properties_when_whitelist_contains_non_pii_and_blacklist_only_pii_not_hashed', () => {
        let rudderElement = {
            message: {
                "properties": {
                    firstName: 'John',
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                    customPiiPropertyWhiteHashFalse: 'should be hashed',
                },
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual({
            "customPiiPropertyWhiteHashFalse": "should be hashed",
            "firstName": "a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da",
        });
    });

    // Tests that the payload includes all properties when the whitelist contains non-PII properties and the blacklist only contains non-PII properties
    it('test_payload_includes_all_properties_when_whitelist_contains_non_pii_and_blacklist_only_non_pii', () => {
        let rudderElement = {
            message: {
                "properties": {
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                    customPiiPropertyWhiteHashFalse: 'should not be hashed',
                    BlacklistPiiPropertyHashTrue: 'should be hashed',
                    BlacklistPiiPropertyHashFalse: 'should not be hashed',
                },
            }
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock);
        expect(payload).toEqual({
            "BlacklistPiiPropertyHashTrue": "cde0eb46fc74cc39cb142e54bff325ea12a317c3b4521e71a7efab7121e598d7",
            "customPiiPropertyWhiteHashFalse": "should not be hashed",
        });
    });

    it('if_integrationobj_contains_hash_true_for_pii_blacklist', () => {
        let blacklistPiiPropertiesMock = [
            {
                "blacklistPiiProperties": "lastName",
                "blacklistPiiHash": true
            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    firstName: 'John',
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": "true"
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            "lastName": "Doe"
        });
    })

    it('if_integrationobj_contains_hash_true_for_non_pii_blacklist', () => {
        let blacklistPiiPropertiesMock = [
            {
                "blacklistPiiProperties": "BlacklistPiiPropertyHashTrue",
                "blacklistPiiHash": true
            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    firstName: 'John',
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                    BlacklistPiiPropertyHashTrue: 'should not be hashed',
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": "true"
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            "BlacklistPiiPropertyHashTrue": "should not be hashed",
        });
    })

    it('if_integrationobj_contains_hash_true_for_non_pii_whitelist', () => {
        let whitelistPiiPropertiesMock = [
            {
                "whitelistPiiProperties": "whitelistNonDefaultPiiProperties",

            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                    whitelistNonDefaultPiiProperties: 'should not be hashed',
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": "true"
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            "whitelistNonDefaultPiiProperties": "should not be hashed",
        });
    })

    it('if_integrationobj_contains_hash_true_for_pii_whitelist', () => {
        let whitelistPiiPropertiesMock = [
            {
                "whitelistPiiProperties": "email",

            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    email: 'acb@gmail.com',
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": "true"
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            email: 'acb@gmail.com',
        });
    })

    it('if_integrationobj_contains_hash_false_for_pii_blacklist', () => {
        let blacklistPiiPropertiesMock = [
            {
                "blacklistPiiProperties": "lastName",
                "blacklistPiiHash": true
            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    firstName: 'John',
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": false
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            "lastName": "fd53ef835b15485572a6e82cf470dcb41fd218ae5751ab7531c956a2a6bcd3c7"
        });
    })

    it('if_integrationobj_contains_hash_false_for_non_pii_blacklist', () => {
        let blacklistPiiPropertiesMock = [
            {
                "blacklistPiiProperties": "BlacklistPiiPropertyHashTrue",
                "blacklistPiiHash": true
            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    firstName: 'John',
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                    BlacklistPiiPropertyHashTrue: 'should not be hashed',
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": false
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            "BlacklistPiiPropertyHashTrue": "735dd9dca6186f03c27694a4e65d4cadc4330cea27b6e46bc53d36f7fc3ae9a9",
        });
    })

    it('if_integrationobj_contains_hash_false_for_non_pii_whitelist', () => {
        let whitelistPiiPropertiesMock = [
            {
                "whitelistPiiProperties": "whitelistNonDefaultPiiProperties",

            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                    whitelistNonDefaultPiiProperties: 'should not be hashed',
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": false
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            "whitelistNonDefaultPiiProperties": "should not be hashed",
        });
    })

    it('if_integrationobj_contains_hash_false_for_pii_whitelist', () => {
        let whitelistPiiPropertiesMock = [
            {
                "whitelistPiiProperties": "email",

            }
        ]
        let rudderElement = {
            message: {
                "properties": {
                    email: 'acb@gmail.com',
                    lastName: 'Doe',
                    ...piiPropertiesObject,
                },
                "integrations": {
                    "All": true,
                    "fbpixel": {
                        "hashed": false
                    }
                }
            },
        };
        const payload = buildPayLoad(rudderElement, whitelistPiiPropertiesMock, blacklistPiiPropertiesMock, getHashedStatus(rudderElement.message, "fbpixel"));
        expect(payload).toEqual({
            email: 'acb@gmail.com',
        });
    })
});


