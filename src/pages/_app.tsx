import type { NextPage } from 'next';
import { Session } from 'next-auth';
import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

import { ErrorDialogProvider } from '../components/dialog/errorDialog';
import { Layout } from '../components/layout';
import { Loading } from '../components/loading';
import '../styles/globals.css';

type GetLayout = (page: ReactElement) => ReactNode;
export type NextPageWithLayout = NextPage & {
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
      <ErrorDialogProvider>
        {Component.auth !== false ? <Auth>{getLayout(<Component {...pageProps} />)}</Auth> : getLayout(<Component {...pageProps} />)}
      </ErrorDialogProvider>
    </SessionProvider>
  );
}

function Auth({ children }: React.PropsWithChildren): JSX.Element {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({
    required: true,
  });

  if (status === 'loading') {
    return <Loading />;
  }

  // todo refactor. ReactNode is not valid JSX.Element.
  return children as JSX.Element;
}
