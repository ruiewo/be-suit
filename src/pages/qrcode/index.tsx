import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { Box, Grid } from '@mui/material';
import PcTag from '../../components/pcTag';
import { useEquipments } from '../../hooks/useEquipments';
import { getEquipmentCode } from '../../models/equipment';
import { NextPageWithLayout } from '../_app';
import { PcDetail } from '../../models/equipmentDetails/pc';

const QrCodePage: NextPageWithLayout = () => {
  const data = [
    { code: 'PC-D-00127', pcName: 'Sandra' },
    { code: 'PC-D-00128', pcName: 'Sandrb' },
    { code: 'PC-D-00129', pcName: 'Sandrc' },
    { code: 'PC-D-00130', pcName: 'Sandrd' },
    { code: 'PC-D-99999', pcName: 'Abcdef' },
    { code: 'PC-D-00001', pcName: 'Ghijk' },
    { code: 'PC-D-00004', pcName: 'Lmnop' },
  ];

  const { equipments, isLoading, isError } = useEquipments();

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

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
