import dynamic from 'next/dynamic';

import { isClientSide } from '../modules/util';

let qrCodes: string[] | null = null;

const qrCodeKey = 'QrCodes';

const qrCode = {
  get codes() {
    if (!isClientSide()) {
      return [];
    }

    if (qrCodes == null) {
      const json = localStorage.getItem(qrCodeKey);
      qrCodes = json === null ? [] : (JSON.parse(json) as string[]);
    }

    return qrCodes;
  },

  add: (newCodes: string[]) => {
    // @ts-ignore
    const codes = qrCode.codes as string[];
    newCodes.forEach(x => codes.push(x));
    localStorage.setItem(qrCodeKey, JSON.stringify(codes));

    return codes;
  },

  delete: () => {
    localStorage.removeItem(qrCodeKey);
    qrCodes = [];
  },
};

export const storage = {
  qrCode: qrCode,
};
