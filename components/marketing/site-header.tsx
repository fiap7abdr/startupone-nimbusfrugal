import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CloudCog } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CloudCog className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Nimbus Frugal
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Entrar
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Começar grátis</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
