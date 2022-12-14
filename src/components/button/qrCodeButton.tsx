import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Badge, IconButton } from '@mui/material';

import { storage } from '../../models/localStorage';

type QrCountContext = {
  qrCount: number;
  getQrCodes: () => string[];
  addQrCodes: (codes: string[]) => void;
  deleteQrCodes: () => void;
};
const QrCount = createContext<QrCountContext>({ qrCount: 0, getQrCodes: () => [], addQrCodes: () => {}, deleteQrCodes: () => {} });

export const useQrCount = () => useContext(QrCount);

export const QrCountProvider = ({ children }: { children: ReactNode }) => {
  const initCount = storage.qrCode.codes;
  const [qrCount, setQrCount] = useState(initCount.length);

  const getQrCodes = () => {
    return storage.qrCode.codes;
  };

  const addQrCodes = (newCodes: string[]) => {
    const codes = storage.qrCode.add(newCodes);
    console.log(codes);
    setQrCount(codes.length);
  };

  const deleteQrCodes = () => {
    storage.qrCode.delete();
    setQrCount(0);
  };

  return <QrCount.Provider value={{ qrCount, getQrCodes, addQrCodes, deleteQrCodes }}>{children}</QrCount.Provider>;
};

export function QrCodeButton() {
  const { qrCount } = useQrCount();

  return (
    <IconButton sx={{ width: 80, height: 80 }}>
      <Badge badgeContent={qrCount} color="error">
        <QrCode2Icon sx={{ width: 40, height: 40, color: 'var(--color1)' }} />
      </Badge>
    </IconButton>
  );
}
