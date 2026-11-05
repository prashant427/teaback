"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Download, Loader2, MessageSquare, Share2, Trash2 } from "lucide-react";

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
  const [sharing, setSharing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [diagFile, setDiagFile] = useState<File | null>(null);

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const paragraphs = text.split(/\\n/);
    const allLines: string[] = [];
    for (const para of paragraphs) {
      const words = para.split(/\\s+/).filter(Boolean);
      let current = "";
      // wrap within paragraph
      for (const word of words) {
        if (ctx.measureText(word).width > maxWidth) {
          if (current) {
            allLines.push(current);
            current = "";
          }
          let chunk = "";
          for (const ch of word) {
            if (ctx.measureText(chunk + ch).width <= maxWidth) {
              chunk += ch;
            } else {
              if (chunk) allLines.push(chunk);
              chunk = ch;
            }
          }
          if (chunk) current = chunk;
          continue;
        }
        const test = current ? `${current} ${word}` : word;
        if (ctx.measureText(test).width <= maxWidth) {
          current = test;
        } else {
          if (current) allLines.push(current);
          current = word;
        }
      }
      if (current) allLines.push(current);
      allLines.push(""); // paragraph break
    }
    return allLines.filter((l, i, arr) => !(l === "" && arr[i - 1] === ""));
  };

  const generateStoryPng = async (): Promise<Blob> => {
    const width = 1080;
    const height = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    const cardX = 80;
    const cardY = 240;
    const cardW = width - 160;
    const padX = 48;
    const maxTextWidth = cardW - padX * 2;
    const maxCardH = 900;
    const maxTextHeight = maxCardH - 200;

    // find font size
    let fontSize = 56;
    let chosenLines: string[] = [];
    while (fontSize >= 24) {
      ctx.font = `400 ${fontSize}px system-ui, sans-serif`;
      const lines = wrapText(ctx, content, maxTextWidth);
      const lineHeight = Math.round(fontSize * 1.35);
      if (lines.length * lineHeight <= maxTextHeight) {
        chosenLines = lines;
        break;
      }
      fontSize -= 2;
    }
    if (chosenLines.length === 0) {
      ctx.font = "400 24px system-ui, sans-serif";
      chosenLines = wrapText(ctx, content, maxTextWidth);
    }
    const lineHeight = Math.round(fontSize * 1.35);
    const cardH = Math.min(maxCardH, Math.max(200, chosenLines.length * lineHeight + 160));

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);

    // Card
    ctx.fillStyle = "#171717";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 32);
    ctx.fill();

    // Header
    ctx.fillStyle = "#a3a3a3";
    ctx.font = "500 36px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Anonymous question", cardX + padX, cardY + 72);

    // Text
    ctx.fillStyle = "#fafafa";
    ctx.font = `400 ${fontSize}px system-ui, sans-serif`;
    let y = cardY + 160;
    for (const line of chosenLines) {
      ctx.fillText(line, cardX + padX, y);
      y += lineHeight;
    }

    // Branding
    ctx.fillStyle = "#737373";
    ctx.font = "400 48px \"Instrument Serif\", serif";
    ctx.textAlign = "center";
    ctx.fillText("bebaak", width / 2, height - 120);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image"));
      }, "image/png");
    });
  };

  const openPreview = async () => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewBlob(null);
    try {
      const blob = await generateStoryPng();
      const url = URL.createObjectURL(blob);
      setPreviewBlob(blob);
      setPreviewUrl(url);
    } catch {
      setPreviewError("Could not generate image");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleShareStory = async () => {
    if (!previewBlob) return;
    setSharing(true);
    try {
      const file = new File([previewBlob], "question.png", { type: "image/png" });
      if (process.env.NODE_ENV !== "production") {
        console.info("share diagnostics", {
          userAgent: navigator.userAgent,
          isSecureContext: window.isSecureContext,
          standalone: window.matchMedia("(display-mode: standalone)").matches,
          share: typeof navigator.share,
          canShare: typeof navigator.canShare,
          canShareText: navigator.canShare?.({ text: "test" }),
          canShareFiles: navigator.canShare?.({ files: [file] }),
          mime: file.type,
          size: file.size,
        });
      }
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: "Anonymous question" });
        toast.success("Shared");
      } else {
        setPreviewError(
          "Direct sharing isn't supported in this browser. You can download your image and upload it manually."
        );
      }
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        // cancelled
      } else {
        setPreviewError("Could not share image");
      }
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = () => {
    if (!previewBlob) return;
    const url = URL.createObjectURL(previewBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded PNG");
  };

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
    <>
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

      <CardFooter className="flex items-center justify-between border-t border-border px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Received without a name
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={openPreview}
          disabled={sharing}
          aria-label="Share to Instagram Story"
        >
          {sharing ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Share2 />
          )}
          Share to Story
        </Button>
      </CardFooter>
    </Card>

    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Story preview</DialogTitle>
          <DialogDescription>
            This is the image that will be shared. Answers are added in Instagram.
          </DialogDescription>
        </DialogHeader>

        {previewLoading && <p className="text-sm text-muted-foreground">Generating…</p>}
        {previewError && <p className="text-sm text-destructive">{previewError}</p>}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Story preview"
            className="mx-auto h-[400px] w-auto rounded-lg border border-border"
          />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleDownload} disabled={!previewBlob}>
            <Download /> Download Image
          </Button>
          <Button onClick={handleShareStory} disabled={!previewBlob || sharing}>
            {sharing ? <Loader2 className="animate-spin" /> : <Share2 />}
            Share Story
          </Button>
        </DialogFooter>

        {process.env.NODE_ENV !== "production" && (
          <div className="mt-4 space-y-2 rounded border border-border p-3 text-xs">
            {!window.isSecureContext && (
              <p className="text-destructive">
                Insecure context: Web Share API requires HTTPS or localhost.
              </p>
            )}
            <p>UA: {navigator.userAgent}</p>
            <p>share: {String(typeof navigator.share)}</p>
            <p>canShare: {String(typeof navigator.canShare)}</p>
            <p>secure: {String(window.isSecureContext)}</p>
            <p>standalone: {String(window.matchMedia("(display-mode: standalone)").matches)}</p>
            <p>permissions-policy: unknown</p>
            {previewBlob && (
              <>
                <p>blob: {String(!!previewBlob)} {previewBlob.type} {previewBlob.size}</p>
                <p>file: anonymous-question.png image/png {String(!!new File([previewBlob], "anonymous-question.png", { type: "image/png" }))}</p>
                <p>canShare files: {String(navigator.canShare?.({ files: [new File([previewBlob], "anonymous-question.png", { type: "image/png" })] }))}</p>
              </>
            )}
            <input type="file" accept="image/png,image/*" onChange={(e) => setDiagFile(e.target.files?.[0] ?? null)} />
            <Button
              variant="outline"
              size="sm"
              disabled={!diagFile}
              onClick={async () => {
                if (!diagFile) return;
                try {
                  await navigator.share({ files: [diagFile] });
                  toast.success("Test share success");
                } catch (e) {
                  const err = e as Error;
                  toast.error(`${err.name}: ${err.message}`);
                }
              }}
            >
              Test Native Share
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
