"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/lib/locale-actions";
import { Loader2 } from "lucide-react";

const LOCALE_LABELS: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value;
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  }

  return (
    <div className={className}>
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <select
          value={locale}
          onChange={handleChange}
          className="bg-transparent text-xs font-medium cursor-pointer focus:outline-none"
        >
          {Object.entries(LOCALE_LABELS).map(([value, label]) => (
            <option key={value} value={value} className="text-foreground bg-background">
              {label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
