import type { NextPage } from 'next';
import CustomizedTables from '../../components/table';
import { useEquipments } from '../../hooks/useEquipments';

const Equipment: NextPage = () => {
  const { equipments, isLoading, isError } = useEquipments();

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

  return <CustomizedTables equipments={equipments} />;
};

export default Equipment;
