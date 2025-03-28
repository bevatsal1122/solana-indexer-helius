"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, FileText, Award, Mail } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/useAuth";

export default function StatsPage() {
  const { user, loading } = useAuth({ redirectTo: "/auth" });

  console.log("user", user);

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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container pb-10 mt-2 bg-background text-foreground max-w-6xl">
          <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* Live Jobs */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">Live Jobs</CardTitle>
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">24</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Active jobs in the system
                </p>
              </CardContent>
            </Card>

            {/* Recent Jobs */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">
                  Recent Jobs
                </CardTitle>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">7</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Created in the last 7 days
                </p>
              </CardContent>
            </Card>

            {/* Entries Processed */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">
                  Entries Processed
                </CardTitle>
                <FileText className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">1,284</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total entries processed
                </p>
              </CardContent>
            </Card>

            {/* Top Job */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-medium">Top Job</CardTitle>
                <Award className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mb-1">
                <div className="text-4xl font-bold">Analytics</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Type: Report
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 mb-10 justify-center">
            <Button className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
              <Briefcase className="mr-3 h-5 w-5" />
              My Jobs
            </Button>
            <Button className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
              <Calendar className="mr-3 h-5 w-5" />
              Create Job
            </Button>
            <Button className="px-8 py-6 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <FileText className="mr-3 h-5 w-5" />
              Job Logs
            </Button>
          </div>

          {/* Contact Developer */}
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="flex items-center border shadow-sm px-6 py-5 text-lg"
            >
              <Mail className="mr-3 h-5 w-5" />
              Contact the Developer
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
