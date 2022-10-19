import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { ColumnDefinition, convertToDisplay, convertToValue, equipmentBaseColumn, EquipmentWithUser } from '../models/equipment';
import { Equipment, Prisma } from '@prisma/client';

type Props = {
  open: boolean;
  onClose: () => void;
  equipment: EquipmentWithUser | null | undefined;
  optionColumn: ColumnDefinition<any>[];
};

export default function EquipmentDialog({ open, onClose, equipment, optionColumn }: Props) {
  const baseColumn = [...equipmentBaseColumn];

  const handleSubmit = async () => {
    const data = new FormData(document.getElementById('equipmentEditDialog') as HTMLFormElement);

    const equipmentData = {} as Equipment;

    baseColumn.forEach(x => {
      // @ts-ignore
      equipmentData[x.key] = convertToValue(data.get(x.key), x.type);
    });

    const details = {} as { [key: string]: string | number | Date | null };
    optionColumn.forEach(col => {
      // col.key is always string
      details[col.key as string] = convertToValue(data.get(col.key as string), col.type);
    });
    equipmentData.details = details as Prisma.JsonValue; // todo refactor as cast.

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
