import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { useEffect } from 'react';
import { getBrowserAnalytics } from '@/lib/rudderstack-client';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    void getBrowserAnalytics();
  }, []);

  return <Component {...pageProps} />;
}
