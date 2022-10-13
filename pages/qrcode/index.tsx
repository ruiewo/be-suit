import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import NormalTag from '../../components/normalTag';
import PcTag from '../../components/pcTag';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import PcTag2 from '../../components/pcTag2';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const LoginPage: NextPage = () => {
  const json = JSON.stringify({ code: 'PC-D-00128', pcName: 'Sandra' });
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="login page" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container gap={10}>
            <NormalTag value="https://www.google.com" />
            <PcTag value="PC-D-00128" pcName="Sandra" />
            <PcTag value={json} pcName="Sandra" />
            <PcTag2 value="PC-D-00128" pcName="Sandra" />
          </Grid>
        </Box>
      </main>
    </div>
  );
};

export default LoginPage;
