import { columnDefinition, getDetailValue } from '../equipment';

export type PcDetail = {
  os: string;
  cpu: string;
  ram: string;
  pcName: string;
};

export const pcColumn: columnDefinition<PcDetail>[] = [
  { key: 'os', label: 'OS', convert: getDetailValue<PcDetail> },
  { key: 'cpu', label: 'CPU', convert: getDetailValue<PcDetail> },
  { key: 'ram', label: 'RAM', convert: getDetailValue<PcDetail> },
  { key: 'pcName', label: 'PC名', convert: getDetailValue<PcDetail> },
];
