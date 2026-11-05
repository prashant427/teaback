import Link from "next/link";
import Brand from "@/components/Brand";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-col gap-3">
          <Brand href="/" />
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            A monochrome space for anonymous messages and honest thoughts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/"
            className="eyebrow transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="eyebrow transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="eyebrow transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="eyebrow transition-colors hover:text-foreground"
          >
            Sign up
          </Link>
        </div>

        <p className="eyebrow">© {new Date().getFullYear()} Bebaak</p>
      </div>
    </footer>
  );
}
