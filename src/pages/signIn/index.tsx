import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { Copyright } from '../../components/copyright';
import SignInButton from '../../components/signInButton';
import styles from '../../styles/Home.module.css';
import { NextPageWithLayout } from '../_app';

const SignInPage: NextPageWithLayout = () => {
  const { data: session } = useSession();

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
            <Typography component="h1" variant="h5">
              Signed in as
            </Typography>
            <SignInButton></SignInButton>
          </Box>
        </Container>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </main>
    </div>
  );
};

SignInPage.getLayout = page => page;

export default SignInPage;
