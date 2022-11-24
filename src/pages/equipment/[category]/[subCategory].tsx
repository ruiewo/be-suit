import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Loading } from '../../../components/loading';
import EquipmentsTable from '../../../components/table';
import { useEquipments } from '../../../hooks/useEquipments';

const EquipmentsPage: NextPage = () => {
  const router = useRouter();
  const { category, subCategory } = router.query;

  const { equipments, columns, isLoading, isError } = useEquipments(category as string, subCategory as string);

  if (isError) return <div>Failed to load</div>;

  if (isLoading) return <Loading />;

  if (equipments == null || columns == null) return <div>Failed to load</div>;

  return <EquipmentsTable equipments={equipments} columns={columns} />;
};

export default EquipmentsPage;
