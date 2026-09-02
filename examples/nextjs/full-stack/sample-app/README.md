# RudderStack Next.js full-stack sample

This sample sends RudderStack events from both Next.js runtime environments:

- The browser uses `@rudderstack/analytics-js`.
- `getServerSideProps` and an API route use `@rudderstack/rudder-sdk-node`.

The sample uses the Pages Router to demonstrate the server-side tracking case from [SDK-2454](https://linear.app/rudderstack/issue/SDK-2454/create-a-sample-app-with-nextjs-utilising-node-sdk).

## Configure the sample

From the repository root, create `.env` from `.env.example`. Then run the shared setup script:

```bash
cp .env.example .env
./scripts/setup-examples-env.sh
```

The script creates this sample's local `.env` file. You can also copy this directory's `.env.example` to `.env` and replace each placeholder manually.

The server and browser settings use the same source in this sample. The `NEXT_PUBLIC_` values are included in the browser bundle. RudderStack write keys are designed for client-side use, but you must not put other secrets in these variables.

## Run the sample

```bash
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What the sample demonstrates

The browser buttons call the JavaScript SDK `page`, `identify`, `track`, `group`, and `alias` APIs.

The server buttons call a Next.js API route. The route calls the same event APIs on the Node SDK. `getServerSideProps` also sends a `page` event for each server-rendered request.

Both SDK paths include an `integrations` setting. Edit `src/lib/rudderstack-config.ts` to select destinations by their dashboard names.

## Keep the Node SDK on the server

Only `getServerSideProps` and the API route import `src/lib/rudderstack-server.ts`. Do not import this module from browser code. `getServerSideProps` uses a dynamic import so the browser build does not follow the Node SDK dependency.

`next.config.js` lists `@rudderstack/rudder-sdk-node` in `serverExternalPackages`. Next.js then uses the installed Node.js package instead of adding it to a browser or server bundle. This prevents Node.js dependencies such as `fs` from entering a browser bundle.

The server module creates one shared Node SDK client. It does not create a new client for each event. The server waits for the SDK to enqueue the event. The API route then waits for `flush()` before it finishes the request. This behavior is important for short-lived serverless runtimes.
