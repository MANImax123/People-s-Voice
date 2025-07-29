
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getIssues } from "@/lib/issues";

const MOCK_USER_ID = "user-123";

export default function TechDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const allIssues = await getIssues();
        setIssues(allIssues);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch issues.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [toast]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tech Issue Dashboard</CardTitle>
          <CardDescription>View and manage all reported civic issues.</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">All Issues</h2>
          {loading ? <p>Loading issues...</p> :
            issues.length > 0 ? (
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
                  {issues.map(issue => (
                    <TableRow key={issue.id}>
                      <TableCell>{issue.category}</TableCell>
                      <TableCell><Badge>{issue.status}</Badge></TableCell>
                      <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{issue.upvotes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <p>No issues found.</p>
          }
        </CardContent>
      </Card>
    </div>
  );
}
