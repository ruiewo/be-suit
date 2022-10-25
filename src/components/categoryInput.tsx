import { ChangeEvent } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CategoryBase } from '../models/category';
import { DeleteButton } from './deleteButton';

type Props = {
  index?: number;
  category: CategoryBase;
  onChange: (event: ChangeEvent, index?: number) => void;
  remove?: (index: number) => void;
};

// const style = { width: '29%' };
const style = { width: '29%', ml: '2%', mr: '2%' };
const buttonStyle = { width: '15%', ml: '2%', mr: '2%' };
// const buttonStyle = { width: '15%', ml: '2%', mr: '2%', mt: 2, mb: 1 };
export const CategoryInput = ({ index, category, onChange, remove }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <TextField margin="normal" sx={style} label="code" name="code" value={category.code} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="label" name="label" value={category.label} onChange={e => onChange(e, index)} />
    <FormControlLabel sx={buttonStyle} control={<Checkbox checked={category.enable} />} label="Enabled" />
    {remove != null ? <DeleteButton onClick={() => remove(index!)}></DeleteButton> : null}
  </Box>
);
