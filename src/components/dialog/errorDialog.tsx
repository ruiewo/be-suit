import Image from 'next/image';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { Copyright } from '../../components/copyright';
import { isNullOrWhiteSpace } from '../../modules/util';
import styles from '../../styles/accountDialog.module.css';

type Props = {
  message?: string;
};
export const ErrorDialog = ({ message }: Props) => {
  message = isNullOrWhiteSpace(message) ? 'Failed to load' : message;

  return (
    <Box
      maxWidth="xs"
      className={styles.accountDialog}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Icon sx={{ width: 280, height: 60, position: 'relative' }}>
        <Image src="/images/app-logo-text-1.png" alt="logo" layout="fill" objectFit="contain" />
      </Icon>
      <Typography sx={{ mt: 5, fontSize: 32 }}>{message}</Typography>

      <Copyright sx={{ mt: 5 }} />
    </Box>
  );
};
