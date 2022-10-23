import * as React from 'react';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Category, CategoryBase } from '../models/category';
import { KeyedMutator } from 'swr';

type Props = {
  categoryBase: CategoryBase;
  update: () => void;
  category: Category;
  setCategory: KeyedMutator<Category>;
};
const style = { width: '29%', ml: '2%', mr: '2%' };
export const CategoryInput = ({ category, update }: Props) => (
  <>
    <TextField margin="normal" sx={style} label="code" name="code" value={category.code} />
    <TextField
      margin="normal"
      sx={style}
      label="label"
      name="label"
      value={category.label}
      onChange={e => {
        category.label = e.target.value;
        update();
      }}
    />
    <FormControlLabel control={<Checkbox checked={category.enable} />} label="Enabled" />
  </>
);
