import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { ColumnDefinition, Details } from '../models/equipment';

type Props = {
  index?: number;
  column: ColumnDefinition<Details>;
  onChange: (event: ChangeEvent, index?: number) => void;
  remove?: (index: number) => void;
};

const style = { width: '20%', ml: '2%', mr: '2%' };
export const ColumnInput = ({ index, column, onChange, remove }: Props) => (
  <Box>
    <TextField margin="normal" sx={style} label="key" name="key" value={column.key} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="type" name="type" value={column.type} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="label" name="label" value={column.label} onChange={e => onChange(e, index)} />
    <TextField margin="normal" sx={style} label="width" name="width" value={column.width} onChange={e => onChange(e, index)} />
    {remove != null ? <Button onClick={() => remove(index!)}> Remove </Button> : null}
  </Box>
);
