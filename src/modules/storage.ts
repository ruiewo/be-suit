import { QrCodeModel } from '../models/qrCodeModel';
import { isClientSide } from './util';

let qrCodes: QrCodeModel[] | null = null;

const qrCodeKey = 'QrCodes';

const qrCode = {
  get codes() {
    if (!isClientSide()) {
      return [];
    }

    if (qrCodes == null) {
      const json = localStorage.getItem(qrCodeKey);
      qrCodes = json === null ? [] : (JSON.parse(json) as QrCodeModel[]);
    }

    return qrCodes;
  },

  add: (newCodes: QrCodeModel[]) => {
    const codes = qrCode.codes as QrCodeModel[];
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
