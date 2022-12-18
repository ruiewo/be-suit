import Head from 'next/head';

import { useQrCode } from '../../components/button/qrCodeButton';
import { Loading } from '../../components/loading';
import { QrPage } from '../../components/qrPage';
import { Skeleton } from '../../components/skeleton';
import { useEquipments } from '../../hooks/useEquipments';
import { NextPageWithLayout } from '../_app';

const QrCodePage: NextPageWithLayout = () => {
  const { equipments, isLoading, isError } = useEquipments('PC', 'D');
  const { getQrCodes } = useQrCode();
  const qrCodes = getQrCodes();

  if (isError) return <Skeleton />;

  if (isLoading) return <Loading />;

  if (!equipments) return <Skeleton />;

  return (
    <>
      <Head>
        <title>QRcode</title>
        <meta name="description" content="QRcode Print page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <QrPage qrCodes={qrCodes} />
      </main>
    </>
  );
};

QrCodePage.getLayout = page => page;

export default QrCodePage;
