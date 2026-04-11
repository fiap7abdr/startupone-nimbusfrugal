import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Nimbus Frugal. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <Link href="/login" className="hover:text-foreground">
            Entrar
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Signup
          </Link>
        </div>
      </div>
    </footer>
  );
}
