"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const SignInPage = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const loginForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier : "",
      password : "",
    },
  });

  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if (result?.error) {
        if (result.error == "CredentialsSignIn") {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
            duration: 1000,
            className: "bg-red-500 text-white"
          });
          setIsSubmitting(false);
        }
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
          duration: 1000,
          className: "bg-red-500 text-white"
        });
        setIsSubmitting(false); 
    }
    if (result?.url) {
      // toast({
      //   title: "Success",
      //   description: "login successfully",
      //   variant: "default",
      //   duration: 1000,       

      // });
      router.replace(`/dashboard`)
      setIsSubmitting(false);
    }
    
  }


  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
          Welcome Back to Message~Flow
          </h1>
          <p className="mb-4">
            Sign in to start your anonymous adventure
          </p>
        </div>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              name="identifier"
              control={loginForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={loginForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...

                </>
              ) : ("Sign in")}
            </Button>
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 underline">
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignInPage;
