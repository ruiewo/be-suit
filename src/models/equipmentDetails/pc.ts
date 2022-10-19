import { columnDefinition, getDetailValue } from '../equipment';

export type PcDetail = {
  os: string;
  cpu: string;
  ram: string;
  pcName: string;
};

export const pcColumn: columnDefinition<PcDetail>[] = [
  { key: 'os', label: 'OS', width: 120, convert: getDetailValue<PcDetail> },
  { key: 'cpu', label: 'CPU', width: 120, convert: getDetailValue<PcDetail> },
  { key: 'ram', label: 'RAM', width: 120, convert: getDetailValue<PcDetail> },
  { key: 'pcName', label: 'PC名', width: 120, convert: getDetailValue<PcDetail> },
];
