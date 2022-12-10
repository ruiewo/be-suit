import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

export function DeleteButton(props: any) {
  return (
    <IconButton sx={{ width: 56, height: 56, mt: 2, mb: 1 }} {...props}>
      <DeleteIcon></DeleteIcon>
    </IconButton>
  );
}
