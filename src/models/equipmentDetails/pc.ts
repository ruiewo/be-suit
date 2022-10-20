import { ColumnDefinition } from '../equipment';

export type PcDetail = {
  os: string;
  cpu: string;
  ram: string;
  pcName: string;
};

export const pcColumn: ColumnDefinition<PcDetail>[] = [
  { key: 'pcName', type: 'string', label: 'PC名', width: 120 },
  { key: 'os', type: 'string', label: 'OS', width: 120 },
  { key: 'cpu', type: 'string', label: 'CPU', width: 120 },
  { key: 'ram', type: 'string', label: 'RAM', width: 120 },
];
