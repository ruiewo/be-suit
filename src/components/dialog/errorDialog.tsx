import Image from 'next/image';
import { ReactNode, createContext, useContext, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon } from '@mui/material';

type DialogOption = {
  title: string;
  description: string;
};

const ErrorDialogOption = createContext<(options: DialogOption) => void>(() => {});

export const useErrorDialog = () => useContext(ErrorDialogOption);

export const ErrorDialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogOption, setDialogOption] = useState<DialogOption | null>(null);

  const showDialog = (options: DialogOption | null) => {
    setDialogOption(options);
  };

  return (
    <>
      <ErrorDialogOption.Provider value={showDialog}>{children}</ErrorDialogOption.Provider>
      <ErrorDialog open={dialogOption != null} {...dialogOption} close={() => showDialog(null)} />
    </>
  );
};

type Props = {
  open: boolean;
  title?: string;
  description?: string;

  close: () => void;
  onSubmit?: () => void;
  onClose?: () => void;
};
const ErrorDialog = ({ open, title, description, close, onSubmit, onClose }: Props) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          alignItems: 'center',
          minWidth: 400,
          padding: '15px 10px',
          borderRadius: '20px',
          border: '4px solid var(--color4)',
          backgroundColor: 'var(--color5)',
        },
      }}
    >
      <Icon sx={{ width: 280, height: 60, position: 'relative' }}>
        <Image src="/images/app-logo-text-1.png" alt="logo" fill style={{ objectFit: 'contain' }} />
      </Icon>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            close();
            // onSubmit();
          }}
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};
