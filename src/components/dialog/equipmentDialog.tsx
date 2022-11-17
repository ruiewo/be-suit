import * as React from 'react';

import aspida from '@aspida/fetch';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  ColumnDefinition,
  Details,
  Equipment,
  EquipmentWithUser,
  convertToDisplay,
  convertToValue,
  equipmentBaseColumn,
} from '../../models/equipment';
import api from '../../pages/$api';

type Props = {
  open: boolean;
  onClose: () => void;
  equipment: EquipmentWithUser | null | undefined;
  optionColumn: ColumnDefinition<Details>[];
};

const client = api(aspida());

export default function EquipmentDialog({ open, onClose, equipment, optionColumn }: Props) {
  const baseColumn = [...equipmentBaseColumn];

  const handleSubmit = async () => {
    const data = new FormData(document.getElementById('equipmentEditDialog') as HTMLFormElement);

    const equipmentData = {} as Equipment;

    baseColumn.forEach(x => {
      // @ts-ignore
      equipmentData[x.key] = convertToValue(data.get(x.key), x.type);
    });

    const details = {} as Details;
    optionColumn.forEach(col => {
      details[col.key] = convertToValue(data.get(col.key), col.type);
    });
    equipmentData.details = details; // todo refactor as cast.

    // todo error handling
    client.api.equipment.update.$post({ body: { equipment: equipmentData } });
  };

  if (equipment == null) {
    return (
      <Dialog open={open}>
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
              onClose();
            }}
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle textAlign="center">EQUIPMENT 詳細/編集</DialogTitle>

      <DialogContent>
        <Box id="equipmentEditDialog" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {baseColumn.map(col => (
            <TextField
              margin="normal"
              // required
              // fullWidth
              sx={{ width: '46%', ml: '2%', mr: '2%' }}
              key={col.key}
              id={col.key}
              label={col.label}
              name={col.key}
              defaultValue={convertToDisplay(equipment, col.key, col.type)}
              // if you set value property, input will be readonly.
              // value={convertToDisplay(equipment, def.key, def.type)}

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
          {optionColumn.map(col => (
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
        <Button disabled={false} variant="contained" color="secondary" sx={{ width: 200 }} onClick={onClose}>
          キャンセル
        </Button>
        <Button disabled={false} variant="contained" color="primary" sx={{ width: 200 }} onClick={handleSubmit}>
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
