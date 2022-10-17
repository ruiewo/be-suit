import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginButton() {
  const { data: session } = useSession();
  console.dir(session);

  // export default () => <button
  // onClick = {() => signIn('google', { callbackUrl: 'http://localhost:3000/bar' })
  // }> Sign in</button >;
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
      <button onClick={() => signIn('github', { callbackUrl: 'http://localhost:3000/' })}>Sign in</button>
    </>
  );
}
