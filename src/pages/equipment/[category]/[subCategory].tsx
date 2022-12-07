import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { EquipmentPage } from '../../../components/equipmentsPage';

const Page: NextPage = () => {
  const router = useRouter();
  const { category, subCategory } = router.query;

  const main = (category as string).toUpperCase();
  const sub = (subCategory as string).toUpperCase();

  return <EquipmentPage categoryCodes={{ main, sub: [sub] }} key={`${main}-${sub}`} />;
};

export default Page;
