"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { toggleDemoMode } from "@/lib/demo/actions";

export function WelcomeDialog({
  initialOpen,
  labels,
}: {
  initialOpen: boolean;
  labels: {
    title: string;
    description: string;
    enable: string;
    skip: string;
    enabling: string;
  };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [pending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    router.replace("/app/settings");
  }

  function handleEnable() {
    startTransition(async () => {
      await toggleDemoMode(true);
      close();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <FlaskConical className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">{labels.title}</DialogTitle>
          <DialogDescription className="text-center">
            {labels.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button onClick={handleEnable} disabled={pending} className="w-full">
            {pending ? labels.enabling : labels.enable}
          </Button>
          <Button
            variant="ghost"
            onClick={close}
            disabled={pending}
            className="w-full"
          >
            {labels.skip}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
