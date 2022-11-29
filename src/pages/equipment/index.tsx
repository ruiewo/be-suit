import type { NextPage } from 'next';

import { ErrorDialog } from '../../components/errorDialog';
import { Loading } from '../../components/loading';
import EquipmentsTable from '../../components/table';
import { useEquipments } from '../../hooks/useEquipments';

const EquipmentPage: NextPage = () => {
  const { equipments, columns, isLoading, isError } = useEquipments('PC', 'D');

  if (isError) return <ErrorDialog />;

  if (isLoading) return <Loading />;

  if (equipments == null || columns == null) return <ErrorDialog />;

  return <EquipmentsTable equipments={equipments} columns={columns} />;
};

export default EquipmentPage;
