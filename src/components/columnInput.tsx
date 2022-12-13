import { ChangeEvent } from 'react';

import { Box, TextField } from '@mui/material';

import { ColumnDefinition, Details } from '../models/equipmentModel';
import { DeleteButton } from './button/deleteButton';
import { ColumnTypeSelect } from './columnTypeSelect';

type Props = {
  index: number;
  column: ColumnDefinition<Details>;
  onChange: (event: ChangeEvent, index?: number) => void;
  remove?: (index: number) => void;
};

const style = { width: '18%', ml: 1, mr: 1, mt: 2, mb: 1 };

export const ColumnInput = ({ index, column, onChange, remove }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <TextField margin="normal" sx={style} label="key" name="key" value={column.key} onChange={e => onChange(e, index)} />
    <ColumnTypeSelect sx={style} value={column.type} index={index} onChange={onChange} />
    <TextField margin="normal" sx={style} label="label" name="label" value={column.label} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="width" name="width" value={column.width} onChange={e => onChange(e, index)} />
    {remove == null ? null : <DeleteButton onClick={() => remove(index)}> Remove </DeleteButton>}
  </Box>
);
