"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getIssue, updateIssueStatus, assignIssue } from "@/ai/flows/issue-flow";
import { type Issue, type UpdateIssueStatusInput } from "@/ai/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  status: z.enum(["In Progress", "Resolved"]),
});

interface UpdateIssuePanelProps {
  issueId: string;
}

export default function UpdateIssuePanel({ issueId }: UpdateIssuePanelProps) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const fetchedIssue = await getIssue({ issueId });
        if (fetchedIssue) {
          setIssue(fetchedIssue);
          form.reset({
            status: fetchedIssue.status as "In Progress" | "Resolved" | "Pending",
          });
        } else {
          toast({ variant: "destructive", title: "Error", description: "Issue not found." });
        }
      } catch (error) {
        console.error("Failed to fetch issue:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch issue details." });
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [issueId, toast, form]);

  
  const handleAssignToMe = async () => {
    if (!issue || !user) return;
    setIsSubmitting(true);
    try {
        await assignIssue({ issueId: issue.id, assigneeId: user.uid });
        toast({ title: "Success", description: "Issue assigned to you successfully." });
        const updatedIssue = await getIssue({ issueId });
        if (updatedIssue) setIssue(updatedIssue);
    } catch (error) {
        console.error("Failed to assign issue:", error);
        toast({ variant: "destructive", title: "Assignment Failed", description: "Could not assign the issue." });
    } finally {
        setIsSubmitting(false);
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!issue) return;

    if (values.status === issue.status) {
      toast({
        variant: "default",
        title: "No Changes",
        description: "The status is already set to this value.",
      });
      return;
    }

    try {
        setIsSubmitting(true);
        
        const updateInput: UpdateIssueStatusInput = {
            issueId: issue.id,
            status: values.status,
        };

        await updateIssueStatus(updateInput);
        toast({ title: "Success", description: `Issue status updated to ${values.status}.` });
        router.push("/technician");

    } catch (error) {
        console.error("Failed to update status:", error);
        toast({ variant: "destructive", title: "Update Failed", description: "Could not update the issue status." });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!issue) return <div className="text-center py-12">Issue not found.</div>;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Update Issue: {issue.category}</CardTitle>
          <CardDescription>Reported on {new Date(issue.createdAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Issue Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">User's Description</h3>
                <p className="text-muted-foreground">{issue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="font-semibold">Status:</span> {issue.status}</div>
                 <div><span className="font-semibold">Upvotes:</span> {issue.upvotes}</div>
                 <div>
                    <span className="font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location:
                    </span> 
                    {issue.location}
                </div>
                 <div><span className="font-semibold">Assigned To:</span> {issue.assigneeId ? issue.assigneeId : 'Unassigned'}</div>
              </div>
            </div>

            {/* Right Column: Update Form */}
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Update Panel</h3>
              
              {!issue.assigneeId && (
                <Button onClick={handleAssignToMe} className="w-full mb-6" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Assign to Me"}
                </Button>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Update Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!issue.assigneeId || issue.status === 'Resolved'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a new status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        {!issue.assigneeId && <p className="text-sm text-muted-foreground">Assign the issue first to change its status.</p>}
                        {issue.status === 'Resolved' && <p className="text-sm text-muted-foreground">This issue has already been resolved.</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting || !issue.assigneeId || issue.status === 'Resolved'}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
