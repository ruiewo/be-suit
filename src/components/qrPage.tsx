import { Box, Grid } from '@mui/material';

import { QrCodeModel } from '../models/qrCodeModel';
import styles from '../styles/qrcode.module.css';
import PcTag from './pcTag';

type Props = {
  qrCodes: QrCodeModel[];
};

const maxItemCount = 70;

export const QrPage = ({ qrCodes }: Props) => {
  return (
    <>
      {split(qrCodes, maxItemCount).map((x, i) => (
        <RectangleSheet key={i} qrCodes={x}></RectangleSheet>
      ))}
    </>
  );
};

export const RectangleSheet = ({ qrCodes }: { qrCodes: QrCodeModel[] }) => (
  <section className={styles.onePage}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowGap={'4mm'} columnGap={'4mm'}>
        {qrCodes.map(([code, pcName]) => (
          // todo switch if is pc.
          <PcTag key={code} value={code} pcName={pcName!} />
        ))}
      </Grid>
    </Box>
  </section>
);

// 配列をNずつ個の配列に分割
function split<T>(arr: T[], maxItemCount: number): T[][] {
  const newArr: T[][] = [];
  const pageCount = Math.ceil(arr.length / maxItemCount);
  for (let i = 0; i < pageCount; i++) {
    newArr.push(arr.slice(i * maxItemCount, (i + 1) * maxItemCount));
  }

  return newArr;
}
