import Analytics from '@rudderstack/rudder-sdk-node';
import {
  destinationRouting,
  sampleAnonymousId,
  sampleUserId,
  type EventType,
} from './rudderstack-config';

let analytics: Analytics | undefined;

function getServerAnalytics(): Analytics {
  const writeKey = process.env.RUDDERSTACK_WRITE_KEY;
  const dataPlaneUrl = process.env.RUDDERSTACK_DATAPLANE_URL;

  if (!writeKey || !dataPlaneUrl) {
    throw new Error('Missing RUDDERSTACK_WRITE_KEY or RUDDERSTACK_DATAPLANE_URL.');
  }

  if (!analytics) {
    analytics = new Analytics(writeKey, {
      dataPlaneUrl,
      flushAt: 20,
      flushInterval: 10_000,
      logLevel: 'debug',
    });
  }

  return analytics;
}

export async function sendServerEvent(type: EventType): Promise<void> {
  const client = getServerAnalytics();
  const common = {
    userId: sampleUserId,
    integrations: destinationRouting,
  };

  switch (type) {
    case 'page':
      client.page({
        ...common,
        name: 'Next.js Server Page',
        properties: { renderedBy: 'getServerSideProps' },
      });
      break;
    case 'identify':
      client.identify({
        ...common,
        traits: { email: 'alex@example.com', plan: 'Pro' },
      });
      break;
    case 'track':
      client.track({
        ...common,
        event: 'Server Button Clicked',
        properties: { framework: 'Next.js', runtime: 'Node.js' },
      });
      break;
    case 'group':
      client.group({
        ...common,
        groupId: 'rudderstack-sample-company',
        traits: { name: 'Sample Company', industry: 'Software' },
      });
      break;
    case 'alias':
      client.alias({
        userId: sampleUserId,
        previousId: sampleAnonymousId,
        integrations: destinationRouting,
      });
      break;
  }

  // The Node SDK enqueues API calls with setImmediate. Wait for that task before flushing.
  await new Promise<void>(resolve => setImmediate(resolve));
  await client.flush();
}
