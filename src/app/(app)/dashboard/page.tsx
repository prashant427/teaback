"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMsgSchema } from "@/Schemas/acceptMsgSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponce";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/messageCard";
import { Card } from "@/components/ui/card";
import AiSuggestions from "@/components/AiSuggestion";

type MessageModel = {
  _id: string;
  [key: string]: any;
};

function DashboardPage() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  const [aiQuestions, setAiQuestions] = useState<string[]>([]);

  const onDelete = (id?: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== id));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMsgSchema),
  });

  const { register, watch, setValue } = form;

  // ensure field is registered so watch/setValue work correctly
  useEffect(() => {
    register("msgAccepted");
  }, [register]);

  const msgAccepted = watch("msgAccepted");

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
      setSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/getUseMessage");
        if (response.data.messages) setMessages(response.data.messages || []);
        if (refresh) {
          toast.success(`Refreshed messages`);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError?.response?.data?.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
        setSwitchLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  // const aiSuggestion = useCallback(async () => {
  //   try {
  //     const response = await fetch("/api/aiSuggestion", { method: "POST" });
  //     if (!response.body) {
  //       return toast.error("AI can't suggest anything");
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
  //     let aiMessage = "";

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       const chunk = decoder.decode(value, { stream: true });
  //       aiMessage += chunk;
  //     }

  //     // AI ka final response string
  //     console.log("🔥 Final AI response:", aiMessage);

  //     // "||" se split karke array bana do
  //     const questions = aiMessage
  //       .split("||")
  //       .map((q) => q.trim())
  //       .filter(Boolean);

  //     // Ab yaha tu alag se ek aur state bana le for AI suggestions
  //     setAiQuestions(questions);

  //     return aiMessage;
  //   } catch (error) {
  //     const axiosError = error as AxiosError<ApiResponse>;
  //     toast.error(
  //       axiosError?.response?.data?.message || "Something went wrong"
  //     );
  //   }
  // }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMsg();
    fetchMessages();
    
  }, [session, fetchAcceptMsg, fetchMessages]);

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

  if (!session || !session.user) {
    return <div>login plz</div>;
  }

  const profileUrl = `${window.location.origin}/message/${session?.user?.username}`;
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl);
    toast.success("url copied");
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          checked={msgAccepted}
          onCheckedChange={handleSwitchChange}
          disabled={switchLoading}
        />
        <span className="ml-2">
          Accept Messages: {msgAccepted ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message.length}
              id={message._id}
              content={message.content}
              onDelete={onDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
      <div className="h-full p-4 flex flex-col mt-6 text-2xl">
        <h1>Click on any message below to select it.</h1>
        <AiSuggestions ></AiSuggestions>
      </div>
    </div>
  );
}

export default DashboardPage;
