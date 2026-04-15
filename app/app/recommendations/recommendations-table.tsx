"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Rec {
  id: string;
  recommendationType: string;
  source: string;
  awsAccountId: string | null;
  priority: string;
  estimatedSavings: number | null;
  status: string;
}

type SortKey = keyof Rec;
type SortDir = "asc" | "desc";

const PRIORITY_ORDER: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function compare(a: Rec, b: Rec, key: SortKey, dir: SortDir): number {
  const mul = dir === "asc" ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === "priority") {
    return ((PRIORITY_ORDER[String(av)] ?? 0) - (PRIORITY_ORDER[String(bv)] ?? 0)) * mul;
  }
  if (key === "estimatedSavings") {
    return ((Number(av ?? 0)) - Number(bv ?? 0)) * mul;
  }
  const as = av == null ? "" : String(av);
  const bs = bv == null ? "" : String(bv);
  return as.localeCompare(bs) * mul;
}

export function RecommendationsTable({ recs }: { recs: Rec[] }) {
  const t = useTranslations("recommendations");
  const tc = useTranslations("common");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...recs];
    copy.sort((a, b) => compare(a, b, sortKey, sortDir));
    return copy;
  }, [recs, sortKey, sortDir]);

  function toggle(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortHeader({
    label,
    keyName,
    align = "left",
  }: {
    label: string;
    keyName: SortKey;
    align?: "left" | "right";
  }) {
    const active = sortKey === keyName;
    const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
    return (
      <th
        className={cn(
          "px-4 py-3",
          align === "right" ? "text-right" : "text-left",
        )}
      >
        <button
          type="button"
          onClick={() => toggle(keyName)}
          className={cn(
            "inline-flex items-center gap-1 uppercase tracking-wide transition hover:text-foreground",
            active ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span>{label}</span>
          <Icon className="h-3 w-3" />
        </button>
      </th>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50 text-xs">
        <tr>
          <SortHeader label={t("col_type")} keyName="recommendationType" />
          <SortHeader label={t("col_source")} keyName="source" />
          <SortHeader label={t("col_account")} keyName="awsAccountId" />
          <SortHeader label={t("col_priority")} keyName="priority" />
          <SortHeader label={t("col_savings")} keyName="estimatedSavings" align="right" />
          <SortHeader label={tc("status")} keyName="status" />
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr key={r.id} className="border-t border-border">
            <td className="px-4 py-3 font-medium">{r.recommendationType}</td>
            <td className="px-4 py-3 text-muted-foreground">{r.source}</td>
            <td className="px-4 py-3 font-mono text-xs">
              {r.awsAccountId ?? "—"}
            </td>
            <td className="px-4 py-3">
              <Badge variant={r.priority === "high" ? "negative" : "muted"}>
                {r.priority}
              </Badge>
            </td>
            <td className="px-4 py-3 text-right font-medium">
              {r.estimatedSavings != null
                ? `US$ ${r.estimatedSavings.toFixed(2)}`
                : "—"}
            </td>
            <td className="px-4 py-3">
              <Badge variant="outline">{r.status}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
