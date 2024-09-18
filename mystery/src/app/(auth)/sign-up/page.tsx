"use client";

import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useToast } from "@/components/hooks/use-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = () => {  
  
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  // Debounce the username change
  const debouncedUsername = useDebounceCallback((value: string) => {
    setUsername(value);
  }, 600);

  // Effect for checking username availability
  useEffect(() => {
    const checkUsernameUnique = async (): Promise<void> => {
      if (!username) return; // Avoid checking if no username
      setIsCheckingUsername(true);
      try {
        const response = await fetch(`/api/check?username=${username}`);
        const data = await response.json();
        setUsernameMessage(data.message);
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    if (username) {
      checkUsernameUnique();
    }
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>): Promise<void> => {
    try {
      setIsFormSubmitting(true);
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      toast({
        description: responseData.message,
      });

      if (responseData.success) {
        router.push(`/verify/${username}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && (
                      <p className="text-gray-500">Checking availability...</p>
                    )}
                    <p
                      className={`text-black ${
                        usernameMessage === "Username is available"
                          ? "text-green-500"
                          : "text-red-600"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" type="email" {...field} />
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
                      <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isFormSubmitting}>
                {isFormSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-3" /> Submitting
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
