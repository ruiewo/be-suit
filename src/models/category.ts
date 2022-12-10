import { ColumnDefinition, Details } from './equipmentModel';

export type Category = CategoryBase & {
  subCategories: CategoryBase[];
  columns: ColumnDefinition<Details>[];
};

export type CategoryBase = { code: string; label: string; enable: boolean };

const category = {
  key: 'PC',
  label: 'パソコン',
  enable: true,
  subCategories: [
    { key: 'D', label: 'Desktop', enable: true },
    { key: 'N', label: 'Note', enable: true },
    { key: 'T', label: 'Tablet', enable: true },
  ],
  columns: [
    { key: 'os', type: 'string', label: 'OS', width: 120 },
    { key: 'cpu', type: 'string', label: 'CPU', width: 120 },
    { key: 'ram', type: 'string', label: 'RAM', width: 120 },
    { key: 'pcName', type: 'string', label: 'PC名', width: 120 },
  ],
};

const hoge = {
  pc: { label: 'パソコン', sub: [] },
  monitor: { label: 'モニタ', sub: [] },
  printer: { label: 'プリンタ', sub: [] },
  drive: { label: 'ドライブ', sub: ['dvd drive', 'blu-ray drive'] },
  storage: { label: 'ストレージ', sub: ['nas', 'portable hdd', 'usb memory'] },
  network: { label: 'ネットワーク機器', sub: ['router', 'Switching Hub'] },
  other: { label: 'その他', sub: ['ups', 'speaker'] },
  parts: { label: 'PCパーツ', sub: ['', ''] },
  cable: { label: '変換ケーブル？？？', sub: ['', ''] },
  devices: { label: '周辺機器', sub: ['head set', 'web camera'] },
  chair: { label: '椅子', sub: [] },
  desk: { label: '机', sub: [] },
  shelf: { label: '棚・ロッカー', sub: [] },
  oa: { label: 'OA機器', sub: [] },
};
