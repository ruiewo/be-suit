import { useSession, signIn, signOut } from 'next-auth/react';
import { page } from '../models/const/path';

export default function LoginButton() {
  const { data: session } = useSession();
  console.dir(session);

  if (session) {
    return (
      <>
        Signed in as {session!.user!.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
      <button onClick={() => signIn('github', { callbackUrl: page.home })}>Sign in</button>
    </>
  );
}
