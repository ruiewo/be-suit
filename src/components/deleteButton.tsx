import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export function DeleteButton(props: any) {
  return (
    <IconButton {...props}>
      <DeleteIcon></DeleteIcon>
    </IconButton>
  );
}
