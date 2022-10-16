import Head from 'next/head';
import Login from '../../components/login';
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
      </main>
    </div>
  );
};

LoginPage.getLayout = page => page;

export default LoginPage;
