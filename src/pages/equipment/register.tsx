import type { NextPage } from 'next';

import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import EquipmentsTable from '../../components/table';
import { useEquipments } from '../../hooks/useEquipments';

const EquipmentPage: NextPage = () => {
  const { equipments, columns, isLoading, isError } = useEquipments('PC', 'D');

  if (isError) return <ErrorDialog />;

  if (isLoading) return <Loading />;

  if (equipments == null || columns == null) return <ErrorDialog />;

  return <RegisterPage />;
};

export default EquipmentPage;

function RegisterPage() {
  return (
    <>
      <div id="register">上1/3が登録フォーム</div>
      <div id="register">登録した項目をリストに追加していく（編集も可）</div>
      <div id="register">「確定」などのボタンを押下してDBに登録</div>
    </>
  );
}
