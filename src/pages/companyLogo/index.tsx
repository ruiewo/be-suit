import Head from 'next/head';

import { Box } from '@mui/material';

import styles from '../../styles/companyLogo.module.css';
import { NextPageWithLayout } from '../_app';

const CompanyLogoPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Company Logo</title>
        <meta name="description" content="Company Logo page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className={styles.onePage}>
          <Logo />
        </section>
      </main>
    </>
  );
};

function Logo() {
  const logos = [];
  const count = 95;
  for (let i = 0; i < count; i++) {
    logos.push(
      <Box
        sx={{
          width: '35mm',
          height: '12mm',
          display: 'inline-flex',
          flexDirection: 'column',
          margin: '1mm 2mm 1mm 0mm',
        }}
      >
        <div className={styles.companyLogo}></div>
      </Box>
    );
  }
  return <>{logos}</>;
}

CompanyLogoPage.getLayout = page => page;

export default CompanyLogoPage;
