import BorderColorIcon from '@mui/icons-material/BorderColor';
import { IconButton } from '@mui/material';

export function EditButton(props: any) {
  return (
    <IconButton sx={{ width: 56, height: 56, mt: 2, mb: 1 }} {...props}>
      <BorderColorIcon />
    </IconButton>
  );
}
