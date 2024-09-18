"use client" ;
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/hooks/use-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";



const page = () => { 
    const router =  useRouter() ;
    const [isFormSubmitting , SetisFormSubmitting] = useState<boolean>(false) ;  
    const {toast} = useToast() ;


    const form = useForm({
      resolver : zodResolver(signInSchema) ,
      defaultValues : {
        email : "" ,
        password:""
      }
    }); 


  
      
  
  const onSubmit = async (data:z.infer<typeof signInSchema> ):Promise<void>=> {
      SetisFormSubmitting(true) ;
      try {
            const result = await signIn("credentials",{
              email : data.email ,
              password:data.password ,
              redirect:false,
            }) ;  
            SetisFormSubmitting(false) ;
            
               
            if(result?.url) { 
              toast({
                title : "success",
                description :"Login Success" ,
                variant :"default"
              }) ;
                router.push("/dashboard")
            } else {
              toast({
                title : "Error",
                description : result?.error ?? "Failed to sign in"  ,
                variant :"destructive"
              }) ;
            }
      } catch(error) {
        console.error(error);
        
      }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
             Join Mystery Messege
          </h1> 
          <p className="mb-4">
              Sign In to start your journey
          </p>
        </div> 
        <div>
          <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> 

            <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" type="email" {...field} 
                 
                />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
    
    <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} 
                 
                />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />

     <Button type="submit">
       
      {
        isFormSubmitting?  <><Loader2 className="animate-spin mr-2"/>loading </> : "Sign in"  
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
