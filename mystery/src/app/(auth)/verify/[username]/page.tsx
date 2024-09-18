"use client"
import {  useToast } from "@/components/hooks/use-toast"
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form" 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod" 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const page = ()  => { 
  const [isSubmitting , setisSubmitting] = useState<boolean>(false) ;  
  const router = useRouter() ;
  const {toast} = useToast() 
  const params = useParams<{username:string}>() ;
  const form = useForm({
    resolver : zodResolver(
      verifyCodeSchema 
    ) ,
    defaultValues : {
      verifyCode : ""
    }
  })  ;
  const onSubmit = async (data?:z.infer<typeof verifyCodeSchema>):Promise<void> =>  {
      setisSubmitting(true) ; 
      console.log(params.username)
      try {
         const response = await fetch("/api/check-verify-code",{
           method : "POST", 
           headers : {
             "Content-Type" : "application/json"
           }, 
           body : JSON.stringify({username:params.username,verifyCode:data?.verifyCode})
         }); 
         const dataJson = await response.json(); 
  
         setisSubmitting(false) ; 
         if(dataJson.success) {
          toast({ 
            title : "Success" ,
            description : dataJson.message,
            
          }) ; 
          router.push("/sign-in")
         }  else {
          toast({ 
            title : "Error" , 
            variant : "destructive" ,
            description : dataJson.message            
          }) ;
         }
      } catch (error) { 
        console.error(error);
        
      }
  } 
  
  
  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
         <div className="text-center">
         <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
             Verify your account
          </h1>  
          <p className="mb-4">
              Make your account to a verified user account
          </p>
         </div>  
         <div>
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="verifyCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verify Here</FormLabel>
              <FormControl>
                <Input placeholder="verify" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting? (
              <Loader2 className="animate-spin mr-3"  />
            ) : (
              "Verify"
            )
          }
        </Button>
      </form>
    </Form>
         </div>

      </div>
   </div>
  )
}

export default page
