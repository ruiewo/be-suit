import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';

import { TextField } from '@mui/material';

import styles from '../styles/equipmentTable.module.css';
import CategoryChip from './categoryChip';

type Props = {
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
};

export const EquipmentSearchPanel = ({ filterText, setFilterText, selectedCategories, setSelectedCategories }: Props) => {
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
