'use client';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { useEffect } from 'react';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';

export default function Home() {
  const { ready, authenticated, user } = usePrivy();
  const { createWallet } = useSolanaWallets();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated && !user?.wallet) {
      createWallet();
    }
  }, [ready, authenticated, user, createWallet]);

  if (!ready) return null;
  if (!authenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-8">
      <h1>Solana CRUD dApp</h1>
      <p>Welcome, {user?.wallet?.address}</p>
      <EntryForm />
      {/* <EntryList /> */}
    </div>
  );
}
