"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { messageSchema } from "@/schemas/messageSchema"
import { useParams } from "next/navigation"

const MessagePage = () => {
  const params = useParams<{username: string}>()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const { toast } = useToast();
  
  

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    
    setIsSubmitting(true);    
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        content: data.content,
        username: params.username
      });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
          duration: 1000
        })
        registerForm.reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="w-full h-screen px-4 md:px-44 py-10 text-neutral-900 bg-slate-200">     
        <h1 className='text-2xl md:text-3xl font-bold'>Public Profile Link</h1>      
      <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={registerForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your anonymous message here " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="">
              Send It
            </Button>
          </form>
        </Form>
    </div>
  )
}

export default MessagePage;