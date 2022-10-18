import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import Head from 'next/head';
import { Copyright } from '../../components/copyright';
import SignInButton from '../../components/signInButton';
import styles from '../../styles/Home.module.css';
import { NextPageWithLayout } from '../_app';

const SignInPage: NextPageWithLayout = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Sign in page" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main className={styles.main}>
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
            <Icon sx={{ width: 120, height: 120 }}>
              <img src="/images/logo.svg" style={{ width: 'inherit', height: 'inherit' }} />
            </Icon>

            <SignInButton></SignInButton>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </main>
    </div>
  );
};

SignInPage.getLayout = page => page;

export default SignInPage;
