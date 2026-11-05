import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandProps = {
  href?: string;
  inverted?: boolean;
  className?: string;
};

export default function Brand({ href = "/", inverted = false, className }: BrandProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-[7px] font-display text-lg leading-none",
          inverted
            ? "bg-background text-foreground"
            : "bg-foreground text-background"
        )}
      >
        b
      </span>
      <span className="flex items-baseline gap-1">
        <span className="font-display text-2xl leading-none tracking-tight">
          bebaak
        </span>
        <span
          className={cn(
            "size-1.5 rounded-full",
            inverted ? "bg-background/70" : "bg-foreground/70"
          )}
        />
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Bebaak home"
      className="inline-flex rounded-[7px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {content}
    </Link>
  );
}
