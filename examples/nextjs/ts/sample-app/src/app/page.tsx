'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import type { RudderAnalytics } from '@rudderstack/analytics-js';

export default function Home() {
  useEffect(() => {
    if ((window.rudderanalytics as RudderAnalytics) && !Array.isArray(window.rudderanalytics)) {
      return;
    }
    const initialize = async () => {
      const { RudderAnalytics } = await import('@rudderstack/analytics-js');
      const analytics = new RudderAnalytics();

      analytics.load('<writeKey>', '<dataplaneUrl>');

      analytics.ready(() => {
        console.log('We are all set!!!');
      });
    };

    initialize();
  }, []);

  const page = () => {
    window.rudderanalytics?.page(
      'Cart',
      'Cart Viewed',
      {
        path: '/best-seller/1',
        referrer: 'https://www.google.com/search?q=estore+bestseller',
        search: 'estore bestseller',
        title: 'The best sellers offered by EStore',
        url: 'https://www.estore.com/best-seller/1',
      },
      () => {
        console.log('page call');
      },
    );
  };
  const identify = () => {
    window.rudderanalytics?.identify(
      'sample-user-123',
      {
        firstName: 'Alex',
        lastName: 'Keener',
        email: 'alex@example.com',
        phone: '+1-202-555-0146',
      },
      () => {
        console.log('identify call');
      },
    );
  };
  const track = () => {
    window.rudderanalytics?.track(
      'Order Completed',
      {
        revenue: 30,
        currency: 'USD',
        user_actual_id: 12345,
      },
      () => {
        console.log('track call');
      },
    );
  };
  const alias = () => {
    window.rudderanalytics?.alias('alias-user-id', () => {
      console.log('alias call');
    });
  };
  const group = () => {
    window.rudderanalytics?.group(
      'sample_group_id',
      {
        name: 'Apple Inc.',
        location: 'USA',
      },
      () => {
        console.log('group call');
      },
    );
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
          src='/next.svg'
          alt='Next.js Logo'
          width={180}
          height={37}
          priority
        />
      </div>

      <div className='mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left'>
        <button
          onClick={page}
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
          <h2 className={`mb-3 text-2xl font-semibold`}>Page </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Clicking this tile will trigger a page event.
          </p>
        </button>

        <button
          onClick={identify}
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30'>
          <h2 className={`mb-3 text-2xl font-semibold`}>Identify</h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Clicking this tile will trigger a identify event.
          </p>
        </button>

        <button
          onClick={track}
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
          <h2 className={`mb-3 text-2xl font-semibold`}>Track</h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Clicking this tile will trigger a track event.
          </p>
        </button>

        <button
          onClick={group}
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
          <h2 className={`mb-3 text-2xl font-semibold`}>Group</h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Clicking this tile will trigger a group event.
          </p>
        </button>
        <button
          onClick={alias}
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
          <h2 className={`mb-3 text-2xl font-semibold`}>Alias</h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Clicking this tile will trigger an alias event.
          </p>
        </button>
      </div>
    </main>
  );
}
