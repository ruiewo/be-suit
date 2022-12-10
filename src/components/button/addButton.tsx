import { Box, Button } from '@mui/material';

export function AddButton(props: any) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button {...props}>＋追加</Button>
    </Box>
  );
}
