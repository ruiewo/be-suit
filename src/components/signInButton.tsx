import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { page } from '../models/const/path';

export default function SignInButton() {
  const { data: session } = useSession();
  console.dir(session);

  const router = useRouter();

  if (session) {
    return (
      <>
        <Typography component="h1" variant="h5" sx={{ mt: 5, mb: 5 }}>
          Signed in as {session.user!.email}
        </Typography>
        <Button variant="contained" onClick={() => signOut()}>
          Sign out
        </Button>

        <Button variant="contained" onClick={() => router.push(page.home)} sx={{ mt: 5, mb: 5 }}>
          <HomeIcon />
        </Button>
      </>
    );
  }
  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mt: 5, mb: 5 }}>
        Not signed in
      </Typography>
      <Button type="button" variant="contained" onClick={() => signIn('github', { callbackUrl: page.home })}>
        Sign in github
      </Button>
      <Button type="button" variant="contained" onClick={() => signIn('azure-ad', { callbackUrl: page.home })} sx={{ mt: 3 }}>
        Sign in azure
      </Button>
    </>
  );
}
