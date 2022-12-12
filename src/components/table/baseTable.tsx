import { useState } from 'react';

import { ColumnDefinition, Details } from '../../models/equipmentModel';
import { isNullOrWhiteSpace } from '../../modules/util';
import styles from '../../styles/equipmentTable.module.css';
import { RentStateButton } from '../button/rentButton';
import { ContextMenuProps } from './userTable';

type Props = {
  data: Record<string, string | number>[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  onTrClick?: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: string | number) => void;
  reload?: () => void;
  Dialog?: ({ onClose, id }: { id: number; onClose: (isEdited: boolean) => void }) => JSX.Element;
  ContextMenu?: ({ contextMenu, onClose }: ContextMenuProps) => JSX.Element;
};

export const BaseTable = ({ data, columns, filterText, onTrClick, reload, Dialog, ContextMenu }: Props) => {
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
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; dataId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const tr = (e.target as HTMLElement).closest<HTMLElement>('tr');
    if (tr == null) {
      setContextMenu(null);
      return;
    }

    setContextMenu(contextMenu === null ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6, dataId: tr.dataset.id! } : null);
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
              <tr key={data.id} data-id={data.id} onClick={onTrClick == null ? undefined : e => onTrClick(e, data.id)}>
                {columns.map(col => {
                  if (col.key === 'rentalButtonState') {
                    return (
                      <td key={col.key} data-type={col.style == null ? '' : col.style}>
                        <RentStateButton state={data[col.key] as string} />
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
