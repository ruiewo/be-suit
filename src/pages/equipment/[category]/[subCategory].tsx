import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { ErrorDialog } from '../../../components/dialog/errorDialog';
import { EquipmentPage } from '../../../components/equipmentsPage';
import { Loading } from '../../../components/loading';
import EquipmentsTable from '../../../components/table';
import { useEquipments } from '../../../hooks/useEquipments';

const Page: NextPage = () => {
  const router = useRouter();
  const { category, subCategory } = router.query;

  const categoryCode = `${(category as string).toUpperCase()}-${(subCategory as string).toUpperCase()}`;

  return <EquipmentPage category={categoryCode} key={categoryCode} />;

  // const { equipments, columns, isLoading, isError } = useEquipments(category as string, subCategory as string);

  // if (isError) return <ErrorDialog />;

  // if (isLoading) return <Loading />;

  // if (equipments == null || columns == null) return <ErrorDialog />;

  // return <EquipmentsTable equipments={equipments} columns={columns} />;
};

export default Page;
