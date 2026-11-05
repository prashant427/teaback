import Brand from "@/components/Brand";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: AuthShellProps) {
  return (
    <div className={cn("grid min-h-dvh lg:grid-cols-2", className)}>
      <aside className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="dot-surface absolute inset-0 opacity-30" aria-hidden />
        <div className="relative">
          <Brand inverted href="/" />
        </div>

        <div className="relative max-w-md">
          <p className="eyebrow text-background/50">Anonymous by design</p>
          <p className="display-tight mt-5 text-5xl">
            Say it <span className="italic">fearlessly.</span>
            <br />
            Stay unknown.
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/60">
            One link. Honest words. No names attached. Bebaak keeps the
            conversation raw and the identity private.
          </p>
        </div>

        <div className="relative flex items-center justify-between border-t border-background/15 pt-5">
          <span className="eyebrow text-background/40">bebaak</span>
          <span className="eyebrow text-background/40">Est. 2026</span>
        </div>
      </aside>

      <main className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <Brand href="/" />
          <span className="eyebrow">Anonymous by design</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-12 md:px-10">
          <div className="w-full max-w-md">
            <p className="eyebrow flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-foreground" />
              {eyebrow}
            </p>
            <h1 className="display-tight mt-4 text-4xl md:text-5xl">{title}</h1>
            {description ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}

            <div className="mt-8">{children}</div>

            {footer ? (
              <div className="mt-8 border-t border-border pt-5 text-sm text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
