'use client'
import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponce'
import AiSuggestions from "@/components/AiSuggestion";


function Page() {
    const params = useParams<{username: string}>()
    const form = useForm<{ message: string }>()
    const [isLoading, setIsLoading] = useState(false);
    const [aiQuestions, setAiQuestions] = useState<string[]>([]);
    const onSubmit = async (values: { message: string }) => {
            setIsLoading(true);
            try {
              console.log("params",params)
              const response = await axios.post('/api/send-message',{username: params.username, content: values.message});
              console.log("response",response)
              setIsLoading(false);
              if (response.data.success) {
                toast.success('Message sent successfully');
              }

              form.reset();
            } catch (error) {
              const axiosError = error as AxiosError<ApiResponse>;
              toast.error(axiosError.response?.data.message || "An error occurred during signup");
                    
            } finally {
              setIsLoading(false);
            }
          }

    const fetchAiQuestions = async () => {
      try {
        const response = await axios.get(`/api/aiSuggestion`);
        setAiQuestions(response.data.suggestions);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message || "An error occurred during fetching ai questions");
      }
    }
    

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className="text-4xl font-bold mb-4 text-center">Public Profile Link</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <p className="text-sm text-muted-foreground">Sending message to <span className="font-medium">@{params?.username}</span></p>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormDescription>Write a public message that will appear on your profile.</FormDescription>
                <FormControl>
                  <textarea
                    {...field}
                    rows={6}
                    placeholder="Write your message..."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : null}
              Send
            </button>
          </div>
        </form>
      </Form>

      <div className="h-full p-4 flex flex-col mt-6 text-2xl">
        <h1>Click on any message below to select it.</h1>
        <AiSuggestions ></AiSuggestions>
      </div>




    </div>
  )
}

export default Page
 