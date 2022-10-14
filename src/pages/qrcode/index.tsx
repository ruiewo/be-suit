import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import NormalTag from '../../components/normalTag';
import PcTag from '../../components/pcTag';
import { Box, Grid } from '@mui/material';
import PcTag2 from '../../components/pcTag2';

const QrCodePage: NextPage = () => {
  const data = [
    { code: 'PC-D-00127', pcName: 'Sandra' },
    { code: 'PC-D-00128', pcName: 'Sandrb' },
    { code: 'PC-D-00129', pcName: 'Sandrc' },
    { code: 'PC-D-00130', pcName: 'Sandrd' },
    { code: 'PC-D-99999', pcName: 'Abcdef' },
    { code: 'PC-D-00001', pcName: 'Ghijk' },
    { code: 'PC-D-00004', pcName: 'Lmnop' },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>QRcode</title>
        <meta name="description" content="login page" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container gap={5}>
            {data.map(x => (
              <PcTag2 value={x.code} pcName={x.pcName} />
            ))}
          </Grid>
        </Box>
      </main>
    </div>
  );
};

export default QrCodePage;
