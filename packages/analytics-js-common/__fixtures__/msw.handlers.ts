import { http, HttpResponse } from 'msw';
import { dummyDataplaneHost, dummyScriptSourceBase, dummySourceConfigResponse } from './fixtures';

const handlers = [
  http.get(`${dummyDataplaneHost}/rawSample`, () => {
    return new HttpResponse('{"raw": "sample"}', {
      status: 200,
    });
  }),
  http.get(`${dummyDataplaneHost}/brokenJsonSample`, () => {
    return new HttpResponse('{raw: sample}', {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }),
  http.get(`${dummyDataplaneHost}/emptyJsonSample`, () => {
    return new HttpResponse('', {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }),
  http.get(`${dummyDataplaneHost}/404ErrorSample`, () => {
    return new HttpResponse(null, {
      status: 404,
    });
  }),
  http.get(`${dummyDataplaneHost}/429ErrorSample`, () => {
    return new HttpResponse(null, {
      status: 429,
    });
  }),
  http.get(`${dummyDataplaneHost}/500ErrorSample`, () => {
    return new HttpResponse(null, {
      status: 500,
    });
  }),
  http.get(`${dummyDataplaneHost}/noConnectionSample`, () => {
    return HttpResponse.error();
  }),
  http.get(`${dummyScriptSourceBase}/jsFileSample.js`, () => {
    const fileContents = 'console.log("jsFileSample script executed")';
    return new HttpResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Content-Length': fileContents.length.toString(),
      },
    });
  }),
  http.get(`${dummyScriptSourceBase}/jsFileEmpty.js`, () => {
    const fileContents = '';
    return new HttpResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Content-Length': fileContents.length.toString(),
      },
    });
  }),
  http.get(`${dummyScriptSourceBase}/fileDoesNotExist.js`, () => {
    return HttpResponse.error();
  }),
  http.get(`${dummyScriptSourceBase}/longResponseScript.js`, () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const fileContents = 'console.log("jsFileSample script executed")';
        resolve(HttpResponse.error());
      }, 101); // Simulating a delay
    });
  }),
  http.get(`${dummyDataplaneHost}/sourceConfig`, () => {
    return new HttpResponse(JSON.stringify(dummySourceConfigResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }),
];

export { handlers };
