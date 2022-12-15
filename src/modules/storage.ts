import { QrModel } from '../models/qrModel';
import { isClientSide } from './util';

let qrCodes: QrModel[] | null = null;

const qrCodeKey = 'QrCodes';

const qrCode = {
  get codes() {
    if (!isClientSide()) {
      return [];
    }

    if (qrCodes == null) {
      const json = localStorage.getItem(qrCodeKey);
      qrCodes = json === null ? [] : (JSON.parse(json) as QrModel[]);
    }

    return qrCodes;
  },

  add: (newCodes: QrModel[]) => {
    const codes = qrCode.codes as QrModel[];
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
