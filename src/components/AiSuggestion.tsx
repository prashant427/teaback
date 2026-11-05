"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type AiSuggestionsProps = {
  onSelect?: (text: string) => void;
};

const FALLBACK_SUGGESTIONS = [
  "What would you do if nobody could judge you?",
  "What advice do you give others but never follow yourself?",
  "What is something you have wanted to say out loud but never have?",
];

export default function AiSuggestions({ onSelect }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/aiSuggestion", {
        method: "POST",
      });
      const data = await response.json();
      setSuggestions(data.suggestions ?? FALLBACK_SUGGESTIONS);
    } catch {
      setSuggestions(FALLBACK_SUGGESTIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (text: string) => {
    setSuggestions([]);
    onSelect?.(text);
  };

  return (
    <section className="relative overflow-hidden rounded-lg border border-foreground bg-foreground p-6 text-background md:p-8">
      <div className="dot-surface absolute inset-0 opacity-20" aria-hidden />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-background/50">Prompt lab</p>
            <h2 className="display-tight mt-2 text-3xl">
              Need a spark<span className="italic">?</span>
            </h2>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-md border border-background/20">
            <Sparkles className="size-4" />
          </span>
        </div>

        <p className="mt-3 max-w-sm text-sm leading-relaxed text-background/60">
          Not sure what to say? Generate open-ended questions and send the one
          that sticks.
        </p>

        <Button
          onClick={generate}
          disabled={loading}
          className="mt-6 w-full bg-background text-foreground hover:bg-background/90"
        >
          {loading ? (
            <>
              <span className="animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Sparkles />
              Generate questions
            </>
          )}
        </Button>

        <div className="mt-6 space-y-2.5">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                key={`${index}-${suggestion}`}
                onClick={() => handleSelect(suggestion)}
                className="w-full flex gap-3 items-start rounded-md border border-background/10 bg-background p-4 text-foreground text-left transition-colors hover:bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed">{suggestion}</p>
              </button>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-background/25 px-4 py-8 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-background/50">
                No prompts yet
              </p>
              <p className="mt-2 text-sm text-background/60">
                Hit generate to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
