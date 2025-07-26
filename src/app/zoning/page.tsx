import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandPlot } from "lucide-react";

export default function ZoningPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <LandPlot className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Zoning & Property Information</CardTitle>
              <CardDescription>Access zoning maps, property details, and land use regulations.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back soon for zoning information!</p>
        </CardContent>
      </Card>
    </div>
  );
}
