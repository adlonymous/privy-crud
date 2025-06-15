import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("7YLZNk621SNwX5TLWVet9PhKjEuCjezUs95S1tJGQBRU");

export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export function deriveEntryPDA(title: string, owner: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(title), owner.toBuffer()],
    PROGRAM_ID
  )[0];
}
