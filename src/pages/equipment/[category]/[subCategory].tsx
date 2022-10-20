import type { NextPage } from 'next';
import EquipmentsTable from '../../../components/table';
import { useEquipments } from '../../../hooks/useEquipments';
import { useRouter } from 'next/router';

const Equipment: NextPage = () => {
  const router = useRouter();
  const { category, subCategory } = router.query;

  const { equipments, isLoading, isError } = useEquipments(category as string, subCategory as string);

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

  return <EquipmentsTable equipments={equipments} />;
};

export default Equipment;
