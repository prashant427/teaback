"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/Schemas/loginSchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { signIn } from 'next-auth/react';


const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //schema validation zod
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    resetOptions: {
      keepValues: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log("on submit", data);
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log("signIn result", result);

      if (result?.error) {
        toast.error(`Login failed: ${result.error}`);
      } else {
        toast.success("Login successful");
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("Login error", err);
      toast.error("Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (

    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-purple-500'>
      <div className='w-full max-w-md p-8 space-y-3 rounded-xl bg-white/30 backdrop-blur-sm shadow-lg'>
        <div className='w-full max-w-md py-4 space-y-3 '>
          <h1 className='text-2xl font-bold'>Login</h1>
          <p className='text-sm text-gray-600'>Please enter your credentials to continue.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(
  (data) => { console.log("✅ submit passed", data); onSubmit(data) },
  (err) => { console.log("❌ validation errors", err); }
)} className='space-y-6'>



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



            <Button type="submit" >
              {isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : "Login"}
            </Button>
          </form>

        </Form>
        <div className='text-center mt-4'>
          <p>
            If you don&apos;t have an account? <Link href="/signup">signup</Link>
          </p>
        </div>

      </div>



    </div>
  )
}

export default Page
