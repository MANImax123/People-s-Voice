
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIssues } from "@/ai/flows/issue-flow";
import { type Issue } from "@/ai/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

export default function TechnicianDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedIssues = await getIssues();
        // Filter issues for the current technician: assigned to them or unassigned.
        const technicianIssues = fetchedIssues.filter(
            (issue) => issue.assigneeId === user.uid || !issue.assigneeId
        );
        setIssues(technicianIssues);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch issues. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [toast, user]);

  const getStatusVariant = (status: Issue["status"]): "default" | "secondary" | "destructive" => {
    if (status === "Resolved") return "default";
    if (status === "In Progress") return "secondary";
    return "destructive";
  };


  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Technician Issue Dashboard</CardTitle>
          <CardDescription>View and manage issues assigned to you or that are currently unassigned.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading issues...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upvotes</TableHead>
                    <TableHead>Date Reported</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.category}</TableCell>
                      <TableCell>{issue.location}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
                      </TableCell>
                      <TableCell>{issue.upvotes}</TableCell>
                      <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                       <TableCell>{issue.assigneeId || "Unassigned"}</TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/technician/${issue.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View/Update
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
