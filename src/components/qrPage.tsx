import { Box, Grid } from '@mui/material';

import { PcDetail } from '../models/equipmentDetails/pc';
import { Equipment, getEquipmentCode } from '../models/equipmentModel';
import { QrModel } from '../models/qrModel';
import styles from '../styles/qrcode.module.css';
import PcTag from './pcTag';

type Props = {
  equipments: Equipment[];
  qrCodes?: QrModel[];
};

export const QrPage = ({ equipments, qrCodes }: Props) => {
  const sheetComponents = [];
  const maxItemCount = 70;

  if (qrCodes != null && qrCodes.length > 0) {
    return (
      <>
        {split(qrCodes, maxItemCount).map((x, i) => (
          <RectangleSheet key={i} qrCodes={x}></RectangleSheet>
        ))}
      </>
    );
  }

  const pageCount = Math.floor(equipments.length / maxItemCount) + 1;

  for (let i = 0; i < pageCount; i++) {
    const lastIndex = (i + 1) * maxItemCount;
    const sheet = RectangleSheet2(equipments.slice(i * maxItemCount, lastIndex));
    sheetComponents.push(sheet);
  }

  return <>{sheetComponents}</>;
};

export const RectangleSheet = ({ qrCodes }: { qrCodes: QrModel[] }) => (
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

export const RectangleSheet2 = (equipment: Equipment[]) => {
  return (
    <section className={styles.onePage}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowGap={'4mm'} columnGap={'4mm'}>
          {equipment.map(x => (
            <PcTag key={x.id} value={getEquipmentCode(x)} pcName={(x.details as PcDetail).pcName} />
          ))}
        </Grid>
      </Box>
    </section>
  );
};

// 配列をNずつ個の配列に分割
function split<T>(arr: T[], maxItemCount: number): T[][] {
  const newArr: T[][] = [];
  const pageCount = Math.ceil(arr.length / maxItemCount);
  for (let i = 0; i < pageCount; i++) {
    newArr.push(arr.slice(i * maxItemCount, (i + 1) * maxItemCount));
  }

  return newArr;
}
