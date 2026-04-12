import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("common");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Nimbus Frugal. {t("all_rights_reserved")}</p>
        <div className="flex gap-6">
          <Link href="/login" className="hover:text-foreground">
            {t("login")}
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            {t("signup")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
