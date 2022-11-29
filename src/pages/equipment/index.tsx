import type { NextPage } from 'next';

import { ErrorDialog } from '../../components/errorDialog';
import { Loading } from '../../components/loading';
import EquipmentsTable from '../../components/table';
import { useEquipments } from '../../hooks/useEquipments';
import { ColumnDefinition, Details, Equipment, ValueType, convertToDisplay } from '../../models/equipment';
import styles from '../../styles/equipmentTable.module.css';

const EquipmentPage: NextPage = () => {
  const { equipments, columns, isLoading, isError } = useEquipments('PC', 'D');

  if (isError) return <ErrorDialog />;

  if (isLoading) return <Loading />;

  if (equipments == null || columns == null) return <ErrorDialog />;

  return (
    <>
      <SearchPanel />
      <Table equipments={equipments} />
    </>
  );
};

export default EquipmentPage;

const SearchPanel = () => {
  return <div>SearchPanel</div>;
};
type Props = {
  equipments: Equipment[];
  // columns: ColumnDefinition<Details>[];
};

const Table = ({ equipments }: Props) => {
  const equipmentBaseColumn = [
    { key: 'id', type: 'number', label: 'ID', width: 40 },
    { key: 'category', type: 'string', label: '管理番号', width: 100 },
    { key: 'subCategory', type: 'string', label: '管理番号', width: 100 },
    { key: 'categorySerial', type: 'number', label: '管理番号', width: 100 },
    { key: 'maker', type: 'string', label: 'メーカー', width: 120 },
    { key: 'modelNumber', type: 'string', label: '型番', width: 120 },
    { key: 'group', type: 'string', label: '管理者', width: 120 },
    { key: 'rentalUserStr', type: 'string', label: '使用者', width: 120 },
    { key: 'place', type: 'string', label: '場所', width: 180 },
    { key: 'rentalDate', type: 'date', label: '貸出日', width: 120 },
    { key: 'returnDate', type: 'date', label: '返却日', width: 120 },
    { key: 'registrationDate', type: 'date', label: '登録日', width: 120 },
    { key: 'deletedDate', type: 'date', label: '削除日', width: 120 },
    { key: 'inventoryDate', type: 'date', label: '棚卸日', width: 120 },
    { key: 'note', type: 'string', label: '備考', width: 400 },
  ];

  type ColumnDefinition<T> = {
    key: keyof T;
    type: ValueType;
    label: string;
    style?: string;
    width: number;
  };

  const baseColumn: ColumnDefinition<Details>[] = [
    { key: 'id', type: 'code', label: '管理番号', width: 110 },
    { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
    { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
    { key: 'group', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
    { key: 'rentalUserStr', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
    { key: 'place', type: 'string', label: '場所', width: 180 },
    { key: 'rentalDate', type: 'rentalState', label: '貸出状態', style: 'center', width: 80 },
    { key: 'registrationDate', type: 'date', label: '登録日', style: 'center', width: 120 },
    { key: 'note', type: 'string', label: '備考', width: 400 },
  ];

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {baseColumn.map(x => (
              <th key={x.key} style={{ width: x.width }}>
                {x.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {equipments.map(equipment => {
            return (
              <tr key={equipment.id}>
                {baseColumn.map(col => (
                  <td key={col.key} data-type={col.style == null ? '' : col.style}>
                    {convertToDisplay(equipment, col.key, col.type)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
