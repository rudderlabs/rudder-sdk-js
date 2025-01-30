import { http, HttpResponse } from 'msw';
import {
  dummyCDNHost,
  dummyDataplaneHost,
  dummySourceConfigResponse,
  SDK_FILE_BASE_PATH,
  SDK_FILE_NAME,
} from './fixtures';
import fs from 'fs';
import path from 'path';

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
  http.get(`${dummyDataplaneHost}/jsonSample`, () => {
    return new HttpResponse(JSON.stringify({ json: 'sample' }), {
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
  http.get(`${dummyDataplaneHost}/jsFileSample`, () => {
    const fileContents = 'console.log("jsFileSample script executed")';
    return new HttpResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
        'Content-Length': fileContents.length.toString(),
      },
    });
  }),
  http.get(`${dummyDataplaneHost}/jsFileEmpty`, () => {
    const fileContents = '';
    return new HttpResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
        'Content-Length': fileContents.length.toString(),
      },
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
  http.post(`${dummyDataplaneHost}/rsaRequest`, () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Set-Cookie':
          'key1=value1; Path=/; Domain=dummy.dataplane.host.com; Expires=Mon, 22 Apr 2025 10:55:28 GMT; SameSite=Lax',
      },
    });
  }),
  http.post(`${dummyDataplaneHost}/serverDown/rsaRequest`, () => {
    return new HttpResponse(null, {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }),
  http.post(`${dummyDataplaneHost}/invalidUrl/rsaRequest`, () => {
    return new HttpResponse(null, {
      status: 404,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }),
  http.get(`${dummyCDNHost}/modern/${SDK_FILE_NAME}`, () => {
    const scriptContent = fs.readFileSync(
      path.join(path.resolve(__dirname, SDK_FILE_BASE_PATH), SDK_FILE_NAME),
      'utf-8',
    );
    return new HttpResponse(scriptContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
      },
    });
  }),
];

export { handlers };
