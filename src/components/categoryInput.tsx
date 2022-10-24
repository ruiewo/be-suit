import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { CategoryBase } from '../models/category';
import { ChangeEvent } from 'react';

type Props = {
  index?: number;
  category: CategoryBase;
  onChange: (event: ChangeEvent, index?: number) => void;
  remove?: (index: number) => void;
};

const style = { width: '29%', ml: '2%', mr: '2%' };
export const CategoryInput = ({ index, category, onChange, remove }: Props) => (
  <Box>
    <TextField margin="normal" sx={style} label="code" name="code" value={category.code} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="label" name="label" value={category.label} onChange={e => onChange(e, index)} />
    <FormControlLabel control={<Checkbox checked={category.enable} />} label="Enabled" />
    {remove != null ? <Button onClick={() => remove(index!)}> Remove </Button> : null}
  </Box>
);
