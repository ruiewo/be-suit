import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { equipmentBaseColumn, EquipmentWithUser } from '../models/equipment';
import { pcColumn } from '../models/equipmentDetails/pc';

type Props = {
  open: boolean;
  onClose: () => void;
  equipment: EquipmentWithUser | null | undefined;
};

export default function EquipmentDialog({ open, onClose, equipment }: Props) {
  const router = useRouter();
  const definitions = [...equipmentBaseColumn, ...pcColumn];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    if (data.get('email') !== 'email' && data.get('password') !== 'password') {
      // login failed
      return;
    }

    router.push('/');
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
        {definitions.map(def => (
          <TextField
            margin="normal"
            required
            fullWidth
            key={def.key}
            id={def.key}
            label={def.label}
            name={def.key}
            value={def.convert(equipment, def.key)}
          />
        ))}
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
            onClose();
          }}
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
