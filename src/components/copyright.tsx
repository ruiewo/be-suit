import * as React from 'react';

import Typography from '@mui/material/Typography';

export function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {process.env.NEXT_PUBLIC_COMPANY}
    </Typography>
  );
}
