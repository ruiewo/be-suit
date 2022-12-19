import { useState } from 'react';

import { EquipmentEditDialog } from '../../components/dialog/equipmentEditDialog';
import { ColumnDefinition, Details, EquipmentModel, convertToDisplay, rentalButtonState } from '../../models/equipmentModel';
import { RentDialog, RentDialogType } from '../dialog/rentDialog';
import { BaseTable, OnTrClick, TableDataObj } from './baseTable';

type Props = {
  equipments: EquipmentModel[];
  baseColumns?: ColumnDefinition<Details>[];
  detailColumns?: ColumnDefinition<Details>[];
  filterText: string;
  reload: () => void;
};

const defaultColumns: ColumnDefinition<Details>[] = [
  { key: 'rentalButtonState', type: 'string', label: '貸出状態', style: 'center', width: 80 },
  { key: 'code', type: 'string', label: '管理番号', style: 'center', width: 110 },
  { key: 'department', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
  { key: 'rentalUserStr', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
  { key: 'location', type: 'string', label: '場所', style: 'center', width: 180 },
  { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
  { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
  { key: 'registrationDate', type: 'date', label: '登録日', style: 'center', width: 120 },
  { key: 'note', type: 'string', label: '備考', width: 400 },
];

export const EquipmentTable = ({ equipments, baseColumns = defaultColumns, detailColumns = [], filterText, reload }: Props) => {
  const [rentEquipment, setRentEquipment] = useState<EquipmentModel | null>(null);
  const [dialogType, setDialogType] = useState<RentDialogType>('');

  const tableData = equipments.map(equipment => {
    const converted: TableDataObj = {};
    converted['id'] = equipment.id;

    for (const col of baseColumns) {
      converted[col.key] = convertToDisplay(equipment, col.key, col.type);
    }

    for (const col of detailColumns) {
      converted[col.key] = convertToDisplay(equipment.details, col.key, col.type);
    }

    return converted;
  });

  const columns = [...baseColumns, ...detailColumns];

  const onTrClick: OnTrClick = (e, data) => {
    const rentButton = (e.target as HTMLElement).closest<HTMLElement>('[data-rent-state]');
    if (rentButton == null) {
      return;
    }

    const targetId = (data as unknown as EquipmentModel).id;

    switch (rentButton.dataset.rentState) {
      case rentalButtonState.canRent:
        setRentEquipment(equipments.find(x => x.id === targetId) ?? null);
        setDialogType('rent');
        break;
      case rentalButtonState.canReturn:
        setRentEquipment(equipments.find(x => x.id === targetId) ?? null);
        setDialogType('return');
        break;
      case rentalButtonState.lending:
        return;
      case rentalButtonState.deleted:
        return;
      default:
        return;
    }
  };

  return (
    <>
      <BaseTable data={tableData} columns={columns} filterText={filterText} onTrClick={onTrClick} reload={reload} Dialog={EquipmentEditDialog} />
      <RentDialog equipment={rentEquipment} setEquipment={setRentEquipment} reload={reload} type={dialogType} />
    </>
  );
};
