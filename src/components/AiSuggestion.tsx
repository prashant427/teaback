"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";

export default function AiSuggestions() {
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/aiSuggestion",
  });

  // split AI response into array
  const suggestions = completion
    ? completion.split("||").map((s) => s.trim())
    : [];

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">✨ AI Suggestions</h2>

      
        <Button onClick={() => complete("")} >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Thinking...
            </>
          ) : (
            "Get 3 Questions"
          )}
        </Button>

      {/* Suggestions list */}
      <div className="space-y-3 mt-4">
        {suggestions.length > 0 ? (
          suggestions.map((s, i) => (
            <Card key={i} className="p-4 shadow-md border bg-white">
              <p className="text-lg">{s}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No suggestions yet. Click the button!</p>
        )}
      </div>
    </div>
  );
}
