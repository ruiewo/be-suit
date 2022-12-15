import { useState } from 'react';

import { Menu, MenuItem } from '@mui/material';

import { EquipmentEditDialog } from '../../components/dialog/equipmentEditDialog';
import { ColumnDefinition, Details, EquipmentModel, convertToDisplay, rentalButtonState } from '../../models/equipmentModel';
import { isNullOrWhiteSpace } from '../../modules/util';
import { useQrCode } from '../button/qrCodeButton';
import { ContextMenuProps } from '../contextMenu/contextMenu';
import { RentDialog, RentDialogType } from '../dialog/rentDialog';
import { BaseTable } from './baseTable';

type Props = {
  equipments: EquipmentModel[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  reload: () => void;
};

export const EquipmentTable = ({ equipments, columns: optionColumns, filterText, reload }: Props) => {
  const [rentEquipment, setRentEquipment] = useState<EquipmentModel | null>(null);
  const [dialogType, setDialogType] = useState<RentDialogType>('');

  const baseColumn: ColumnDefinition<Details>[] = [
    { key: 'rentalButtonState', type: 'string', label: '貸出状態', style: 'center', width: 80 },
    { key: 'code', type: 'string', label: '管理番号', style: 'center', width: 110 },
    { key: 'department', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
    { key: 'rentalUser', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
    { key: 'location', type: 'string', label: '場所', style: 'center', width: 180 },
    { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
    { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
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

  const onTrClick: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, data: Record<string, string | number>) => void = (e, data) => {
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
      <BaseTable
        data={tableData}
        columns={columns}
        filterText={filterText}
        onTrClick={onTrClick}
        reload={reload}
        Dialog={EquipmentEditDialog}
        ContextMenu={QrContextMenu}
      />
      <RentDialog equipment={rentEquipment} setEquipment={setRentEquipment} reload={reload} type={dialogType} />
    </>
  );
};

const QrContextMenu = ({ contextMenu, onClose }: ContextMenuProps) => {
  const { addQrCodes, deleteQrCodes } = useQrCode();

  const addQrCode = async () => {
    const equipment = contextMenu!.data as unknown as EquipmentModel;

    // @ts-ignore
    let pcName = equipment['pcName'] as string | undefined;
    if (isNullOrWhiteSpace(pcName)) {
      pcName = undefined;
    }

    addQrCodes([[equipment.code, pcName]]);
    onClose(false);
  };

  const addAllQrCode = async () => {
    const equipment = contextMenu!.data as unknown as EquipmentModel;

    // @ts-ignore
    let pcName = equipment['pcName'] as string | undefined;
    if (isNullOrWhiteSpace(pcName)) {
      pcName = undefined;
    }

    addQrCodes([[equipment.code, pcName]]);
    onClose(false);
  };

  const resetQrCode = async () => {
    deleteQrCodes();
    onClose(false);
  };

  return (
    <Menu
      open={contextMenu !== null}
      onClose={() => onClose(false)}
      anchorReference="anchorPosition"
      anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
    >
      {/* <MenuItem onClick={addAllQrCode}>Add All QR Code</MenuItem> */}
      <MenuItem onClick={addQrCode}>Add QR Code</MenuItem>
      <MenuItem onClick={resetQrCode}>reset QR Code</MenuItem>
    </Menu>
  );
};
