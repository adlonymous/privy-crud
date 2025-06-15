'use client';
import { Entry } from "@/types";

export default function EntryCard({ entry }: { entry: Entry }) {
  return (
    <div className="p-4 border rounded shadow">
      <h3>{entry.title}</h3>
      <p>{entry.message}</p>
      <small>Owner: {entry.owner.slice(0, 6)}...{entry.owner.slice(-4)}</small>
    </div>
  );
}
