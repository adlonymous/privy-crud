import { connection, PROGRAM_ID } from "./solana";
import { PublicKey } from "@solana/web3.js";
import { Entry } from "@/types";

const ENTRY_DISCRIMINATOR = Buffer.from([28, 78, 177, 145, 104, 207, 246, 184]);

export async function fetchAllEntries(): Promise<Entry[]> {
  const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
    filters: [
      {
        memcmp: {
          offset: 0,
          bytes: ENTRY_DISCRIMINATOR.toString("base64"),
        },
      },
    ],
  });

  return accounts.map(({ pubkey, account }) => {
    const data = account.data;
    const owner = new PublicKey(data.slice(8, 40)).toBase58();
    const titleLen = data[40];
    const title = data.slice(41, 41 + titleLen).toString();
    const messageLen = data[41 + titleLen];
    const message = data.slice(42 + titleLen, 42 + titleLen + messageLen).toString();

    return {
      pubkey: pubkey.toBase58(),
      title,
      message,
      owner,
    };
  });
}