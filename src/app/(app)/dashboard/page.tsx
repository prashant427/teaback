"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Inbox,
  Link2,
  Loader2,
  MailOpen,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";

import MessageCard from "@/components/messageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { acceptMsgSchema } from "@/Schemas/acceptMsgSchema";
import type { ApiResponse } from "@/types/apiResponce";

type MessageModel = {
  _id: string;
  [key: string]: unknown;
};

export default function DashboardPage() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMsgSchema),
  });

  const { register, watch, setValue } = form;

  useEffect(() => {
    register("msgAccepted");
  }, [register]);

  const msgAccepted = Boolean(watch("msgAccepted"));

  useEffect(() => {
    if (session?.user?.username) {
      setProfileUrl(`${window.location.origin}/message/${session.user.username}`);
    }
  }, [session?.user?.username]);

  const onDelete = (id?: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== id));
  };

  const fetchAcceptMsg = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("msgAccepted", response.data?.data?.msgAccepted ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/getUseMessage");
        setMessages((response.data.messages as unknown as MessageModel[]) ?? []);
        if (refresh) {
          toast.success("Messages refreshed");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 404) {
          setMessages([]);
          if (refresh) {
            toast.success("No new messages");
          }
          return;
        }
        toast.error(
          axiosError?.response?.data?.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchAcceptMsg();
    fetchMessages();
  }, [status, fetchAcceptMsg, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        msgAccepted: !msgAccepted,
      });
      setValue("msgAccepted", !msgAccepted);
      toast.success(response.data.message || "Updated");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  if (status === "loading") {
    return (
      <main className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" aria-hidden />
        <div className="mt-4 h-12 w-64 animate-pulse rounded bg-muted" aria-hidden />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-lg border border-border bg-card"
              aria-hidden
            />
          ))}
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-24 text-center md:px-8">
        <span className="eyebrow">Private area</span>
        <h1 className="display-tight mt-4 text-4xl">You need to log in.</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Your inbox is private. Sign in to see your messages and manage your
          link.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Log in</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-foreground" />
            Dashboard
          </p>
          <h1 className="display-tight mt-4 text-5xl md:text-6xl">
            Your inbox<span className="italic">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Everything people sent you, anonymous as always. Open your link when
            you are ready for more.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => fetchMessages(true)}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <RefreshCcw />
          )}
          Refresh
        </Button>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        <div className="flex items-center gap-4 bg-card p-5">
          <span className="grid size-10 place-items-center rounded-md border border-border bg-background">
            <MessageSquare className="size-4" />
          </span>
          <div>
            <p className="eyebrow">Messages</p>
            <p className="mt-1 font-display text-3xl leading-none">
              {messages.length.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-card p-5">
          <span className="grid size-10 place-items-center rounded-md border border-border bg-background">
            <Inbox className="size-4" />
          </span>
          <div>
            <p className="eyebrow">Inbox status</p>
            <p className="mt-1 flex items-center gap-2 font-display text-3xl leading-none">
              {msgAccepted ? "Open" : "Closed"}
              <span
                className={`inline-block size-1.5 rounded-full ${
                  msgAccepted ? "bg-foreground" : "bg-muted-foreground"
                }`}
              />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-card p-5">
          <span className="grid size-10 place-items-center rounded-md border border-border bg-background">
            <Link2 className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Public link</p>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              /message/@{session.user.username}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Share your link</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight">
                Anyone with this link can send a message
              </h2>
            </div>
            <MailOpen className="hidden size-5 text-muted-foreground sm:block" />
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Input
              readOnly
              value={profileUrl}
              aria-label="Your public Bebaak link"
              className="font-mono text-xs"
            />
            <Button onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Drop it in your bio or story. People never need an account to write
            to you.
          </p>
        </section>

        <section className="flex flex-col justify-between rounded-lg border border-border bg-card p-6">
          <div>
            <p className="eyebrow">Inbox control</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">
              Accept messages
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              When closed, visitors will see that your inbox is taking a break.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
              {msgAccepted ? "Inbox open" : "Inbox closed"}
            </span>
            <Switch
              checked={msgAccepted}
              onCheckedChange={handleSwitchChange}
              disabled={switchLoading}
              aria-label="Toggle accepting messages"
            />
          </div>
        </section>
      </div>

      <Separator className="my-10" />

      <section>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Inbox</p>
            <h2 className="display-tight mt-2 text-4xl">
              Messages<span className="italic">.</span>
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>

        {loading && messages.length === 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-lg border border-border bg-card"
                aria-hidden
              />
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                id={message._id}
                content={String(message.content)}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full border border-border bg-background">
              <Inbox className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">
              No messages yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Share your link and give people a place to say what they mean.
            </p>
            <Button onClick={copyToClipboard} variant="outline" className="mt-5">
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy your link"}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
