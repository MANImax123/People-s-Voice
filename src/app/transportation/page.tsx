import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus } from "lucide-react";

export default function TransportationPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Bus className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Public Transportation</CardTitle>
              <CardDescription>Schedules, routes, and real-time tracking for city transit.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back soon for transit information!</p>
        </CardContent>
      </Card>
    </div>
  );
}
