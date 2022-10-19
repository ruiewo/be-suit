import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { convertToDisplay, convertToValue, equipmentBaseColumn, EquipmentWithUser } from '../models/equipment';
import { pcColumn, PcDetail } from '../models/equipmentDetails/pc';
import { Equipment } from '@prisma/client';

type Props = {
  open: boolean;
  onClose: () => void;
  equipment: EquipmentWithUser | null | undefined;
};

export default function EquipmentDialog({ open, onClose, equipment }: Props) {
  const definitions = [...equipmentBaseColumn, ...pcColumn];

  const handleSubmit = async () => {
    const form = document.getElementById('equipmentEditDialog') as HTMLFormElement;
    const data = new FormData(form);

    console.log(data);
    let equipmentData = {} as Equipment;

    equipmentBaseColumn.forEach(x => {
      // @ts-ignore
      equipmentData[x.key] = convertToValue(data.get(x.key), x.type);
      console.log(`${x.key}: ${data.get(x.key)}`);
    });

    const details = {} as { [key: string]: string };
    pcColumn.forEach(x => {
      details[x.key] = convertToValue(data.get(x.key), x.type) as string;
    });
    equipmentData.details = details;

    console.dir(equipmentData);

    const path = `/api/equipments/update`;
    const request = new Request(path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equipment: equipmentData }),
    });

    let response: Response;

    try {
      response = await fetch(request);
    } catch (error: any) {
      console.log(error);
      // const apiError: ApiErrorDetail = { code: errorCode.network, message: 'network error occurred.' };
      // throw new ApiError({ errors: [apiError] });
    }
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
    <Dialog open={open}>
      <DialogTitle>EQUIPMENT 詳細/編集 todo 機能分割</DialogTitle>

      <DialogContent>
        <Box id="equipmentEditDialog" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {definitions.map(def => (
            <TextField
              margin="normal"
              // required
              fullWidth
              key={def.key}
              id={def.key}
              label={def.label}
              name={def.key}
              defaultValue={convertToDisplay(equipment, def.key, def.type)}
              // if you set value property, input will be readonly.
              // value={convertToDisplay(equipment, def.key, def.type)}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          disabled={false}
          variant="contained"
          color="secondary"
          sx={{ width: 200 }}
          onClick={() => {
            onClose();
          }}
        >
          キャンセル
        </Button>
        <Button
          disabled={false}
          variant="contained"
          color="primary"
          sx={{ width: 200 }}
          onClick={() => {
            handleSubmit();
          }}
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
