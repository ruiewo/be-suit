import EquipmentEditDialog from '../../components/dialog/equipmentEditDialog';
import { ColumnDefinition, Details, EquipmentModel, convertToDisplay, rentalState } from '../../models/equipmentModel';
import { BaseTable } from './baseTable';

type Props = {
  equipments: EquipmentModel[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  reload: () => void;
};

export const EquipmentTable = ({ equipments, columns: optionColumns, filterText, reload }: Props) => {
  const baseColumn: ColumnDefinition<Details>[] = [
    { key: 'rentalState', type: 'rentalState', label: '貸出状態', style: 'center', width: 80 },
    { key: 'code', type: 'string', label: '管理番号', style: 'center', width: 110 },
    { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
    { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
    { key: 'department', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
    { key: 'rentalUser', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
    { key: 'location', type: 'string', label: '場所', style: 'center', width: 180 },
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

  const onTrClick: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: string | number) => void = (e, id) => {
    const rentButton = (e.target as HTMLElement).closest<HTMLElement>('[data-rent-state]');
    if (rentButton == null) {
      return;
    }

    console.log(rentButton.dataset.rentState);
    switch (rentButton.dataset.rentState) {
      case rentalState.canRent:
        break;
      case rentalState.canReturn:
        break;
      case rentalState.lending:
        return;
      default:
        return;
    }
  };

  return <BaseTable data={tableData} columns={columns} filterText={filterText} onTrClick={onTrClick} reload={reload} Dialog={EquipmentEditDialog} />;
};
