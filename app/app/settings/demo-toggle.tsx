"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleDemoMode } from "@/lib/demo/actions";

export function DemoToggle({
  enabled,
  labels,
}: {
  enabled: boolean;
  labels: {
    on: string;
    off: string;
    enable: string;
    disable: string;
    updating: string;
  };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between">
      <Badge variant={enabled ? "positive" : "muted"}>
        {enabled ? labels.on : labels.off}
      </Badge>
      <Button
        size="sm"
        variant={enabled ? "outline" : "default"}
        disabled={pending}
        onClick={() => startTransition(() => toggleDemoMode(!enabled))}
      >
        {pending ? labels.updating : enabled ? labels.disable : labels.enable}
      </Button>
    </div>
  );
}
