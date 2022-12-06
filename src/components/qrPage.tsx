import { Box, Grid } from '@mui/material';

import { getEquipmentCode } from '../models/equipment';
import { Equipment } from '../models/equipment';
import { PcDetail } from '../models/equipmentDetails/pc';
import styles from '../styles/qrcode.module.css';
import PcTag from './pcTag';

type Props = {
  equipments: Equipment[];
};

export const QrPage = ({ equipments }: Props) => {
  const sheetComponents = [];
  const maxItemCount = 70;
  const pageCount = Math.floor(equipments.length / maxItemCount) + 1;

  for (let i = 0; i < pageCount; i++) {
    const lastIndex = (i + 1) * maxItemCount;
    const sheet = RectangleSheet(equipments.slice(i * maxItemCount, lastIndex));
    sheetComponents.push(sheet);
  }

  return <>{sheetComponents}</>;
};

export const RectangleSheet = (equipment: Equipment[]) => {
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
