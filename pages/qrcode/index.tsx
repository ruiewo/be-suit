import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
// import QRCodeStyling from 'qr-code-styling';
import Login from '../../components/login';
import styles from '../../styles/Home.module.css';
import React, { useEffect, useRef, useState } from 'react';

const LoginPage: NextPage = () => {
  const ref = useRef(null);
  // if (typeof window !== 'undefined') {
  //   const QRCodeStyling = require('qr-code-styling');
  //   const qrCode = new QRCodeStyling({
  //     width: 300,
  //     height: 300,
  //     type: 'svg',
  //     data: 'https://www.facebook.com/',
  //     image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
  //     dotsOptions: {
  //       color: '#4267b2',
  //       type: 'rounded',
  //     },
  //     backgroundOptions: {
  //       color: '#e9ebee',
  //     },
  //     imageOptions: {
  //       crossOrigin: 'anonymous',
  //       margin: 20,
  //     },
  //   });

  //   // qrCode.append(document.getElementById('canvas')!);
  //   // qrCode.download({ name: 'qr', extension: 'svg' });

  //   useEffect(() => {
  //     qrCode.append(ref.current);
  //   }, []);
  // }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="login page" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main className={styles.main}>
        aaaa
        <div ref={ref} />
      </main>
    </div>
  );
};

export default LoginPage;
