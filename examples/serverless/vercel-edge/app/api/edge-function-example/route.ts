import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Analytics } from '@rudderstack/analytics-js-service-worker';

const writeKey = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
const dataplaneUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL;

let rudderClient: Analytics | undefined;
if (writeKey && dataplaneUrl) {
  rudderClient = new Analytics(writeKey, `${dataplaneUrl}/v1/batch`, {
    flushAt: 1,
  });
} else {
  console.error('RudderStack configuration missing. Please check environment variables.');
}

export const runtime = 'edge'; // 'nodejs' is the default

export function GET(request: NextRequest) {
  rudderClient?.track({
    userId: '123456',
    event: 'test vercel edge worker',
    properties: {
      data: {
        url: 'test vercel edge worker',
      },
    },
  });

  return NextResponse.json(
    {
      body: request.body,
      query: request.nextUrl.search,
      cookies: request.cookies.getAll(),
    },
    {
      status: 200,
    },
  );
}
