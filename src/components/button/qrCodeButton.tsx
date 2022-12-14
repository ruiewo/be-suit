import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Badge, IconButton } from '@mui/material';

import { storage } from '../../models/localStorage';

type QrCountContext = {
  qrCount: number;
  setQrCount: Dispatch<SetStateAction<number>>;
};
const QrCount = createContext<QrCountContext>({ qrCount: 0, setQrCount: () => {} });

export const useQrCount = () => useContext(QrCount);

export const QrCountProvider = ({ children }: { children: ReactNode }) => {
  const initCount = storage.qrCode.getQrCodes();
  const [qrCount, setQrCount] = useState(initCount.length);

  return <QrCount.Provider value={{ qrCount, setQrCount }}>{children}</QrCount.Provider>;
};

export function QrCodeButton({ count }: { count: number }) {
  const { qrCount, setQrCount } = useQrCount();

  return (
    <IconButton sx={{ width: 80, height: 80 }}>
      <Badge badgeContent={qrCount} color="error">
        <QrCode2Icon sx={{ width: 40, height: 40, color: 'var(--color1)' }} />
      </Badge>
    </IconButton>
  );
}
