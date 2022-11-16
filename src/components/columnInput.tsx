import { ChangeEvent } from 'react';

import { Box, TextField } from '@mui/material';

import { ColumnDefinition, Details } from '../models/equipment';
import { DeleteButton } from './deleteButton';

type Props = {
  index?: number;
  column: ColumnDefinition<Details>;
  onChange: (event: ChangeEvent, index?: number) => void;
  remove?: (index: number) => void;
};

const style = { width: '18%', ml: '2%', mr: '2%' };
export const ColumnInput = ({ index, column, onChange, remove }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <TextField margin="normal" sx={style} label="key" name="key" value={column.key} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="type" name="type" value={column.type} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="label" name="label" value={column.label} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="width" name="width" value={column.width} onChange={e => onChange(e, index)} />
    {remove != null ? <DeleteButton onClick={() => remove(index!)}> Remove </DeleteButton> : null}
  </Box>
);
