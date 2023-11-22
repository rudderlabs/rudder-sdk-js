import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { useEffect } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

const pageStyles = {
  color: '#232129',
  padding: 96,
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};
const headingAccentStyles = {
  color: '#663399',
};
const paragraphStyles = {
  marginBottom: 48,
};
const codeStyles = {
  color: '#8A6534',
  padding: 4,
  backgroundColor: '#FFF4DB',
  fontSize: '1.25rem',
  borderRadius: 4,
};
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
};
const doclistStyles = {
  paddingLeft: 0,
};
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
};

const linkStyle = {
  color: '#8954A8',
  fontWeight: 'bold',
  fontSize: 16,
  verticalAlign: '5%',
};

const docLinkStyle = {
  ...linkStyle,
  listStyleType: 'none',
  display: `inline-block`,
  marginBottom: 24,
  marginRight: 12,
};

const descriptionStyle = {
  color: '#232129',
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
};

const badgeStyle = {
  color: '#fff',
  backgroundColor: '#088413',
  border: '1px solid #088413',
  fontSize: 11,
  fontWeight: 'bold',
  letterSpacing: 1,
  borderRadius: 4,
  padding: '4px 6px',
  display: 'inline-block',
  position: 'relative' as 'relative',
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
};

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

const buttons = [
  {
    text: 'Page',
    color: '#E95800',
    action: page,
  },
  {
    text: 'Identify',
    color: '#1099A8',
    action: identify,
  },
  {
    text: 'Track',
    color: '#BC027F',
    action: track,
  },
  {
    text: 'Group',
    color: '#0D96F2',
    action: group,
  },
  {
    text: 'Alias',
    color: '#8EB814',
    action: alias,
  },
];

const IndexPage: React.FC<PageProps> = () => {
  useEffect(() => {
    if (window.rudderanalytics as RudderAnalytics) {
      return;
    }
    const analytics = new RudderAnalytics();

    analytics.load('<writeKey>', '<dataplaneUrl>');

    analytics.ready(() => {
      console.log('We are all set!!!');
    });

    window.rudderanalytics = analytics;
  }, []);

  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        <span style={headingAccentStyles}>Welcome to sample Gatsby site! 🎉🎉🎉</span>
      </h1>
      <p style={paragraphStyles}>
        Edit <code style={codeStyles}>src/pages/index.tsx</code> to see this page update in
        real-time. 😎
      </p>

      <ul style={listStyles}>
        {buttons.map(btn => (
          <button onClick={btn.action} style={{ ...listItemStyles, color: btn.color }}>
            {btn.text}
          </button>
        ))}
        <span></span>
      </ul>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
