import Image from 'next/image';

import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { Copyright } from '../../components/copyright';
import SignInButton from '../../components/signInButton';
import styles from '../../styles/accountDialog.module.css';

export const AccountDialog = () => {
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
      <Icon sx={{ width: 110, height: 100, position: 'relative' }}>
        <Image src="/images/app-logo.png" alt="logo" layout="fill" objectFit="contain" />
      </Icon>
      <Icon sx={{ width: 280, height: 60, position: 'relative' }}>
        <Image src="/images/app-logo-text-1.png" alt="logo" layout="fill" objectFit="contain" />
      </Icon>
      <SignInButton />
      <Copyright sx={{ mt: 8 }} />
    </Box>
  );
};
