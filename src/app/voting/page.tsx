import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export default function VotingPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Landmark className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Voting Information</CardTitle>
              <CardDescription>Find your polling location, check voter registration status, and get details on upcoming elections.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back soon for voting information!</p>
        </CardContent>
      </Card>
    </div>
  );
}
