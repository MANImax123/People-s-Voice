import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Calendar className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">City Events Calendar</CardTitle>
              <CardDescription>Find out about upcoming festivals, community gatherings, and official city events.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back soon for event listings!</p>
        </CardContent>
      </Card>
    </div>
  );
}
