import eventFiltering1ExpectedData from '../../__mocks__/eventFiltering1.json';

const eventFilteringSuite = {
  id: 'eventFilteringFeature',
  name: 'eventFiltering',
  description:
    'Track Method: rudderanalytics.track(event, [properties], [apiOptions], [callback]);',
  testCases: [
    {
      id: 'eventFiltering',
      description: 'Call with all arguments and all primitives in properties and apiOptions',
      inputData: [
        {
          "message": {
            "channel": "web",
            "context": {
              "externalId": [
                {
                  "id": "lynnanderson@smith.net",
                  "identifierType": "device_id",
                  "type": "AM-users"
                }
              ],
              "mappedToDestination": "true",
              "app": {
                "build": "1.0.0",
                "name": "RudderLabs JavaScript SDK",
                "namespace": "com.rudderlabs.javascript",
                "version": "1.0.0"
              },
              "traits": {
                "anonymousId": "123456",
                "email": "sayan@gmail.com",
                "address": {
                  "country": "India",
                  "postalCode": 712136,
                  "state": "WB",
                  "street": "",
                  "os_version": "test os"
                },
                "ip": "0.0.0.0",
                "age": 26
              },
              "library": {
                "name": "RudderLabs JavaScript SDK",
                "version": "1.0.0"
              },
              "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
              "locale": "en-US",
              "ip": "0.0.0.0",
              "os": {
                "name": "",
                "version": ""
              },
              "screen": {
                "density": 2
              },
              "page": {
                "path": "/destinations/amplitude",
                "referrer": "",
                "search": "",
                "title": "",
                "url": "https://docs.rudderstack.com/destinations/amplitude",
                "category": "destination",
                "initial_referrer": "https://docs.rudderstack.com",
                "initial_referring_domain": "docs.rudderstack.com"
              }
            },
            "traits": {
              "anonymousId": "123456",
              "email": "sayan@gmail.com",
              "city": "kolkata",
              "address": {
                "country": "India",
                "postalCode": 712136,
                "state": "WB",
                "street": ""
              },
              "os_version": "test os",
              "ip": "0.0.0.0",
              "age": 26,
              "an": "Test App name",
              "ul": "Test ul"
            },
            "type": "identify",
            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
            "originalTimestamp": "2019-10-14T09:03:17.562Z",
            "anonymousId": "123456",
            "userId": "123456",
            "integrations": {
              "All": true
            },
            "sentAt": "2019-10-14T09:03:22.563Z"
          }
        }
      ],
      expectedResult: eventFiltering1ExpectedData,
      triggerHandler: 'track',
    }
  ],
};

export { eventFilteringSuite };
