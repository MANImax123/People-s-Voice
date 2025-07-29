
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";

interface Issue {
  _id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  upvotes?: number;
  description: string;
  location: {
    area: string;
    metropolitanCity: string;
  };
}

export default function UserProfile() {
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyIssues = async () => {
      if (!user?.email) {
        setLoadingIssues(false);
        return;
      }

      try {
        setLoadingIssues(true);
        const response = await fetch(`/api/issues?userEmail=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setMyIssues(data.issues || []);
        } else {
          throw new Error('Failed to fetch issues');
        }
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

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">User Profile</CardTitle>
          <CardDescription>Manage your reports and notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">My Submitted Issues</h2>
          {loadingIssues ? <p>Loading your issues...</p> :
            myIssues.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date Reported</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myIssues.map(issue => (
                    <TableRow key={issue._id}>
                      <TableCell className="font-medium">{issue.title}</TableCell>
                      <TableCell className="capitalize">{issue.category?.replace('-', ' ')}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{issue.status}</Badge></TableCell>
                      <TableCell>{issue.location?.area}, {issue.location?.metropolitanCity}</TableCell>
                      <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <p>You have not reported any issues yet.</p>
          }
        </CardContent>
      </Card>
    </div>
  );
}
