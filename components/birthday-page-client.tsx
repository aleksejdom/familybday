"use client";

import { useState } from "react";
import { BirthdayTable } from "@/components/birthday-table";
import { AddBirthdayForm } from "@/components/add-birthday-form";
import { Birthday } from "@/components/edit-birthday-dialog";
import { PlusCircle } from "lucide-react";

interface Props {
  initialData: Birthday[];
}

export function BirthdayPageClient({ initialData }: Props) {
  const [entries, setEntries] = useState<Birthday[]>(initialData);

  function handleAdded(entry: Birthday) {
    setEntries((prev) => [...prev, entry]);
  }

  return (
    <div className="space-y-8">
      <BirthdayTable initialData={entries} />

      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15">
            <PlusCircle className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Neuen Eintrag hinzufügen</h2>
        </div>
        <AddBirthdayForm onAdded={handleAdded} />
      </div>
    </div>
  );
}
