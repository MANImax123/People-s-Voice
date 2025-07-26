
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIssues } from "@/ai/flows/issue-flow";
import { type Issue } from "@/ai/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Bell } from "lucide-react";


export default function UserProfile() {
  const { user } = useAuth();
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  
  const { toast } = useToast();

  const getStatusVariant = (status: Issue["status"]): "default" | "secondary" | "destructive" => {
    if (status === "Resolved") return "default";
    if (status === "In Progress") return "secondary";
    return "destructive";
  };

  useEffect(() => {
    const fetchMyIssues = async () => {
      if (!user) {
        setMyIssues([]);
        setLoadingIssues(false);
        return;
      };

      try {
        setLoadingIssues(true);
        const allIssues = await getIssues();
        const userIssues = allIssues.filter(issue => issue.userId === user.uid);
        setMyIssues(userIssues);
      } catch (error) {
        console.error("Failed to fetch user issues:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your reported issues.",
        });
      } finally {
        setLoadingIssues(false);
      }
    };
    fetchMyIssues();
  }, [toast, user]);
  

  if (!user) {
    return (
        <div className="container mx-auto py-8 text-center">
            <p>Please <Link href="/login" className="text-primary underline">login</Link> to view your profile.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">User Profile</CardTitle>
          <CardDescription>Manage your reports and notifications. Welcome, {user.email}!</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-reports" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-reports"><FileText className="mr-2"/> My Reported Issues</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="mr-2"/> Notifications</TabsTrigger>
            </TabsList>
            
            {/* My Reports Tab */}
            <TabsContent value="my-reports">
              <Card>
                <CardHeader>
                  <CardTitle>My Submitted Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingIssues ? <p>Loading your issues...</p> :
                   myIssues.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Reported</TableHead>
                           <TableHead>Upvotes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myIssues.map(issue => (
                          <TableRow key={issue.id}>
                            <TableCell>{issue.category}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge></TableCell>
                            <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{issue.upvotes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                   ) : <p>You have not reported any issues yet.</p>
                  }
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">This is where your notifications and alerts would appear.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
