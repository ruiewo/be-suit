import type { NextPage } from 'next';

import { EquipmentPage } from '../../components/equipmentsPage';

const Page: NextPage = () => {
  return <EquipmentPage categoryCodes={{ main: 'PC', sub: ['D', 'N', 'T'] }} departmentId={2} />;
};

export default Page;
