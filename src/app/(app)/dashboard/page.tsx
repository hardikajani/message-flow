"use client"

import MessageCard from "@/components/Message/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";



const Dashboard = () => {
  const [messages, setMessage] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isUrlCopy, setIsUrlCopy] = useState(false);

  const { toast } = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessage(messages.filter((message) => message._id !== messageId))
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-message`)
      if (response.data.success) {
        setValue("acceptMessages", response.data.isAcceptingMessages)
      }


    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Faild to fetch message settings",
        variant: "destructive",
        className: "bg-red-500 text-white",
        duration: 2000
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>(`/api/get-messages`)
      if (response.data.success) {
        setMessage(response.data.messages || [])
      }
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
          variant: "default",
          duration: 2000
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Faild to fetch messages",
        variant: "destructive",
        className: "bg-red-500 text-white",
        duration: 2000
      })
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessage]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
    console.log(username)
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  // handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", { acceptMessages: !acceptMessages });
      if (response.data.success) {
        setValue("acceptMessages", !acceptMessages);
        toast({
          title: response.data.message,
          variant: "default",
          duration: 2000,
        })
      }


    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Faild to fetch messages",
        variant: "destructive",
        className: "bg-red-500 text-white",
        duration: 1000
      })
    }
    finally {
      setIsSwitchLoading(false);
    }
  }

  const username = session?.user?.username;

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsUrlCopy(true);
    toast({
      title: "URL Copied to clipboard",
      variant: "default",
      duration: 1000,
    })
  }


  if (!session || !session.user) {
    return <div>Unauthorised</div>
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">
        User Dashboard
      </h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Copy your unique Link
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          {isUrlCopy ? (
            <Link href={profileUrl} target="_blank">
              <Button>View</Button>
            </Link>
          ) : (
            <Button onClick={copyToClipboard}>Copy</Button>
          )}
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {
          isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-h h-4" />
          )
        }
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
              <MessageCard 
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard;