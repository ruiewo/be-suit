import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function SignInButton() {
  const { data: session } = useSession();
  console.dir(session);

  if (session) {
    return (
      <>
        <Typography component="h1" variant="h5" sx={{ mt: 5, mb: 5 }}>
          Signed in as {session!.user!.email}
        </Typography>
        <Button variant="contained" onClick={() => signOut()}>
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mt: 5, mb: 5 }}>
        Not signed in
      </Typography>
      <Button type="button" variant="contained" onClick={() => signIn('github', { callbackUrl: 'http://localhost:3000/' })}>
        Sign in
      </Button>
    </>
  );
}
