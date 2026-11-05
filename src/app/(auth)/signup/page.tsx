"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/Schemas/signupSchema";
import type { ApiResponse } from "@/types/apiResponce";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resetOptions: {
      keepValues: false,
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) return;

      setIsCheckingUsername(true);
      setUserMessage("");
      try {
        const response = await axios.get(
          `/api/check-username-uniqe?username=${encodeURIComponent(username)}`
        );
        setUserMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUserMessage(
          axiosError.response?.data.message ||
            "Could not check that username right now."
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "An error occurred during signup"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const usernameAvailable = userMessage === "Username is available";

  return (
    <AuthShell
      eyebrow="Create an account"
      title={
        <>
          Claim your
          <br />
          <span className="italic">Bebaak link.</span>
        </>
      }
      description="One handle, one link, and a private inbox for whatever people are too shy to say out loud."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Log in
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="yourhandle"
                    autoComplete="username"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      debounced(event.target.value);
                    }}
                  />
                </FormControl>

                {isCheckingUsername ? (
                  <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <Loader2 className="size-3 animate-spin" />
                    Checking availability
                  </p>
                ) : userMessage ? (
                  <p
                    className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
                      usernameAvailable
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {usernameAvailable ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <XCircle className="size-3" />
                    )}
                    {userMessage}
                  </p>
                ) : null}

                <FormDescription>
                  This becomes your public link. Choose wisely.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Create a password"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Repeat your password"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isCheckingUsername}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
