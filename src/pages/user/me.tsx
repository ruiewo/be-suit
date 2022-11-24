import type { NextPage } from 'next';

import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

import { Loading } from '../../components/loading';
import { useUsersMe } from '../../hooks/useUsers';
import { Equipment, getEquipmentCode } from '../../models/equipment';
import { DateEx } from '../../modules/util';
import styles from '../../styles/home.module.css';

const CategoryPage: NextPage = () => {
  const { equipments, isLoading, isError } = useUsersMe();

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <Loading />;

  if (equipments == null) return <div>Failed to load</div>;

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
        My Items
      </Typography>
      <div className={styles.grid}>{equipments.map(ItemCard)}</div>
    </Box>
  );
};

function ItemCard(equipment: Equipment) {
  return (
    <Card key={equipment.id} sx={{ width: 345, height: 280 }}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardMedia component="img" height="140" image="/images/monitor.svg" alt="monitor" sx={{ objectFit: 'contain' }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {getEquipmentCode(equipment)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`貸出日： ${equipment.rentalDate == null ? '' : new DateEx(equipment.rentalDate).toDateString()}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`返却日： ${equipment.returnDate == null ? '' : new DateEx(equipment.returnDate).toDateString()}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CategoryPage;
