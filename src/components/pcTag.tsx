import * as React from 'react';
import Box from '@mui/material/Box';
import NormalTag from './normalTag';
import { Typography } from '@mui/material';

type Props = {
  value: string;
  pcName: string;
};

export default function PcTag({ value, pcName }: Props) {
  return (
    <Box sx={{ width: 256, display: 'inline-flex', flexDirection: 'row' }}>
      <NormalTag value={value}></NormalTag>
      <Box sx={{ width: 128, padding: '5px' }}>
        <Typography>{value}</Typography>
        <Typography>{pcName}</Typography>
      </Box>
    </Box>
  );
}
