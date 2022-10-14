import * as React from 'react';
import Box from '@mui/material/Box';
import { QRCodeSVG } from 'qrcode.react';

type Props = {
  value: string;
};

export default function NormalTag({ value }: Props) {
  return (
    <Box sx={{ width: 128, position: 'relative', display: 'inline-block' }}>
      <QRCodeSVG value={value} level="H" />
      <Box
        sx={{
          width: 48,
          height: 48,
          backgroundImage: 'url("/qrlogo.svg")',
          backgroundSize: 'contain',
          position: 'absolute',
          left: 40,
          top: 40,
        }}
      ></Box>
    </Box>
  );
}
