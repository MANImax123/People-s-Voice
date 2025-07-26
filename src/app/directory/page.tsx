import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function DirectoryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Store className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Business Directory</CardTitle>
              <CardDescription>Search for local businesses, view their operating hours, and find contact information.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back soon for a full business directory!</p>
        </CardContent>
      </Card>
    </div>
  );
}
