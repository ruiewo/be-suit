import * as React from 'react';

import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useEquipment } from '../../hooks/useEquipments';
import { useSharedState } from '../../hooks/useStaticSwr';
import { client } from '../../models/apiClient';
import { DepartmentModel } from '../../models/departmentModel';
import { ColumnDefinition, Details, Equipment, convertToDisplay, convertToValue, getEquipmentCode } from '../../models/equipmentModel';
import { SubmitButtons } from '../button/submitButtons';
import { Loading } from '../loading';
import { ErrorDialog } from './errorDialog';

type Props = {
  id: number;
  onClose: (isEdited: boolean) => void;
};

const baseColumn: ColumnDefinition<Equipment>[] = [
  // { key: 'id', type: 'number', label: 'ID', width: 40 },
  // { key: 'category', type: 'string', label: '管理番号', width: 100 },
  // { key: 'subCategory', type: 'string', label: '管理番号', width: 100 },
  // { key: 'categorySerial', type: 'number', label: '管理番号', width: 100 },
  { key: 'maker', type: 'string', label: 'メーカー', width: 120 },
  { key: 'modelNumber', type: 'string', label: '型番', width: 120 },
  { key: 'group', type: 'string', label: '管理者', width: 120 },
  { key: 'rentalUser', type: 'string', label: '使用者', width: 120 },
  { key: 'place', type: 'string', label: '使用・保管場所', width: 180 },
  { key: 'rentalDate', type: 'date', label: '貸出日', width: 120 },
  { key: 'returnDate', type: 'date', label: '返却日', width: 120 },
  { key: 'registrationDate', type: 'date', label: '登録日', width: 120 },
  { key: 'deletedDate', type: 'date', label: '削除日', width: 120 },
  { key: 'inventoryDate', type: 'date', label: '棚卸日', width: 120 },
  { key: 'note', type: 'string', label: '備考', width: 400 },
];

export default function EquipmentEditDialog({ onClose, id }: Props) {
  const { equipment, columns, isLoading, isError } = useEquipment(id);
  console.log(equipment);

  const [departments] = useSharedState<DepartmentModel[]>('departments', []);

  if (isError) return <ErrorDialog />;

  if (isLoading) return <Loading />;

  if (equipment == null || columns == null) {
    return (
      <Dialog open={id !== null}>
        <DialogTitle>EQUIPMENT 詳細/編集</DialogTitle>

        <DialogContent>
          <DialogContentText>設備指定が不適切です。</DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            disabled={false}
            variant="contained"
            color="primary"
            sx={{ width: 200 }}
            onClick={() => {
              onClose(false);
            }}
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleSubmit = async () => {
    const data = new FormData(document.getElementById('equipmentEditDialog') as HTMLFormElement);

    const equipmentData = { ...equipment } as Equipment;

    baseColumn.forEach(x => {
      // @ts-ignore
      equipmentData[x.key] = convertToValue(data.get(x.key), x.type);
    });

    const details = {} as Details;
    columns.forEach(col => {
      details[col.key] = convertToValue(data.get(col.key), col.type);
    });
    equipmentData.details = details;
    console.log(equipmentData);

    // todo error handling
    await client.api.equipment.update.$post({ body: { equipment: equipmentData } });
    onClose(true);
  };

  const equipmentCode = getEquipmentCode(equipment);

  return (
    <Dialog open={id !== null} maxWidth="md">
      <DialogTitle textAlign="center">{equipmentCode} </DialogTitle>

      <DialogContent>
        <Box id="equipmentEditDialog" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Typography component="h6" variant="h6" sx={{ textAlign: 'center' }}>
            機種
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <TextInput name="maker" label="メーカー" data={equipment} />
            <TextInput name="modelNumber" label="型番" data={equipment} />
          </Box>

          <Typography component="h6" variant="h6" sx={{ textAlign: 'center' }}>
            利用状況
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <TextInput name="group" label="管理者" data={equipment} />
            <TextInput name="rentalUser" label="使用者" data={equipment} />
            <DateInput name="rentalDate" label="貸出日" data={equipment} />
            <DateInput name="returnDate" label="返却日" data={equipment} />
            <TextInput name="place" label="使用・保管場所" data={equipment} />
          </Box>

          <Typography component="h6" variant="h6" sx={{ textAlign: 'center' }}>
            登録情報 その他
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <DateInput name="registrationDate" label="登録日" data={equipment} />
            <DateInput name="deletedDate" label="削除日" data={equipment} />
            <DateInput name="inventoryDate" label="棚卸日" data={equipment} />
            <TextAreaInput name="note" label="備考" data={equipment} />
          </Box>

          <Typography component="h6" variant="h6" sx={{ textAlign: 'center' }}>
            カテゴリー固有
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            {columns.map(col => {
              switch (col.type) {
                case 'string':
                case 'number':
                  return <TextInput name={col.key} label={col.label} data={equipment.details} />;
                case 'date':
                  return <DateInput name={col.key} label={col.label} data={equipment.details} />;
                default:
                  return <></>;
              }
            })}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <SubmitButtons onSubmit={handleSubmit} onCancel={() => onClose(false)}></SubmitButtons>
      </DialogActions>
    </Dialog>
  );
}
type InputProps = {
  name: string;
  label: string;
  data: any; // Equipment, Details, etc.
};
const style = { width: '46%', ml: 1, mr: 1, mt: 2, mb: 1 };

function TextInput({ name, label, data }: InputProps) {
  return <TextField sx={style} name={name} label={label} defaultValue={convertToDisplay(data, name, 'string')}></TextField>;
}

function DateInput({ name, label, data }: InputProps) {
  return (
    <TextField
      sx={style}
      name={name}
      label={label}
      defaultValue={convertToDisplay(data, name, 'date')}
      type="date"
      InputLabelProps={{ shrink: true }}
    ></TextField>
  );
}
function TextAreaInput({ name, label, data }: InputProps) {
  return (
    <TextField
      sx={{ ...style, width: '94%', boxSizing: 'border-box' }}
      name={name}
      label={label}
      defaultValue={convertToDisplay(data, name, 'string')}
      multiline={true}
    ></TextField>
  );
}
