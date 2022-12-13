import { ReactNode, createContext, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface DialogOption {
  title: string;
  description: string;
}
export const ErrDialog = createContext<(options: DialogOption) => void>(() => {});
// const useErrDialog = useContext(ErrDialog);

export const ErrDialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogOption, setDialogOption] = useState<DialogOption | null>(null);

  const showDialog = (options: DialogOption | null) => {
    setDialogOption(options);
  };

  return (
    <>
      <ErrDialog.Provider value={showDialog}>{children}</ErrDialog.Provider>
      <TestDialog open={dialogOption != null} {...dialogOption} close={() => showDialog(null)} />
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
const TestDialog = ({ open, title, description, close, onSubmit, onClose }: Props) => {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            close();
            // onSubmit();
          }}
        >
          閉じる
        </Button>
        <Button color="primary" onClick={onClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
