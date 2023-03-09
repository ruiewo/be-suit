import { Borders, Fill, Font } from 'exceljs';

type ExcelStyle = {
  border: Partial<Borders>;
  font: {
    header: Partial<Font>;
  };
  fill: {
    header: Fill;
    even: Fill;
    odd: Fill;
  };
};

export const style: ExcelStyle = {
  border: {
    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  },
  font: {
    header: { bold: true },
  },
  fill: {
    header: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } },
    even: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } },
    odd: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
  },
};
