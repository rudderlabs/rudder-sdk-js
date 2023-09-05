/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Analytics } from '@rudderstack/analytics-js-service-worker';

const rudderClient = new Analytics('<writeKey>', '<dataplaneUrl>/v1/batch');

export default {
	async fetch(request, env, ctx) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
			'Access-Control-Allow-Headers': '*',
		};

		if (request.method.toLowerCase() === 'options') {
			return new Response('ok', {
				headers: corsHeaders,
			});
		}

		try {
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

			// this both flushes and ensures completion
			await flush();

			return new Response('Hello world', {
				headers: corsHeaders,
			});
		} catch (error) {
			return new Response(JSON.stringify(error), {
				headers: corsHeaders,
			});
		}
	},
};
