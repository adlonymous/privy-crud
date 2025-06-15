'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets, useSignTransaction } from '@privy-io/react-auth/solana';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

const PROGRAM_ID = new PublicKey("7YLZNk621SNwX5TLWVet9PhKjEuCjezUs95S1tJGQBRU");

export default function Home() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return <></>;
  }

  if (ready && !authenticated) {
      // Replace this code with however you'd like to handle an unauthenticated user
      // As an example, you might redirect them to a login page
      router.push("/login");
      return <></>;
  }

  if (ready && authenticated) {
      // Replace this code with however you'd like to handle an authenticated user
      return <Authenticated />;
  }
  
}

function Authenticated() {
  const { user } = usePrivy();
  const { createWallet } = useSolanaWallets();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [txLink, setTxLink] = useState('');
  const {signTransaction} = useSignTransaction();

  useEffect(() => {
    if (!user?.wallet) {
      createWallet(); // Create the embedded Solana wallet if not yet created
    }
  }, [user, createWallet]);

  const handleCreateEntry = async () => {
    if (!user?.wallet) return;

    const connection = new Connection("https://api.devnet.solana.com");
    const owner = new PublicKey(user.wallet.address);

    const [entryPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(title), owner.toBuffer()],
      PROGRAM_ID
    );

    // Discriminator for "create_entry"
    const discriminator = Uint8Array.from([248, 207, 142, 242, 66, 162, 150, 16]);

    const encodeString = (str: string) => {
      const buf = Buffer.from(str);
      return Buffer.concat([Buffer.from(Uint8Array.of(buf.length)), buf]);
    };

    const data = Buffer.concat([
      discriminator,
      encodeString(title),
      encodeString(message),
    ]);

    const instruction = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: entryPDA, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });

    const tx = new Transaction().add(instruction);
    tx.feePayer = owner;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signed = await signTransaction({ transaction: tx, connection });
    const sig = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(sig);

    setTxLink(`https://solscan.io/tx/${sig}?cluster=devnet`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hello</h1>  
      <h2>{user?.wallet?.address}</h2>

      <div style={{ marginTop: '2rem' }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
        <input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
        <button onClick={handleCreateEntry} style={{ padding: '0.5rem' }}>
          Create Entry
        </button>
      </div>

      {txLink && (
        <p style={{ marginTop: '1rem' }}>
          ✅ Transaction submitted: <a href={txLink} target="_blank">View on Solscan</a>
        </p>
      )}
    </div>
  );
}
