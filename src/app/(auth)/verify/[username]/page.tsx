"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import AuthShell from "@/components/AuthShell";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifySchema } from "@/Schemas/verifySchema";
import type { ApiResponse } from "@/types/apiResponce";

export default function VerifyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
    resetOptions: {
      keepValues: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verifyUser", {
        username: params.username,
        otp: data.code,
      });

      toast.success(response.data.message);
      router.replace("/login");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Verification failed. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="One last step"
      title={
        <>
          Check your
          <br />
          <span className="italic">inbox.</span>
        </>
      }
      description={
        <>
          We sent a six-digit code to the email linked to{" "}
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">
            @{params?.username}
          </span>
          . Enter it below to activate your account.
        </>
      }
      footer={
        <p>
          Wrong account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Start over
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-time password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="size-11 rounded-md border text-base sm:size-12"
                      />
                      <InputOTPSlot
                        index={1}
                        className="size-11 rounded-md border text-base sm:size-12"
                      />
                      <InputOTPSlot
                        index={2}
                        className="size-11 rounded-md border text-base sm:size-12"
                      />
                      <InputOTPSlot
                        index={3}
                        className="size-11 rounded-md border text-base sm:size-12"
                      />
                      <InputOTPSlot
                        index={4}
                        className="size-11 rounded-md border text-base sm:size-12"
                      />
                      <InputOTPSlot
                        index={5}
                        className="size-11 rounded-md border text-base sm:size-12"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  The code expires after 15 minutes. Check your spam folder if
                  it is not there.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify account"
            )}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
