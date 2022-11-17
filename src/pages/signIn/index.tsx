import Head from 'next/head';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';

import { Copyright } from '../../components/copyright';
import SignInButton from '../../components/signInButton';
import styles from '../../styles/Home.module.css';
import { NextPageWithLayout } from '../_app';

const SignInPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Sign in</title>
        <meta name="description" content="Sign in page" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.signInContent}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Icon sx={{ width: 110, height: 100, position: 'relative' }}>
                <Image src="/images/setbee-logo.png" alt="logo" layout="fill" objectFit="contain" />
              </Icon>
              <Icon sx={{ width: 280, height: 60, position: 'relative' }}>
                <Image src="/images/setbee-text-1.png" alt="logo" layout="fill" objectFit="contain" />
              </Icon>
              <SignInButton />
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </div>
      </main>
    </>
  );
};

SignInPage.getLayout = page => page;
SignInPage.auth = false;

export default SignInPage;
