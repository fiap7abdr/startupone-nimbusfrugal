import Link from "next/link";
import Image from "next/image";
import { LoginModal } from "@/components/marketing/login-modal";
import { SignupModal } from "@/components/marketing/signup-modal";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-64.png"
            alt="Nimbus Frugal"
            width={36}
            height={36}
          />
          <span className="text-lg font-semibold tracking-tight">
            Nimbus Frugal
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <LoginModal />
          <SignupModal />
        </div>
      </div>
    </header>
  );
}
