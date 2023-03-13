import * as React from 'react';

import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useEquipment } from '../../hooks/useEquipments';
import { useSharedState } from '../../hooks/useStaticSwr';
import { client } from '../../models/apiClient';
import { DepartmentModel } from '../../models/departmentModel';
import { ColumnDefinition, Details, Equipment, convertToDisplay, convertToValue, getEquipmentCode } from '../../models/equipmentModel';
import { LocationModel } from '../../models/locationModel';
import { SubmitButtons } from '../button/submitButtons';
import { Loading } from '../loading';
import { UncontrolledCommonSelect } from '../select/CommonSelect';
import { Skeleton } from '../skeleton';
import UserSelect from '../userSelect';

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
  { key: 'departmentId', type: 'number', label: '管理者', width: 120 },
  { key: 'locationId', type: 'number', label: '使用・保管場所', width: 180 },
  { key: 'rentalDate', type: 'date', label: '貸出日', width: 120 },
  { key: 'returnDate', type: 'date', label: '返却日', width: 120 },
  { key: 'registrationDate', type: 'date', label: '登録日', width: 120 },
  { key: 'deletedDate', type: 'date', label: '削除日', width: 120 },
  { key: 'inventoryDate', type: 'date', label: '棚卸日', width: 120 },
  { key: 'note', type: 'string', label: '備考', width: 400 },
];

export function EquipmentEditDialog({ onClose, id }: Props) {
  const { equipment, columns, isLoading, isError } = useEquipment(id);

  const [departments] = useSharedState<DepartmentModel[]>('departments', []);
  const [locations] = useSharedState<LocationModel[]>('locations', []);
  const departmentItems = departments.map(x => ({ value: x.id, label: x.label }));
  const locationItems = locations.map(x => ({ value: x.id, label: x.label }));

  if (isError) return <Skeleton />;

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

    //rentalUserだけcontrol componentのため、イレギュラー
    equipmentData.rentalUserId = equipment.rentalUser?.id ?? null;

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
            <UncontrolledCommonSelect sx={style} name="locationId" label="使用・保管場所" value={equipment.locationId ?? ''} items={locationItems} />
            <UncontrolledCommonSelect sx={style} name="departmentId" label="管理者" value={equipment.departmentId ?? ''} items={departmentItems} />
            {/* rentalUserだけcontrol componentのため、イレギュラー */}
            <UserSelect name="rentalUser" label="使用者" user={equipment.rentalUser} onChange={user => (equipment.rentalUser = user)}></UserSelect>
            <DateInput name="rentalDate" label="貸出日" data={equipment} />
            <DateInput name="returnDate" label="返却日" data={equipment} />
          </Box>

          <Typography component="h6" variant="h6" sx={{ textAlign: 'center' }}>
            登録情報 その他
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <DateInput name="registrationDate" label="登録日" data={equipment} />
            <DateInput name="inventoryDate" label="棚卸日" data={equipment} />
            <DateInput name="deletedDate" label="削除日" data={equipment} />
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
                  return <TextInput key={col.key} name={col.key} label={col.label} data={equipment.details} />;
                case 'date':
                  return <DateInput key={col.key} name={col.key} label={col.label} data={equipment.details} />;
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
const style = { width: '30%', ml: 1, mr: 1, mt: 2, mb: 1 };

function TextInput({ name, label, data }: InputProps) {
  return (
    <TextField
      sx={style}
      name={name}
      label={label}
      defaultValue={convertToDisplay(data, name, 'string')}
      inputProps={{
        sx: {
          textAlign: 'center',
        },
      }}
    ></TextField>
  );
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
      inputProps={{
        sx: {
          textAlign: 'center',
        },
      }}
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
