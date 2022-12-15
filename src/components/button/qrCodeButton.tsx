import Link from 'next/link';
import { ReactNode, createContext, useContext, useState } from 'react';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Badge, IconButton } from '@mui/material';

import { page } from '../../models/const/path';
import { QrModel } from '../../models/qrModel';
import { storage } from '../../modules/storage';

type QrCodeContext = {
  qrCount: number;
  getQrCodes: () => QrModel[];
  addQrCodes: (codes: QrModel[]) => void;
  deleteQrCodes: () => void;
};
const QrCode = createContext<QrCodeContext>({ qrCount: 0, getQrCodes: () => [], addQrCodes: () => {}, deleteQrCodes: () => {} });

export const useQrCode = () => useContext(QrCode);

export const QrCodeProvider = ({ children }: { children: ReactNode }) => {
  const initCount = storage.qrCode.codes;
  const [qrCount, setQrCount] = useState(initCount.length);

  const getQrCodes = () => {
    return storage.qrCode.codes;
  };

  const addQrCodes = (newCodes: QrModel[]) => {
    const codes = storage.qrCode.add(newCodes);
    console.log(codes);
    setQrCount(codes.length);
  };

  const deleteQrCodes = () => {
    storage.qrCode.delete();
    setQrCount(0);
  };

  return <QrCode.Provider value={{ qrCount, getQrCodes, addQrCodes, deleteQrCodes }}>{children}</QrCode.Provider>;
};

export function QrCodeButton() {
  const { qrCount } = useQrCode();

  return (
    <Link href={page.qrCodePrint}>
      <IconButton sx={{ width: 80, height: 80 }}>
        <Badge badgeContent={qrCount} color="error">
          <QrCode2Icon sx={{ width: 40, height: 40, color: 'var(--color1)' }} />
        </Badge>
      </IconButton>
    </Link>
  );
}
