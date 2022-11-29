import Box from '@mui/material/Box';

import styles from '../styles/qrcode.module.css';
import NormalTag from './normalTag';

type Props = {
  value: string;
  pcName: string;
};

export default function PcTag({ value, pcName }: Props) {
  return (
    <Box
      sx={{
        width: '20mm',
        height: '20mm',
        display: 'inline-flex',
        flexDirection: 'column',
        border: '1px solid black',
        padding: '4px 0 0 0',
      }}
    >
      <NormalTag value={value}></NormalTag>
      <div className={styles.textArea}>
        <p className={styles.text}>{value}</p>
        <p className={styles.text}>{pcName}</p>
      </div>
    </Box>
  );
}
