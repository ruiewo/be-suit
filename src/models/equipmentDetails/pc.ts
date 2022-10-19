import { columnDefinition, getDetailValue } from '../equipment';

export type PcDetail = {
  os: string;
  cpu: string;
  ram: string;
  pcName: string;
};

export const pcColumn: columnDefinition<PcDetail>[] = [
  { key: 'os', type: 'details', label: 'OS', width: 120 },
  { key: 'cpu', type: 'details', label: 'CPU', width: 120 },
  { key: 'ram', type: 'details', label: 'RAM', width: 120 },
  { key: 'pcName', type: 'details', label: 'PC名', width: 120 },
];
