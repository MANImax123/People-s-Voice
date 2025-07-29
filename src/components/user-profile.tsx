
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getIssues } from "@/lib/issues";

const MOCK_USER_ID = "user-123";

export default function UserProfile() {
  const [myIssues, setMyIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        setLoadingIssues(true);
        const allIssues = await getIssues();
        const userIssues = allIssues.filter(issue => issue.userId === MOCK_USER_ID);
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
  }, [toast]);

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
                      <TableCell><Badge>{issue.status}</Badge></TableCell>
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
    </div>
  );
}
