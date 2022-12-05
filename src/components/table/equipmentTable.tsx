import EquipmentEditDialog from '../../components/dialog/equipmentEditDialog';
import { ColumnDefinition, Details, Equipment, convertToDisplay } from '../../models/equipment';
import { BaseTable } from './baseTable';

type Props = {
  equipments: Equipment[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  reload: () => void;
};

export const EquipmentTable = ({ equipments, columns: optionColumns, filterText, reload }: Props) => {
  const baseColumn: ColumnDefinition<Details>[] = [
    { key: 'code', type: 'code', label: '管理番号', style: 'center', width: 110 },
    { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
    { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
    { key: 'group', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
    { key: 'rentalUser', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
    { key: 'place', type: 'string', label: '場所', style: 'center', width: 180 },
    { key: 'rentalDate', type: 'rentalState', label: '貸出状態', style: 'center', width: 80 },
    { key: 'registrationDate', type: 'date', label: '登録日', style: 'center', width: 120 },
    { key: 'note', type: 'string', label: '備考', width: 400 },
  ];

  const tableData = equipments.map(equipment => {
    const converted: Record<string, string | number> = {};
    converted['id'] = equipment.id;

    for (const col of baseColumn) {
      converted[col.key] = convertToDisplay(equipment, col.key, col.type);
    }

    for (const col of optionColumns) {
      converted[col.key] = convertToDisplay(equipment.details, col.key, col.type);
    }

    return converted;
  });

  const columns = [...baseColumn, ...optionColumns];

  return <BaseTable data={tableData} columns={columns} filterText={filterText} reload={reload} Dialog={EquipmentEditDialog} />;
};
