"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/useAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  dbHost: z.string().min(1, "Database host is required"),
  dbPort: z.string().min(1, "Database port is required"),
  dbName: z.string().min(1, "Database name is required"),
  dbUser: z.string().min(1, "Database user is required"),
  dbPassword: z.string().min(1, "Database password is required"),
  indexingType: z.enum([
    "nft_bids",
    "nft_prices",
    "token_prices",
    "token_borrowing",
  ]),
});

export default function CreateIndexerJob() {
  const { user, loading } = useAuth({ redirectTo: "/auth" });
  const { toast } = useToast();
  const router = useRouter();
  console.log("user", user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dbPort: "5432",
      indexingType: "nft_prices",
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = await supabase.auth.getSession();
      console.log("token", token);
      // Convert form values to match API schema
      const payload = {
        name: values.name,
        description: values.description,
        db_host: values.dbHost,
        db_port: values.dbPort,
        db_name: values.dbName,
        db_user: values.dbUser,
        db_password: values.dbPassword,
        type: values.indexingType,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.data.session?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create indexer job");
      }

      toast({
        title: "Success! Indexer Job created successfully",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/myjobs");
    } catch (error: any) {
      console.error("Error creating indexer job:", error);
      toast({
        title: "Error creating indexer job",
      });
    }
  }

  return (
    <div className="flex gap-8 min-h-screen">
      <div className="w-[250px] shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-12">
        <Breadcrumb className="">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Indexer Job</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container pb-10 mt-2  max-w-6xl">
          <h1 className="text-4xl font-bold mb-10">Create Indexer Job</h1>

          <div className="flex-1 p-2">
            <div className="max-w-5xl mx-auto">
              <div className="space-y-8">
                <Card className="p-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My Indexer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Description of this indexer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dbHost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Database Host</FormLabel>
                            <FormControl>
                              <Input placeholder="localhost" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dbPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Database Port</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dbName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Database Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dbUser"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Database User</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dbPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Database Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="indexingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What would you like to index?</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select what to index" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="nft_bids">
                                  Current NFT Bids
                                </SelectItem>
                                <SelectItem value="nft_prices">
                                  NFT Prices
                                </SelectItem>
                                <SelectItem value="token_prices">
                                  Token Prices
                                </SelectItem>
                                <SelectItem value="token_borrowing">
                                  Available Tokens to Borrow
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose what blockchain data you want to index
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full h-12 text-lg">
                        Start Indexing
                      </Button>
                    </form>
                  </Form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
