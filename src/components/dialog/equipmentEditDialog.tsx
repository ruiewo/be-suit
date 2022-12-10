import * as React from 'react';

import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useEquipment } from '../../hooks/useEquipments';
import { client } from '../../models/apiClient';
import { Details, Equipment, convertToDisplay, convertToValue, equipmentBaseColumn } from '../../models/equipmentModel';
import { SubmitButtons } from '../button/submitButtons';
import { Loading } from '../loading';
import { ErrorDialog } from './errorDialog';

type Props = {
  id: number;
  onClose: (isEdited: boolean) => void;
};

export default function EquipmentEditDialog({ onClose, id }: Props) {
  const baseColumn = [...equipmentBaseColumn];

  const { equipment, columns, isLoading, isError } = useEquipment(id);

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

    const equipmentData = {} as Equipment;

    baseColumn.forEach(x => {
      // @ts-ignore
      equipmentData[x.key] = convertToValue(data.get(x.key), x.type);
    });

    const details = {} as Details;
    columns.forEach(col => {
      details[col.key] = convertToValue(data.get(col.key), col.type);
    });
    equipmentData.details = details;

    // todo error handling
    await client.api.equipment.update.$post({ body: { equipment: equipmentData } });
    onClose(true);
  };

  return (
    <Dialog open={id !== null} maxWidth="md">
      <DialogTitle textAlign="center">EQUIPMENT 詳細/編集</DialogTitle>

      <DialogContent>
        <Box id="equipmentEditDialog" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {baseColumn.map(col => (
            <TextField
              margin="normal"
              sx={{ width: '46%', ml: '2%', mr: '2%' }}
              key={col.key}
              id={col.key}
              label={col.label}
              name={col.key}
              defaultValue={convertToDisplay(equipment, col.key, col.type)}
              // for text area
              multiline={col.key === 'note'}
              // for input type="date".
              type={col.type === 'date' ? 'date' : ''}
              InputLabelProps={
                col.type === 'date'
                  ? {
                      shrink: true,
                    }
                  : {}
              }
            />
          ))}
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
            OPTIONAL
          </Typography>
          {columns.map(col => (
            <TextField
              margin="normal"
              sx={{ width: '46%', ml: '2%', mr: '2%' }}
              key={col.key as string}
              id={col.key as string}
              label={col.label}
              name={col.key as string}
              defaultValue={convertToDisplay(equipment.details, col.key as string, col.type)}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <SubmitButtons onSubmit={handleSubmit} onCancel={() => onClose(false)}></SubmitButtons>
      </DialogActions>
    </Dialog>
  );
}
