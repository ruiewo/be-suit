import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Login from '../../components/login';
import styles from '../../styles/Home.module.css';

const LoginPage: NextPage = () => {
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

export default LoginPage;
