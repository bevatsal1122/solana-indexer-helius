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
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IndexingJob } from "@/lib/types";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/supabaseAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formSchema = z.object({
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
  const [activeJobs, setActiveJobs] = useState<IndexingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dbPort: "5432",
      indexingType: "nft_prices",
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await getLoggedInUser();

      if (data?.user) {
        setUser(data.user);
      } else {
        window.location.href = "/auth";
      }
    };

    getUser();
  }, []);

  async function fetchActiveJobs() {
    try {
      const { data: jobs, error } = await supabase
        .from("indexing_jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      //   setActiveJobs(jobs);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast({
        title: "Success",
        description: "Indexing job created successfully",
      });

      fetchActiveJobs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  }

  return (
    // <div className="flex min-h-screen">
    //   <Sidebar />
    //   <Breadcrumb>
    //     <BreadcrumbList>
    //       <BreadcrumbItem>
    //         <BreadcrumbLink href="/">Home</BreadcrumbLink>
    //       </BreadcrumbItem>
    //       <BreadcrumbSeparator />
    //       <BreadcrumbItem>
    //         <BreadcrumbPage>Dashboard</BreadcrumbPage>
    //       </BreadcrumbItem>
    //     </BreadcrumbList>
    //   </Breadcrumb>

    //   <div className="flex-1 ml-64 p-8">
    //     <div className="max-w-4xl mx-auto">
    //       <h1 className="text-3xl font-bold mb-8 text-center">Configure Your Indexer</h1>

    //       <div className="space-y-8">
    //         <Card className="p-6">
    //           <Form {...form}>
    //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //               <FormField
    //                 control={form.control}
    //                 name="dbHost"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Database Host</FormLabel>
    //                     <FormControl>
    //                       <Input placeholder="localhost" {...field} />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />

    //               <FormField
    //                 control={form.control}
    //                 name="dbPort"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Database Port</FormLabel>
    //                     <FormControl>
    //                       <Input {...field} />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />

    //               <FormField
    //                 control={form.control}
    //                 name="dbName"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Database Name</FormLabel>
    //                     <FormControl>
    //                       <Input {...field} />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />

    //               <FormField
    //                 control={form.control}
    //                 name="dbUser"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Database User</FormLabel>
    //                     <FormControl>
    //                       <Input {...field} />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />

    //               <FormField
    //                 control={form.control}
    //                 name="dbPassword"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Database Password</FormLabel>
    //                     <FormControl>
    //                       <Input type="password" {...field} />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />

    //               <FormField
    //                 control={form.control}
    //                 name="indexingType"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>What would you like to index?</FormLabel>
    //                     <Select onValueChange={field.onChange} defaultValue={field.value}>
    //                       <FormControl>
    //                         <SelectTrigger>
    //                           <SelectValue placeholder="Select what to index" />
    //                         </SelectTrigger>
    //                       </FormControl>
    //                       <SelectContent>
    //                         <SelectItem value="nft_bids">Current NFT Bids</SelectItem>
    //                         <SelectItem value="nft_prices">NFT Prices</SelectItem>
    //                         <SelectItem value="token_prices">Token Prices</SelectItem>
    //                         <SelectItem value="token_borrowing">Available Tokens to Borrow</SelectItem>
    //                       </SelectContent>
    //                     </Select>
    //                     <FormDescription>
    //                       Choose what blockchain data you want to index
    //                     </FormDescription>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />

    //               <Button type="submit" className="w-full h-12 text-lg">Start Indexing</Button>
    //             </form>
    //           </Form>
    //         </Card>
    //       </div>
    //     </div>
    //   </div>
    // </div>
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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container pb-10 mt-2 bg-background text-foreground max-w-6xl">
          <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

          <div className="flex-1 ml-64 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Configure Your Indexer
              </h1>

              <div className="space-y-8">
                <Card className="p-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
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
