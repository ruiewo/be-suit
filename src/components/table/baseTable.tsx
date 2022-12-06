import { useState } from 'react';

import { ColumnDefinition, Details } from '../../models/equipment';
import { isNullOrWhiteSpace } from '../../modules/util';
import styles from '../../styles/equipmentTable.module.css';

type Props = {
  data: Record<string, string | number>[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  reload?: () => void;
  Dialog?: ({ onClose, id }: { id: number; onClose: (isEdited: boolean) => void }) => JSX.Element;
};

export const BaseTable = ({ data, columns, filterText, reload, Dialog }: Props) => {
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
        <tbody className={styles.tbody} onDoubleClick={handleDialogOpen}>
          {filteredData.map(data => {
            return (
              <tr key={data.id} data-id={data.id}>
                {columns.map(col => (
                  <td key={col.key} data-type={col.style == null ? '' : col.style}>
                    {data[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {Dialog == null || dataId == null ? <></> : <Dialog onClose={handleDialogClose} id={dataId} />}
    </div>
  );
};
