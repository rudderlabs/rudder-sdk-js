# RudderStack Cloudflare Worker Example

This example demonstrates how to integrate RudderStack with a Cloudflare Worker.

## Setup

1. Copy the environment variables template to your local .env file:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your RudderStack credentials:
   ```
   RUDDERSTACK_WRITE_KEY=your_write_key_here
   RUDDERSTACK_DATAPLANE_URL=your_dataplane_url_here
   ```

3. Run the script to update the wrangler configuration:
   ```
   npm run config
   ```

4. Install dependencies:
   ```
   npm install
   ```

5. Deploy to Cloudflare Workers:
   ```
   npm run deploy
   ```

## Development

To test your worker locally:

```
npm run start
```

This will start a local development server that simulates the Cloudflare Workers environment.

## Implementation Details

- The RudderStack Analytics client is initialized only once as a global variable outside the request handler to improve performance.
- The client will automatically use the environment variables set in your wrangler.toml file.
- For each request, the worker sends a track event and ensures it's flushed before sending a response.

## Structure

- `src/worker.js` - The main worker code
- `wrangler.toml` - Cloudflare Workers configuration
- `.env` - Environment variables (not committed to git)
- `scripts/update-wrangler-config.js` - Script to update wrangler.toml with values from .env

## Learn More

- [RudderStack Documentation](https://rudderstack.com/docs/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/) 
