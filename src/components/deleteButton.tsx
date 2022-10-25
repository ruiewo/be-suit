import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export function DeleteButton(props: any) {
  return (
    <Button {...props}>
      <IconButton>
        <DeleteIcon></DeleteIcon>
      </IconButton>
    </Button>
 
  );
}
