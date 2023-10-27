import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import useRudderStackAnalytics from './useRudderAnalytics';

function App() {
  const analytics = useRudderStackAnalytics();

  useEffect(() => {
    if (analytics) {
      analytics.page('Auto track');
    }
  }, [analytics]);

  const page = () => {
    analytics?.page(
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
    analytics?.identify(
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
    analytics?.track(
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
    analytics?.alias('alias-user-id', () => {
      console.log('alias call');
    });
  };
  const group = () => {
    analytics?.group(
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
          Edit <code>src/App.tsx</code> and save to reload.
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
