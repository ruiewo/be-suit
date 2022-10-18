import '../styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Layout from '../components/layout';

type GetLayout = (page: ReactElement) => ReactNode;
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
  auth?: boolean;
};

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout: GetLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>);

  // Authentication is always required unless page.auth is explicitly set to FALSE.
  return (
    <SessionProvider session={session}>
      {Component.auth !== false ? <Auth>{getLayout(<Component {...pageProps} />)}</Auth> : getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}

function Auth({ children }: React.PropsWithChildren<{}>): JSX.Element {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({
    required: true,
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // todo refactor. ReactNode is not valid JSX.Element.
  return children as JSX.Element;
}
