import * as React from 'react';
import { ChangeEvent } from 'react';

import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

type Props = {
  index: number;
  value: string;
  onChange: (event: ChangeEvent, index?: number) => void;
  sx: SxProps;
};
export default function ColumnTypeSelect({ index, value, onChange, sx }: Props) {
  return (
    <Box sx={sx}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="type"
          name="type"
          value={value}
          onChange={e => onChange(e as ChangeEvent, index)}
        >
          <MenuItem value="string">string</MenuItem>
          <MenuItem value="number">number</MenuItem>
          <MenuItem value="date">date</MenuItem>
          <MenuItem value="Date">Date11111110349853058038450385038508011</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
