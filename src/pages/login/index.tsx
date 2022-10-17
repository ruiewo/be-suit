import Head from 'next/head';
import Login from '../../components/login';
import LoginButton from '../../components/loginButton';
import styles from '../../styles/Home.module.css';
import { NextPageWithLayout } from '../_app';

const LoginPage: NextPageWithLayout = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="login page" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Login></Login>
        <LoginButton></LoginButton>
      </main>
    </div>
  );
};

LoginPage.getLayout = page => page;

export default LoginPage;
