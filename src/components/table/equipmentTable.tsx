import EquipmentEditDialog from '../../components/dialog/equipmentEditDialog';
import { useDepartments } from '../../hooks/useDepartments';
import { useSharedState } from '../../hooks/useStaticSwr';
import { DepartmentModel } from '../../models/departmentModel';
import { ColumnDefinition, Details, EquipmentModel, convertToDisplay } from '../../models/equipmentModel';
import { BaseTable } from './baseTable';

type Props = {
  equipments: EquipmentModel[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  reload: () => void;
};

export const EquipmentTable = ({ equipments, columns: optionColumns, filterText, reload }: Props) => {
  const [, setDepartments] = useSharedState<DepartmentModel[]>('departments', []);
  useDepartments(x => setDepartments(x));

  const baseColumn: ColumnDefinition<Details>[] = [
    { key: 'code', type: 'string', label: '管理番号', style: 'center', width: 110 },
    { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
    { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
    { key: 'department', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
    { key: 'rentalUser', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
    { key: 'location', type: 'string', label: '場所', style: 'center', width: 180 },
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
