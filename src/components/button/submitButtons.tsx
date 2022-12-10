import { Box, Button } from '@mui/material';

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
};

export function SubmitButtons({ onCancel, onSubmit }: Props) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button variant="contained" color="secondary" sx={{ width: 200, mr: 2, ml: 2 }} onClick={onCancel}>
        戻る
      </Button>
      <Button variant="contained" color="primary" sx={{ width: 200, mr: 2, ml: 2 }} onClick={onSubmit}>
        確定
      </Button>
    </Box>
  );
}
