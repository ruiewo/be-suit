import Button from '@mui/material/Button';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session!.user!.email} <br />
        <Button variant="contained" onClick={() => signOut()}>
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <Button type="submit" variant="contained" onClick={() => signIn('github', { callbackUrl: 'http://localhost:3000/' })}>
        Sign in
      </Button>
    </>
  );
}
