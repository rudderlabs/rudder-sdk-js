import Head from 'next/head';
import { useState } from 'react';
import { getBrowserAnalytics } from '@/lib/rudderstack-client';
import {
  destinationRouting,
  sampleAnonymousId,
  sampleUserId,
  type EventType,
} from '@/lib/rudderstack-config';

type HomeProps = {
  serverPageEvent: string;
};

const eventTypes: EventType[] = ['page', 'identify', 'track', 'group', 'alias'];

export default function Home({ serverPageEvent }: HomeProps) {
  const [browserStatus, setBrowserStatus] = useState('No browser event sent yet.');
  const [serverStatus, setServerStatus] = useState(serverPageEvent);

  const sendBrowserEvent = (type: EventType) => {
    const analytics = getBrowserAnalytics();
    if (!analytics) {
      setBrowserStatus('Add the browser environment variables before you send events.');
      return;
    }

    switch (type) {
      case 'page':
        analytics.page(
          'Next.js Browser Page',
          { renderedBy: 'browser' },
          { integrations: destinationRouting },
        );
        break;
      case 'identify':
        analytics.identify(
          sampleUserId,
          { email: 'alex@example.com', plan: 'Pro' },
          { integrations: destinationRouting },
        );
        break;
      case 'track':
        analytics.track(
          'Browser Button Clicked',
          { framework: 'Next.js', runtime: 'browser' },
          { integrations: destinationRouting },
        );
        break;
      case 'group':
        analytics.group(
          'rudderstack-sample-company',
          { name: 'Sample Company', industry: 'Software' },
          { integrations: destinationRouting },
        );
        break;
      case 'alias':
        analytics.setAnonymousId(sampleAnonymousId);
        analytics.alias(sampleUserId, { integrations: destinationRouting });
        break;
    }

    setBrowserStatus(`The browser queued a ${type} event.`);
  };

  const sendEventFromServer = async (type: EventType) => {
    setServerStatus(`Sending a ${type} event from the server...`);

    try {
      const response = await fetch('/api/server-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const result = (await response.json()) as { message: string };
      setServerStatus(result.message);
    } catch (error) {
      console.error('Failed to call the server event API.', error);
      setServerStatus('The request to the server failed.');
    }
  };

  return (
    <>
      <Head>
        <title>RudderStack Next.js full-stack sample</title>
        <meta
          name='description'
          content='Send RudderStack events from the browser and the Next.js server.'
        />
      </Head>
      <main>
        <header>
          <p className='eyebrow'>RudderStack sample</p>
          <h1>Next.js client and server tracking</h1>
          <p className='intro'>
            Compare the JavaScript SDK browser calls with the Node SDK server calls in one
            application.
          </p>
        </header>

        <section>
          <div className='section-heading'>
            <div>
              <p className='eyebrow'>Browser</p>
              <h2>JavaScript SDK</h2>
            </div>
            <code>@rudderstack/analytics-js</code>
          </div>
          <div className='button-grid'>
            {eventTypes.map(type => (
              <button
                key={`browser-${type}`}
                type='button'
                onClick={() => void sendBrowserEvent(type)}>
                {type}
              </button>
            ))}
          </div>
          <p className='status' aria-live='polite'>
            {browserStatus}
          </p>
        </section>

        <section>
          <div className='section-heading'>
            <div>
              <p className='eyebrow'>Server</p>
              <h2>Node SDK</h2>
            </div>
            <code>@rudderstack/rudder-sdk-node</code>
          </div>
          <div className='button-grid'>
            {eventTypes.map(type => (
              <button
                key={`server-${type}`}
                type='button'
                onClick={() => void sendEventFromServer(type)}>
                {type}
              </button>
            ))}
          </div>
          <p className='status' aria-live='polite'>
            {serverStatus}
          </p>
        </section>

        <aside>
          <strong>Destination routing:</strong> all configured destinations are enabled except
          Google Analytics. Change <code>src/lib/rudderstack-config.ts</code> to try other
          integrations.
        </aside>
      </main>
    </>
  );
}

export async function getServerSideProps(): Promise<{ props: HomeProps }> {
  try {
    const { sendServerEvent } = await import('@/lib/rudderstack-server');
    await sendServerEvent('page');
    return { props: { serverPageEvent: 'getServerSideProps sent and flushed a page event.' } };
  } catch (error) {
    console.error('Failed to send the getServerSideProps page event.', error);
    return {
      props: { serverPageEvent: 'Add the server environment variables before you send events.' },
    };
  }
}
