import type { NextPage } from 'next';
import EquipmentsTable from '../../components/table';
import { useEquipments } from '../../hooks/useEquipments';

const EquipmentPage: NextPage = () => {
  const { equipments, columns, isLoading, isError } = useEquipments('PC', 'D');

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

  if (equipments == null || columns == null) return <div>Failed to load</div>;

  return <EquipmentsTable equipments={equipments} columns={columns} />;
};

export default EquipmentPage;
