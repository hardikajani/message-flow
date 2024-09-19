"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { signUpSchema } from "@/schemas/signUpSchema"
import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { Loader2 } from "lucide-react"



const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isChackingUsename, setIsChackingUsename] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const registerForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsenameUnique = async () => {
      if (username) {
        setIsChackingUsename(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);

        } catch (error) {
          console.log(error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || 'Error checking username');
        } finally {
          setIsChackingUsename(false);
        }
      }
    }
    checkUsenameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
        duration: 3000,
        className: "bg-green-500 text-white"

      });
      router.replace(`/verify/${username}`)
      setIsSubmitting(false);
      registerForm.reset();
      setUsername('');
      setUsernameMessage('');
      setIsChackingUsename(false);
      debounced.cancel();

    } catch (error) {
      console.error("Error in signup of user ", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message || 'Error signing up';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 1000,
        className: "bg-red-500 text-white"
      });
      setIsSubmitting(false);
      debounced.cancel();
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Join Message~Flow
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={registerForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="usename"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isChackingUsename && <Loader2 className="animate-spin" />}


                  {usernameMessage && <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                  </p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={registerForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={registerForm.control}
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
              ) : ("Sign up")}
            </Button>
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 underline">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignUpPage;