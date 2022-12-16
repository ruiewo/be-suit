import { useState } from 'react';

import { Checkbox } from '@mui/material';

import { ColumnDefinition, Details } from '../../models/equipmentModel';
import { isNullOrWhiteSpace } from '../../modules/util';
import styles from '../../styles/equipmentTable.module.css';
import { RentStateButton } from '../button/rentButton';
import { ContextMenu, ContextMenuProps } from '../contextMenu/contextMenu';

export type TableDataObj = Record<string, string | number>;
export type OnTrClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, data: TableDataObj) => void;

type Props = {
  data: TableDataObj[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  onTrClick?: OnTrClick;
  reload?: () => void;
  Dialog?: ({ onClose, id }: { id: number; onClose: (isEdited: boolean) => void }) => JSX.Element;
  ContextMenu?: ({ contextMenu, onClose }: ContextMenuProps) => JSX.Element;
};

export const BaseTable = ({ data, columns, filterText, onTrClick, reload, Dialog, ContextMenu }: Props) => {
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const handleClick = (dataItem: TableDataObj, id: string | number) => {
    const selectedIndex = selected.indexOf(id);

    if (selectedIndex === -1) {
      (dataItem['isSelected'] as any) = true;
      setSelected([...selected, id]);
    } else {
      (dataItem['isSelected'] as any) = false;
      selected.splice(selectedIndex, 1);
      setSelected([...selected]);
    }
  };

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1;

  const lowerFilterText = filterText.toLowerCase();
  const filteredData = isNullOrWhiteSpace(lowerFilterText)
    ? data
    : data.filter(x => Object.values(x).some(value => value?.toString().toLowerCase().includes(lowerFilterText)));

  // for dialog
  const [dataId, setDataId] = useState<number | null>(null);
  const handleDialogOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    const tr = (e.target as HTMLElement).closest<HTMLElement>('tr');

    if (tr == null) {
      return;
    }

    const targetId = parseInt(tr.dataset.id!);
    setDataId(targetId);
  };

  const handleDialogClose = (isEdited: boolean) => {
    setDataId(null);
    if (isEdited && typeof reload === 'function') {
      reload();
    }
  };

  // context menu
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const tr = (e.target as HTMLElement).closest<HTMLElement>('tr');
    if (tr == null) {
      setContextMenu(null);
      return;
    }

    const id = tr.dataset.id!;
    const targetData = filteredData.find(x => x.id.toString() === id) ?? null;

    setContextMenu(contextMenu === null ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6, data: targetData } : null);
  };
  const handleContextMenuClose = (isEdited: boolean) => {
    setContextMenu(null);
    if (isEdited && typeof reload === 'function') {
      reload();
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map(x => (
              <th key={x.key} style={{ width: x.width }}>
                {x.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody} onDoubleClick={handleDialogOpen} onContextMenu={handleContextMenu}>
          {filteredData.map(data => {
            return (
              <tr key={data.id} data-id={data.id} onClick={onTrClick == null ? undefined : e => onTrClick(e, data)}>
                {columns.map(col => {
                  if (col.key === 'rentalButtonState') {
                    return (
                      <td key={col.key} data-type={col.style == null ? '' : col.style}>
                        <RentStateButton state={data[col.key] as string} />
                      </td>
                    );
                  }

                  if (col.key === 'isSelected') {
                    return (
                      <td key={col.key} data-type={col.style == null ? '' : col.style}>
                        <Checkbox checked={isSelected(data.id)} onClick={event => handleClick(data, data.id)} />
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} data-type={col.style == null ? '' : col.style}>
                      {data[col.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {Dialog == null || dataId == null ? <></> : <Dialog onClose={handleDialogClose} id={dataId} />}
      {ContextMenu == null ? <></> : <ContextMenu contextMenu={contextMenu} onClose={handleContextMenuClose} />}
    </div>
  );
};
