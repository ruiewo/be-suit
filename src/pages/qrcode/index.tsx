import Head from 'next/head';

import { Box, Grid } from '@mui/material';

import { Loading } from '../../components/loading';
import PcTag from '../../components/pcTag';
import { useEquipments } from '../../hooks/useEquipments';
import { getEquipmentCode } from '../../models/equipment';
import { PcDetail } from '../../models/equipmentDetails/pc';
import styles from '../../styles/home.module.css';
import { NextPageWithLayout } from '../_app';

const QrCodePage: NextPageWithLayout = () => {
  const { equipments, isLoading, isError } = useEquipments('PC', 'D');

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <Loading />;

  if (!equipments) return <div>Failed to load</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>QRcode</title>
        <meta name="description" content="QRcode page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container gap={5}>
            {equipments.map(x => (
              <PcTag key={x.id} value={getEquipmentCode(x)} pcName={(x.details as PcDetail).pcName} />
            ))}
          </Grid>
        </Box>
      </main>
    </div>
  );
};

QrCodePage.getLayout = page => page;

export default QrCodePage;
