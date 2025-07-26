import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquarePlus } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <MessageSquarePlus className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Citizen Feedback</CardTitle>
              <CardDescription>Share your opinions and suggestions on current and upcoming city projects.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back soon to provide your feedback on city initiatives!</p>
        </CardContent>
      </Card>
    </div>
  );
}
