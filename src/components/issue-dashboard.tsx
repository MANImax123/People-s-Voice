"use client";

import { useState, useEffect } from "react";
import { getIssues, upvoteIssue } from "@/ai/flows/issue-flow";
import { type Issue } from "@/ai/schema";
import IssueCard from "./issue-card";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function IssueDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const fetchedIssues = await getIssues();
      // Sort by upvotes descending
      fetchedIssues.sort((a, b) => b.upvotes - a.upvotes);
      setIssues(fetchedIssues);
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

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleUpvote = async (id: string) => {
    setUpvotingId(id);
    try {
      await upvoteIssue({ issueId: id });
      // Re-fetch issues to get updated upvote counts and re-sort
      await fetchIssues();
       toast({
        title: "Success",
        description: "Your vote has been counted!",
      });
    } catch (error) {
      console.error("Failed to upvote issue:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not submit your upvote. Please try again.",
      });
    } finally {
      setUpvotingId(null);
    }
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Community Issues Dashboard</h1>
            <p className="text-muted-foreground">Here are the latest issues reported by the community. Upvote issues to help prioritize them.</p>
        </div>
        <Button asChild>
            <Link href="/report">
                <PlusCircle className="mr-2 h-4 w-4" />
                Report New Issue
            </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
             <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4 mt-4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onUpvote={handleUpvote}
              isUpvoting={upvotingId === issue.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
