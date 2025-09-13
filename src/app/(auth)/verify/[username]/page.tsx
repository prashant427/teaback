'use client'
import { verifySchema } from '@/Schemas/verifySchema'
import { ApiResponse } from '@/types/apiResponce'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from 'zod'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader } from 'lucide-react'

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()
  const params = useParams<{username: string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: {
        code: "",
        
      },
      resetOptions: {
        keepValues: false,
      },
    });

    const onSubmit = async (data : z.infer<typeof verifySchema>) =>{
      console.log("on submit")
      setIsSubmitting(true)
      try {
        console.log("params",params)
       const response = await axios.post('/api/verifyUser',{username: params.username, otp:data.code })
      
       setIsSubmitting(false)
       toast.success(response.data.message);
       router.replace("/login")


      } catch (error) {
        if (error instanceof Error) {
          setIsSubmitting(false)
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data.message || "An error occurred during signup");
      }}

    }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-purple-500'>
      <div  className='w-full max-w-md p-8 space-y-3 rounded-xl bg-white/30 backdrop-blur-sm shadow-lg'>
      <div className='text-center'>
          <h1 className='text-2xl font-bold'>verify your account {params.username} </h1>
          <p className='text-sm text-gray-600'>your verification code sent to your provided email.</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"  >
              {isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> </> : "Verify"}
            </Button>
      </form>
    </Form>



      </div>
    </div>
  )
}

export default Page
