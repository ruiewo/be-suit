import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';

import { useCategories } from '../hooks/useCategories';
import styles from '../styles/equipmentTable.module.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(categoryCode: string, selectedCategories: readonly string[], theme: Theme) {
  return {
    fontWeight: selectedCategories.includes(categoryCode) ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}
type Props = {
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
};
export default function CategoryChip({ selectedCategories, setSelectedCategories }: Props) {
  const theme = useTheme();
  const { categories, isLoading, isError } = useCategories('');

  const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const {
      target: { value },
    } = event;

    if (typeof value === 'string') {
      return;
    }

    setSelectedCategories(value);
  };

  return (
    <div className={styles.categoryChip}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedCategories}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {(categories ?? []).map(category =>
            category.subCategories.map(subCategory => {
              const value = `${category.code}-${subCategory.code}`;
              return (
                <MenuItem key={value} value={value} style={getStyles(value, selectedCategories, theme)}>
                  {category.label} - {subCategory.label}
                </MenuItem>
              );
            })
          )}
        </Select>
      </FormControl>
    </div>
  );
}