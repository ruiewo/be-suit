import { QRCodeSVG } from 'qrcode.react';

import Box from '@mui/material/Box';

import styles from '../styles/qrcode.module.css';

type Props = {
  value: string;
};

export default function NormalTag({ value }: Props) {
  return (
    <Box sx={{ width: '20mm', position: 'relative', display: 'inline-block' }}>
      <div className={styles.qrcode}>
        <QRCodeSVG size={35} value={value} level="H" className={styles.qrcodeIncludeImage} />
      </div>
    </Box>
  );
}
