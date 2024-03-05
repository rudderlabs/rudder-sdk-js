import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';
import { Ninetailed } from '@ninetailed/experience.js';
import { DATAPLANE_URL, WRITE_KEY, CONFIG_URL } from './config';

export const ninetailed = new Ninetailed({
  // REQUIRED. An API key uniquely identifying your Ninetailed account.
  // OPTIONAL. Your Ninetailed environment, typically either "main" or "development"
  clientId: '52f31dff-94c4-4a59-8938-52a3ffc94571',
  environment: 'main', // Default
});

function App() {
  useEffect(() => {
    if (window.rudderanalytics) {
      return;
    }

    window.rudderanalytics = new RudderAnalytics();

    window.rudderanalytics.load(WRITE_KEY, DATAPLANE_URL, { configUrl: CONFIG_URL });

    window.rudderanalytics.ready(() => {
      console.log('We are all set!!!');
    });
  }, []);
  const page = () => {
    window.rudderanalytics.page(
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
    window.rudderanalytics.identify(
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
    window.rudderanalytics.track(
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
    window.rudderanalytics.alias('alias-user-id', () => {
      console.log('alias call');
    });
  };
  const group = () => {
    window.rudderanalytics.group(
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
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div className='card'>
          <button onClick={page}>page</button>
          <button onClick={identify}>identify</button>
          <button onClick={track}>track</button>
          <button onClick={group}>group</button>
          <button onClick={alias}>alias</button>
        </div>
      </header>
    </div>
  );
}

export default App;
