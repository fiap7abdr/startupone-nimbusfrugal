"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renameTenant } from "@/lib/tenant-actions";

export function TenantNameEdit({
  initialName,
  canEdit,
  labels,
}: {
  initialName: string;
  canEdit: boolean;
  labels: {
    edit: string;
    save: string;
    cancel: string;
    saving: string;
  };
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!canEdit) return <span>{initialName}</span>;

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span>{initialName}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setValue(initialName);
            setError(null);
            setEditing(true);
          }}
        >
          {labels.edit}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            await renameTenant(value);
            setEditing(false);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
          }
        });
      }}
    >
      <div className="flex flex-col items-end gap-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={pending}
          autoFocus
          className="h-8 w-48"
        />
        {error && <span className="text-destructive text-xs">{error}</span>}
      </div>
      <Button size="sm" type="submit" disabled={pending}>
        {pending ? labels.saving : labels.save}
      </Button>
      <Button
        size="sm"
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() => setEditing(false)}
      >
        {labels.cancel}
      </Button>
    </form>
  );
}
