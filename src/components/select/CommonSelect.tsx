import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps } from '@mui/material';

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  items: CommonSelectItem[];
  sx: SxProps;
};
export type CommonSelectItem = { value: string; label: string };
export function CommonSelect({ label, name, value, onChange, items, sx }: Props) {
  return (
    <Box sx={sx}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select label={label} name={name} value={value ? value : ''} onChange={onChange}>
          <MenuItem value="">未選択</MenuItem>
          {items.map(x => (
            <MenuItem key={x.value} value={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
