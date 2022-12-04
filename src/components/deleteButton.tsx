import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

export function DeleteButton(props: any) {
  return (
    <IconButton {...props}>
      <DeleteIcon></DeleteIcon>
    </IconButton>
  );
}
