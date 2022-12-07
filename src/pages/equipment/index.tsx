import type { NextPage } from 'next';

import { EquipmentPage } from '../../components/equipmentsPage';

const Page: NextPage = () => {
  return <EquipmentPage categoryCodes={{ main: 'PC', sub: ['D'] }} />;
};

export default Page;
