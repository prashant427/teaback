"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ApiResponse } from "@/types/apiResponce";

type MessageCardProps = {
  id?: string;
  content: string;
  onDelete?: (_id?: string) => void;
};

export default function MessageCard({ id, content, onDelete }: MessageCardProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${id}`
      );
      if (response.data?.success) {
        toast.success(response.data.message ?? "Message deleted");
        setOpen(false);
        onDelete?.(id);
      } else {
        toast.error(response.data?.message ?? "Failed to delete message");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message || "Failed to delete message"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="group gap-0 overflow-hidden rounded-lg border-border bg-card py-0 transition-colors hover:border-foreground/30">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-full bg-foreground text-background">
            <MessageSquare className="size-3.5" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Anonymous
          </span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="Delete message"
            >
              <Trash2 />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this message?</DialogTitle>
              <DialogDescription>
                This removes it from your inbox permanently. There is no undo.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete message"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="px-5 py-5">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {content}
        </p>
      </CardContent>

      <CardFooter className="border-t border-border px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Received without a name
        </p>
      </CardFooter>
    </Card>
  );
}
