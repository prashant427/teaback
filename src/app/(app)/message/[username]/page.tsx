"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, Lock, Send } from "lucide-react";

import AiSuggestions from "@/components/AiSuggestion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ApiResponse } from "@/types/apiResponce";

export default function PublicMessagePage() {
  const params = useParams<{ username: string }>();
  const form = useForm<{ message: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { message: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: values.message,
      });

      if (response.data.success) {
        toast.success("Message sent. They will never know it was you.");
        form.reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Could not send that message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-foreground" />
          Public message
        </p>
        <h1 className="display-tight mt-4 text-5xl md:text-6xl">
          Write to{" "}
          <span className="italic">@{params?.username}</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Say the thing. Ask the question. Bebaak delivers it without your name,
          your email, or anything that points back to you.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-border bg-card p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Compose</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight">
                Your anonymous message
              </h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <Lock className="size-3" />
              Anonymous
            </span>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-5"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={8}
                        placeholder="Type what you have been holding back..."
                        className="w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-sm leading-relaxed shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    </FormControl>
                    <FormDescription>
                      Be honest, be kind, be bebaak. Your identity stays hidden.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Sent without a name
                </p>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </section>

        <AiSuggestions onSelect={(text) => form.setValue("message", text)} />
      </div>
    </main>
  );
}
