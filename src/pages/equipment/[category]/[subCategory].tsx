import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { EquipmentPage } from '../../../components/equipmentsPage';

const Page: NextPage = () => {
  const router = useRouter();
  const { category, subCategory } = router.query;

  const categoryCode = `${(category as string).toUpperCase()}-${(subCategory as string).toUpperCase()}`;

  return <EquipmentPage category={categoryCode} key={categoryCode} />;
};

export default Page;
