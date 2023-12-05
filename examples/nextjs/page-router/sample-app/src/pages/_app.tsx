import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useRudderStackAnalytics from '../useRudderAnalytics';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const analytics = useRudderStackAnalytics();

  useEffect(() => {
    const trackPageChange = () => {
      analytics?.page(
        'PageView',
        {
          path: router.pathname,
          search: router.query
        }
      );
    }

    const completeHandler = () => {
      trackPageChange();
    };

    router.events.on('routeChangeComplete', completeHandler);
    trackPageChange()

    return () => {
      router.events.off('routeChangeComplete', completeHandler);
    };
  }, [router, analytics]);

  return <Component {...pageProps} />
}
