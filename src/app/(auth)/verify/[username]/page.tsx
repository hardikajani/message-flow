"use client"

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';



const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{username: string}>()
  const {toast} = useToast();

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) =>{
    try {
     const response = await axios.post('/api/verify-code', {
        code: data.code,
        username: params.username
      });
      if(response.status === 200){
        toast({
          title: "Success",
          description: response.data.message,
          duration: 3000,
          className: "bg-green-500 text-white"
        })
        router.replace('/sign-in')
      }

    } catch (error) {
      console.error("Error in varify code ", error)
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Something went wrong",
        variant: "destructive",
        duration: 3000,
        className: "bg-red-500 text-white"
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">
            Enter Verifaction code sent to your email.
          </p>
        </div>
        <Form {...verifyForm}>
          <form onSubmit={verifyForm.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verifaction Code</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder="code"
                      {...field}                      
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
            <Button type='submit'>
                Verify Code
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount;