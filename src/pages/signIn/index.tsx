import Head from 'next/head';

import { Container } from '@mui/material';

import { AccountDialog } from '../../components/dialog/accountDialog';
import { NextPageWithLayout } from '../_app';

const SignInPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Sign in</title>
        <meta name="description" content="Sign in page" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <Container
        component="main"
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AccountDialog></AccountDialog>
      </Container>
    </>
  );
};

SignInPage.getLayout = page => page;
SignInPage.auth = false;

export default SignInPage;
