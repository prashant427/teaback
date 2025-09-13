'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/Schemas/signupSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponce'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react';



const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [usermessage, setUserMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);


  const router = useRouter();

  //schema validation zod
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

  //check user Unique debounce
  useEffect(() => {
    const CheckingUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUserMessage("");
        try {
          const response = await axios.get(`/api/check-username-uniqe?username=${encodeURIComponent(username)}`);
          setUserMessage(response.data.message);
        } catch (error) {
          if (error instanceof Error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUserMessage(axiosError.response?.data.message || "An error occurred on username uniqueness check");
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    CheckingUsername();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message || "An error occurred during signup");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500'>
      <div className='w-full max-w-md p-8 space-y-3 rounded-xl bg-white/30 backdrop-blur-sm shadow-lg'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Join teaback</h1>
          <p className='text-sm text-gray-600'>Please fill in the details below to create an account.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

            <FormField
              name="username"
              type="text"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  <p className={`text-sm ${usermessage === "Username is available" ? "text-green-500" : "text-red-500"}`}> {usermessage} </p>
                  <FormDescription>
                    This is your public display name.
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
                      placeholder="email"
                      type="email"
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
                      placeholder="password"
                      type="password"
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="confirm password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit"  disabled={isSubmitting}>
              {isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> </> : "Create Account"}
            </Button>
          </form>

        </Form>
        <div className='text-center mt-4'>
          <p>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>


      </div>
    </div>
  )
}

export default  SignupPage 
