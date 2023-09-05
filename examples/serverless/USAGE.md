# Serverless Usage

RudderStack JS SDK service worker can be used in serverless runtimes like Cloudflare Workers or Vercel Edge functions.
It exposes the same interface and features as the [nodeJS SDK](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-node-sdk/)

## Table of contents

- [**Examples**](#examples)
- [**Cloudflare Worker**](#Cloudflare-Worker)
- [**Vercel Edge**](#Vercel-Edge)

## Examples

The provided examples are based on official documentation of the platforms, these contain minimal
vercel edge and cloudflare worker implementation.

## Cloudflare Worker

RudderStack JS SDK service worker can be utilised in Cloudflare workers. You can start with the
[sample](https://developers.cloudflare.com/workers/get-started/guide/) and alter the worker.js file
to integrate the sdk:

    import { Analytics } from '@rudderstack/analytics-js-service-worker';

    const rudderClient = new Analytics(
      "<writeKey>",
      "<dataplaneUrl>/v1/batch",
      {
        flushAt: 1
      }
    );

You can then utilise the RudderStack JS SDK within the fetch methods with promisified flush:

    const flush = () => new Promise((resolve) => rudderClient.flush(resolve));

    rudderClient.track({
      userId: '123456',
      event: 'test cloudflare worker',
      properties: {
        data: {
          url: 'test cloudflare worker',
        },
      },
    });

    await flush();

See relevant [example](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/cloudflare-worker)

## Vercel Edge

RudderStack JS SDK service worker can be utilised in Vercel Edge functions. You can start with the
[sample](https://vercel.com/docs/functions/edge-functions/quickstart) and alter the
app/api/edge-function-sample/route.ts file to integrate the sdk:

    import { Analytics } from '@rudderstack/analytics-js-service-worker';

    const rudderClient = new Analytics(
      "<writeKey>",
      "<dataplaneUrl>/v1/batch",
      {
        flushAt: 1
      }
    );

You can then utilise the RudderStack JS SDK within the fetch methods as usual:

    rudderClient.track({
      userId: '123456',
      event: 'test vercel edge worker',
      properties: {
        data: {
          url: 'test vercel edge worker',
        },
      }
    });

See relevant [example](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/vencel-edge)

## External resources

- [Cloudflare Workers - Get Started](https://developers.cloudflare.com/workers/get-started/guide/)
- [Quickstart for Using Edge Functions](https://vercel.com/docs/functions/edge-functions/quickstart)
