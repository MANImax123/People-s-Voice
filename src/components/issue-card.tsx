"use client";

import { ArrowUp, Clock, MessageSquare, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Issue } from "@/ai/schema";

interface IssueCardProps {
  issue: Issue;
  onUpvote: (id: string) => void;
  isUpvoting: boolean;
}

export default function IssueCard({ issue, onUpvote, isUpvoting }: IssueCardProps) {
  const getStatusVariant = (status: Issue["status"]): "default" | "secondary" | "destructive" => {
    if (status === "Resolved") return "default";
    if (status === "In Progress") return "secondary";
    return "destructive";
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="mt-4 text-xl font-bold">{issue.category}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
          <p className="line-clamp-3">{issue.description}</p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{issue.location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpvote(issue.id)}
          disabled={isUpvoting}
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Upvote ({issue.upvotes})
        </Button>
      </CardFooter>
    </Card>
  );
}
