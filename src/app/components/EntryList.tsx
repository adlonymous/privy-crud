'use client';
import { useEffect, useState } from "react";
import { fetchAllEntries } from "@/helpers/program";
import EntryCard from "./EntryCard";
import { Entry } from "@/types";

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetchAllEntries().then(setEntries);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {entries.map((e) => (
        <EntryCard key={e.pubkey} entry={e} />
      ))}
    </div>
  );
}
