import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EquipmentDialog(props: Props) {
  const router = useRouter();

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

  return (
    <Dialog open={props.open}>
      <DialogTitle>EQUIPMENT</DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Typography>ページ</Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          disabled={false}
          variant="contained"
          color="error"
          sx={{ width: '100%' }}
          onClick={() => {
            props.onClose();
          }}
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
