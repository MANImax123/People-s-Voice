"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getIssue, assignIssue, updateIssueStatusCompat as updateIssueStatus } from "@/lib/issues";

const MOCK_USER_ID = "user-123";

export default function UpdateIssuePanel({ issueId }) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const fetchedIssue = await getIssue({ issueId });
        setIssue(fetchedIssue);
      } catch (error) {
        console.error("Failed to fetch issue:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch issue details.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [issueId, toast]);

  async function handleAssign(assigneeId) {
    setIsSubmitting(true);
    try {
      await assignIssue({ issueId, assigneeId });
      toast({ title: "Success", description: "Issue assigned successfully." });
      const updatedIssue = await getIssue({ issueId });
      setIssue(updatedIssue);
    } catch (error) {
      console.error("Failed to assign issue:", error);
      toast({ variant: "destructive", title: "Assignment Failed", description: "Could not assign the issue." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusUpdate(status) {
    setIsSubmitting(true);
    try {
      await updateIssueStatus({ issueId, status });
      toast({ title: "Success", description: `Issue status updated to ${status}.` });
      router.push("/tech/dashboard");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update the issue status." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (!issue) return <div className="text-center py-12">Issue not found.</div>;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Update Issue: {issue.category}</CardTitle>
          <CardDescription>Reported on {new Date(issue.createdAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Issue Details</h3>
              <p className="text-muted-foreground">{issue.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">Status:</span> {issue.status}</div>
              <div><span className="font-semibold">Upvotes:</span> {issue.upvotes}</div>
              <div><span className="font-semibold">Location:</span> {issue.location || "N/A"}</div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => handleAssign(MOCK_USER_ID)} disabled={isSubmitting}>Assign to Me</Button>
              <Button onClick={() => handleStatusUpdate("Resolved")} disabled={isSubmitting}>Mark as Resolved</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
