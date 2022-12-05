import type { NextPage } from 'next';
import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { TextField } from '@mui/material';

import CategoryChip from '../../components/categoryChip';
import EquipmentEditDialog from '../../components/dialog/equipmentEditDialog';
import { ErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { client } from '../../models/apiClient';
import { ColumnDefinition, Details, Equipment, convertToDisplay } from '../../models/equipment';
import { isNullOrWhiteSpace, sleep } from '../../modules/util';
import styles from '../../styles/equipmentTable.module.css';

const EquipmentPage: NextPage = () => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['PC-D']);

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [columns, setColumns] = useState<ColumnDefinition<Details>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [{ equipments, columns }] = await Promise.all([
          client.api.equipment.advancedSearch.$post({ body: { categoryCodes: selectedCategories } }),
          sleep(1000),
        ]);

        setEquipments(equipments);
        setColumns(columns);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [selectedCategories]);

  const reload = () => setSelectedCategories([...selectedCategories]);

  if (isError) return <ErrorDialog />;

  if (equipments == null || columns == null) return <ErrorDialog />;

  return (
    <>
      <SearchPanel
        filterText={filterText}
        setFilterText={setFilterText}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      {isLoading ? <Loading /> : <Table equipments={equipments} columns={columns} filterText={filterText} reload={reload} />}
    </>
  );
};

export default EquipmentPage;

type SearchPanelProps = {
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
};
const SearchPanel = ({ filterText, setFilterText, selectedCategories, setSelectedCategories }: SearchPanelProps) => {
  const filter: ChangeEventHandler<HTMLInputElement> = e => {
    setFilterText(e.target.value);
  };
  return (
    <div className={styles.selectPanel}>
      <CategoryChip selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
      <TextField margin="normal" label="絞り込み" value={filterText} onChange={filter} />
    </div>
  );
};

type Props = {
  equipments: Equipment[];
  columns: ColumnDefinition<Details>[];
  filterText: string;
  reload: () => void;
};

const EquipmentTable = ({ equipments, columns, filterText, reload }: Props) => {
  return <Table equipments={equipments} columns={columns} filterText={filterText} reload={reload} />;
};

const Table = ({ equipments, columns, filterText, reload }: Props) => {
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

  const convertedEquipments = equipments.map(equipment => {
    const converted: Record<string, string | number> = {};
    converted['id'] = equipment.id;
    for (const col of baseColumn) {
      converted[col.key] = convertToDisplay(equipment, col.key, col.type);
    }

    for (const col of columns) {
      converted[col.key] = convertToDisplay(equipment.details, col.key, col.type);
    }

    return converted;
  });

  const lowerFilterText = filterText.toLowerCase();
  const filteredEquipments = isNullOrWhiteSpace(lowerFilterText)
    ? convertedEquipments
    : convertedEquipments.filter(x => Object.values(x).some(value => value?.toString().toLowerCase().includes(lowerFilterText)));

  const cols = [...baseColumn, ...columns];

  // for dialog
  const [equipmentId, setEquipmentId] = useState<number | null>(null);
  const handleDialogOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    const tr = (e.target as HTMLElement).closest<HTMLElement>('tr');

    if (tr == null) {
      return;
    }

    const targetId = parseInt(tr.dataset.id!);

    setEquipmentId(targetId);
  };

  const handleDialogClose = (isEdited: boolean) => {
    setEquipmentId(null);
    if (isEdited) {
      reload();
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {cols.map(x => (
              <th key={x.key} style={{ width: x.width }}>
                {x.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody} onDoubleClick={handleDialogOpen}>
          {filteredEquipments.map(equipment => {
            return (
              <tr key={equipment.id} data-id={equipment.id}>
                {cols.map(col => (
                  <td key={col.key} data-type={col.style == null ? '' : col.style}>
                    {equipment[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {equipmentId == null ? <></> : <EquipmentEditDialog onClose={handleDialogClose} id={equipmentId} />}
    </div>
  );
};
