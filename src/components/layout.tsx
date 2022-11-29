import Head from 'next/head';
import { ReactElement } from 'react';

import styles from '../styles/home.module.css';
import SideMenu from './sideMenu';

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Be Suit</title>
        <meta name="description" content="management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideMenu></SideMenu>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
