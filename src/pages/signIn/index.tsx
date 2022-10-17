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
        <SignInButton></SignInButton>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </main>
    </div>
  );
};

SignInPage.getLayout = page => page;

export default SignInPage;
