import BorderColorIcon from '@mui/icons-material/BorderColor';
import { IconButton } from '@mui/material';

export function EditButton(props: any) {
  return (
    <IconButton {...props}>
      <BorderColorIcon></BorderColorIcon>
    </IconButton>
  );
}
