import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Box, Button } from '@mui/material';

import { QrCodeButton, useQrCode } from '../../components/button/qrCodeButton';
import { useErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { EquipmentSearchPanel } from '../../components/searchPanel/equipmentSearchPanel';
import { Skeleton } from '../../components/skeleton';
import { BaseTable, TableDataObj } from '../../components/table/baseTable';
import { client } from '../../models/apiClient';
import { ColumnDefinition, Details, EquipmentModel, convertToDisplay } from '../../models/equipmentModel';
import { QrCodeModel } from '../../models/qrCodeModel';
import { convertToMessage, sleep } from '../../modules/util';
import styles from '../../styles/deleteChip.module.css';
import { NextPageWithLayout } from '../_app';

const Page: NextPageWithLayout = () => {
  const showErrorDialog = useErrorDialog();

  const { getQrCodes, addQrCodes, deleteQrCodes, changeQrCodes } = useQrCode();

  const [categoryCodes, setCategoryCodes] = useState({ main: 'PC', sub: ['D'] });

  const [filterText, setFilterText] = useState('');

  const [tableData, setTableData] = useState<TableDataObj[]>([]);
  const [columns, setColumns] = useState<ColumnDefinition<Details>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [qrCodes, setQrCodes] = useState<QrCodeModel[]>([]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const [{ equipments, columns: detailColumns, error }] = await Promise.all([
          client.api.equipment.advancedSearch.$post({ body: { categoryCodes: categoryCodes } }),
          sleep(1000),
        ]);

        if (error) {
          showErrorDialog({ title: 'Load Failed.', description: convertToMessage(error) });
          return;
        }

        setQrCodes(getQrCodes());
        setTableData(convertToTableData(equipments, detailColumns));
        setColumns([...baseColumns, ...detailColumns]);
      } catch (error) {
        setIsError(true);
        showErrorDialog({ title: 'Load Failed.', description: `failed to load equipments. ${error}` });
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [categoryCodes]);

  if (isError) return <Skeleton />;

  if (tableData == null || columns == null) return <Skeleton />;

  return (
    <>
      <Box display="flex" flexDirection="column" position="relative" width="100%" minHeight={400} height="50vh">
        <EquipmentSearchPanel
          filterText={filterText}
          setFilterText={setFilterText}
          categoryCodes={categoryCodes}
          setCategoryCodes={setCategoryCodes}
          departments={[]}
          departmentId={undefined}
          setDepartmentId={() => {}}
        />
        {isLoading ? <Loading></Loading> : <BaseTable data={tableData} columns={columns} filterText={filterText} />}
      </Box>
      <SubmitButtons
        addAll={() => {
          const all: QrCodeModel[] = tableData.map(x => [x.code as string, (x.pcName as string) ?? undefined]);
          setQrCodes([...qrCodes, ...all]);
          addQrCodes(all);
        }}
        addSelected={() => {
          const selectedItems: QrCodeModel[] = tableData.filter(x => x['isSelected']).map(x => [x.code as string, (x.pcName as string) ?? undefined]);
          setQrCodes([...qrCodes, ...selectedItems]);
          addQrCodes(selectedItems);
        }}
        deleteAll={() => {
          setQrCodes([]);
          deleteQrCodes();
        }}
      ></SubmitButtons>
      <QrCodes qrCodes={qrCodes} setQrCodes={setQrCodes} changeQrCodes={changeQrCodes}></QrCodes>
    </>
  );
};

export default Page;

const baseColumns: ColumnDefinition<Details>[] = [
  { key: 'isSelected', type: 'bool', label: '', style: 'center', width: 80 },
  { key: 'code', type: 'string', label: '管理番号', style: 'center', width: 110 },
  { key: 'department', type: 'string', label: '管理者', style: 'upLeft', width: 100 },
  { key: 'rentalUserStr', type: 'string', label: '使用者', style: 'bottomRight', width: 100 },
  { key: 'location', type: 'string', label: '場所', style: 'center', width: 180 },
  { key: 'maker', type: 'string', label: 'メーカー', style: 'upLeft', width: 100 },
  { key: 'modelNumber', type: 'string', label: '型番', style: 'bottomRight', width: 130 },
];

function convertToTableData(equipments: EquipmentModel[], detailColumns: ColumnDefinition<Details>[] = []) {
  const tableData = equipments.map(equipment => {
    const converted: TableDataObj = {};
    converted['id'] = equipment.id;

    for (const col of baseColumns) {
      converted[col.key] = convertToDisplay(equipment, col.key, col.type);
    }

    for (const col of detailColumns) {
      converted[col.key] = convertToDisplay(equipment.details, col.key, col.type);
    }

    return converted;
  });

  return tableData;
}

type Props = {
  addAll: () => void;
  addSelected: () => void;
  deleteAll: () => void;
};

export function SubmitButtons({ addAll, addSelected, deleteAll }: Props) {
  return (
    <Box sx={{ textAlign: 'center' }} margin={4}>
      <Button variant="contained" color="primary" sx={{ width: 200, mr: 2, ml: 2 }} onClick={addAll}>
        すべて追加
      </Button>
      <Button variant="contained" color="primary" sx={{ width: 200, mr: 2, ml: 2 }} onClick={addSelected}>
        選択中を追加
      </Button>
      <Button variant="contained" color="primary" sx={{ width: 200, mr: 8, ml: 2 }} onClick={deleteAll}>
        すべて削除
      </Button>
      <QrCodeButton />
    </Box>
  );
}

function QrCodes({
  qrCodes,
  setQrCodes,
  changeQrCodes,
}: {
  qrCodes: QrCodeModel[];
  setQrCodes: Dispatch<SetStateAction<QrCodeModel[]>>;
  changeQrCodes: (codes: QrCodeModel[]) => void;
}) {
  const handleDelete = (qrCode: QrCodeModel) => {
    const newCodes = [...qrCodes.filter(x => x !== qrCode)];
    changeQrCodes(newCodes);
    setQrCodes(newCodes);
  };

  return (
    <div className={styles.chipWrapper}>
      {qrCodes.map((x, i) => (
        <Chip key={`${x[0]}_${i}`} label={x[0]} onDelete={() => handleDelete(x)}></Chip>
      ))}
    </div>
  );
}
type ChipProps = {
  label: string;
  onDelete: (event: any) => void;
};
function Chip({ label, onDelete }: ChipProps) {
  return (
    <div className={styles.chipRoot}>
      <span className={styles.label}>{label}</span>
      <svg className={styles.icon} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon" onClick={onDelete}>
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
      </svg>
    </div>
  );
}
