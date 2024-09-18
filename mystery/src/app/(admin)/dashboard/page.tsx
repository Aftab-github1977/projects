"use client"

import { useToast } from "@/components/hooks/use-toast";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { message } from "@/models/UserModel";
import { acceptingMessageSchema } from "@/schemas/accecptingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";

const page = () => {  
  const [message , setMessage] = useState<message[]>([]) ;
  const [isSwitchLoading , SetisSwitchLoading] = useState<boolean>(false) ; 
  const [isLoading , SetisLoading] = useState<boolean>(false) ;  
  const {toast} = useToast() ;
  const form = useForm({
    resolver : zodResolver(acceptingMessageSchema)
  }) ; 
  const {data:session} = useSession() ;
  const {register , setValue , watch} = form ;
  const acceptingMessege = watch('acceptingMessege') ;

  const fetchAcceptingMessege = useCallback(async() => {
    SetisSwitchLoading(true) ;
    try {
     const response = await fetch("api/accept-message") ;
     const data = await response.json() ; 
     if(data.success) {
      setValue("acceptingMessege" ,data.message) ;
     } 

    } catch(error) {
      console.log(error) ;
      
    } finally {
      SetisSwitchLoading(false) ;
    }
  } ,[setValue]) 

  const fetchMessages = useCallback(async (refresh:boolean = false) => {
    SetisLoading(true) ;
    try {
         const response = await fetch("api/messeges") ;
         const data = await response.json() ;
         if(data.success) {
           setMessage(data.message) ;
         }  
         if(refresh) {
            toast({   
              variant : "default" ,
             title : "Refreshing",
             description : "Data is being refreshed"
             
            }) ;
         }
    } catch (error) {
     console.error(error);
     
    } finally {
      SetisLoading(false) ;

    }
 },[setMessage,toast]) 

 useEffect(() => { 
    if(!session || !session?.user) return
   fetchAcceptingMessege() ;
   fetchMessages() ; 

 },[setValue,session,fetchAcceptingMessege ,fetchMessages ]) ;

 const hanndleToggleSwitch = async () => {
    try {
      const response = await fetch("api/accept-message",{
        method:"POST" ,
        headers : {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({AcceptingMessage : !acceptingMessege})
      }) ; 
      const data = await response.json() ; 
      if(data.success) {
        toast({ 
          variant : "default" ,
          title : "Success",
          description : data.message
        }) ;
        setValue("acceptingMessege",!acceptingMessege) ;
      }  else {
        toast({ 
          variant : "destructive",
          title : "Error",
          description : data.message ?? "failed to update the status"
        }) ;
      }
    } catch(error) {
      console.error(error);
      
    }
 } 
 const copyToClipboard = function() {
    navigator.clipboard.writeText(acceptingMessege);
    toast({
      variant : "default",
      title : "Success",
      description : "Message copied to clipboard"
    }) ;
  } ; 
 const baseUrl = `${window.location.protocol}//${window.location.host}`
 const showUrl = `${baseUrl}/u/${session?.user.username}`  

 const handleDeleteMessage = (id:unknown) => {
      setMessage(message.filter((message) => message.id !== id)) ;
 }


 if(!session || !session?.user) return <div> un Authorized</div>
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={showUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptingMessege}
          onCheckedChange={hanndleToggleSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptingMessege ? 'On' : 'Off'}
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
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessegeDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page
