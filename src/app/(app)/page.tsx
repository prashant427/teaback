import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Link2,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  ToggleRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const marqueeItems = [
  "Anonymous messages",
  "No names attached",
  "Say it fearlessly",
  "Your link, your rules",
  "Honest thoughts only",
];

const features = [
  {
    index: "01",
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Every message lands without a name, an email, or a trace. Just the words someone needed to say.",
  },
  {
    index: "02",
    icon: ToggleRight,
    title: "Your link, your rules",
    description:
      "Open the inbox when you are ready. Close it when you are not. You stay in control of the noise.",
  },
  {
    index: "03",
    icon: Sparkles,
    title: "The prompt lab",
    description:
      "Stuck on what to ask? Generate thoughtful questions in one click and send something worth answering.",
  },
  {
    index: "04",
    icon: MessageSquareQuote,
    title: "Built for honesty",
    description:
      "A quiet, monochrome inbox that keeps the focus on what was said — not who said it.",
  },
];

const steps = [
  {
    number: "01",
    title: "Claim your handle",
    description:
      "Sign up with an email, verify the code, and get a personal Bebaak link.",
    icon: Link2,
  },
  {
    number: "02",
    title: "Share it anywhere",
    description:
      "Drop it in your bio, a story, or a group chat. Anyone can send without signing up.",
    icon: ArrowUpRight,
  },
  {
    number: "03",
    title: "Read the truth",
    description:
      "Message by message, no names attached. Delete what you do not need and keep what matters.",
    icon: MessageSquareQuote,
  },
];

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-surface absolute inset-0 opacity-70" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-foreground" />
              Anonymous messages · Made loud
            </p>

            <h1 className="display-tight mt-6 text-[3.25rem] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              Say it{" "}
              <span className="italic underline decoration-1 underline-offset-8">
                fearlessly.
              </span>
              <br />
              Stay unknown.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Bebaak is a monochrome space for anonymous messages. Share one
              link, collect honest thoughts, and decide exactly when your inbox
              is open.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Claim your link
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">
                  Log in
                  <ArrowRight />
                </Link>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
              <div>
                <dt className="eyebrow">Identity</dt>
                <dd className="mt-2 font-display text-2xl">Hidden</dd>
              </div>
              <div>
                <dt className="eyebrow">Inbox</dt>
                <dd className="mt-2 font-display text-2xl">Open / closed</dd>
              </div>
              <div>
                <dt className="eyebrow">Cost</dt>
                <dd className="mt-2 font-display text-2xl">Free</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              className="absolute -left-8 top-16 size-64 rounded-full border border-border"
              aria-hidden
            />
            <div
              className="absolute -left-2 top-24 size-40 rounded-full border border-dashed border-border"
              aria-hidden
            />

            <div className="relative -rotate-2 rounded-xl border border-border bg-card p-1.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]">
              <div className="rounded-lg border border-border bg-background p-5">
                <div className="flex items-center justify-between">
                  <span className="eyebrow flex items-center gap-2">
                    <span className="inline-block size-1.5 rounded-full bg-foreground" />
                    Anonymous
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    #01
                  </span>
                </div>
                <p className="mt-5 font-display text-2xl leading-snug">
                  “You give the best advice but never take your own. Start
                  today.”
                </p>
                <p className="mt-5 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Just now · no name
                </p>
              </div>
            </div>

            <div className="relative ml-auto -mt-2 w-[88%] rotate-2 rounded-xl border border-border bg-card p-1.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]">
              <div className="rounded-lg border border-border bg-background p-5">
                <span className="eyebrow">Anonymous</span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “What is the one thing you would do if nobody could judge
                  you?”
                </p>
              </div>
            </div>

            <div className="absolute -right-4 -top-5 grid size-24 rotate-12 place-items-center rounded-full border border-foreground bg-foreground text-background">
              <span className="text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em]">
                100%
                <br />
                anon
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-border bg-foreground py-3 text-background">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 items-center"
              aria-hidden={group === 1}
            >
              {marqueeItems.map((item) => (
                <span
                  key={`${group}-${item}`}
                  className="flex items-center gap-6 whitespace-nowrap px-6 font-mono text-[11px] uppercase tracking-[0.2em]"
                >
                  {item}
                  <span className="inline-block size-1 rounded-full bg-background/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">What you get</p>
            <h2 className="display-tight mt-3 text-4xl md:text-5xl">
              Less noise. More truth.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Everything you need to collect honest thoughts, and nothing you do
            not. No feeds, no followers, no clout.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.index}
              className="group bg-background p-7 transition-colors hover:bg-card md:p-9"
            >
              <div className="flex items-start justify-between">
                <div className="grid size-10 place-items-center rounded-md border border-border bg-card transition-colors group-hover:bg-foreground group-hover:text-background">
                  <feature.icon className="size-5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  [ {feature.index} ]
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="display-tight mt-3 text-4xl md:text-5xl">
                Three steps. Zero drama.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/signup">
                Start now
                <ArrowUpRight />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="display-tight block text-6xl text-muted-foreground/35">
                  {step.number}
                </span>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <step.icon className="size-4" />
                  <h3 className="text-base font-semibold tracking-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="dot-surface absolute inset-0 opacity-20" aria-hidden />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-16 md:flex-row md:items-center md:px-8 md:py-20">
          <div>
            <p className="eyebrow text-background/50">Your inbox is waiting</p>
            <h2 className="display-tight mt-3 max-w-2xl text-4xl md:text-5xl">
              Give people a place to be{" "}
              <span className="italic">bebaak.</span>
            </h2>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/signup">
              Get your link
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
