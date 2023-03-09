import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton } from '@mui/material';

export function ExportButton(props: any) {
  return (
    <IconButton sx={{ width: 56, height: 56, mt: 2, mb: 1 }} {...props}>
      <FileDownloadIcon />
    </IconButton>
  );
}
