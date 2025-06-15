'use client';
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets, useSignTransaction } from '@privy-io/react-auth/solana';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import idl from '@/lib/idl.json';
import { connection } from '@/helpers/solana';
import { PublicKey, SystemProgram, Transaction, VersionedTransaction } from "@solana/web3.js"

// Types
interface EntryFormProps { onCreate?: () => void };

export default function EntryForm({ onCreate }: EntryFormProps) {
  const { user } = usePrivy();
  const { createWallet } = useSolanaWallets();
  const { signTransaction } = useSignTransaction();
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Initialize Anchor provider + program
  useEffect(() => {
    if (!user?.wallet) {
      createWallet();
      return;
    }

    // Anchor Wallet interface
    const walletAdapter = {
      publicKey: new PublicKey(user.wallet.address),
      signTransaction: async (tx: Transaction | VersionedTransaction) => {
        const signed = await signTransaction({ transaction: tx, connection });
        return signed as Transaction | VersionedTransaction;
      },
      signAllTransactions: async (txs: (Transaction | VersionedTransaction)[]) => {
        const signedTxs = await Promise.all(
          txs.map((tx) => signTransaction({ transaction: tx, connection }))
        );
        return signedTxs as (Transaction | VersionedTransaction)[];
      },
    };

    const provider = new AnchorProvider(connection, walletAdapter as any, {});
    const prog = new Program(idl as Idl, provider as AnchorProvider);
    setProgram(prog);
  }, [user]);

  const createEntry = async () => {
    if (!program) return;
    const ownerPubkey = program.provider.publicKey;
    if (!ownerPubkey) {
      console.error('No public key found for provider.');
      return;
    }
    try {
      const [entryPda] = await PublicKey.findProgramAddress(
        [Buffer.from(title), ownerPubkey.toBuffer()],
        program.programId
      );
      await program.methods
        .createEntry(title, message)
        .accounts({
          entry: entryPda,
          owner: ownerPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setTitle('');
      setMessage('');
      onCreate?.();
    } catch (e) {
      console.error('createEntry error:', e);
    }
  };

  return (
    <div>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={createEntry} disabled={!program}>
        Create Entry
      </button>
    </div>
  );
}
