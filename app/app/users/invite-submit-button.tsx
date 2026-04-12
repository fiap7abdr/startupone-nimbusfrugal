"use client";

import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function InviteSubmitButton() {
  const { pending } = useFormStatus();
  const tc = useTranslations("common");

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? tc("sending_invite") : tc("send_invite")}
    </Button>
  );
}
