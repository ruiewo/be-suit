import type { NextPage } from 'next';
import EquipmentsTable from '../../../components/table';
import { useEquipments } from '../../../hooks/useEquipments';
import { useRouter } from 'next/router';

const EquipmentsPage: NextPage = () => {
  const router = useRouter();
  const { category, subCategory } = router.query;

  const { equipments, columns, isLoading, isError } = useEquipments(category as string, subCategory as string);

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

  if (equipments == null || columns == null) return <div>Failed to load</div>;

  return <EquipmentsTable equipments={equipments} columns={columns} />;
};

export default EquipmentsPage;
