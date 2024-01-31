import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useEffect } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

function App() {
  useEffect(() => {
    if ((window.rudderanalytics as RudderAnalytics) && !Array.isArray(window.rudderanalytics)) {
      return;
    }
    const analytics = new RudderAnalytics();

    analytics.load('<writeKey>', '<dataplaneUrl>');

    analytics.ready(() => {
      console.log('We are all set!!!');
    });
  }, []);

  const page = () => {
    (window.rudderanalytics as RudderAnalytics).page(
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
    (window.rudderanalytics as RudderAnalytics).identify(
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
    (window.rudderanalytics as RudderAnalytics).track(
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
    (window.rudderanalytics as RudderAnalytics).alias('alias-user-id', () => {
      console.log('alias call');
    });
  };
  const group = () => {
    (window.rudderanalytics as RudderAnalytics).group(
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
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={page}>page</button>
        <button onClick={identify}>identify</button>
        <button onClick={track}>track</button>
        <button onClick={group}>group</button>
        <button onClick={alias}>alias</button>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
